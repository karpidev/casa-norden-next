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
  media: {
    tina: {
      mediaRoot: "images",
      publicFolder: "public",
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
