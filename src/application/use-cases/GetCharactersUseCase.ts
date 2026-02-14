import { ISwapiService } from '../../domain/services/ISwapiService';
import { Character } from '../../domain/entities/Character';

/**
 * Caso de uso: Obtener personajes de SWAPI
 * Responsabilidad: Coordinar la obtención y transformación de personajes desde la API externa
 */
export class GetCharactersUseCase {
  constructor(private swapiService: ISwapiService) {}

  /**
   * Ejecuta el caso de uso
   * @param page Número de página (opcional)
   * @returns Listado de personajes transformados
   */
  async execute(page?: number): Promise<{ count: number; next: string | null; previous: string | null; results: Character[] }> {
    return await this.swapiService.getPeople(page);
  }
}
