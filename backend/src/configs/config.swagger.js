// Định nghĩa các tùy chọn cho Swagger
const apiDocsV1 = {
  swaggerDefinition: {
    info: {
      title: "eCommerce apis",
      version: "1.0.0",
      description: "API for developer od eCommerce website",
    },
    securityDefinitions: {
      ApiKey: {
        type: "apiKey",
        name: "x-api-key",
        in: "header",
        description: "Api key",
      },
      Authorization: {
        type: "apiKey",
        name: "authorization",
        in: "header",
        description: "Authentication token",
      },
      ClientId: {
        type: "apiKey",
        name: "x-client-id",
        in: "header",
        description: "Client ID",
      },
    },
    security: [
      {
        ApiKey: [],
        Authorization: [],
        ClientId: [],
      },
    ],
    schemes: ["http", "https"],
    consumes: ["application/json"],
    produces: ["application/json"],
    basePath: "/v1/api",
    definitions: {
      200: {
        type: "object",
        properties: {
          message: {
            type: "string",
            description: "Thông tin",
          },
          status: {
            type: "number",
            description: "Mã trạng thái",
          },
          metadata: {
            type: "object",
            description: "Dữ liệu trả về",
          },
        },
      },
    },
  },
  apis: ["./src/routes/**/*.js"],
};

module.exports = {
  apiDocsV1,
};
