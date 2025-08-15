import path from "path";
import swaggerJSDoc from "swagger-jsdoc";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const options = {
  definition: {
    openapi: "3.0.0", // Phiên bản OpenAPI
    info: {
      title: "API Documentation",
      version: "1.0.0",
      description: "API docs for User CRUD using Express + MongoDB",
    },
    servers: [
      {
        url: process.env.BASE_URL, // URL server
      },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT", // chỉ để mô tả là JWT
        },
      },
    },

    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [path.join(__dirname, "routes/*.js")], // đường dẫn tuyệt đối
};

export const swaggerSpec = swaggerJSDoc(options);
