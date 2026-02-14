import { IFavoriteRepository } from '../../domain/repositories/IFavoriteRepository';
import { FavoriteCharacter, PaginationParams, PaginatedResponse } from '../../domain/entities/Character';

/**
 * Caso de uso: Obtener personajes favoritos
 * Responsabilidad: Recuperar personajes guardados con paginación
 */
export class GetFavoritesUseCase {
  constructor(private favoriteRepository: IFavoriteRepository) {}

  /**
   * Ejecuta el caso de uso
   * @param page Número de página
   * @param pageSize Tamaño de página
   * @returns Respuesta paginada con los favoritos
   */
  async execute(page: number = 1, pageSize: number = 10): Promise<PaginatedResponse<FavoriteCharacter>> {
    // Validar parámetros
    if (page < 1) {
      throw new Error('El número de página debe ser mayor o igual a 1');
    }
    
    if (pageSize < 1 || pageSize > 100) {
      throw new Error('El tamaño de página debe estar entre 1 y 100');
    }

    const params: PaginationParams = { page, pageSize };
    return await this.favoriteRepository.findAll(params);
  }
}
