package com.travelapp.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.travelapp.dto.ViajeDTO;
import com.travelapp.service.ViajeService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/viajes")
@Slf4j
@CrossOrigin
@RequiredArgsConstructor
public class ViajeRestController {
    
    private final ViajeService viajeService;

    // GET /api/viajes - Listar viajes con paginación
    @GetMapping
    public ResponseEntity<Page<ViajeDTO>> getAllViajes(
            @PageableDefault(size = 10, sort = "fechaInicio") Pageable pageable,
            @RequestParam(required = false) Long destinoId) {

        log.info("GET /api/viajes?destinoId={}", destinoId);

        Page<ViajeDTO> viajes = (destinoId != null)
            ? viajeService.findByDestinoId(destinoId, pageable)
            : viajeService.findAll(pageable);
        
        return ResponseEntity.ok(viajes);
    }

    // GET /api/viajes/{id} - Viaje por ID
    @GetMapping("/{id}")
    public ResponseEntity<ViajeDTO> getViajeById(@PathVariable Long id) {
        log.info("GET /api/viajes/{}", id);

        ViajeDTO viajeDTO = viajeService.findById(id);

        return ResponseEntity.ok(viajeDTO);
    }

    // POST /api/viajes - Crear nuevo viaje
    @PostMapping
    public ResponseEntity<ViajeDTO> createViaje(@RequestBody ViajeDTO viajeDTO) {
        log.info("POST /api/viajes - creando viaje: {}", viajeDTO);

        ViajeDTO viajeCreado = viajeService.create(viajeDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(viajeCreado);
    }

    // PUT /api/viajes/{id} - Actualizar viaje existente
    @PutMapping("/{id}")
    public ResponseEntity<ViajeDTO> updateViaje(
        @PathVariable Long id,
        @Valid @RequestBody ViajeDTO viajeDTO) {

        log.info("PUT /api/viajes/{} - actualizando viaje: {}", id, viajeDTO);

        ViajeDTO viajeActualizado = viajeService.update(id, viajeDTO);
        return ResponseEntity.ok(viajeActualizado);
    }

    // DELETE /api/viajes/{id} - Eliminar viaje existente
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteViaje(@PathVariable Long id) {
        log.info("DELETE /api/viajes/{}", id);
        
        viajeService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

}
