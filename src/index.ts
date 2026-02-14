import serverless from 'serverless-http';
import { createApp } from './app';

// Crear la aplicación Express
const app = createApp();

// Exportar el handler para AWS Lambda
export const handler = serverless(app);
