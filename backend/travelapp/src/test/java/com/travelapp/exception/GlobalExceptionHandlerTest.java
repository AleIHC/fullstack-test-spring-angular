package com.travelapp.exception;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;

@DisplayName("Tests de GlobalExceptionHandler")
class GlobalExceptionHandlerTest {
    
    private GlobalExceptionHandler globalExceptionHandler;

    // Configuraciones previas a cada test
    @BeforeEach
    void setUp() {
        globalExceptionHandler = new GlobalExceptionHandler();
    }

    @Test
    @DisplayName("Debe manejar EntityNotFoundException correctamente")
    void shouldHandleEntityNotFoundException() {
        // Dado
        EntityNotFoundException excepcion = new EntityNotFoundException("Entidad no encontrada");

        // Cuando
        ResponseEntity<ProblemDetail> respuesta = globalExceptionHandler.handleEntityNotFoundException(excepcion);

        // Entonces
        assertThat(respuesta.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
        assertThat(respuesta.getBody().getDetail()).isEqualTo("Entidad no encontrada");
        assertThat(respuesta.getBody().getTitle()).isEqualTo("Entidad no encontrada");
    }

    @Test
    @DisplayName("Debe manejar ValidationException correctamente")
    void shouldHandleValidationException() {
        // Dado
        ValidationException excepcion = new ValidationException("Error de validación");

        // Cuando
        ResponseEntity<ProblemDetail> respuesta = globalExceptionHandler.handleValidationException(excepcion);

        // Entonces
        assertThat(respuesta.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(respuesta.getBody().getDetail()).isEqualTo("Error de validación");
        assertThat(respuesta.getBody().getTitle()).isEqualTo("Error de validación");
    }

    @Test
    @DisplayName("Debe manejar DuplicateEntityException correctamente")
    void shouldHandleDuplicateEntityException() {
        // Dado
        DuplicateEntityException excepcion = new DuplicateEntityException("Entidad duplicada");

        // Cuando
        ResponseEntity<ProblemDetail> respuesta = globalExceptionHandler.handleDuplicateEntityException(excepcion);

        // Entonces
        assertThat(respuesta.getStatusCode()).isEqualTo(HttpStatus.CONFLICT);
        assertThat(respuesta.getBody().getDetail()).isEqualTo("Entidad duplicada");
        assertThat(respuesta.getBody().getTitle()).isEqualTo("Entidad duplicada");
    }

    @Test
    @DisplayName("Debe manejar Exception genérica correctamente")
    void shouldHandleGenericException() {
        // Dado
        Exception excepcion = new RuntimeException("Error inesperado");

        // Cuando
        ResponseEntity<ProblemDetail> respuesta = globalExceptionHandler.handleGeneralException(excepcion);

        // Entonces
        assertThat(respuesta.getStatusCode()).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR);
        assertThat(respuesta.getBody().getTitle()).isEqualTo("Error interno del servidor");
    }

}
