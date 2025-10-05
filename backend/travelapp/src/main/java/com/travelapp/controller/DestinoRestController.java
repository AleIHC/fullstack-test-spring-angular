package com.travelapp.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.travelapp.dto.DestinoDTO;
import com.travelapp.service.DestinoService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("/api/destinos")
@Slf4j
@CrossOrigin
@RequiredArgsConstructor
public class DestinoRestController {

    private final DestinoService destinoService;

    // GET /api/destinos - Listar destinos con paginación
    // GET /api/destinos?pais= - Listar destinos por pais con paginación
    @GetMapping
    public ResponseEntity<Page<DestinoDTO>> getAllDestinos(
            @PageableDefault(size = 10, sort = "nombre") Pageable pageable,
            @RequestParam(required = false) String pais) {

        log.info("GET /api/destinos?pais={}", pais);

        Page<DestinoDTO> destinos = (pais != null && !pais.trim().isEmpty())
            ? destinoService.findByPais(pais, pageable)
            : destinoService.findAll(pageable);

        return ResponseEntity.ok(destinos);
    }

    // GET /api/destinos/{id} - Destino por ID
    @GetMapping("/{id}")
    public ResponseEntity<DestinoDTO> getDestinoById(@PathVariable Long id) {
        log.info("GET /api/destinos/{}", id);

        DestinoDTO destinoDTO = destinoService.findById(id);

        return ResponseEntity.ok(destinoDTO);
    }

    // POST /api/destinos - Crear nuevo destino
    @PostMapping
    public ResponseEntity<DestinoDTO> createDestino(@Valid @RequestBody DestinoDTO destinoDTO) {
        log.info("POST /api/destinos - creando destino: {}", destinoDTO.getNombre());

        DestinoDTO destinoCreado = destinoService.create(destinoDTO);

        return ResponseEntity.status(HttpStatus.CREATED).body(destinoCreado);
    }

    // PUT /api/destinos/{id} - Actualizar destino existente
    @PutMapping("/{id}")
    public ResponseEntity<DestinoDTO> updateDestino(
            @PathVariable Long id,
            @Valid @RequestBody DestinoDTO destinoDTO) {

        log.info("PUT /api/destinos/{} - actualizando destino: {}", id, destinoDTO.getNombre());

        DestinoDTO destinoActualizado = destinoService.update(id, destinoDTO);

        return ResponseEntity.ok(destinoActualizado);
    }

    // DELETE /api/destinos/{id} - Eliminar destino existente
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDestino(@PathVariable Long id) {
        log.info("DELETE /api/destinos/{}", id);
        destinoService.deleteById(id);
        return ResponseEntity.noContent().build();
    }       
}
