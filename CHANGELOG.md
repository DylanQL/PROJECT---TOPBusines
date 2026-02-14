# Changelog

Todos los cambios notables de este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/lang/es/).

## [1.0.0] - 2026-02-14

### ✨ Agregado

#### Funcionalidades Core
- API REST para consultar personajes de SWAPI
- Transformación y normalización de datos de SWAPI (solo campos requeridos)
- Sistema de gestión de personajes favoritos
- Paginación en listado de favoritos
- Validación robusta de datos con Joi
- Manejo centralizado de errores
- Health check endpoint

#### Arquitectura
- Implementación de Arquitectura Hexagonal (Clean Architecture)
- Separación en capas: Domain, Application, Infrastructure, Presentation
- Inyección de dependencias
- Repository Pattern para abstracción de persistencia
- Service Pattern para APIs externas
- Use Case Pattern para lógica de negocio

#### Tecnología
- TypeScript con strict mode
- Express.js como framework web
- Serverless Framework para AWS Lambda
- MySQL2 con connection pooling
- Axios para HTTP requests
- Joi para validación de esquemas

#### Base de Datos
- Script SQL para creación de BD y tablas
- Índice único en nombre de personaje (evita duplicados)
- Índice en created_at (optimiza ordenamiento)
- Consultas parametrizadas (prevención SQL Injection)

#### Testing
- Pruebas unitarias con Jest
- Tests para casos de uso críticos
- Tests para servicios
- Configuración de coverage
- Mocks para testing aislado

#### Documentación
- README completo con instrucciones
- Documentación OpenAPI/Swagger 3.0
- Swagger UI integrado
- Ejemplos de uso de API (curl, JavaScript, Python)
- Guía de deployment a AWS
- Documentación de arquitectura
- Guía de inicio rápido
- Colección de Postman

#### DevOps
- Configuración de Serverless Framework
- Plugin serverless-offline para desarrollo local
- Plugin serverless-plugin-typescript
- Scripts npm para desarrollo y deployment
- Variables de entorno configurables
- ESLint configurado
- .gitignore apropiado

#### Seguridad
- Consultas parametrizadas (SQL Injection prevention)
- Validación de entrada robusta
- Sanitización de datos
- Gestión segura de errores (no expone stack traces en prod)
- CORS configurado

### 🎯 Puntos Bonus Implementados
- ✅ TypeScript en backend
- ✅ Pruebas unitarias básicas
- ✅ Documentación OpenAPI/Swagger
- ✅ Configuración para AWS Lambda con Serverless Framework
- ✅ Paginación en listados
- ✅ Buenas prácticas de seguridad
- ✅ Arquitectura escalable y mantenible

### 📋 Endpoints Implementados

#### Characters (SWAPI)
- `GET /api/characters` - Listar personajes
- `GET /api/characters/:id` - Obtener personaje por ID

#### Favorites
- `GET /api/favorites` - Listar favoritos (con paginación)
- `POST /api/favorites` - Crear favorito

#### Health
- `GET /health` - Health check

### 📦 Dependencias Principales
- express: ^4.18.2
- typescript: ^5.3.3
- mysql2: ^3.6.5
- axios: ^1.6.2
- joi: ^17.11.0
- serverless-http: ^3.2.0
- swagger-ui-express: ^5.0.0
- jest: ^29.7.0
- serverless: ^3.38.0

### 📚 Documentación Creada
- README.md - Documentación principal
- API_EXAMPLES.md - Ejemplos de uso
- ARCHITECTURE.md - Documentación de arquitectura
- DEPLOYMENT.md - Guía de deployment
- QUICKSTART.md - Inicio rápido
- CHANGELOG.md - Histórico de cambios
- swagger.yml - Especificación OpenAPI
- postman_collection.json - Colección de Postman

### 🏗️ Estructura del Proyecto
```
PROJECT - SEIDOR/
├── src/
│   ├── application/use-cases/      # Casos de uso
│   ├── domain/                     # Entidades e interfaces
│   ├── infrastructure/             # Implementaciones
│   ├── presentation/               # Controllers y routes
│   ├── app.ts                      # Express app
│   └── index.ts                    # Lambda handler
├── database/
│   └── schema.sql                  # Script de BD
├── tests/                          # Pruebas unitarias
├── swagger.yml                     # OpenAPI spec
├── serverless.yml                  # Config Serverless
└── [documentación]
```

### 🔄 Workflows
- Desarrollo local con hot-reload
- Testing automatizado
- Build de TypeScript
- Deployment a AWS Lambda

---

## [Unreleased]

### 🚀 Mejoras Futuras Planeadas
- [ ] Autenticación y autorización (JWT)
- [ ] Endpoints UPDATE y DELETE para favoritos
- [ ] Rate limiting
- [ ] Caching con Redis
- [ ] Logging estructurado (Winston)
- [ ] Monitoring con AWS X-Ray
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Búsqueda y filtrado avanzado
- [ ] Integración con otros recursos de SWAPI
- [ ] Internacionalización (i18n)
- [ ] GraphQL API (alternativa a REST)

---

## Notas de Versión

### Versión 1.0.0
Esta es la primera versión estable del proyecto. Incluye todas las funcionalidades core requeridas y varios puntos bonus. La aplicación está completamente preparada para deployment en AWS Lambda y cumple con todos los requisitos del reto SEIDOR.

**Desarrollado para:** SEIDOR  
**Fecha:** 14 de febrero de 2026  
**Autor:** Proyecto SEIDOR Backend Challenge
