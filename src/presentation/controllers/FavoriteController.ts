import { Request, Response, NextFunction } from 'express';
import { CreateFavoriteUseCase } from '../../application/use-cases/CreateFavoriteUseCase';
import { GetFavoritesUseCase } from '../../application/use-cases/GetFavoritesUseCase';

/**
 * Controlador para operaciones relacionadas con personajes favoritos
 */
export class FavoriteController {
  constructor(
    private createFavoriteUseCase: CreateFavoriteUseCase,
    private getFavoritesUseCase: GetFavoritesUseCase
  ) {}

  /**
   * Crea un nuevo personaje favorito
   */
  createFavorite = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { character_id } = req.body;
      const favorite = await this.createFavoriteUseCase.execute(character_id);

      res.status(201).json({
        success: true,
        message: 'Personaje agregado a favoritos exitosamente',
        data: favorite,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Obtiene el listado de personajes favoritos con paginación
   */
  getFavorites = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Después de la validación con Joi, estos valores ya son números
      const page = Number(req.query.page) || 1;
      const pageSize = Number(req.query.pageSize) || 10;

      const result = await this.getFavoritesUseCase.execute(page, pageSize);

      res.status(200).json({
        success: true,
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  };
}
