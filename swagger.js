import swaggereJsdoc from 'swagger-jsdoc';

const options = {
  swaggerDefinition: {
    info: {
      title: 'User API',
      version: '1.0.0',
      description: 'User API with express',
    },
    host: 'localhost:8000',
    // basePath: '/',
  },
  apis: ['./routers/*.js', './swagger/*'],
};

export const specs = swaggereJsdoc(options);
