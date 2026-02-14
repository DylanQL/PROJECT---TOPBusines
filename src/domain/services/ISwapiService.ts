import { Character } from '../entities/Character';

/**
 * Interfaz del servicio de SWAPI
 * Define el contrato para consumir la API externa
 */
export interface ISwapiService {
  /**
   * Obtiene el listado de personajes de SWAPI
   * @param page Número de página (opcional)
   * @returns Respuesta con personajes transformados
   */
  getPeople(page?: number): Promise<{ count: number; next: string | null; previous: string | null; results: Character[] }>;

  /**
   * Obtiene un personaje específico por ID
   * @param id ID del personaje en SWAPI
   * @returns Personaje transformado
   */
  getPersonById(id: number): Promise<Character>;
}
