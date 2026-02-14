import { IFavoriteRepository } from '../../domain/repositories/IFavoriteRepository';
import { Character, FavoriteCharacter } from '../../domain/entities/Character';

/**
 * Caso de uso: Crear un personaje favorito
 * Responsabilidad: Validar y guardar un personaje en la base de datos
 */
export class CreateFavoriteUseCase {
  constructor(private favoriteRepository: IFavoriteRepository) {}

  /**
   * Ejecuta el caso de uso
   * @param character Datos del personaje a guardar (incluye swapi_id)
   * @returns El personaje guardado con su ID
   * @throws Error si el personaje ya existe en favoritos
   */
  async execute(character: Character & { swapi_id: number }): Promise<FavoriteCharacter> {
    // Verificar si el personaje ya existe
    const exists = await this.favoriteRepository.exists(character.name);
    
    if (exists) {
      throw new Error(`El personaje "${character.name}" ya existe en favoritos`);
    }

    // Crear el personaje favorito
    return await this.favoriteRepository.create(character);
  }
}
