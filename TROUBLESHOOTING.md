# Guía de Solución de Problemas

## Historial de Problemas Resueltos

### 1. Error de TypeScript: "Not all code paths return a value"

**Problema:**
```
src/presentation/middlewares/validation.ts:8:74 - error TS7030: Not all code paths return a value.
```

**Causa:** 
Las funciones de validación no tenían un tipo de retorno explícito y TypeScript en modo estricto requiere que todas las rutas de código retornen un valor.

**Solución:**
- Agregar anotación de tipo `: void` a las funciones
- Cambiar `return res.status(400).json(...)` por `res.status(400).json(...); return;`

**Archivos modificados:**
- `src/presentation/middlewares/validation.ts`

---

### 2. Error de MySQL2: "Incorrect arguments to mysqld_stmt_execute"

**Problema:**
```
Error: Incorrect arguments to mysqld_stmt_execute
code: 'ER_WRONG_ARGUMENTS',
errno: 1210,
sql: 'SELECT ... LIMIT ? OFFSET ?'
```

**Causa:**
MySQL2 no soporta placeholders (`?`) para las cláusulas `LIMIT` y `OFFSET` en prepared statements. Aunque los valores sean de tipo `number`, la librería rechaza estos parámetros en consultas preparadas.

**Solución:**
Interpolar directamente los valores de LIMIT y OFFSET en la consulta SQL después de validarlos como enteros seguros:

```typescript
// ❌ INCORRECTO - No funciona con MySQL2
const sql = 'SELECT ... LIMIT ? OFFSET ?';
const rows = await this.db.query(sql, [limit, skip]);

// ✅ CORRECTO - Interpolar directamente
const limit = Math.floor(Number(pageSize)); // Validar como entero
const skip = Math.floor(Number(offset));
const sql = `SELECT ... LIMIT ${limit} OFFSET ${skip}`;
const rows = await this.db.query(sql);
```

**Nota de seguridad:**
Esta interpolación es segura porque los valores pasan por:
1. Validación Joi que asegura que son números
2. Conversión con `Number()` 
3. Redondeo a entero con `Math.floor()`
4. No hay entrada arbitraria del usuario en estos valores

**Archivos modificados:**
- `src/infrastructure/repositories/MySQLFavoriteRepository.ts`

**Referencias:**
- [MySQL2 Issue sobre LIMIT/OFFSET](https://github.com/sidorares/node-mysql2/issues/1239)

---

### 3. Error en Test: "Property 'returnValue' does not exist on type 'Mock'"

**Problema:**
```
tests/services/SwapiService.test.ts:15:36 - error TS2339: 
Property 'returnValue' does not exist on type 'Mock<any, any, any>'.
```

**Causa:**
Jest no tiene un método `.returnValue()`, el método correcto es `.mockReturnValue()`.

**Solución:**
```typescript
// ❌ INCORRECTO
mockedAxios.create = jest.fn().returnValue({...});

// ✅ CORRECTO
mockedAxios.create = jest.fn().mockReturnValue({...});
```

**Archivos modificados:**
- `tests/services/SwapiService.test.ts`

---

## Verificación de Funcionalidad

### Todos los Endpoints Funcionando ✅

1. **Health Check** - `GET /health`
   ```bash
   curl http://localhost:3000/health
   ```

2. **Listar Personajes SWAPI** - `GET /api/characters?page=1`
   ```bash
   curl "http://localhost:3000/api/characters?page=1"
   ```

3. **Obtener Personaje** - `GET /api/characters/:id`
   ```bash
   curl "http://localhost:3000/api/characters/1"
   ```

4. **Crear Favorito** - `POST /api/favorites`
   ```bash
   curl -X POST http://localhost:3000/api/favorites \
     -H "Content-Type: application/json" \
     -d '{"name":"Luke Skywalker","height":"172","mass":"77","hair_color":"blond","skin_color":"fair","eye_color":"blue","birth_year":"19BBY","gender":"male"}'
   ```

5. **Listar Favoritos** - `GET /api/favorites?page=1&pageSize=10`
   ```bash
   curl "http://localhost:3000/api/favorites?page=1&pageSize=10"
   ```

### Tests Unitarios ✅

```bash
npm test
```

Resultado: **9 tests pasando, 3 suites**
- ✅ GetFavoritesUseCase.test.ts
- ✅ CreateFavoriteUseCase.test.ts  
- ✅ SwapiService.test.ts

---

## Comandos Útiles

### Desarrollo
```bash
# Iniciar servidor de desarrollo
npm start

# Ejecutar tests
npm test

# Ejecutar tests en modo watch
npm run test:watch

# Verificar compilación TypeScript
npx tsc --noEmit
```

### Base de Datos
```bash
# Conectar a MySQL
mysql -u root -p

# Ejecutar schema
mysql -u root -p seidor_swapi_db < database/schema.sql

# Ver favoritos en DB
mysql -u root -p seidor_swapi_db -e "SELECT * FROM favorite_characters;"
```

### Debugging
```bash
# Ver logs del servidor
tail -f /tmp/server.log

# Matar proceso del servidor
pkill -f "ts-node server.ts"

# Verificar puerto 3000
lsof -i :3000
```

---

## Notas de Arquitectura

### Limitaciones Conocidas de MySQL2

1. **LIMIT/OFFSET no soportan placeholders**: Deben interpolarse directamente
2. **Tipos de datos estrictos**: Los parámetros deben coincidir exactamente con los tipos de columna
3. **Prepared statements**: No todas las cláusulas SQL soportan `?` como placeholder

### Buenas Prácticas

1. **Validación en capas**:
   - Joi valida en la capa de presentación
   - Use cases validan lógica de negocio
   - Repositorios validan tipos antes de DB

2. **Seguridad**:
   - Siempre usar placeholders cuando sea posible
   - Validar y sanitizar antes de interpolar
   - Nunca interpolar entrada directa del usuario sin validación

3. **Testing**:
   - Mockear dependencias externas (axios, mysql)
   - Probar casos de error y éxito
   - Validar transformaciones de datos
