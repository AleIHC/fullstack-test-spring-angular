package com.travelapp.mapper;

import java.util.List;

import org.springframework.stereotype.Component;

import com.travelapp.dto.DestinoDTO;
import com.travelapp.model.Destino;
import com.travelapp.model.Viaje;

@Component
public class DestinoMapper {

    // Convertir entidad a DTO
    public DestinoDTO toDto(Destino destinoEntity) {
        if (destinoEntity == null) return null;

        DestinoDTO destinoDTO = DestinoDTO.builder()
            .id(destinoEntity.getId())
            .nombre(destinoEntity.getNombre())
            .pais(destinoEntity.getPais())
            .build();

        if (destinoEntity.getViajes() != null) {
            destinoDTO.setViajeIds(
                destinoEntity.getViajes().stream()
                    .map(Viaje::getId)
                    .toList()
            );
        }

        return destinoDTO;
    }

    // Convertir DTO a entidad
    public Destino toEntity(DestinoDTO destinoDTO) {
        if (destinoDTO == null) return null;

        return Destino.builder()
            .id(destinoDTO.getId())
            .nombre(destinoDTO.getNombre())
            .pais(destinoDTO.getPais())
            .build();
    }

    // Convertir lista de entidades a lista de DTOs
    public List<DestinoDTO> toDtoList(List<Destino> destinos) {
        return destinos.stream()
            .map(this::toDto)
            .toList();
    }
    
}
