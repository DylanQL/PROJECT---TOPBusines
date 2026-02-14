# SEIDOR SWAPI Backend API

Backend API desarrollado para AWS Lambda que consume la API de Star Wars (SWAPI) y gestiona personajes favoritos en una base de datos MySQL.

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Tecnologías Utilizadas](#-tecnologías-utilizadas)
- [Arquitectura](#-arquitectura)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Ejecución](#-ejecución)
- [Testing](#-testing)
- [Documentación de la API](#-documentación-de-la-api)
- [Despliegue en AWS](#-despliegue-en-aws)
- [Endpoints](#-endpoints)
- [Decisiones Técnicas](#-decisiones-técnicas)

## ✨ Características

- ✅ Consumo de API externa SWAPI (Star Wars API)
- ✅ Transformación y normalización de datos
- ✅ Gestión de personajes favoritos en MySQL
- ✅ Paginación en listados
- ✅ Validación robusta de datos (Joi)
- ✅ Manejo centralizado de errores
- ✅ TypeScript en backend
- ✅ Documentación OpenAPI/Swagger
- ✅ Pruebas unitarias (Jest)
- ✅ Preparado para AWS Lambda (Serverless Framework)
- ✅ Arquitectura Hexagonal (Clean Architecture)
- ✅ Consultas parametrizadas (seguridad)

## 🛠 Tecnologías Utilizadas

### Backend
- **Node.js** v18+
- **TypeScript** v5.3
- **Express.js** v4.18
- **MySQL2** v3.6 (con soporte de Promises)
- **Axios** v1.6 (cliente HTTP)
- **Joi** v17 (validación)
- **Serverless Framework** v3
- **serverless-http** (adaptador Lambda)

### Testing
- **Jest** v29
- **ts-jest** (transformador TypeScript)

### Documentación
- **Swagger UI Express** v5
- **OpenAPI 3.0**

### DevOps
- **AWS Lambda** (runtime Node.js 18)
- **Serverless Offline** (desarrollo local)

## 🏗 Arquitectura

### Arquitectura Hexagonal (Ports and Adapters)

Se eligió la **Arquitectura Hexagonal** (también conocida como Clean Architecture o Ports and Adapters) por las siguientes razones:

#### ¿Por qué Arquitectura Hexagonal?

1. **Separación de Responsabilidades**
   - El código de negocio está completamente aislado de frameworks y tecnologías externas
   - Facilita el testing al poder mockear fácilmente las dependencias
   - Permite cambiar tecnologías (DB, frameworks, APIs) sin afectar la lógica de negocio

2. **Testabilidad**
   - Las dependencias se inyectan mediante interfaces
   - Los casos de uso son fáciles de probar de forma unitaria
   - No se requiere levantar servidores o bases de datos para las pruebas

3. **Mantenibilidad**
   - Código organizado en capas bien definidas
   - Alto cohesión y bajo acoplamiento
   - Fácil de entender y modificar

4. **Escalabilidad**
   - Preparado para crecer sin necesidad de refactorización mayor
   - Nuevas funcionalidades se agregan de manera predecible
   - Adaptable a diferentes infraestructuras (Lambda, EC2, containers)

5. **Ideal para Serverless**
   - AWS Lambda favorece funciones pequeñas y desacopladas
   - La arquitectura hexagonal facilita la creación de handlers Lambda independientes
   - Permite reutilizar lógica de negocio entre diferentes funciones

### Capas de la Arquitectura

```
┌────────────────────────────────────────────────────────┐
│                    PRESENTATION                         │
│  (Controllers, Routes, Validators, Middlewares)        │
│                   Infrastructure Layer                  │
└────────────────────────────────────────────────────────┘
                           ↓
┌────────────────────────────────────────────────────────┐
│                    APPLICATION                          │
│              (Use Cases - Business Logic)              │
│                   Application Layer                     │
└────────────────────────────────────────────────────────┘
                           ↓
┌────────────────────────────────────────────────────────┐
│                      DOMAIN                             │
│        (Entities, Interfaces, Business Rules)          │
│                     Domain Layer                        │
└────────────────────────────────────────────────────────┘
                           ↓
┌────────────────────────────────────────────────────────┐
│                  INFRASTRUCTURE                         │
│     (Database, External APIs, Implementations)         │
│                 Infrastructure Layer                    │
└────────────────────────────────────────────────────────┘
```

#### 1. **Domain Layer** (Núcleo)
- Entidades de negocio (`Character`, `FavoriteCharacter`)
- Interfaces de repositorios y servicios
- Reglas de negocio puras
- **No depende de ninguna otra capa**

#### 2. **Application Layer** (Casos de Uso)
- Casos de uso (`GetCharactersUseCase`, `CreateFavoriteUseCase`, etc.)
- Orquestación de la lógica de negocio
- **Depende solo del Domain**

#### 3. **Infrastructure Layer** (Implementaciones)
- Implementaciones concretas (MySQL, SWAPI service)
- Acceso a bases de datos y APIs externas
- **Depende del Domain (implementa sus interfaces)**

#### 4. **Presentation Layer** (API/UI)
- Controllers, Routes
- Validadores y middlewares
- **Depende de Application e Infrastructure**

## 📁 Estructura del Proyecto

```
PROJECT - SEIDOR/
├── src/
│   ├── application/                 # Capa de aplicación
│   │   └── use-cases/              # Casos de uso
│   │       ├── CreateFavoriteUseCase.ts
│   │       ├── GetCharacterByIdUseCase.ts
│   │       ├── GetCharactersUseCase.ts
│   │       └── GetFavoritesUseCase.ts
│   │
│   ├── domain/                      # Capa de dominio
│   │   ├── entities/               # Entidades de negocio
│   │   │   └── Character.ts
│   │   ├── repositories/           # Interfaces de repositorios
│   │   │   └── IFavoriteRepository.ts
│   │   └── services/               # Interfaces de servicios
│   │       └── ISwapiService.ts
│   │
│   ├── infrastructure/              # Capa de infraestructura
│   │   ├── database/               # Configuración de BD
│   │   │   └── DatabaseConnection.ts
│   │   ├── repositories/           # Implementaciones de repositorios
│   │   │   └── MySQLFavoriteRepository.ts
│   │   └── services/               # Implementaciones de servicios
│   │       └── SwapiService.ts
│   │
│   ├── presentation/                # Capa de presentación
│   │   ├── controllers/            # Controladores
│   │   │   ├── CharacterController.ts
│   │   │   └── FavoriteController.ts
│   │   ├── middlewares/            # Middlewares
│   │   │   ├── errorHandler.ts
│   │   │   └── validation.ts
│   │   ├── routes/                 # Rutas
│   │   │   ├── characterRoutes.ts
│   │   │   └── favoriteRoutes.ts
│   │   └── validators/             # Esquemas de validación
│   │       └── schemas.ts
│   │
│   ├── app.ts                       # Configuración de Express
│   └── index.ts                     # Handler de Lambda
│
├── database/
│   └── schema.sql                   # Script de base de datos
│
├── tests/                           # Pruebas unitarias
│   ├── use-cases/
│   │   ├── CreateFavoriteUseCase.test.ts
│   │   └── GetFavoritesUseCase.test.ts
│   └── services/
│       └── SwapiService.test.ts
│
├── swagger.yml                      # Documentación OpenAPI
├── serverless.yml                   # Configuración Serverless
├── package.json
├── tsconfig.json
├── jest.config.js
├── .env.example
├── .gitignore
└── README.md
```

## 📋 Requisitos Previos

- **Node.js** v18 o superior
- **npm** v9 o superior
- **MySQL** v5.7 o superior
- **Serverless Framework** (opcional para deploy)

## 📦 Instalación

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd "PROJECT - SEIDOR"
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
```

Editar el archivo `.env` con tus credenciales:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=123456
DB_NAME=seidor_database
DB_PORT=3306

SWAPI_BASE_URL=https://swapi.py4e.com/api
```

4. **Crear la base de datos**
```bash
mysql -u root -p < database/schema.sql
```

O ejecutar manualmente:
```bash
mysql -u root -p
source database/schema.sql
```

## ⚙️ Configuración

### Base de Datos

El script `database/schema.sql` crea:
- Base de datos `seidor_database`
- Tabla `favorite_characters` con:
  - Campos del personaje (name, height, mass, etc.)
  - Índice único en `name` (evita duplicados)
  - Índice en `created_at` (optimiza ordenamiento)
  - Consultas parametrizadas para seguridad

### Variables de Entorno

| Variable | Descripción | Valor por defecto |
|----------|-------------|-------------------|
| `DB_HOST` | Host de MySQL | `localhost` |
| `DB_USER` | Usuario de MySQL | `root` |
| `DB_PASSWORD` | Contraseña de MySQL | `123456` |
| `DB_NAME` | Nombre de la base de datos | `seidor_database` |
| `DB_PORT` | Puerto de MySQL | `3306` |
| `SWAPI_BASE_URL` | URL base de SWAPI | `https://swapi.py4e.com/api` |

## 🚀 Ejecución

### Desarrollo Local

#### Opción 1: Serverless Offline (simula Lambda)
```bash
npm run local
```

La API estará disponible en: `http://localhost:3000`

#### Opción 2: Node.js directo
Crear archivo `server.ts` en la raíz:
```typescript
import { createApp } from './src/app';

const app = createApp();
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
```

Ejecutar:
```bash
npx ts-node server.ts
```

### Compilar TypeScript
```bash
npm run build
```

## 🧪 Testing

### Ejecutar todas las pruebas
```bash
npm test
```

### Modo watch (desarrollo)
```bash
npm run test:watch
```

### Coverage
```bash
npm run test:coverage
```

### Resultados Esperados
- ✅ Casos de uso (CreateFavorite, GetFavorites)
- ✅ Servicios (SwapiService)
- ✅ Transformación de datos
- ✅ Validaciones

## 📚 Documentación de la API

### Swagger UI

Una vez la aplicación esté corriendo, acceder a:
```
http://localhost:3000/api-docs
```

### Especificación OpenAPI

Archivo: `swagger.yml` (OpenAPI 3.0)

## ☁️ Despliegue en AWS

### Requisitos
- Cuenta de AWS
- AWS CLI configurado
- Serverless Framework instalado globalmente:
```bash
npm install -g serverless
```

### Pasos para Deploy

1. **Configurar credenciales de AWS**
```bash
aws configure
```

2. **Configurar base de datos RDS**
   - Crear instancia MySQL en RDS
   - Configurar Security Group para permitir conexiones desde Lambda
   - Actualizar variables de entorno en `serverless.yml`

3. **Deploy a dev**
```bash
npm run deploy
```

4. **Deploy a producción**
```bash
npm run deploy:prod
```

### Configuración VPC (para RDS)

Editar `serverless.yml`:
```yaml
provider:
  vpc:
    securityGroupIds:
      - sg-xxxxxxxxx
    subnetIds:
      - subnet-xxxxxxxxx
      - subnet-yyyyyyyyy
```

### Variables de Entorno en AWS

Configurar en AWS Systems Manager Parameter Store o en `serverless.yml`:
```yaml
provider:
  environment:
    DB_HOST: ${ssm:/seidor/db/host}
    DB_USER: ${ssm:/seidor/db/user}
    DB_PASSWORD: ${ssm:/seidor/db/password~true}
```

## 📡 Endpoints

### Health Check
```http
GET /health
```

### Personajes (SWAPI)

#### Obtener listado
```http
GET /api/characters?page=1
```

#### Obtener por ID
```http
GET /api/characters/{id}
```

### Favoritos

#### Listar favoritos
```http
GET /api/favorites?page=1&pageSize=10
```

#### Crear favorito
```http
POST /api/favorites
Content-Type: application/json

{
  "name": "Luke Skywalker",
  "height": "172",
  "mass": "77",
  "hair_color": "blond",
  "skin_color": "fair",
  "eye_color": "blue",
  "birth_year": "19BBY",
  "gender": "male"
}
```

### Ejemplos de Uso

#### Con curl
```bash
# Obtener personajes de SWAPI
curl http://localhost:3000/api/characters

# Crear favorito
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

# Listar favoritos
curl http://localhost:3000/api/favorites?page=1&pageSize=10
```

## 💡 Decisiones Técnicas

### 1. **TypeScript**
- **Ventaja**: Type safety, mejor IDE support, menos errores en runtime
- **Decisión**: Usar strict mode para máxima seguridad de tipos

### 2. **Arquitectura Hexagonal**
- **Ventaja**: Separación de responsabilidades, testabilidad, mantenibilidad
- **Decisión**: Implementar capas bien definidas (Domain, Application, Infrastructure, Presentation)

### 3. **Joi para Validación**
- **Ventaja**: Validaciones declarativas, mensajes personalizados, fácil de mantener
- **Decisión**: Esquemas centralizados en `validators/schemas.ts`

### 4. **MySQL2 con Promises**
- **Ventaja**: Pool de conexiones, prepared statements, async/await
- **Decisión**: Singleton pattern para reutilizar conexiones en Lambda

### 5. **Consultas Parametrizadas**
- **Ventaja**: Prevención de SQL Injection
- **Decisión**: Todas las consultas usan placeholders (`?`)

### 6. **Transformación de Datos**
- **Ventaja**: Solo exponemos los campos necesarios, reduce payload
- **Decisión**: Método `transformCharacter` en `SwapiService`

### 7. **Paginación**
- **Ventaja**: Optimización de rendimiento, mejor UX
- **Decisión**: Implementada en favoritos (page, pageSize) y respetada en SWAPI

### 8. **Manejo de Errores Centralizado**
- **Ventaja**: Consistencia en respuestas de error, fácil debugging
- **Decisión**: Middleware `errorHandler` que clasifica errores

### 9. **Serverless Framework**
- **Ventaja**: Configuración declarativa, plugins, multi-cloud
- **Decisión**: Plugin `serverless-offline` para desarrollo local

### 10. **Testing con Jest**
- **Ventaja**: Framework completo, good mocking support, TypeScript support
- **Decisión**: Unit tests para casos de uso críticos

### 11. **Swagger/OpenAPI**
- **Ventaja**: Documentación interactiva, estándar de la industria
- **Decisión**: YAML para mejor legibilidad

### 12. **Express con serverless-http**
- **Ventaja**: Ecosistema maduro, fácil migración entre architecturas
- **Decisión**: Adaptar Express a Lambda en lugar de API Gateway directo

## 🔐 Seguridad

- ✅ Consultas parametrizadas (prevención de SQL Injection)
- ✅ Validación robusta de entrada (Joi)
- ✅ Sanitización de datos
- ✅ Variables de entorno para credenciales
- ✅ CORS configurado
- ✅ Manejo seguro de errores (no expone stack traces en producción)

## 📈 Mejoras Futuras

- [ ] Autenticación y autorización (JWT)
- [ ] Rate limiting
- [ ] Caching (Redis)
- [ ] Logs estructurados (Winston, CloudWatch)
- [ ] Monitoring (AWS X-Ray)
- [ ] CI/CD pipeline
- [ ] Endpoints adicionales (UPDATE, DELETE favoritos)
- [ ] Búsqueda y filtrado avanzado
- [ ] Integración con otros recursos de SWAPI (films, planets, etc.)

## 👨‍💻 Autor

Proyecto desarrollado para SEIDOR

## 📄 Licencia

MIT
