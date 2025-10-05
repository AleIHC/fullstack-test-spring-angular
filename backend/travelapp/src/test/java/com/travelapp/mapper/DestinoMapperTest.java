package com.travelapp.mapper;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import com.travelapp.dto.DestinoDTO;
import com.travelapp.model.Destino;
import com.travelapp.model.Viaje;

@DisplayName("Tests de DestinoMapper")
class DestinoMapperTest {
    
    private DestinoMapper destinoMapper;
    private Destino destino;
    private DestinoDTO destinoDTO;
    private Viaje viaje1, viaje2;

    // Configuraciones previas a cada test
    @BeforeEach
    void setUp() {
        destinoMapper = new DestinoMapper();
        
        // Crear viajes de ejemplo
        viaje1 = Viaje.builder()
                .id(1L)
                .fechaInicio(LocalDate.of(2029, 6, 15))
                .fechaFin(LocalDate.of(2029, 6, 22))
                .precio(1500.00)
                .build();

        viaje2 = Viaje.builder()
                .id(2L)
                .fechaInicio(LocalDate.of(2029, 7, 10))
                .fechaFin(LocalDate.of(2029, 7, 15))
                .precio(2000.00)
                .build();

        destino = Destino.builder()
                .id(1L)
                .nombre("Berlín")
                .pais("Alemania")
                .viajes(Arrays.asList(viaje1, viaje2))
                .build();

        destinoDTO = DestinoDTO.builder()
                .id(1L)
                .nombre("Nairobi")
                .pais("Kenia")
                .viajeIds(Arrays.asList(1L, 2L))
                .build();
    }

    @Test
    @DisplayName("Debe mapear Destino a DestinoDTO correctamente")
    void shouldMapDestinoToDestinoDTO() {
        // Cuando
        DestinoDTO resultado = destinoMapper.toDto(destino);

        // Entonces
        assertThat(resultado).isNotNull();
        assertThat(resultado.getId()).isEqualTo(1L);
        assertThat(resultado.getNombre()).isEqualTo("Berlín");
        assertThat(resultado.getPais()).isEqualTo("Alemania");
        assertThat(resultado.getViajeIds()).hasSize(2);
        assertThat(resultado.getViajeIds()).containsExactly(1L, 2L);
    }

    @Test
    @DisplayName("Debe mapear Destino a DestinoDTO sin viajes")
    void shouldMapDestinoToDestinoDTOWithoutViajes() {
        // Dado
        destino.setViajes(null);

        // Cuando
        DestinoDTO resultado = destinoMapper.toDto(destino);

        // Entonces
        assertThat(resultado).isNotNull();
        assertThat(resultado.getId()).isEqualTo(1L);
        assertThat(resultado.getNombre()).isEqualTo("Berlín");
        assertThat(resultado.getPais()).isEqualTo("Alemania");
        assertThat(resultado.getViajeIds()).isNull();
    }

    @Test
    @DisplayName("Debe retornar null al mapear Destino nulo a DestinoDTO")
    void shouldReturnNullWhenMappingNullDestinoToDestinoDTO() {
        // Cuando
        DestinoDTO resultado = destinoMapper.toDto(null);

        // Entonces
        assertThat(resultado).isNull();
    }

    @Test
    @DisplayName("Debe mapear DestinoDTO a Destino correctamente")
    void shouldMapDestinoDTOToDestino() {
        // Cuando
        Destino resultado = destinoMapper.toEntity(destinoDTO);

        // Entonces
        assertThat(resultado).isNotNull();
        assertThat(resultado.getId()).isEqualTo(1L);
        assertThat(resultado.getNombre()).isEqualTo("Nairobi");
        assertThat(resultado.getPais()).isEqualTo("Kenia");
        assertThat(resultado.getViajes()).isNull();
    }

    @Test
    @DisplayName("Debe retornar null al mapear DestinoDTO nulo a Destino")
    void shouldReturnNullWhenMappingNullDestinoDTOToDestino() {
        // Cuando
        Destino resultado = destinoMapper.toEntity(null);

        // Entonces
        assertThat(resultado).isNull();
    }

    @Test
    @DisplayName("Debe mapear lista de Destino a lista de DestinoDTO correctamente")
    void shouldMapListOfDestinoToListOfDestinoDTO() {
        // Dado
        Destino destino2 = Destino.builder()
                .id(2L)
                .nombre("Honolulu")
                .pais("Estados Unidos")
                .viajes(Arrays.asList(viaje1))
                .build();
        
        List<Destino> destinos = Arrays.asList(destino, destino2);

        // Cuando
        List<DestinoDTO> resultado = destinoMapper.toDtoList(destinos);

        // Entonces
        assertThat(resultado)
            .isNotNull()
            .hasSize(2);

        // Primer destino
        assertThat(resultado.get(0).getId()).isEqualTo(1L);
        assertThat(resultado.get(0).getNombre()).isEqualTo("Berlín");
        assertThat(resultado.get(0).getPais()).isEqualTo("Alemania");
        assertThat(resultado.get(0).getViajeIds()).hasSize(2);

        // Segundo destino
        assertThat(resultado.get(1).getId()).isEqualTo(2L);
        assertThat(resultado.get(1).getNombre()).isEqualTo("Honolulu");
        assertThat(resultado.get(1).getPais()).isEqualTo("Estados Unidos");
        assertThat(resultado.get(1).getViajeIds()).hasSize(1);
    }

    @Test
    @DisplayName("Debe retornar lista vacía al mapear lista nula de Destino a lista  de DestinoDTO")
    void shouldReturnEmptyListWhenMappingNullListOfDestinoToListOfDestinoDTO() {
        // Dado
        List<Destino> destinos = Arrays.asList();

        // Cuando
        List<DestinoDTO> resultado = destinoMapper.toDtoList(destinos);

        // Entonces
        assertThat(resultado)
            .isNotNull()
            .isEmpty();
    }


}
