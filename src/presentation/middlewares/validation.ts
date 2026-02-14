import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

/**
 * Middleware para validar el cuerpo de la petición
 */
export function validateBody(schema: Joi.ObjectSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map((detail: Joi.ValidationErrorItem) => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      return res.status(400).json({
        success: false,
        message: 'Error de validación',
        errors,
      });
    }

    req.body = value;
    next();
  };
}

/**
 * Middleware para validar parámetros de query
 */
export function validateQuery(schema: Joi.ObjectSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.query, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map((detail: Joi.ValidationErrorItem) => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      return res.status(400).json({
        success: false,
        message: 'Error de validación',
        errors,
      });
    }

    req.query = value;
    next();
  };
}

/**
 * Middleware para validar parámetros de ruta
 */
export function validateParams(schema: Joi.ObjectSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.params, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map((detail: Joi.ValidationErrorItem) => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      return res.status(400).json({
        success: false,
        message: 'Error de validación',
        errors,
      });
    }

    req.params = value;
    next();
  };
}
