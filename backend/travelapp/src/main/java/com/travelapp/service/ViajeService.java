package com.travelapp.service;

import java.time.LocalDate;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import org.springframework.transaction.annotation.Transactional;

import com.travelapp.dto.ViajeDTO;
import com.travelapp.mapper.ViajeMapper;
import com.travelapp.model.Destino;
import com.travelapp.model.Viaje;
import com.travelapp.repository.DestinoRepository;
import com.travelapp.repository.ViajeRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@Transactional
@RequiredArgsConstructor
public class ViajeService {

    private final ViajeRepository viajeRepository;
    private final DestinoRepository destinoRepository;
    private final ViajeMapper viajeMapper;
    
    // Buscar todos los viajes
    @Transactional(readOnly = true)
    public Page<ViajeDTO> findAll(Pageable pageable) {
        log.debug("Buscando todos los viajes con paginación: {}", pageable);

        Page<Viaje> viajes = viajeRepository.findAll(pageable);

        log.info("Viajes encontrados: {}", viajes.getTotalElements());

        return viajes.map(viajeMapper::toDto);
    }

    // Buscar por ID
    @Transactional(readOnly = true)
    public ViajeDTO findById(Long id) {
        log.debug("Buscando viaje por ID: {}", id);

        Viaje viaje = viajeRepository.findById(id)
            .orElseThrow(() -> {
                log.warn("Viaje no encontrado con ID: {}", id);
                return new RuntimeException("Viaje no encontrado");
            });
        
        log.info("Viaje encontrado: {}", viaje.getId());

        return viajeMapper.toDto(viaje);
    }

    // Crear nuevo viaje
    public ViajeDTO create(ViajeDTO viajeDTO) {
        log.debug("Creando nuevo viaje: {}", viajeDTO);

        // Validar destino
        Destino destino = destinoRepository.findById(viajeDTO.getDestinoId())
            .orElseThrow(() -> {
                log.warn("Destino no encontrado con ID: {}", viajeDTO.getDestinoId());
                return new RuntimeException("Destino no encontrado");
            });

        // Validar fechas
        validateFechas(viajeDTO.getFechaInicio(), viajeDTO.getFechaFin());

        Viaje viaje = viajeMapper.toEntity(viajeDTO);
        viaje.setDestino(destino);

        Viaje nuevoViaje = viajeRepository.save(viaje);

        log.info("Viaje creado con ID: {}", nuevoViaje.getId());

        return viajeMapper.toDto(nuevoViaje);
    }

    // Actualizar viaje existente
    public ViajeDTO update(Long id, ViajeDTO viajeDTO) {
        log.debug("Actualizando viaje con ID: {}", id);

        Viaje viajeExistente = viajeRepository.findById(id)
            .orElseThrow(() -> {
                log.warn("Viaje no encontrado con ID: {}", id);
                return new RuntimeException("Viaje no encontrado");
            });

        // Validar destino
        Destino destino = destinoRepository.findById(viajeDTO.getDestinoId())
            .orElseThrow(() -> {
                log.warn("Destino no encontrado con ID: {}", viajeDTO.getDestinoId());
                return new RuntimeException("Destino no encontrado");
            });
        viajeExistente.setDestino(destino);
        
        // Validar fechas
        validateFechas(viajeDTO.getFechaInicio(), viajeDTO.getFechaFin());

        viajeExistente.setFechaInicio(viajeDTO.getFechaInicio());
        viajeExistente.setFechaFin(viajeDTO.getFechaFin());
        viajeExistente.setPrecio(viajeDTO.getPrecio());
        
        Viaje viajeActualizado = viajeRepository.save(viajeExistente);

        log.info("Viaje actualizado con ID: {}", viajeActualizado.getId());

        return viajeMapper.toDto(viajeActualizado);
    }

    // Eliminar viaje por ID
    public void deleteById(Long id) {
        log.debug("Eliminando viaje con ID: {}", id);

        if (!viajeRepository.existsById(id)) {
            log.warn("Intento de eliminar viaje no existente con ID: {}", id);
            throw new RuntimeException("Viaje no encontrado");
        }

        viajeRepository.deleteById(id);

        log.info("Viaje eliminado con ID: {}", id);
    }

    // Buscar viaje por destino
    @Transactional(readOnly = true)
    public Page<ViajeDTO> findByDestinoId(Long destinoId, Pageable pageable) {
        log.debug("Buscando viajes por destino ID: {} con paginación: {}", destinoId, pageable);

        Page<Viaje> viajes = viajeRepository.findByDestinoId(destinoId, pageable);
    
        log.info("Viajes encontrados para destino ID {}: {}", destinoId, viajes.getTotalElements());
        
        return viajes.map(viajeMapper::toDto);
    }

    // Validación de fechas
    private void validateFechas(LocalDate fechaInicio, LocalDate fechaFin) {
        if (fechaInicio == null || fechaFin == null) {
            log.warn("Las fechas de inicio y fin no pueden ser nulas");
            throw new RuntimeException("Las fechas de inicio y fin no pueden ser nulas");
        }

        if (fechaInicio.isAfter(fechaFin)) {
            log.warn("La fecha de inicio no puede ser posterior a la fecha de fin");
            throw new RuntimeException("La fecha de inicio no puede ser posterior a la fecha de fin");
        }

        if (fechaInicio.isBefore(LocalDate.now())) {
            log.warn("La fecha de inicio no puede ser en el pasado");
            throw new RuntimeException("La fecha de inicio no puede ser en el pasado");
        }
    }
    
}
