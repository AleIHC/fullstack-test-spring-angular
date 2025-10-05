package com.travelapp.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import com.travelapp.dto.ViajeDTO;
import com.travelapp.exception.EntityNotFoundException;
import com.travelapp.exception.ValidationException;
import com.travelapp.mapper.ViajeMapper;
import com.travelapp.model.Destino;
import com.travelapp.model.Viaje;
import com.travelapp.repository.DestinoRepository;
import com.travelapp.repository.ViajeRepository;


@ExtendWith(MockitoExtension.class)
@DisplayName("Tests de ViajeService")
class ViajeServiceTest {

    @Mock
    private ViajeRepository viajeRepository;

    @Mock
    private DestinoRepository destinoRepository;

    @Mock
    private ViajeMapper viajeMapper;

    @InjectMocks
    private ViajeService viajeService;

    private Viaje viaje;
    private ViajeDTO viajeDTO;
    private Destino destino;
    private Pageable pageable;

    @BeforeEach
    void setUp() {
        destino = Destino.builder()
            .id(1L)
            .nombre("Buenos Aires")
            .pais("Argentina")
            .build();

        viaje = Viaje.builder()
            .id(1L)
            .fechaInicio(LocalDate.of(2026, 3, 20))
            .fechaFin(LocalDate.of(2026, 3, 30))
            .precio(300.00)
            .build();

        viajeDTO = ViajeDTO.builder()
            .id(1L)
            .fechaInicio(LocalDate.of(2026, 3, 20))
            .fechaFin(LocalDate.of(2026, 3, 30))
            .precio(300.00)
            .destinoId(1L)
            .destinoNombre("Buenos Aires")
            .build();

        pageable = PageRequest.of(0, 10);
    }

    @Test
    @DisplayName("Debe traer pagina de viajes cuando findAll es invocado")
    void shouldReturnPageOfViajes_WhenFindAllCalled() {
        // Dado
        Page<Viaje> viajesPage = new PageImpl<>(Arrays.asList(viaje));
        
        when(viajeRepository.findAll(pageable)).thenReturn(viajesPage);
        when(viajeMapper.toDto(viaje)).thenReturn(viajeDTO);

        // Cuando
        Page<ViajeDTO> resultado = viajeService.findAll(pageable);

        // Entonces
        assertThat(resultado).isNotNull();
        assertThat(resultado.getContent()).hasSize(1);
        assertThat(resultado.getContent().get(0).getDestinoNombre()).isEqualTo("Buenos Aires");

        verify(viajeRepository).findAll(pageable);
        verify(viajeMapper).toDto(viaje);
    }

    @Test
    @DisplayName("Debe traer un viaje por ID cuando findById encuentra un ID válido")
    void shouldReturnViaje_WhenFindByIdCalledWithValidId() {
        // Dado
        when(viajeRepository.findById(1L)).thenReturn(Optional.of(viaje));
        when(viajeMapper.toDto(viaje)).thenReturn(viajeDTO);


        // Cuando
        ViajeDTO resultado = viajeService.findById(1L);

        // Entonces
        assertThat(resultado).isNotNull();
        assertThat(resultado.getDestinoNombre()).isEqualTo("Buenos Aires");

        verify(viajeRepository).findById(1L);
        verify(viajeMapper).toDto(viaje);
    }

    @Test
    @DisplayName("Debe lanzar EntityNotFoundException cuando findById no encuentra un ID")
    void shouldThrowEntityNotFoundException_WhenFindByIdCalledWithInvalidId() {
        // Dado
        when(viajeRepository.findById(1L)).thenReturn(Optional.empty());

        // Cuando - Entonces
        assertThatThrownBy(() -> viajeService.findById(1L))
            .isInstanceOf(EntityNotFoundException.class)
            .hasMessage("Viaje no encontrado");

        verify(viajeRepository).findById(1L);
    }

