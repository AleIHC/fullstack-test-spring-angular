package com.travelapp.mapper;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import com.travelapp.dto.ViajeDTO;
import com.travelapp.model.Destino;
import com.travelapp.model.Viaje;

@DisplayName("Tests de ViajeMapper")
class ViajeMapperTest {
    
    private ViajeMapper viajeMapper;
    private Viaje viaje;
    private ViajeDTO viajeDTO;
    private Destino destino;

    @BeforeEach
    void setUp() {
        viajeMapper = new ViajeMapper();
        
        destino = Destino.builder()
                .id(1L)
                .nombre("Hanoi")
                .pais(null)
                .build(); 
                
        viaje = Viaje.builder()
                .id(1L)
                .fechaInicio(java.time.LocalDate.of(2029, 5, 20))
                .fechaFin(java.time.LocalDate.of(2029, 5, 27))
                .precio(1200.00)
                .destino(destino)
                .build();

        viajeDTO = ViajeDTO.builder()
                .id(1L)
                .fechaInicio(LocalDate.of(2029, 5, 20))
                .fechaFin(LocalDate.of(2029, 5, 27))
                .precio(1200.00)
                .destinoId(1L)
                .destinoNombre("Hanoi")
                .build();
    }

    @Test
    @DisplayName("Debe mapear de Viaje a ViajeDTO correctamente")
    void shouldMapViajeToViajeDTO() {
        // Cuando
        ViajeDTO resultado = viajeMapper.toDto(viaje);
        
        // Entonces
        assertThat(resultado).isNotNull();
        assertThat(resultado.getId()).isEqualTo(viaje.getId());
        assertThat(resultado.getFechaInicio()).isEqualTo(LocalDate.of(2029, 5, 20));
        assertThat(resultado.getFechaFin()).isEqualTo(LocalDate.of(2029, 5, 27));
        assertThat(resultado.getPrecio()).isEqualTo(1200.00);
        assertThat(resultado.getDestinoId()).isEqualTo(1L);
        assertThat(resultado.getDestinoNombre()).isEqualTo("Hanoi");
    }

    @Test
    @DisplayName("Debe mapear de Viaje a ViajeDTO con destino null correctamente")
    void shouldMapViajeToViajeDTOWithNullDestino() {
        // Dado
        viaje.setDestino(null);

        // Cuando
        ViajeDTO resultado = viajeMapper.toDto(viaje);


        // Entonces
        assertThat(resultado).isNotNull();
        assertThat(resultado.getId()).isEqualTo(1L);
        assertThat(resultado.getFechaInicio()).isEqualTo(LocalDate.of(2029, 5, 20));
        assertThat(resultado.getFechaFin()).isEqualTo(LocalDate.of(2029, 5, 27));
        assertThat(resultado.getPrecio()).isEqualTo(1200.00);
        assertThat(resultado.getDestinoId()).isNull();
        assertThat(resultado.getDestinoNombre()).isNull();
    }

    @Test
    @DisplayName("Debe mapear de Viaje a ViajeDTO null correctamente")
    void shouldMapViajeToViajeDTONull() {
        // Dado
        ViajeDTO resultado = viajeMapper.toDto(null);

        // Entonces
        assertThat(resultado).isNull();
    }

    @Test
    @DisplayName("Debe mapear de ViajeDTO a Viaje correctamente")
    void shouldMapViajeDTOToViaje() {
        // Dado
        Viaje resultado = viajeMapper.toEntity(viajeDTO);

        // Entonces
        assertThat(resultado).isNotNull();
        assertThat(resultado.getId()).isEqualTo(1L);
        assertThat(resultado.getFechaInicio()).isEqualTo(LocalDate.of(2029, 5, 20));
        assertThat(resultado.getFechaFin()).isEqualTo(LocalDate.of(2029, 5, 27));
        assertThat(resultado.getPrecio()).isEqualTo(1200.00);
        assertThat(resultado.getDestino()).isNull();
    }

    @Test
    @DisplayName("Debe mapear de ViajeDTO a Viaje null correctamente")
    void shouldMapViajeDTOToViajeNull() {
        // Dado
        Viaje resultado = viajeMapper.toEntity(null);

        // Entonces
        assertThat(resultado).isNull();
    }

    @Test
    @DisplayName("Debe mapear lista de Viaje a lista de ViajeDTO correctamente")
    void shouldMapViajeListToViajeDTOList() {
        // Dado
        Destino destino2 = Destino.builder()
                .id(2L)
                .nombre("Glasgow")
                .pais("Escocia")
                .build();

        Viaje viaje2 = Viaje.builder()
                .id(2L)
                .fechaInicio(LocalDate.of(2029, 6, 1))
                .fechaFin(LocalDate.of(2029, 6, 10))
                .precio(1500.00)
                .destino(destino2)
                .build();

        List<Viaje> viajes = Arrays.asList(viaje, viaje2);

        // Cuando
        List<ViajeDTO> resultado = viajeMapper.toDtoList(viajes);

        // Entonces
        assertThat(resultado)
            .isNotNull()
            .hasSize(2);

        // Primer viaje
        assertThat(resultado.get(0).getId()).isEqualTo(1L);
        assertThat(resultado.get(0).getDestinoNombre()).isEqualTo("Hanoi");
        assertThat(resultado.get(0).getPrecio()).isEqualTo(1200.00);

        // Segundo viaje
        assertThat(resultado.get(1).getId()).isEqualTo(2L);
        assertThat(resultado.get(1).getDestinoNombre()).isEqualTo("Glasgow");
        assertThat(resultado.get(1).getPrecio()).isEqualTo(1500.00);
    }

    @Test
    @DisplayName("Debe retornar lista vacía al mapear lista nula de Viaje a lista de ViajeDTO")
    void shouldReturnEmptyListWhenMappingNullListOfViajeToListOfViajeDTO() {
        // Dado
        List<Viaje> viajes = Arrays.asList();

        // Cuando
        List<ViajeDTO> resultado = viajeMapper.toDtoList(viajes);

        // Entonces
        assertThat(resultado)
            .isNotNull()
            .isEmpty();
    }


}
