import { Router } from 'express';
import { FavoriteController } from '../controllers/FavoriteController';
import { validateBody, validateQuery, validateParams } from '../middlewares/validation';
import { createFavoriteSchema, paginationSchema, characterIdSchema } from '../validators/schemas';

/**
 * Crea las rutas para operaciones de favoritos
 */
export function createFavoriteRoutes(controller: FavoriteController): Router {
  const router = Router();

  /**
   * @route POST /api/favorites
   * @description Crea un nuevo personaje favorito
   * @body {Character} Datos del personaje a guardar
   * @returns {Object} Personaje favorito creado
   */
  router.post('/', validateBody(createFavoriteSchema), controller.createFavorite);

  /**
   * @route GET /api/favorites
   * @description Obtiene listado de personajes favoritos con paginación
   * @query page - Número de página (default: 1)
   * @query pageSize - Tamaño de página (default: 10, max: 100)
   * @returns {Object} Lista paginada de favoritos
   */
  router.get('/', validateQuery(paginationSchema), controller.getFavorites);

  /**
   * @route DELETE /api/favorites/:id
   * @description Elimina un personaje favorito por su ID
   * @param id - ID del personaje favorito a eliminar
   * @returns {Object} Confirmación de eliminación
   */
  router.delete('/:id', validateParams(characterIdSchema), controller.deleteFavorite);

  return router;
}