    @Test
    @DisplayName("Debe crear un viaje cuando create es invocado, destino existe y fechas son válidas")
    void shouldCreateViaje_WhenCreateCalledWithValidData() {
        // Dado
        when(destinoRepository.findById(1L)).thenReturn(Optional.of(destino));
        when(viajeMapper.toEntity(viajeDTO)).thenReturn(viaje);
        when(viajeRepository.save(any(Viaje.class))).thenReturn(viaje);
        when(viajeMapper.toDto(viaje)).thenReturn(viajeDTO);

        // Cuando
        ViajeDTO resultado = viajeService.create(viajeDTO);

        // Entonces
        assertThat(resultado).isNotNull();
        assertThat(resultado.getDestinoNombre()).isEqualTo("Buenos Aires");
        
        verify(destinoRepository).findById(1L);
        verify(viajeRepository).save(any(Viaje.class));
        verify(viajeMapper).toEntity(viajeDTO);
        verify(viajeMapper).toDto(viaje);
    }

    @Test
    @DisplayName("Debe actualizar un viaje cuando update es invocado, destino existe y fechas son válidas")
    void shouldUpdateViaje_WhenUpdateCalledWithValidData() {
        // Dado
        Long viajeId = 1L;
        when(viajeRepository.findById(viajeId)).thenReturn(Optional.of(viaje));
        when(destinoRepository.findById(viajeDTO.getDestinoId())).thenReturn(Optional.of(destino));
        when(viajeRepository.save(any(Viaje.class))).thenReturn(viaje);
        when(viajeMapper.toDto(viaje)).thenReturn(viajeDTO);

        // Cuando
        ViajeDTO resultado = viajeService.update(viajeId, viajeDTO);


        // Entonces
        assertThat(resultado).isNotNull();
        verify(viajeRepository).save(any(Viaje.class));
    }

    @Test
    @DisplayName("Debe lanzar ValidationException cuando create es invocado con fechaInicio en el pasado")
    void shouldThrowValidationException_WhenCreateCalledWithPastStartDate() {
        // Dado
        ViajeDTO viajeInvalido = ViajeDTO.builder()
                .fechaInicio(LocalDate.of(2024, 12, 22))
                .fechaFin(LocalDate.of(2024, 12, 15))
                .precio(500.00)
                .destinoId(1L)
                .build();

        when(destinoRepository.findById(1L)).thenReturn(Optional.of(destino));

        // Cuando - Entonces
        assertThatThrownBy(() -> viajeService.create(viajeInvalido))
            .isInstanceOf(ValidationException.class)
            .hasMessage("La fecha de inicio no puede ser posterior a la fecha de fin");

        verify(destinoRepository).findById(1L);
    }

    @Test
    @DisplayName("Debe lanzar ValidationException cuando create es invocado con fechaFin antes de fechaInicio")
    void shouldThrowValidationException_WhenCreateCalledWithEndDateBeforeStartDate() {
        // Dado
        viajeDTO.setFechaInicio(LocalDate.of(2027, 6, 22));
        viajeDTO.setFechaFin(LocalDate.of(2027, 6, 15));

        when(destinoRepository.findById(1L)).thenReturn(Optional.of(destino));

        // Cuando - Entonces
        assertThatThrownBy(() -> viajeService.create(viajeDTO))
            .isInstanceOf(ValidationException.class)
            .hasMessage("La fecha de inicio no puede ser posterior a la fecha de fin");
    }

    @Test
    @DisplayName("Debe eliminar viaje cuando existe el ID")
    void shouldDeleteViaje_WhenIdExists() {
        // Dado
        when(viajeRepository.existsById(1L)).thenReturn(true);

        // Cuando
        viajeService.deleteById(1L);

        // Entonces
        verify(viajeRepository).existsById(1L);
        verify(viajeRepository).deleteById(1L);
    }  
    
