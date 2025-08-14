import swaggerJSDoc from "swagger-jsdoc";

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
        url: "https://demo-express-wo83.onrender.com", // URL server
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
  apis: ["./routes/*.js"], // Chỉ định nơi chứa comment mô tả API
};

export const swaggerSpec = swaggerJSDoc(options);
