import { ISwapiService } from '../../domain/services/ISwapiService';
import { Character } from '../../domain/entities/Character';

/**
 * Caso de uso: Obtener un personaje específico por ID
 */
export class GetCharacterByIdUseCase {
  constructor(private swapiService: ISwapiService) {}

  /**
   * Ejecuta el caso de uso
   * @param id ID del personaje en SWAPI
   * @returns Personaje transformado
   */
  async execute(id: number): Promise<Character> {
    return await this.swapiService.getPersonById(id);
  }
}
