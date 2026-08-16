import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

async function handleRevalidation(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");
  const path = searchParams.get("path");
  const tag = searchParams.get("tag");

  // Validamos el token secreto para proteger el endpoint
  const validToken = process.env.REVALIDATION_TOKEN;
  if (!validToken || secret !== validToken) {
    return NextResponse.json(
      { message: "Token de revalidación inválido o no configurado" },
      { status: 401 }
    );
  }

  if (!path && !tag) {
    return NextResponse.json(
      { message: "Se requiere al menos el parámetro 'path' o 'tag'" },
      { status: 400 }
    );
  }

  try {
    const revalidatedItems: { path?: string; tag?: string } = {};

    if (path) {
      revalidatePath(path);
      revalidatedItems.path = path;
    }

    if (tag) {
      revalidateTag(tag, "default");
      revalidatedItems.tag = tag;
    }

    return NextResponse.json({
      revalidated: true,
      ...revalidatedItems,
      now: Date.now(),
    });
  } catch (err) {
    console.error("[Revalidate API Error]:", err);
    return NextResponse.json(
      {
        message: "Error al revalidar caché",
        error: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return handleRevalidation(request);
}

export async function POST(request: NextRequest) {
  return handleRevalidation(request);
}
