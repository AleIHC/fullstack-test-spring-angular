package com.travelapp.mapper;

import java.util.List;

import org.springframework.stereotype.Component;

import com.travelapp.dto.ViajeDTO;
import com.travelapp.model.Viaje;

@Component
public class ViajeMapper {

    // Convertir entidad a DTO
    public ViajeDTO toDto(Viaje viajeEntity) {
        if (viajeEntity == null) return null;

        ViajeDTO viajeDTO = ViajeDTO.builder()
            .id(viajeEntity.getId())
            .fechaInicio(viajeEntity.getFechaInicio())
            .fechaFin(viajeEntity.getFechaFin())
            .precio(viajeEntity.getPrecio())
            .build();
        
        if (viajeEntity.getDestino() != null) {
            viajeDTO.setDestinoId(viajeEntity.getDestino().getId());
            viajeDTO.setDestinoNombre(viajeEntity.getDestino().getNombre());
        }

        return viajeDTO;
    }

    // Convertir DTO a entidad
    public Viaje toEntity(ViajeDTO viajeDTO) {
        if (viajeDTO == null) return null;

        return Viaje.builder()
            .id(viajeDTO.getId())
            .fechaInicio(viajeDTO.getFechaInicio())
            .fechaFin(viajeDTO.getFechaFin())
            .precio(viajeDTO.getPrecio())
            .build();
    }

    // Convertir lista de entidades a lista de DTOs
    public List<ViajeDTO> toDtoList(List<Viaje> viajes) {
        return viajes.stream()
            .map(this::toDto)
            .toList();
    }

}
