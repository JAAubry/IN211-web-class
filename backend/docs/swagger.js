import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'My movies API',
      version: '1.0.0',
      description: 'API REST pour la gestion des utilisateurs et des films',
    },
   components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./routes/movies.js','./routes/users.js'],
};

export const swaggerSpec = swaggerJsdoc(options);
