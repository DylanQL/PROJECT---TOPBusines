import { Request, Response, NextFunction } from 'express';

/**
 * Middleware para manejo centralizado de errores
 */
export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
  console.error('Error:', err);

  // Error de validación o de negocio
  if (err.message.includes('ya existe') || err.message.includes('no encontrado')) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  // Error de SWAPI
  if (err.message.includes('SWAPI')) {
    return res.status(502).json({
      success: false,
      message: 'Error al comunicarse con el servicio externo',
      details: err.message,
    });
  }

  // Error genérico
  return res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
}

/**
 * Middleware para rutas no encontradas
 */
export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({
    success: false,
    message: `Ruta no encontrada: ${req.method} ${req.path}`,
  });
}
