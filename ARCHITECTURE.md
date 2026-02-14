# Arquitectura del Sistema

## 📐 Diagrama de Arquitectura Cloud (AWS)

```
┌──────────────────────────────────────────────────────────────────┐
│                          INTERNET                                 │
└────────────────────────────┬─────────────────────────────────────┘
                             │
                             ▼
                  ┌──────────────────────┐
                  │   Amazon CloudFront  │ (Opcional)
                  │    (CDN/Cache)       │
                  └──────────┬───────────┘
                             │
                             ▼
                  ┌──────────────────────┐
                  │   API Gateway        │
                  │   (REST API)         │
                  │   - Rate Limiting    │
                  │   - API Keys         │
                  └──────────┬───────────┘
                             │
                             ▼
                  ┌──────────────────────┐
                  │   AWS Lambda         │
                  │   (Node.js 18)       │
                  │   - Express App      │
                  │   - Serverless HTTP  │
                  └──────┬───────────────┘
                         │
          ┌──────────────┼──────────────┐
          │              │              │
          ▼              ▼              ▼
   ┌──────────┐   ┌──────────┐   ┌──────────┐
   │ SWAPI    │   │ RDS      │   │ CloudW.  │
   │ External │   │ MySQL    │   │ Logs     │
   │ API      │   │ Database │   │          │
   └──────────┘   └──────────┘   └──────────┘
```

## 🔄 Flujo de Datos

### Flujo 1: Obtener Personajes de SWAPI

```
Cliente
  │
  │ GET /api/characters
  ▼
API Gateway
  │
  ▼
Lambda Handler (index.ts)
  │
  ▼
Express Router
  │
  ▼
CharacterController
  │
  ▼
GetCharactersUseCase
  │
  ▼
SwapiService
  │
  │ HTTP GET
  ▼
SWAPI (https://swapi.py4e.com/api/people/)
  │
  │ Response (JSON)
  ▼
SwapiService (transformCharacter)
  │
  ▼
CharacterController
  │
  │ JSON Response
  ▼
Cliente
```

### Flujo 2: Guardar Favorito

```
Cliente
  │
  │ POST /api/favorites
  │ { character data }
  ▼
API Gateway
  │
  ▼
Lambda Handler
  │
  ▼
Express Router
  │
  ▼
Validation Middleware (Joi)
  │
  ▼
FavoriteController
  │
  ▼
CreateFavoriteUseCase
  │
  ├─→ favoriteRepository.exists(name)
  │   │
  │   ▼
  │   MySQL Query: SELECT * FROM favorite_characters WHERE name = ?
  │   │
  │   ▼
  │   Return: boolean
  │
  ├─→ if (exists) throw Error
  │
  └─→ favoriteRepository.create(character)
      │
      ▼
      MySQL Query: INSERT INTO favorite_characters (...)
      │
      ▼
      Return: FavoriteCharacter
      │
      ▼
FavoriteController
  │
  │ JSON Response (201 Created)
  ▼
Cliente
```

## 🏛️ Arquitectura Hexagonal Detallada

