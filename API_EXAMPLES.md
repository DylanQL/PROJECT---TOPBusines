# Ejemplos de Uso de la API

Este documento contiene ejemplos prácticos de cómo usar la API.

## 📋 Tabla de Contenidos

- [Health Check](#health-check)
- [Personajes SWAPI](#personajes-swapi)
- [Favoritos](#favoritos)
- [Casos de Uso Completos](#casos-de-uso-completos)

---

## Health Check

### Verificar estado de la API

```bash
curl http://localhost:3000/health
```

**Respuesta:**
```json
{
  "success": true,
  "message": "API funcionando correctamente",
  "timestamp": "2026-02-14T10:30:00.000Z"
}
```

---

## Personajes SWAPI

### 1. Obtener listado de personajes (página 1)

```bash
curl http://localhost:3000/api/characters
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "count": 87,
    "next": "https://swapi.py4e.com/api/people/?page=2",
    "previous": null,
    "results": [
      {
        "name": "Luke Skywalker",
        "height": "172",
        "mass": "77",
        "hair_color": "blond",
        "skin_color": "fair",
        "eye_color": "blue",
        "birth_year": "19BBY",
        "gender": "male"
      },
      {
        "name": "C-3PO",
        "height": "167",
        "mass": "75",
        "hair_color": "n/a",
        "skin_color": "gold",
        "eye_color": "yellow",
        "birth_year": "112BBY",
        "gender": "n/a"
      }
    ]
  }
}
```

### 2. Obtener listado de personajes (página 2)

```bash
curl http://localhost:3000/api/characters?page=2
```

### 3. Obtener un personaje específico por ID

```bash
curl http://localhost:3000/api/characters/1
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "name": "Luke Skywalker",
    "height": "172",
    "mass": "77",
    "hair_color": "blond",
    "skin_color": "fair",
    "eye_color": "blue",
    "birth_year": "19BBY",
    "gender": "male"
  }
}
```

### 4. Error: Personaje no encontrado

```bash
curl http://localhost:3000/api/characters/9999
```

**Respuesta:**
```json
{
  "success": false,
  "message": "Personaje con ID 9999 no encontrado"
}
```

---

## Favoritos

### 1. Crear un personaje favorito

```bash
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
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Personaje agregado a favoritos exitosamente",
  "data": {
    "id": 1,
    "name": "Luke Skywalker",
    "height": "172",
    "mass": "77",
    "hair_color": "blond",
    "skin_color": "fair",
    "eye_color": "blue",
    "birth_year": "19BBY",
    "gender": "male",
    "created_at": "2026-02-14T10:30:00.000Z"
  }
}
```

### 2. Error: Personaje duplicado

```bash
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
```

**Respuesta:**
```json
{
  "success": false,
  "message": "El personaje \"Luke Skywalker\" ya existe en favoritos"
}
```

### 3. Error: Validación de datos

```bash
curl -X POST http://localhost:3000/api/favorites \
  -H "Content-Type: application/json" \
  -d '{
    "name": "",
    "height": "172"
  }'
```

**Respuesta:**
```json
{
  "success": false,
  "message": "Error de validación",
  "errors": [
    {
      "field": "name",
      "message": "El nombre es requerido"
    },
    {
      "field": "mass",
      "message": "El peso es requerido"
    },
    {
      "field": "hair_color",
      "message": "El color de cabello es requerido"
    }
  ]
}
```

### 4. Listar favoritos (página 1, 10 por página)

```bash
curl http://localhost:3000/api/favorites
```

**Respuesta:**
```json
{
  "success": true,
  "data": [
    {
      "id": 3,
      "name": "Han Solo",
      "height": "180",
      "mass": "80",
      "hair_color": "brown",
      "skin_color": "fair",
      "eye_color": "brown",
      "birth_year": "29BBY",
      "gender": "male",
      "created_at": "2026-02-14T10:35:00.000Z"
    },
    {
      "id": 2,
      "name": "Leia Organa",
      "height": "150",
      "mass": "49",
      "hair_color": "brown",
      "skin_color": "light",
      "eye_color": "brown",
      "birth_year": "19BBY",
      "gender": "female",
      "created_at": "2026-02-14T10:32:00.000Z"
    },
    {
      "id": 1,
      "name": "Luke Skywalker",
      "height": "172",
      "mass": "77",
      "hair_color": "blond",
      "skin_color": "fair",
      "eye_color": "blue",
      "birth_year": "19BBY",
      "gender": "male",
      "created_at": "2026-02-14T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 10,
    "total": 3,
    "totalPages": 1
  }
}
```

### 5. Listar favoritos con paginación personalizada

```bash
curl "http://localhost:3000/api/favorites?page=2&pageSize=5"
```

### 6. Error: Paginación inválida

```bash
curl "http://localhost:3000/api/favorites?page=0&pageSize=200"
```

**Respuesta:**
```json
{
  "success": false,
  "message": "Error de validación",
  "errors": [
    {
      "field": "page",
      "message": "El número de página debe ser mayor o igual a 1"
    },
    {
      "field": "pageSize",
      "message": "El tamaño de página no puede exceder 100"
    }
  ]
}
```

---

## Casos de Uso Completos

### Caso 1: Flujo completo - Buscar y guardar favorito

```bash
# 1. Obtener personajes de SWAPI
CHARACTERS=$(curl -s http://localhost:3000/api/characters)
echo $CHARACTERS | jq '.data.results[0]'

# 2. Guardar el primer personaje como favorito
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

# 3. Verificar que se guardó
curl http://localhost:3000/api/favorites
```

### Caso 2: Guardar múltiples favoritos

```bash
# Guardar Luke Skywalker
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

# Guardar Leia Organa
curl -X POST http://localhost:3000/api/favorites \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Leia Organa",
    "height": "150",
    "mass": "49",
    "hair_color": "brown",
    "skin_color": "light",
    "eye_color": "brown",
    "birth_year": "19BBY",
    "gender": "female"
  }'

# Guardar Darth Vader
curl -X POST http://localhost:3000/api/favorites \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Darth Vader",
    "height": "202",
    "mass": "136",
    "hair_color": "none",
    "skin_color": "white",
    "eye_color": "yellow",
    "birth_year": "41.9BBY",
    "gender": "male"
  }'

# Ver todos los favoritos
curl http://localhost:3000/api/favorites
```

### Caso 3: Usando JavaScript/Fetch

```javascript
// Obtener personajes de SWAPI
const getCharacters = async () => {
  const response = await fetch('http://localhost:3000/api/characters');
  const data = await response.json();
  return data.data.results;
};

// Guardar como favorito
const saveFavorite = async (character) => {
  const response = await fetch('http://localhost:3000/api/favorites', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(character),
  });
  return await response.json();
};

// Uso
(async () => {
  const characters = await getCharacters();
  const firstCharacter = characters[0];
  const result = await saveFavorite(firstCharacter);
  console.log(result);
})();
```

### Caso 4: Usando Python/Requests

```python
import requests

# Obtener personajes
response = requests.get('http://localhost:3000/api/characters')
characters = response.json()['data']['results']

# Guardar primer personaje como favorito
first_character = characters[0]
response = requests.post(
    'http://localhost:3000/api/favorites',
    json=first_character
)
print(response.json())

# Obtener favoritos
response = requests.get('http://localhost:3000/api/favorites')
favorites = response.json()
print(f"Total de favoritos: {favorites['pagination']['total']}")
```

---

## Notas

- Todos los ejemplos asumen que la API está corriendo en `http://localhost:3000`
- Para producción, reemplazar con la URL de AWS Lambda
- Los timestamps pueden variar
- Los IDs son autoincrementales
