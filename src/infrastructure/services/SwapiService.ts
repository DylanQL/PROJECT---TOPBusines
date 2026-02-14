import axios, { AxiosInstance } from 'axios';
import { ISwapiService } from '../../domain/services/ISwapiService';
import { Character, SwapiPeopleResponse, SwapiPerson } from '../../domain/entities/Character';

/**
 * Implementación del servicio SWAPI usando Axios
 */
export class SwapiService implements ISwapiService {
  private client: AxiosInstance;
  private baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || process.env.SWAPI_BASE_URL || 'https://swapi.py4e.com/api';
    this.client = axios.create({
      baseURL: this.baseUrl,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Obtiene el listado de personajes de SWAPI
   */
  async getPeople(page?: number): Promise<{ count: number; next: string | null; previous: string | null; results: Character[] }> {
    try {
      const url = page ? `/people/?page=${page}` : '/people/';
      const response = await this.client.get<SwapiPeopleResponse>(url);
      
      return {
        count: response.data.count,
        next: response.data.next,
        previous: response.data.previous,
        results: response.data.results.map((person: SwapiPerson) => this.transformCharacter(person)),
      };
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          throw new Error('Página no encontrada en SWAPI');
        }
        throw new Error(`Error al consultar SWAPI: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Obtiene un personaje específico por ID
   */
  async getPersonById(id: number): Promise<Character> {
    try {
      const response = await this.client.get<SwapiPerson>(`/people/${id}/`);
      return this.transformCharacter(response.data);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          throw new Error(`Personaje con ID ${id} no encontrado`);
        }
        throw new Error(`Error al consultar SWAPI: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Transforma un personaje de SWAPI al formato de la aplicación
   * Filtra únicamente los campos requeridos
   */
  private transformCharacter(swapiPerson: SwapiPerson): Character {
    return {
      name: swapiPerson.name,
      height: swapiPerson.height,
      mass: swapiPerson.mass,
      hair_color: swapiPerson.hair_color,
      skin_color: swapiPerson.skin_color,
      eye_color: swapiPerson.eye_color,
      birth_year: swapiPerson.birth_year,
      gender: swapiPerson.gender,
    };
  }
}
