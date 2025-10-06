# Travel App ✈️

Aplicación fullstack para gestionar destinos turísticos.  
Tecnologías: Java 17, Spring Boot 3, Angular LTS, PostgreSQL, Docker.

## Roadmap
- [x] Backend (Spring Boot + PostgreSQL + REST)
- [x] Frontend (Angular + CRUD básico)
- [x] Docker Compose (Base de datos + Backend + Frontend)
- [x] ✅ Configuración externa con variables de entorno
- [ ] Extras: Swagger, Keycloak

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

**Frontend:**
- Angular 19 (LTS)
- Angular Material
- TypeScript
- RxJS
- Jasmine + Karma (tests)
- HttpClient

## 🚀 Cómo ejecutar Backend

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

### 3. Tests Backend
```bash
cd backend/travelapp
mvn clean test
```

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

## 🚀 Cómo ejecutar Frontend

### Prerrequisitos
- Node.js 18+
- npm 9+

### 1. Ejecutar aplicación
```bash
cd frontend/travel-app
npm install
npm start          # o alternativamente: ng serve 
```

### 2. Tests frontend
```bash
cd frontend/travel-app
npm test        # o alternativamente: ng test
```

## 📄 Reportes de cobertura
- Backend: target/site/jacoco/index.html
- Frontend: coverage/travel-app/index.html

## 🚀 Ejecución Rápida con Docker

### Prerrequisitos
- Docker Desktop instalado y ejecutándose
- Git

### 1. Clonar repositorio
```bash
git clone <url-repositorio>
cd fullstack-test-spring-angular
```

### 2. Ejecutar aplicación completa
```bash
docker-compose up --build
```

### 3. Acceder a la aplicación
- Frontend: http://localhost:4200
- Backend API: http://localhost:8080/api
- Base de datos: localhost:5432

### 4. Detener aplicación
```bash
docker-compose down
```

## 🔧 Configuración Externa

La aplicación implementa **configuración externa** usando variables de entorno, siguiendo las mejores prácticas de seguridad y DevOps.

### 📋 Variables de Entorno Disponibles

| Variable | Descripción | Valor por Defecto | Ejemplo |
|----------|-------------|------------------|---------|
| `DB_URL` | URL de conexión a PostgreSQL | `jdbc:postgresql://postgres:5432/travelapp` | `jdbc:postgresql://localhost:5432/mydb` |
| `DB_USERNAME` | Usuario de base de datos | `travelapp` | `myuser` |
| `DB_PASSWORD` | Contraseña de base de datos | `travelapp123` | `mypassword` |
| `SERVER_PORT` | Puerto del servidor Spring Boot | `8080` | `9090` |
| `LOG_LEVEL` | Nivel de logging para la aplicación | `INFO` | `DEBUG` |
| `SHOW_SQL` | Mostrar consultas SQL en logs | `true` | `false` |
| `FORMAT_SQL` | Formatear consultas SQL | `true` | `false` |

### 🏠 Para Desarrollo Local

#### 1. Usando archivo .env (Recomendado)
```bash
# Copia el template
cp .env.example .env

# Edita las variables según tu entorno
# Las variables se cargan automáticamente con Docker Compose
docker-compose up --build
```

#### 2. Usando variables del sistema
```bash
# Windows PowerShell
$env:DB_PASSWORD="mi_password_seguro"
docker-compose up --build

# Linux/macOS
export DB_PASSWORD="mi_password_seguro"
docker-compose up --build
```

## 🚀 Próximas Funcionalidades

- [ ] Componentes de viajes (backend listo)
- [ ] Documentación API con Swagger
- [ ] Autenticación con Keycloak
- [ ] Tests de integración E2E
- [ ] CI/CD Pipeline

## 📝 Notas de Desarrollo

- Angular 19 genera archivos de build en `dist/travel-app/browser/`
- PostgreSQL se inicializa automáticamente con datos de prueba
- La aplicación usa perfiles Spring (local, docker, test)
- Material Design theming configurado
- Proxy nginx configurado para evitar CORS