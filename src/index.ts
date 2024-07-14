import express from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import csvRoute from './routes/csvRoute';

const app = express();
const port = 3000;

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'CSV Manipulation API',
      version: '1.0.0',
      description: 'API para manipulação de dados CSV',
    },
    servers: [{ url: `http://localhost:${port}` }],
  },
  apis: ['./src/routes/*.ts'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(express.json());
app.use('/csv', csvRoute);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
