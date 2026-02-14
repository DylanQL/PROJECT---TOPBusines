import mysql from 'mysql2/promise';

/**
 * Configuración de la base de datos
 */
export interface DatabaseConfig {
  host: string;
  user: string;
  password: string;
  database: string;
  port: number;
}

/**
 * Clase para gestionar la conexión a la base de datos MySQL
 * Implementa el patrón Singleton para reutilizar la conexión
 */
export class DatabaseConnection {
  private static instance: DatabaseConnection;
  private pool: mysql.Pool;

  private constructor(config: DatabaseConfig) {
    this.pool = mysql.createPool({
      host: config.host,
      user: config.user,
      password: config.password,
      database: config.database,
      port: config.port,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0,
    });
  }

  /**
   * Obtiene la instancia única de la conexión
   */
  public static getInstance(config: DatabaseConfig): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection(config);
    }
    return DatabaseConnection.instance;
  }

  /**
   * Obtiene el pool de conexiones
   */
  public getPool(): mysql.Pool {
    return this.pool;
  }

  /**
   * Ejecuta una consulta SQL
   */
  public async query<T>(sql: string, params?: any[]): Promise<T> {
    const [rows] = await this.pool.execute(sql, params);
    return rows as T;
  }

  /**
   * Cierra todas las conexiones del pool
   */
  public async close(): Promise<void> {
    await this.pool.end();
  }
}

/**
 * Obtiene la configuración de la base de datos desde las variables de entorno
 */
export function getDatabaseConfig(): DatabaseConfig {
  return {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '123456',
    database: process.env.DB_NAME || 'seidor_database',
    port: parseInt(process.env.DB_PORT || '3306', 10),
  };
}
