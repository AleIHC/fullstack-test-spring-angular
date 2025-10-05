package com.travelapp.service;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.travelapp.dto.DestinoDTO;
import com.travelapp.mapper.DestinoMapper;
import com.travelapp.model.Destino;
import com.travelapp.repository.DestinoRepository;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@Transactional
@RequiredArgsConstructor
public class DestinoService {

    private final DestinoRepository destinoRepository;
    private final DestinoMapper destinoMapper;

    // Buscar todos los destinos con paginación
    @Transactional(readOnly = true)
    public Page<DestinoDTO> findAll(Pageable pageable) {
        log.debug("Buscando todos los destinos con paginación: {}", pageable);

        Page<Destino> destinos = destinoRepository.findAll(pageable);

        log.info("Destinos encontrados: {}", destinos.getTotalElements());
        return destinos.map(destinoMapper::toDto);
    }

    // Buscar por ID
    @Transactional(readOnly = true)
    public DestinoDTO findById(Long id) {
        log.debug("Buscando destino por ID: {}", id);

        Destino destino = destinoRepository.findById(id)
            .orElseThrow(() -> {
                log.warn("Destino no encontrado con ID: {}", id);
                return new RuntimeException("Destino no encontrado");
            });
        
        log.info("Destino encontrado: {}", destino.getNombre());

        return destinoMapper.toDto(destino);
    }

    // Crear nuevo destino
    public DestinoDTO create(DestinoDTO destinoDTO) {
        log.debug("Creando nuevo destino: {}", destinoDTO);

        // Validar duplicados 
        if (destinoRepository.existsByNombreIgnoreCase(destinoDTO.getNombre())) {
            log.warn("El destino con nombre '{}' ya existe", destinoDTO.getNombre());
            throw new RuntimeException("El destino ya existe");
        }

        Destino destino = destinoMapper.toEntity(destinoDTO);
        Destino savedDestino = destinoRepository.save(destino);

        log.info("Destino creado con ID: {}", savedDestino.getId());

        return destinoMapper.toDto(savedDestino);
    }

    // Actualizar destino existente
    public DestinoDTO update(Long id, DestinoDTO destinoDTO) {
        log.debug("Actualizando destino con ID: {}", id);

        Destino destinoExistente = destinoRepository.findById(id)
            .orElseThrow(() -> {
                log.warn("Destino no encontrado con ID: {}", id);
                return new RuntimeException("Destino no encontrado");
            });

        // Validar duplicados 
        if (!destinoExistente.getNombre().equalsIgnoreCase(destinoDTO.getNombre()) &&
            destinoRepository.existsByNombreIgnoreCase(destinoDTO.getNombre())) {
            log.warn("Intento de actualizar destino con nombre '{}' que ya existe", destinoDTO.getNombre());
            throw new RuntimeException("El destino ya existe");
        }

        destinoExistente.setNombre(destinoDTO.getNombre());
        destinoExistente.setPais(destinoDTO.getPais());

        Destino destinoActualizado = destinoRepository.save(destinoExistente);

        log.info("Destino actualizado con ID: {}", destinoActualizado.getId());

        return destinoMapper.toDto(destinoActualizado);
    }

    // Eliminar destino por ID
    public void deleteById(Long id) {
        log.debug("Eliminando destino con ID: {}", id);

        if (!destinoRepository.existsById(id)) {
            log.warn("Intento de eliminar destino no existente con ID: {}", id);
            throw new RuntimeException("Destino no encontrado");
        }

        destinoRepository.deleteById(id);

        log.info("Destino eliminado con ID: {}", id);
    }

    // Buscar destinos por país con paginación
    @Transactional(readOnly = true)
    public Page<DestinoDTO> findByPais(String pais, Pageable pageable) {
        log.debug("Buscando destinos por país: {} con paginación: {}", pais, pageable);

        Page<Destino> destinos = destinoRepository.findByPaisContainingIgnoreCase(pais, pageable);

        log.info("Destinos encontrados para país '{}': {}", pais, destinos.getTotalElements());
        
        return destinos.map(destinoMapper::toDto);
    }
}
