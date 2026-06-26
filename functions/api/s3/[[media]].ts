interface Env {
  R2_BUCKET: {
    list(options?: {
      prefix?: string;
      limit?: number;
      cursor?: string;
      delimiter?: string;
    }): Promise<{
      objects: Array<{ key: string; size: number; uploaded: string }>;
      delimitedPrefixes: string[];
      truncated: boolean;
      cursor?: string;
    }>;
    put(
      key: string,
      value: any,
      options?: {
        httpMetadata?: {
          contentType?: string;
        };
      }
    ): Promise<any>;
    delete(key: string): Promise<void>;
  };
  NEXT_PUBLIC_R2_PUBLIC_URL?: string;
}

export async function onRequest(context: {
  request: Request;
  env: Env;
}): Promise<Response> {
  const { request, env } = context;

  // Verificar que el binding de R2 esté configurado y sea válido
  if (!env.R2_BUCKET || typeof env.R2_BUCKET.list !== 'function') {
    const errorMsg = !env.R2_BUCKET 
      ? 'El binding R2_BUCKET está indefinido en el entorno.' 
      : `El binding R2_BUCKET es de tipo "${typeof env.R2_BUCKET}" (valor: "${String(env.R2_BUCKET)}"), pero se esperaba un bucket R2. Asegúrate de haberlo configurado en la sección "R2 bucket bindings" (Bindings de R2) en el panel de Cloudflare y no en la sección de "Environment variables" (Variables de entorno).`;
    
    console.log('[R2 API ERROR] Configuración incorrecta:', errorMsg);
    
    return new Response(
      JSON.stringify({
        error: 'El binding de Cloudflare R2 no está configurado correctamente en Cloudflare Pages.',
        details: errorMsg,
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  const url = new URL(request.url);
  const method = request.method;

  try {
    // -------------------------------------------------------------
    // GET: Listar archivos y carpetas
    // -------------------------------------------------------------
    if (method === 'GET') {
      const pathname = url.pathname.replace(/\/$/, '');

      // Caso A: Solicitar URL de subida (upload_url)
      if (pathname.endsWith('/api/s3/media/upload_url')) {
        const key = url.searchParams.get('key');
        if (!key) {
          return new Response('Falta el parámetro key.', { status: 400 });
        }

        // Devolver una URL proxy local que apunta a nuestro propio endpoint PUT
        const uploadProxyUrl = `${url.origin}/api/s3/media/upload_file?key=${encodeURIComponent(key)}`;
        console.log(`[R2 API GET] Generando URL proxy de subida para: "${key}". Proxy: "${uploadProxyUrl}"`);

        const r2PublicUrl = (env.NEXT_PUBLIC_R2_PUBLIC_URL || '').replace(/\/$/, '');
        const publicUrl = r2PublicUrl ? `${r2PublicUrl}/${key}` : `/${key}`;

        return new Response(
          JSON.stringify({
            signedUrl: uploadProxyUrl,
            src: publicUrl,
          }),
          {
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }

      // Caso B: Listar archivos ordinarios
      const directory = url.searchParams.get('directory') || '';
      const limit = url.searchParams.get('limit');
      const offset = url.searchParams.get('offset') || undefined;

      const prefix = directory ? (directory.endsWith('/') ? directory : `${directory}/`) : '';

      console.log(`[R2 API GET] Listando directorio: "${directory}", prefijo: "${prefix}", límite: ${limit}, cursor: ${offset}`);

      const listed = await env.R2_BUCKET.list({
        prefix,
        limit: limit ? parseInt(limit, 10) : 20,
        cursor: offset,
        delimiter: '/',
      });

      console.log('[R2 API GET] list() completado.', {
        hasListed: !!listed,
        objectsCount: listed?.objects?.length,
        prefixesCount: listed?.delimitedPrefixes?.length,
        truncated: listed?.truncated
      });

      const r2PublicUrl = (env.NEXT_PUBLIC_R2_PUBLIC_URL || '').replace(/\/$/, '');

      // Carpetas virtuales
      const folders = (listed?.delimitedPrefixes || []).map((p) => {
        const folderName = p.slice(prefix.length, -1);
        return {
          id: p,
          type: 'dir' as const,
          directory: directory,
          filename: folderName,
        };
      });

      // Archivos reales
      const files = (listed?.objects || [])
        .filter((obj) => obj.key !== prefix) // Excluir la carpeta en sí
        .map((obj) => {
          const filename = obj.key.split('/').pop() || '';
          return {
            id: obj.key,
            type: 'file' as const,
            directory: directory,
            filename: filename,
            src: r2PublicUrl ? `${r2PublicUrl}/${obj.key}` : `/${obj.key}`, // Fallback a ruta local si no hay URL pública
            size: obj.size,
          };
        });

      return new Response(
        JSON.stringify({
          items: [...folders, ...files],
          nextOffset: listed.truncated ? listed.cursor : undefined,
        }),
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // -------------------------------------------------------------
    // POST: Subir archivo
    // -------------------------------------------------------------
    if (method === 'POST') {
      const formData = await request.formData();
      const file = formData.get('file') as File;
      const directory = formData.get('directory') as string || '';
      const filename = formData.get('filename') as string || file.name;

      if (!file) {
        return new Response('No se proporcionó ningún archivo para subir.', { status: 400 });
      }

      const key = directory ? `${directory}/${filename}` : filename;

      // Subir el archivo al bucket de R2
      await env.R2_BUCKET.put(key, file.stream(), {
        httpMetadata: {
          contentType: file.type,
        },
      });

      const r2PublicUrl = (env.NEXT_PUBLIC_R2_PUBLIC_URL || '').replace(/\/$/, '');

      return new Response(
        JSON.stringify({
          id: key,
          type: 'file' as const,
          directory: directory,
          filename: filename,
          src: r2PublicUrl ? `${r2PublicUrl}/${key}` : `/${key}`,
          size: file.size,
        }),
        {
          status: 201,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // -------------------------------------------------------------
    // PUT: Subir archivo usando el proxy de subida
    // -------------------------------------------------------------
    if (method === 'PUT') {
      const pathname = url.pathname.replace(/\/$/, '');
      if (pathname.endsWith('/api/s3/media/upload_file')) {
        const key = url.searchParams.get('key');
        if (!key) {
          return new Response('Falta el parámetro key en la subida.', { status: 400 });
        }

        if (!request.body) {
          return new Response('No se recibió cuerpo de archivo.', { status: 400 });
        }

        const contentType = request.headers.get('Content-Type') || 'application/octet-stream';
        console.log(`[R2 API PUT] Subiendo archivo "${key}" al bucket de R2. Content-Type: ${contentType}`);

        // Subir directamente el body stream al bucket de R2
        await env.R2_BUCKET.put(key, request.body, {
          httpMetadata: {
            contentType,
          },
        });

        console.log(`[R2 API PUT] Subida completada con éxito: "${key}"`);
        return new Response(null, { status: 200 });
      }
    }

    // -------------------------------------------------------------
    // DELETE: Borrar archivo
    // -------------------------------------------------------------
    if (method === 'DELETE') {
      // TinaCMS envía la clave en la URL: /api/s3/media/ruta/del/archivo.jpg
      const prefixPath = '/api/s3/media/';
      const index = url.pathname.indexOf(prefixPath);
      if (index === -1) {
        return new Response('Ruta de eliminación no válida.', { status: 400 });
      }
      
      const key = decodeURIComponent(url.pathname.substring(index + prefixPath.length));
      if (!key) {
        return new Response('Clave de archivo no especificada.', { status: 400 });
      }

      await env.R2_BUCKET.delete(key);

      return new Response(null, { status: 200 });
    }

    return new Response('Método HTTP no permitido.', { status: 405 });
  } catch (error: any) {
    console.log('[R2 API ERROR] Error detectado en la ejecución:', error);
    console.error('Error en la Cloudflare Pages Function de S3/R2:', error);
    return new Response(
      JSON.stringify({
        error: 'Ocurrió un error inesperado al procesar la solicitud en el servidor.',
        details: error?.message || String(error),
        stack: error?.stack || null
      }),
      {
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store'
        },
      }
    );
  }
}
