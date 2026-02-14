# 🚀 Guía de Inicio Rápido

Guía para poner en marcha el proyecto en menos de 5 minutos.

## ⚡ Instalación Rápida

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales de MySQL

# 3. Crear base de datos
npm run db:setup
# O manualmente: mysql -u root -p123456 < database/schema.sql

# 4. Iniciar servidor
npm start
```

## 🎯 Comandos Disponibles

### Desarrollo

```bash
# Iniciar servidor local (con auto-reload)
npm run dev

# Iniciar servidor local (sin auto-reload)
npm start

# Iniciar con Serverless Offline (simula Lambda)
npm run local
```

### Build & Deploy

```bash
# Compilar TypeScript
npm run build

# Desplegar a AWS (dev)
npm run deploy

# Desplegar a AWS (production)
npm run deploy:prod
```

### Testing

```bash
# Ejecutar todas las pruebas
npm test

# Modo watch (desarrollo)
npm run test:watch

# Con coverage
npm run test:coverage
```

### Calidad de Código

```bash
# Lint (verificar)
npm run lint

# Lint (corregir automáticamente)
npm run lint:fix
```

### Base de Datos

```bash
# Ejecutar script de BD
npm run db:setup

# Conectar a MySQL
mysql -u root -p123456 seidor_database
```

## 📋 Checklist de Instalación

- [ ] Node.js v18+ instalado
- [ ] MySQL instalado y corriendo
- [ ] Variables de entorno configuradas (.env)
- [ ] Base de datos creada (npm run db:setup)
- [ ] Dependencias instaladas (npm install)
- [ ] Servidor funcionando (npm start)
- [ ] Health check OK (curl http://localhost:3000/health)

## 🧪 Prueba Rápida

Una vez el servidor esté corriendo:

```bash
# 1. Health check
curl http://localhost:3000/health

# 2. Obtener personajes de SWAPI
curl http://localhost:3000/api/characters

# 3. Guardar primer favorito
curl -X POST http://localhost:3000/api/favorites \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Luke Skywalker",
    "height": "172",
    "mass": "77",
    "hair_color": "blond",
    "skin_color": "fair",
    "eye_color": "blue",
    "birth_year": "19BBY",
    "gender": "male"
  }'

# 4. Ver favoritos
curl http://localhost:3000/api/favorites
```

## 📚 Acceso a Documentación

```bash
# Swagger UI (requiere servidor corriendo)
open http://localhost:3000/api-docs
```

## 🔧 Solución de Problemas Comunes

### Error: "Cannot connect to MySQL"

```bash
# Verificar que MySQL esté corriendo
sudo service mysql status

# Iniciar MySQL
sudo service mysql start

# Verificar credenciales en .env
cat .env
```

### Error: "Table doesn't exist"

```bash
# Ejecutar script de BD
npm run db:setup

# O manualmente
mysql -u root -p123456 < database/schema.sql
```

### Error: "Port 3000 already in use"

```bash
# Encontrar proceso
lsof -i :3000

# Matar proceso
kill -9 <PID>

# O usar otro puerto
PORT=3001 npm start
```

### Error: "Module not found"

```bash
# Limpiar node_modules y reinstalar
rm -rf node_modules package-lock.json
npm install
```

## 🎓 Próximos Pasos

1. ✅ Revisar la [documentación completa](README.md)
2. ✅ Explorar [ejemplos de uso](API_EXAMPLES.md)
3. ✅ Entender la [arquitectura](ARCHITECTURE.md)
4. ✅ Preparar [deployment a AWS](DEPLOYMENT.md)

## 📞 Recursos

- **Swagger UI**: http://localhost:3000/api-docs
- **Health Check**: http://localhost:3000/health
- **SWAPI Docs**: https://swapi.py4e.com/documentation

---

¿Todo funcionando? ¡Excelente! Ahora puedes empezar a desarrollar. 🎉
