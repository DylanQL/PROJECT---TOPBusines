import { createApp } from './src/app';

/**
 * Servidor local para desarrollo sin Serverless Offline
 * Útil para desarrollo rápido y debugging
 */

const app = createApp();
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('╔═══════════════════════════════════════════════════════╗');
  console.log('║     SEIDOR SWAPI Backend API - Servidor Local        ║');
  console.log('╚═══════════════════════════════════════════════════════╝');
  console.log('');
  console.log(`🚀 Servidor corriendo en: http://localhost:${PORT}`);
  console.log(`📚 Documentación Swagger: http://localhost:${PORT}/api-docs`);
  console.log(`💚 Health Check: http://localhost:${PORT}/health`);
  console.log('');
  console.log('📡 Endpoints disponibles:');
  console.log(`   GET    /api/characters          - Listar personajes SWAPI`);
  console.log(`   GET    /api/characters/:id      - Obtener personaje por ID`);
  console.log(`   GET    /api/favorites           - Listar favoritos`);
  console.log(`   POST   /api/favorites           - Crear favorito`);
  console.log(`   DELETE /api/favorites/:id       - Eliminar favorito`);
  console.log('');
  console.log('Presiona CTRL+C para detener el servidor');
  console.log('═══════════════════════════════════════════════════════');
});

// Manejo de señales de terminación
process.on('SIGINT', () => {
  console.log('\n\n👋 Servidor detenido');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n\n👋 Servidor detenido');
  process.exit(0);
});
