import { FavoriteCharacter, PaginationParams, PaginatedResponse } from '../entities/Character';

/**
 * Interfaz del repositorio de personajes favoritos
 * Define el contrato para la persistencia de datos
 */
export interface IFavoriteRepository {
  /**
   * Crea un nuevo personaje favorito en la base de datos
   * @param character Datos del personaje a guardar
   * @returns El personaje creado con su ID
   */
  create(character: Omit<FavoriteCharacter, 'id' | 'created_at'>): Promise<FavoriteCharacter>;

  /**
   * Obtiene todos los personajes favoritos con paginación
   * @param params Parámetros de paginación
   * @returns Respuesta paginada con los favoritos
   */
  findAll(params: PaginationParams): Promise<PaginatedResponse<FavoriteCharacter>>;

  /**
   * Busca un personaje favorito por su nombre
   * @param name Nombre del personaje
   * @returns El personaje si existe, null en caso contrario
   */
  findByName(name: string): Promise<FavoriteCharacter | null>;

  /**
   * Verifica si un personaje ya existe en favoritos
   * @param name Nombre del personaje
   * @returns true si existe, false en caso contrario
   */
  exists(name: string): Promise<boolean>;

  /**
   * Elimina un personaje favorito por su ID
   * @param id ID del personaje favorito
   * @returns true si se eliminó correctamente, false si no se encontró
   */
  delete(id: number): Promise<boolean>;
}
