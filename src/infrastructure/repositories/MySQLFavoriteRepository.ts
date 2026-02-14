import { IFavoriteRepository } from '../../domain/repositories/IFavoriteRepository';
import { FavoriteCharacter, PaginationParams, PaginatedResponse } from '../../domain/entities/Character';
import { DatabaseConnection } from '../database/DatabaseConnection';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

/**
 * Implementación del repositorio de favoritos usando MySQL
 */
export class MySQLFavoriteRepository implements IFavoriteRepository {
  constructor(private db: DatabaseConnection) {}

  /**
   * Crea un nuevo personaje favorito
   */
  async create(character: Omit<FavoriteCharacter, 'id' | 'created_at'>): Promise<FavoriteCharacter> {
    const sql = `
      INSERT INTO favorite_characters 
      (swapi_id, name, height, mass, hair_color, skin_color, eye_color, birth_year, gender)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      character.swapi_id,
      character.name,
      character.height,
      character.mass,
      character.hair_color,
      character.skin_color,
      character.eye_color,
      character.birth_year,
      character.gender,
    ];

    const result = await this.db.query<ResultSetHeader>(sql, params);
    
    // Obtener el registro recién creado
    const newCharacter = await this.findById(result.insertId);
    
    if (!newCharacter) {
      throw new Error('Error al crear el personaje favorito');
    }

    return newCharacter;
  }

  /**
   * Obtiene todos los personajes favoritos con paginación
   */
  async findAll(params: PaginationParams): Promise<PaginatedResponse<FavoriteCharacter>> {
    const { page, pageSize } = params;
    const offset = (page - 1) * pageSize;

    // Asegurar que los valores sean enteros
    const limit = Math.floor(Number(pageSize));
    const skip = Math.floor(Number(offset));

    // Consulta para obtener el total de registros
    const countSql = 'SELECT COUNT(*) as total FROM favorite_characters';
    const countResult = await this.db.query<RowDataPacket[]>(countSql);
    const total = countResult[0].total;

    // Consulta para obtener los registros paginados
    // NOTA: MySQL2 no soporta placeholders para LIMIT/OFFSET, se deben interpolar directamente
    // Los valores ya están validados como enteros positivos mediante Math.floor()
    const sql = `SELECT id, swapi_id, name, height, mass, hair_color, skin_color, eye_color, birth_year, gender, created_at 
                 FROM favorite_characters 
                 ORDER BY created_at DESC 
                 LIMIT ${limit} OFFSET ${skip}`;

    const rows = await this.db.query<RowDataPacket[]>(sql);
    
    const data: FavoriteCharacter[] = rows.map(row => ({
      id: row.id,
      swapi_id: row.swapi_id,
      name: row.name,
      height: row.height,
      mass: row.mass,
      hair_color: row.hair_color,
      skin_color: row.skin_color,
      eye_color: row.eye_color,
      birth_year: row.birth_year,
      gender: row.gender,
      created_at: row.created_at,
    }));

    return {
      data,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  /**
   * Busca un personaje por nombre
   */
  async findByName(name: string): Promise<FavoriteCharacter | null> {
    const sql = `
      SELECT id, swapi_id, name, height, mass, hair_color, skin_color, eye_color, birth_year, gender, created_at
      FROM favorite_characters
      WHERE name = ?
      LIMIT 1
    `;

    const rows = await this.db.query<RowDataPacket[]>(sql, [name]);

    if (rows.length === 0) {
      return null;
    }

    const row = rows[0];
    return {
      id: row.id,
      swapi_id: row.swapi_id,
      name: row.name,
      height: row.height,
      mass: row.mass,
      hair_color: row.hair_color,
      skin_color: row.skin_color,
      eye_color: row.eye_color,
      birth_year: row.birth_year,
      gender: row.gender,
      created_at: row.created_at,
    };
  }

  /**
   * Busca un personaje por ID
   */
  private async findById(id: number): Promise<FavoriteCharacter | null> {
    const sql = `
      SELECT id, swapi_id, name, height, mass, hair_color, skin_color, eye_color, birth_year, gender, created_at
      FROM favorite_characters
      WHERE id = ?
      LIMIT 1
    `;

    const rows = await this.db.query<RowDataPacket[]>(sql, [id]);

    if (rows.length === 0) {
      return null;
    }

    const row = rows[0];
    return {
      id: row.id,
      swapi_id: row.swapi_id,
      name: row.name,
      height: row.height,
      mass: row.mass,
      hair_color: row.hair_color,
      skin_color: row.skin_color,
      eye_color: row.eye_color,
      birth_year: row.birth_year,
      gender: row.gender,
      created_at: row.created_at,
    };
  }

  /**
   * Verifica si un personaje existe por nombre
   */
  async exists(name: string): Promise<boolean> {
    const character = await this.findByName(name);
    return character !== null;
  }
}
