import { IFavoriteRepository } from '../../domain/repositories/IFavoriteRepository';
import { FavoriteCharacter } from '../../domain/entities/Character';
import { ISwapiService } from '../../domain/services/ISwapiService';

/**
 * Caso de uso: Crear un personaje favorito
 * Responsabilidad: Consultar datos del personaje en SWAPI y guardarlo en favoritos
 */
export class CreateFavoriteUseCase {
  constructor(
    private favoriteRepository: IFavoriteRepository,
    private swapiService: ISwapiService
  ) {}

  /**
   * Ejecuta el caso de uso
   * @param characterId ID del personaje en SWAPI
   * @returns El personaje guardado con su ID
   * @throws Error si el personaje ya existe en favoritos o no existe en SWAPI
   */
  async execute(characterId: number): Promise<FavoriteCharacter> {
    // Verificar si el personaje ya existe en favoritos (por swapi_id si existe el método)
    // Si no existe el método existsBySwapiId, usamos exists por nombre después de consultar
    
    // Consultar los datos del personaje desde SWAPI
    const character = await this.swapiService.getPersonById(characterId);

    // Verificar si el personaje ya existe por nombre
    const exists = await this.favoriteRepository.exists(character.name);
    
    if (exists) {
      throw new Error(`El personaje "${character.name}" ya existe en favoritos`);
    }

    // Crear el personaje favorito con todos los datos
    return await this.favoriteRepository.create({
      swapi_id: characterId,
      ...character,
    });
  }
}