```
┌─────────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                            │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ Controllers  │  │  Validators  │  │  Middlewares │          │
│  ├──────────────┤  ├──────────────┤  ├──────────────┤          │
│  │ Character    │  │ Joi Schemas  │  │ Error Handr. │          │
│  │ Favorite     │  │ Validation   │  │ CORS         │          │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘          │
│         │                 │                 │                   │
│         └─────────────────┼─────────────────┘                   │
│                           │                                     │
└───────────────────────────┼─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                   APPLICATION LAYER                              │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    USE CASES                              │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │ • GetCharactersUseCase                                   │  │
│  │ • GetCharacterByIdUseCase                                │  │
│  │ • CreateFavoriteUseCase                                  │  │
│  │ • GetFavoritesUseCase                                    │  │
│  └────────────────┬────────────────┬────────────────────────┘  │
│                   │                │                            │
└───────────────────┼────────────────┼────────────────────────────┘
                    │                │
                    ▼                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      DOMAIN LAYER                                │
│                                                                  │
│  ┌──────────────┐  ┌──────────────────┐  ┌─────────────────┐  │
│  │  Entities    │  │   Repositories   │  │    Services     │  │
│  ├──────────────┤  ├──────────────────┤  ├─────────────────┤  │
│  │ Character    │  │ IFavoriteRepo    │  │ ISwapiService   │  │
│  │ FavChar      │  │ (Interface)      │  │ (Interface)     │  │
│  │ Pagination   │  └──────────────────┘  └─────────────────┘  │
│  └──────────────┘                                              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                  INFRASTRUCTURE LAYER                            │
│                                                                  │
│  ┌──────────────────┐        ┌──────────────────┐              │
│  │   Repositories   │        │    Services      │              │
│  ├──────────────────┤        ├──────────────────┤              │
│  │ MySQLFavorite    │        │ SwapiService     │              │
│  │ Repository       │        │ (Axios HTTP)     │              │
│  │                  │        │                  │              │
│  │ implements       │        │ implements       │              │
│  │ IFavoriteRepo    │        │ ISwapiService    │              │
│  └────────┬─────────┘        └────────┬─────────┘              │
│           │                           │                         │
│           ▼                           ▼                         │
│  ┌──────────────────┐        ┌──────────────────┐              │
│  │ DatabaseConn     │        │ External API     │              │
│  │ (MySQL Pool)     │        │ (SWAPI)          │              │
│  └──────────────────┘        └──────────────────┘              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 🔌 Dependency Injection Flow

```
app.ts (Composition Root)
  │
  ├─→ DatabaseConnection.getInstance(config)
  │   │
  │   └─→ MySQL Pool
  │
  ├─→ MySQLFavoriteRepository(db)
  │   │
  │   └─→ implements IFavoriteRepository
  │
  ├─→ SwapiService()
  │   │
  │   └─→ implements ISwapiService
  │
  ├─→ GetCharactersUseCase(swapiService)
  ├─→ GetCharacterByIdUseCase(swapiService)
  ├─→ CreateFavoriteUseCase(favoriteRepository)
  ├─→ GetFavoritesUseCase(favoriteRepository)
  │
  ├─→ CharacterController(getCharacters, getCharacterById)
  ├─→ FavoriteController(createFavorite, getFavorites)
  │
  └─→ Express Routes
