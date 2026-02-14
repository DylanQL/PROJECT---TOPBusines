/**
 * Entidad que representa un personaje de Star Wars
 * Contiene únicamente los campos requeridos según las especificaciones
 */
export interface Character {
  name: string;
  height: string;
  mass: string;
  hair_color: string;
  skin_color: string;
  eye_color: string;
  birth_year: string;
  gender: string;
}

/**
 * Entidad que representa un personaje favorito almacenado en la base de datos
 */
export interface FavoriteCharacter extends Character {
  id: number;
  created_at: Date;
}

/**
 * Respuesta paginada de la API externa SWAPI
 */
export interface SwapiPeopleResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: SwapiPerson[];
}

/**
 * Personaje completo de la API SWAPI (todos los campos)
 */
export interface SwapiPerson {
  name: string;
  height: string;
  mass: string;
  hair_color: string;
  skin_color: string;
  eye_color: string;
  birth_year: string;
  gender: string;
  homeworld: string;
  films: string[];
  species: string[];
  vehicles: string[];
  starships: string[];
  created: string;
  edited: string;
  url: string;
}

/**
 * Parámetros de paginación
 */
export interface PaginationParams {
  page: number;
  pageSize: number;
}

/**
 * Respuesta paginada genérica
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}
