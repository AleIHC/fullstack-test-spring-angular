# Dockerfile para backend Spring Boot
FROM openjdk:17-jdk-slim

# Maven
RUN apt-get update && \
    apt-get install -y curl maven && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Archivos de configuración de Maven
COPY pom.xml .

RUN mvn dependency:go-offline -B

# Copiar código fuente
COPY src ./src

# Compilar aplicación
RUN mvn clean package -DskipTests

EXPOSE 8080

# Ejecutar la aplicación
CMD ["java", "-jar", "target/travelapp-0.0.1-SNAPSHOT.jar", "--spring.profiles.active=docker"]