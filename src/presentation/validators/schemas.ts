import Joi from 'joi';

/**
 * Schema de validación para crear un personaje favorito
 */
export const createFavoriteSchema = Joi.object({
  name: Joi.string().required().trim().min(1).max(255).messages({
    'string.empty': 'El nombre es requerido',
    'string.min': 'El nombre debe tener al menos 1 carácter',
    'string.max': 'El nombre no puede exceder 255 caracteres',
    'any.required': 'El nombre es requerido',
  }),
  height: Joi.string().required().trim().messages({
    'string.empty': 'La altura es requerida',
    'any.required': 'La altura es requerida',
  }),
  mass: Joi.string().required().trim().messages({
    'string.empty': 'El peso es requerido',
    'any.required': 'El peso es requerido',
  }),
  hair_color: Joi.string().required().trim().messages({
    'string.empty': 'El color de cabello es requerido',
    'any.required': 'El color de cabello es requerido',
  }),
  skin_color: Joi.string().required().trim().messages({
    'string.empty': 'El color de piel es requerido',
    'any.required': 'El color de piel es requerido',
  }),
  eye_color: Joi.string().required().trim().messages({
    'string.empty': 'El color de ojos es requerido',
    'any.required': 'El color de ojos es requerido',
  }),
  birth_year: Joi.string().required().trim().messages({
    'string.empty': 'El año de nacimiento es requerido',
    'any.required': 'El año de nacimiento es requerido',
  }),
  gender: Joi.string().required().trim().messages({
    'string.empty': 'El género es requerido',
    'any.required': 'El género es requerido',
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
