import { defineConfig } from "tinacms";

// Your hosting provider likely exposes this as an environment variable
const isLocal = process.env.TINA_PUBLIC_IS_LOCAL === 'true' || !process.env.NEXT_PUBLIC_TINA_CLIENT_ID;

const branch = isLocal
  ? null
  : (process.env.GITHUB_BRANCH ||
     process.env.VERCEL_GIT_COMMIT_REF ||
     process.env.HEAD ||
     'main');

export default defineConfig({
  branch,

  // Get this from tina.io
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID || null,
  // Get this from tina.io
  token: process.env.TINA_TOKEN || null,

  search: isLocal ? undefined : {
    tina: {
      indexerToken: process.env.TINA_SEARCH_TOKEN || "",
    },
    indexBatchSize: 100,
    maxSearchIndexFieldLength: 100,
  },

  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },
  media: isLocal
    ? {
        tina: {
          mediaRoot: "images",
          publicFolder: "public",
        },
      }
    : {
        loadCustomStore: async () => {
          const pack = await import("next-tinacms-s3");
          
          const optimizeImageInBrowser = async (file: File, maxWidth = 1600, quality = 0.8): Promise<File> => {
            if (!file.type.startsWith('image/') || file.type === 'image/gif') {
              return file;
            }
            return new Promise((resolve) => {
              const reader = new FileReader();
              reader.onload = (event) => {
                const img = new window.Image();
                img.onload = () => {
                  let width = img.width;
                  let height = img.height;
                  if (width > maxWidth) {
                    height = Math.round((height * maxWidth) / width);
                    width = maxWidth;
                  }
                  const canvas = document.createElement('canvas');
                  canvas.width = width;
                  canvas.height = height;
                  const ctx = canvas.getContext('2d');
                  if (!ctx) {
                    resolve(file);
                    return;
                  }
                  ctx.drawImage(img, 0, 0, width, height);
                  canvas.toBlob((blob) => {
                    if (!blob) {
                      resolve(file);
                      return;
                    }
                    const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
                    const newFile = new File([blob], `${nameWithoutExt}.webp`, {
                      type: 'image/webp',
                      lastModified: Date.now(),
                    });
                    resolve(newFile);
                  }, 'image/webp', quality);
                };
                img.src = event.target?.result as string;
              };
              reader.readAsDataURL(file);
            });
          };

          class OptimizedS3MediaStore extends pack.TinaCloudS3MediaStore {
            async persist(media: any[]) {
              const optimizedMedia = await Promise.all(
                media.map(async (item) => {
                  if (item.file && item.file.type.startsWith("image/")) {
                    try {
                      const optimizedFile = await optimizeImageInBrowser(item.file);
                      return {
                        ...item,
                        file: optimizedFile,
                      };
                    } catch (err) {
                      console.error("Error optimizando imagen en el navegador:", err);
                    }
                  }
                  return item;
                })
              );
              return super.persist(optimizedMedia);
            }
          }

          return OptimizedS3MediaStore;
        },
      },
  // See docs on content modeling for more info on how to setup new content models: https://tina.io/docs/r/content-modelling-collections/
  schema: {
    collections: [
      {
        name: "historia",
        label: "Historia (Página)",
        path: "content/historia",
        format: "md",
        ui: {
          allowedActions: {
            create: false,
            delete: false,
          },
        },
        fields: [
          {
            type: "string",
            name: "heroTitle",
            label: "Título Hero",
            required: true,
          },
          {
            type: "string",
            name: "heroText",
            label: "Texto Hero",
            ui: {
              component: "textarea",
            },
          },
          {
            type: "image",
            name: "heroImg",
            label: "Imagen Hero",
          },
          {
            type: "string",
            name: "missionTitle",
            label: "Título de Misión",
          },
          {
            type: "string",
            name: "missionText",
            label: "Texto de Misión",
            ui: {
              component: "textarea",
            },
          },
          {
            type: "string",
            name: "subTitle",
            label: "Subtítulo",
          },
          {
            type: "string",
            name: "subText",
            label: "Texto de Subtítulo",
            ui: {
              component: "textarea",
            },
          },
          {
            type: "image",
            name: "subImg",
            label: "Imagen de Subtítulo",
          },
          {
            type: "object",
            name: "values",
            label: "Valores/Propósito",
            list: true,
            fields: [
              {
                type: "string",
                name: "n",
                label: "Número (ej: I, II, III)",
              },
              {
                type: "string",
                name: "title",
                label: "Título",
              },
              {
                type: "string",
                name: "text",
                label: "Texto",
                ui: {
                  component: "textarea",
                },
              },
            ],
          },
        ],
      },
      {
        name: "leyendas",
        label: "Leyendas",
        path: "content/leyendas",
        format: "md",
        fields: [
          {
            type: "string",
            name: "title",
            label: "Título",
            isTitle: true,
            required: true,
          },
          {
            type: "string",
            name: "tag",
            label: "Etiqueta/Categoría",
          },
          {
            type: "image",
            name: "img",
            label: "Imagen",
          },
          {
            type: "string",
            name: "text",
            label: "Contenido/Descripción",
            ui: {
              component: "textarea",
            },
          },
        ],
      },
      {
        name: "lugares",
        label: "Lugares con Historia",
        path: "content/lugares",
        format: "md",
        fields: [
          {
            type: "string",
            name: "title",
            label: "Título",
            isTitle: true,
            required: true,
          },
          {
            type: "string",
            name: "tag",
            label: "Etiqueta/Categoría",
          },
          {
            type: "image",
            name: "img",
            label: "Imagen",
          },
          {
            type: "string",
            name: "text",
            label: "Contenido/Descripción",
            ui: {
              component: "textarea",
            },
          },
        ],
      },
      {
        name: "fechas",
        label: "Fechas Recordadas",
        path: "content/fechas",
        format: "md",
        fields: [
          {
            type: "string",
            name: "year",
            label: "Año",
            isTitle: true,
            required: true,
          },
          {
            type: "string",
            name: "title",
            label: "Título del Evento",
            required: true,
          },
          {
            type: "string",
            name: "text",
            label: "Descripción",
            ui: {
              component: "textarea",
            },
          },
        ],
      },
      {
        name: "memorias",
        label: "Memorias (Personajes)",
        path: "content/memorias",
        format: "md",
        fields: [
          {
            type: "string",
            name: "name",
            label: "Nombre Completo",
            isTitle: true,
            required: true,
          },
          {
            type: "string",
            name: "years",
            label: "Años (ej: 1801 — 1870 · Estadista)",
          },
          {
            type: "image",
            name: "img",
            label: "Retrato/Imagen",
          },
          {
            type: "string",
            name: "text",
            label: "Biografía/Descripción",
            ui: {
              component: "textarea",
            },
          },
        ],
      },
    ],
  },
});
