import { Router } from 'express';
import { CharacterController } from '../controllers/CharacterController';
import { validateParams } from '../middlewares/validation';
import { characterIdSchema } from '../validators/schemas';

/**
 * Crea las rutas para operaciones de personajes
 */
export function createCharacterRoutes(controller: CharacterController): Router {
  const router = Router();

  /**
   * @route GET /api/characters
   * @description Obtiene listado de personajes desde SWAPI
   * @query page - Número de página (opcional)
   * @returns {Object} Lista de personajes transformados
   */
  router.get('/', controller.getCharacters);

  /**
   * @route GET /api/characters/:id
   * @description Obtiene un personaje específico por ID
   * @param id - ID del personaje en SWAPI
   * @returns {Object} Personaje transformado
   */
  router.get('/:id', validateParams(characterIdSchema), controller.getCharacterById);

  return router;
}
