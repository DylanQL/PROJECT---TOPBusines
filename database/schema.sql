-- ============================================
-- Script de Base de Datos - SEIDOR SWAPI API
-- ============================================
-- 
-- Descripción: Script para crear la base de datos y tabla
--              necesaria para almacenar personajes favoritos
--              de Star Wars.
--
-- Autor: SEIDOR Project
-- Fecha: 2026-02-14
-- ============================================

-- Crear base de datos si no existe
CREATE DATABASE IF NOT EXISTS seidor_database
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

-- Usar la base de datos
USE seidor_database;

-- Eliminar tabla si existe (para desarrollo/testing)
DROP TABLE IF EXISTS favorite_characters;

-- ============================================
-- Tabla: favorite_characters
-- Descripción: Almacena los personajes de Star Wars
--              marcados como favoritos por los usuarios
-- ============================================
CREATE TABLE favorite_characters (
  -- Clave primaria autoincremental
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  
  -- ID del personaje en la API externa de SWAPI
  swapi_id INT UNSIGNED NOT NULL COMMENT 'ID del personaje en SWAPI',
  
  -- Campos del personaje (según especificaciones SWAPI)
  name VARCHAR(255) NOT NULL COMMENT 'Nombre del personaje',
  height VARCHAR(50) NOT NULL COMMENT 'Altura del personaje',
  mass VARCHAR(50) NOT NULL COMMENT 'Peso del personaje',
  hair_color VARCHAR(50) NOT NULL COMMENT 'Color de cabello',
  skin_color VARCHAR(50) NOT NULL COMMENT 'Color de piel',
  eye_color VARCHAR(50) NOT NULL COMMENT 'Color de ojos',
  birth_year VARCHAR(50) NOT NULL COMMENT 'Año de nacimiento (BBY/ABY)',
  gender VARCHAR(50) NOT NULL COMMENT 'Género del personaje',
  
  -- Metadatos
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación del registro',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Fecha de última actualización',
  
  -- Índices para mejorar el rendimiento
  UNIQUE KEY uk_swapi_id (swapi_id) COMMENT 'Evita duplicados del mismo personaje de SWAPI',
  INDEX idx_name (name) COMMENT 'Búsqueda rápida por nombre',
  INDEX idx_created_at (created_at) COMMENT 'Índice para ordenamiento por fecha'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Tabla de personajes favoritos de Star Wars';

-- ============================================
-- Datos de ejemplo (opcional - comentado)
-- ============================================
-- INSERT INTO favorite_characters (name, height, mass, hair_color, skin_color, eye_color, birth_year, gender) VALUES
-- ('Luke Skywalker', '172', '77', 'blond', 'fair', 'blue', '19BBY', 'male'),
-- ('Leia Organa', '150', '49', 'brown', 'light', 'brown', '19BBY', 'female'),
-- ('Han Solo', '180', '80', 'brown', 'fair', 'brown', '29BBY', 'male');

-- ============================================
-- Verificación de la tabla creada
-- ============================================
SHOW TABLES;
DESCRIBE favorite_characters;

-- ============================================
-- Información de la base de datos
-- ============================================
SELECT 
  TABLE_NAME,
  ENGINE,
  TABLE_ROWS,
  AVG_ROW_LENGTH,
  DATA_LENGTH,
  CREATE_TIME,
  TABLE_COMMENT
FROM information_schema.TABLES
WHERE TABLE_SCHEMA = 'seidor_database'
  AND TABLE_NAME = 'favorite_characters';
