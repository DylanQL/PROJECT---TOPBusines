import { IFavoriteRepository } from '../../domain/repositories/IFavoriteRepository';

/**
 * Caso de uso para eliminar un personaje favorito
 */
export class DeleteFavoriteUseCase {
  constructor(private favoriteRepository: IFavoriteRepository) {}

  /**
   * Ejecuta el caso de uso de eliminación
   * @param id ID del personaje favorito a eliminar
   * @returns true si se eliminó correctamente
   * @throws Error si el personaje no existe
   */
  async execute(id: number): Promise<void> {
    const deleted = await this.favoriteRepository.delete(id);

    if (!deleted) {
      throw new Error(`El personaje favorito con ID ${id} no existe`);
    }
  }
}