    @Test
    @DisplayName("Debe traer viajes filtrados por destino")
    void shouldReturnFilteredViajes_WhenFindByDestinoCalled() {
        // Dado
        Page<Viaje> viajesPage = new PageImpl<>(Arrays.asList(viaje));
        
        when(viajeRepository.findByDestinoId(1L, pageable)).thenReturn(viajesPage);
        when(viajeMapper.toDto(viaje)).thenReturn(viajeDTO);

        // Cuando
        Page<ViajeDTO> resultado = viajeService.findByDestinoId(1L, pageable);

        // Entonces
        assertThat(resultado).isNotNull();
        assertThat(resultado.getContent()).hasSize(1);

        verify(viajeRepository).findByDestinoId(1L, pageable);
    }

    @Test
    @DisplayName("Debe lanzar EntityNotFoundException al actualizar un viaje con ID que no existe")
    void shouldThrowEntityNotFoundException_WhenUpdateCalledWithInvalidId() {
        // Dado
        Long viajeId = 999L;
        when(viajeRepository.findById(viajeId)).thenReturn(Optional.empty());

        // Cuando - Entonces
        assertThatThrownBy(() -> viajeService.update(viajeId, viajeDTO))
        .isInstanceOf(EntityNotFoundException.class)
            .hasMessage("Viaje no encontrado");
    }

    @Test
    @DisplayName("Debe lanzar EntityNotFoundException al actualizar un viaje con destino que no existe")
    void shouldThrowEntityNotFoundException_WhenUpdateCalledWithInvalidDestinoId() {
        // Dado
        Long viajeId = 1L;
        when(viajeRepository.findById(viajeId)).thenReturn(Optional.of(viaje));
        when(destinoRepository.findById(viajeDTO.getDestinoId())).thenReturn(Optional.empty());

        // Cuando - Entonces
        assertThatThrownBy(() -> viajeService.update(viajeId, viajeDTO))
            .isInstanceOf(EntityNotFoundException.class)
            .hasMessage("Destino no encontrado");
    }

    @Test
    @DisplayName("Debe lanzar ValidationException al actualizar un viaje con fechas inválidas")
    void shouldThrowValidationException_WhenUpdateCalledWithInvalidDates() {
    // Given
    Long viajeId = 1L;
    viajeDTO.setFechaInicio(LocalDate.of(2024, 6, 22));
    viajeDTO.setFechaFin(LocalDate.of(2024, 6, 15)); // Fecha fin antes que inicio
    
    when(viajeRepository.findById(viajeId)).thenReturn(Optional.of(viaje));
    when(destinoRepository.findById(viajeDTO.getDestinoId())).thenReturn(Optional.of(destino));

    // When & Then
    assertThatThrownBy(() -> viajeService.update(viajeId, viajeDTO))
        .isInstanceOf(ValidationException.class)
        .hasMessage("La fecha de inicio no puede ser posterior a la fecha de fin");
    }

    @Test
    @DisplayName("Debe lanzar EntityNotFoundException al crear un viaje con destino que no existe")
    void shouldThrowEntityNotFoundException_WhenCreateCalledWithInvalidDestinoId() {
        // Dado
        when(destinoRepository.findById(viajeDTO.getDestinoId())).thenReturn(Optional.empty());

        // Cuando - Entonces
        assertThatThrownBy(() -> viajeService.create(viajeDTO))
            .isInstanceOf(EntityNotFoundException.class)
            .hasMessage("Destino no encontrado");
        
        verify(viajeRepository, never()).save(any());
    }

    @Test
    @DisplayName("Debe traer lista de viajes vacia cuando no hay viajes para un destino")
    void shouldReturnEmptyList_WhenNoViajesFoundForDestino() {
        // Dado
        Long destinoId = 999L;
        when(viajeRepository.findByDestinoId(destinoId, pageable))
        .thenReturn(new PageImpl<>(Arrays.asList()));


        // Cuando
        Page<ViajeDTO> resultado = viajeService.findByDestinoId(destinoId, pageable);

        // Entonces
        assertThat(resultado).isNotNull();
        assertThat(resultado.getContent()).isEmpty();
        assertThat(resultado.getTotalElements()).isZero();
    }

}