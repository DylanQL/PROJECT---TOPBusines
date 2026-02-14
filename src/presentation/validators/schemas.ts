import Joi from 'joi';

/**
 * Schema de validación para crear un personaje favorito
 * Solo requiere el ID del personaje de SWAPI
 */
export const createFavoriteSchema = Joi.object({
  character_id: Joi.number().integer().min(1).required().messages({
    'number.base': 'El character_id debe ser un número',
    'number.integer': 'El character_id debe ser un entero',
    'number.min': 'El character_id debe ser mayor o igual a 1',
    'any.required': 'El character_id es requerido',
  }),
});

/**
 * Schema de validación para parámetros de paginación
 */
export const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1).messages({
    'number.base': 'El número de página debe ser un número',
    'number.integer': 'El número de página debe ser un entero',
    'number.min': 'El número de página debe ser mayor o igual a 1',
  }),
  pageSize: Joi.number().integer().min(1).max(100).default(10).messages({
    'number.base': 'El tamaño de página debe ser un número',
    'number.integer': 'El tamaño de página debe ser un entero',
    'number.min': 'El tamaño de página debe ser mayor o igual a 1',
    'number.max': 'El tamaño de página no puede exceder 100',
  }),
});

/**
 * Schema de validación para el ID de un personaje
 */
export const characterIdSchema = Joi.object({
  id: Joi.number().integer().min(1).required().messages({
    'number.base': 'El ID debe ser un número',
    'number.integer': 'El ID debe ser un entero',
    'number.min': 'El ID debe ser mayor o igual a 1',
    'any.required': 'El ID es requerido',
  }),
});