```

## 📊 Modelo de Datos

### Entidad: Character

```typescript
interface Character {
  name: string          // Nombre del personaje
  height: string        // Altura (en cm)
  mass: string          // Peso (en kg)
  hair_color: string    // Color de cabello
  skin_color: string    // Color de piel
  eye_color: string     // Color de ojos
  birth_year: string    // Año de nacimiento (BBY/ABY)
  gender: string        // Género
}
```

### Entidad: FavoriteCharacter

```typescript
interface FavoriteCharacter extends Character {
  id: number            // ID autoincremental
  created_at: Date      // Timestamp de creación
}
```

### Base de Datos: favorite_characters

```sql
CREATE TABLE favorite_characters (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  height VARCHAR(50) NOT NULL,
  mass VARCHAR(50) NOT NULL,
  hair_color VARCHAR(50) NOT NULL,
  skin_color VARCHAR(50) NOT NULL,
  eye_color VARCHAR(50) NOT NULL,
  birth_year VARCHAR(50) NOT NULL,
  gender VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  UNIQUE KEY uk_name (name),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB;
```

## 🔐 Seguridad

### 1. SQL Injection Prevention

```typescript
// ❌ MAL - Vulnerable a SQL Injection
const sql = `SELECT * FROM users WHERE name = '${name}'`;

// ✅ BIEN - Consultas parametrizadas
const sql = 'SELECT * FROM users WHERE name = ?';
db.query(sql, [name]);
```

### 2. Input Validation

```typescript
// ✅ Joi validation antes de procesar
const schema = Joi.object({
  name: Joi.string().required().trim().min(1).max(255),
  // ...
});

const { error, value } = schema.validate(req.body);
```

### 3. Error Handling

```typescript
// ❌ MAL - Expone información sensible
catch (error) {
  res.json({ error: error.stack });
}

// ✅ BIEN - Mensajes genéricos
catch (error) {
  res.json({ 
    message: 'Error interno',
    details: process.env.NODE_ENV === 'dev' ? error.message : undefined
  });
}
```

## ⚡ Performance

### Connection Pooling

```typescript
// Singleton pattern para reutilizar conexiones en Lambda
const pool = mysql.createPool({
  connectionLimit: 10,
  waitForConnections: true,
  queueLimit: 0,
});
```

### Lambda Cold Start Optimization

- Runtime: Node.js 18 (más rápido)
- Memory: 512 MB (balance costo/performance)
- Lazy loading de dependencias
- Reutilización de conexiones DB

### Paginación

```typescript
// Evita cargar todos los registros
const offset = (page - 1) * pageSize;
const sql = 'SELECT * FROM table LIMIT ? OFFSET ?';
```

## 📈 Escalabilidad

### AWS Lambda

- **Concurrencia**: Hasta 1000 ejecuciones simultáneas por defecto
- **Auto-scaling**: Automático basado en requests
- **Stateless**: Cada invocación es independiente

### Base de Datos

- **Connection Pool**: Reutiliza conexiones
- **Índices**: En campos frecuentemente consultados
- **Preparado para Read Replicas**: Separar lecturas/escrituras

### API Gateway

- **Rate Limiting**: Controla tráfico
- **Caching**: Reduce llamadas a Lambda
- **Throttling**: Protege backend

## 🧪 Testabilidad

### Unit Tests

```typescript
// Mock del repositorio
const mockRepo = {
  create: jest.fn(),
  findAll: jest.fn(),
};

// Test del caso de uso aislado
const useCase = new CreateFavoriteUseCase(mockRepo);
await useCase.execute(character);

expect(mockRepo.create).toHaveBeenCalledWith(character);
```

### Ventajas de la arquitectura

- ✅ Dependencias inyectadas (fácil de mockear)
- ✅ Lógica de negocio aislada
- ✅ Sin dependencias de framework en casos de uso
- ✅ Tests unitarios rápidos (sin DB/HTTP)

## 📦 Build & Deploy

```
Source Code (TypeScript)
  │
  │ npm run build
  ▼
Compiled Code (JavaScript)
  │
  │ serverless deploy
  ▼
AWS CloudFormation
  │
  ├─→ Lambda Function
  ├─→ API Gateway
  ├─→ IAM Roles
  ├─→ CloudWatch Logs
  └─→ CloudFormation Stack
```

## 🔄 CI/CD Pipeline (Futuro)

```
GitHub Push
  │
  ▼
GitHub Actions / AWS CodePipeline
  │
  ├─→ npm install
  ├─→ npm run lint
  ├─→ npm test
  ├─→ npm run build
  │
  ▼
Serverless Deploy
  │
  ├─→ Deploy to dev (automático)
  ├─→ Integration Tests
  ├─→ Manual approval
  └─→ Deploy to prod
```

## 📚 Patrones de Diseño Utilizados

1. **Hexagonal Architecture** (Arquitectura principal)
2. **Dependency Injection** (Inversión de dependencias)
3. **Repository Pattern** (Abstracción de persistencia)
4. **Service Pattern** (Abstracción de APIs externas)
5. **Use Case Pattern** (Lógica de aplicación)
6. **Singleton Pattern** (Conexión a DB)
7. **Adapter Pattern** (serverless-http)
8. **Middleware Pattern** (Express)

## 🎯 Principios SOLID

- ✅ **S**ingle Responsibility: Cada clase tiene una responsabilidad
- ✅ **O**pen/Closed: Abierto a extensión, cerrado a modificación
- ✅ **L**iskov Substitution: Interfaces permiten sustituir implementaciones
- ✅ **I**nterface Segregation: Interfaces específicas (IFavoriteRepo, ISwapiService)
- ✅ **D**ependency Inversion: Dependencias hacia abstracciones, no concreciones
