import express, { Application } from 'express';
import { DatabaseConnection, getDatabaseConfig } from './infrastructure/database/DatabaseConnection';
import { MySQLFavoriteRepository } from './infrastructure/repositories/MySQLFavoriteRepository';
import { SwapiService } from './infrastructure/services/SwapiService';
import { GetCharactersUseCase } from './application/use-cases/GetCharactersUseCase';
import { GetCharacterByIdUseCase } from './application/use-cases/GetCharacterByIdUseCase';
import { CreateFavoriteUseCase } from './application/use-cases/CreateFavoriteUseCase';
import { GetFavoritesUseCase } from './application/use-cases/GetFavoritesUseCase';
import { DeleteFavoriteUseCase } from './application/use-cases/DeleteFavoriteUseCase';
import { CharacterController } from './presentation/controllers/CharacterController';
import { FavoriteController } from './presentation/controllers/FavoriteController';
import { createCharacterRoutes } from './presentation/routes/characterRoutes';
import { createFavoriteRoutes } from './presentation/routes/favoriteRoutes';
import { errorHandler, notFoundHandler } from './presentation/middlewares/errorHandler';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';

/**
 * Crea y configura la aplicación Express
 */
export function createApp(): Application {
  const app = express();

  // Middlewares básicos
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // CORS para desarrollo
  app.use((req: any, res: any, next: any) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

  // Inicialización de dependencias
  const dbConfig = getDatabaseConfig();
  const db = DatabaseConnection.getInstance(dbConfig);
  
  // Repositorios
  const favoriteRepository = new MySQLFavoriteRepository(db);
  
  // Servicios
  const swapiService = new SwapiService();
  
  // Casos de uso
  const getCharactersUseCase = new GetCharactersUseCase(swapiService);
  const getCharacterByIdUseCase = new GetCharacterByIdUseCase(swapiService);
  const createFavoriteUseCase = new CreateFavoriteUseCase(favoriteRepository, swapiService);
  const getFavoritesUseCase = new GetFavoritesUseCase(favoriteRepository);
  const deleteFavoriteUseCase = new DeleteFavoriteUseCase(favoriteRepository);
  
  // Controladores
  const characterController = new CharacterController(getCharactersUseCase, getCharacterByIdUseCase);
  const favoriteController = new FavoriteController(createFavoriteUseCase, getFavoritesUseCase, deleteFavoriteUseCase);

  // Ruta de health check
  app.get('/health', (_req: any, res: any) => {
    res.status(200).json({
      success: true,
      message: 'API funcionando correctamente',
      timestamp: new Date().toISOString(),
    });
  });

  // Documentación Swagger
  try {
    const swaggerDocument = YAML.load(path.join(__dirname, '../swagger.yml'));
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  } catch (error) {
    console.warn('No se pudo cargar la documentación Swagger:', error);
  }

  // Rutas de la API
  app.use('/api/characters', createCharacterRoutes(characterController));
  app.use('/api/favorites', createFavoriteRoutes(favoriteController));

  // Manejadores de errores
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
