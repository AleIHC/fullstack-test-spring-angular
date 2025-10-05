# Travel App ✈️

Aplicación fullstack para gestionar destinos turísticos.  
Tecnologías: Java 17, Spring Boot 3, Angular LTS, PostgreSQL, Docker.

## Roadmap
- [x] Backend (Spring Boot + PostgreSQL + REST)
- [ ] Frontend (Angular + CRUD básico)
- [ ] Docker Compose (Base de datos + Backend + Frontend)
- [ ] Extras: Swagger, Keycloak, Configuración externa

## 🛠️ Tecnologías utilizadas

**Backend:**
- Java 17
- Spring Boot 3.5.6
- Spring Data JPA
- PostgreSQL (producción)
- H2 (tests)
- Liquibase (migraciones)
- JaCoCo (cobertura)
- JUnit 5 + Mockito
- Bean Validation
- Lombok

## 🚀 Cómo ejecutar

### Prerrequisitos
- Java 17+
- Maven 3.6+
- PostgreSQL 12+ (para perfil local)

### 1. Base de datos local
```sql
CREATE DATABASE travel_db;
CREATE USER postgres WITH PASSWORD 'tu_password';
GRANT ALL PRIVILEGES ON DATABASE travel_db TO postgres;
```

### 2. Ejecutar aplicación
Agregar credenciales de BD en backend/travelapp/resources/application.properties
```bash
cd backend/travelapp
mvn spring-boot:run 
```
La aplicación estará disponible en: http://localhost:8080

### 3. Tests
```bash
cd backend/travelapp
mvn clean test
```
Abrir en navegador: target/site/jacoco/index.html

## 📚 API Endpoints

### 🏝️ Destinos
| Método | Endpoint | Descripción | Códigos |
|--------|----------|-------------|---------|
| `GET` | `/api/destinos` | Listar destinos (paginado) | 200 |
| `GET` | `/api/destinos?pais=India` | Filtrar por país | 200 |
| `GET` | `/api/destinos/{id}` | Obtener destino por ID | 200, 404 |
| `POST` | `/api/destinos` | Crear nuevo destino | 201, 400 |
| `PUT` | `/api/destinos/{id}` | Actualizar destino | 200, 400, 404 |
| `DELETE` | `/api/destinos/{id}` | Eliminar destino | 204, 404 |

### ✈️ Viajes  
| Método | Endpoint | Descripción | Códigos |
|--------|----------|-------------|---------|
| `GET` | `/api/viajes` | Listar viajes (paginado) | 200 |
| `GET` | `/api/viajes?destinoId=1` | Filtrar por destino | 200 |
| `GET` | `/api/viajes/{id}` | Obtener viaje por ID | 200, 404 |
| `POST` | `/api/viajes` | Crear nuevo viaje | 201, 400 |
| `PUT` | `/api/viajes/{id}` | Actualizar viaje | 200, 400, 404 |
| `DELETE` | `/api/viajes/{id}` | Eliminar viaje | 204, 404 |

## 📋 Ejemplos de uso

### Crear destino
```bash
POST http://localhost:8080/api/destinos
Content-Type: application/json

{
    "nombre": "Santiago",
    "pais": "Chile"
}
```

### Crear viaje
```bash
POST http://localhost:8080/api/viajes
Content-Type: application/json

{
    "fechaInicio": "2026-01-01",
    "fechaFin": "2026-01-30", 
    "precio": 850.00,
    "destinoId": 1
}
```

### Estadísticas de unit tests
- Total tests: 41
- Services: 22 tests
- Mappers: 14 tests  
- Exception Handlers: 4 tests
- Cobertura: 81.375%