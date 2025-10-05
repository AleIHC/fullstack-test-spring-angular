package com.travelapp.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

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

import com.travelapp.dto.DestinoDTO;
import com.travelapp.exception.DuplicateEntityException;
import com.travelapp.exception.EntityNotFoundException;
import com.travelapp.mapper.DestinoMapper;
import com.travelapp.model.Destino;
import com.travelapp.repository.DestinoRepository;

@ExtendWith(MockitoExtension.class)
@DisplayName("Tests de DestinoService")
class DestinoServiceTest {

    @Mock
    private DestinoRepository destinoRepository;

    @Mock
    private DestinoMapper destinoMapper;

    @InjectMocks
    private DestinoService destinoService;

    private Destino destino;
    private DestinoDTO destinoDTO;
    private Pageable pageable;

    // Configuraciones previas a cada test
    @BeforeEach
    void setUp() {
        destino = Destino.builder()
            .id(1L)
            .nombre("París")
            .pais("Francia")
            .build();

        destinoDTO = DestinoDTO.builder()
            .id(1L)
            .nombre("Moscú")
            .pais("Rusia")
            .build();

        pageable = PageRequest.of(0, 10);
    }

    @Test
    @DisplayName("Debe listar todos los destinos cuando findAll es llamado")
    void shouldReturnPageOfDestinos_WhenFindAllCalled() {
        // Dado
        Page<Destino> destinosPage = new PageImpl<>(Arrays.asList(destino));

        when(destinoRepository.findAll(pageable)).thenReturn(destinosPage);
        when(destinoMapper.toDto(destino)).thenReturn(destinoDTO);

        // Cuando
        Page<DestinoDTO> resultado = destinoService.findAll(pageable);

        // Entonces
        assertThat(resultado).isNotNull();
        assertThat(resultado.getContent()).hasSize(1);
        assertThat(resultado.getContent().get(0).getNombre()).isEqualTo("Moscú");

        verify(destinoRepository).findAll(pageable);
        verify(destinoMapper).toDto(destino);
    }

    @Test
    @DisplayName("Debe traer un destino por ID cuando findById es llamado con un ID válido")
    void shouldReturnDestino_WhenFindByIdCalledWithValidId() {
        // Dado
        when(destinoRepository.findById(1L)).thenReturn(Optional.of(destino));
        when(destinoMapper.toDto(destino)).thenReturn(destinoDTO);

        // Cuando
        DestinoDTO resultado = destinoService.findById(1L);

        // Entonces
        assertThat(resultado).isNotNull();
        assertThat(resultado.getNombre()).isEqualTo("Moscú");

        verify(destinoRepository).findById(1L);
        verify(destinoMapper).toDto(destino);
    }

    @Test
    @DisplayName("Debe lanzar EntityNotFoundException cuando findById es llamado con un ID que no existe") 
    void shouldThrowEntityNotFoundException_WhenFindByIdCalledWithInvalidId() {
        // Dado
        when(destinoRepository.findById(1L)).thenReturn(Optional.empty());

        // Cuando / Entonces
        assertThatThrownBy(() -> destinoService.findById(1L))
            .isInstanceOf(EntityNotFoundException.class)
            .hasMessage("Destino no encontrado");

        verify(destinoRepository).findById(1L);
    }

    @Test
    @DisplayName("Debe crear un nuevo destino cuando no existe duplicado")
    void shouldCreateDestino_WhenNoDuplicateExists() {
        // Dado
        when(destinoRepository.existsByNombreIgnoreCase("Moscú")).thenReturn(false);
        when(destinoMapper.toEntity(destinoDTO)).thenReturn(destino);
        when(destinoRepository.save(destino)).thenReturn(destino);
        when(destinoMapper.toDto(destino)).thenReturn(destinoDTO);

        // Cuando
        DestinoDTO resultado = destinoService.create(destinoDTO);

        // Entonces
        assertThat(resultado).isNotNull();
        assertThat(resultado.getNombre()).isEqualTo("Moscú");

        verify(destinoRepository).existsByNombreIgnoreCase("Moscú");
        verify(destinoRepository).save(destino);
        verify(destinoMapper).toEntity(destinoDTO);
        verify(destinoMapper).toDto(destino);
    }

    @Test
    @DisplayName("Debe lanzar DuplicateEntityException cuando ya existe un destino con el mismo nombre")
    void shouldThrowDuplicateEntityException_WhenDuplicateExists() {
        // Dado
        when(destinoRepository.existsByNombreIgnoreCase("Moscú")).thenReturn(true);

        // Cuando / Entonces
        assertThatThrownBy(() -> destinoService.create(destinoDTO))
            .isInstanceOf(DuplicateEntityException.class)
            .hasMessage("El destino ya existe");

        verify(destinoRepository).existsByNombreIgnoreCase("Moscú");
    }

    @Test
    @DisplayName("Debe actualizar destino cuando existe y no hay duplicados")
    void shouldUpdateDestino_WhenExistsAndNoDuplicates() {
        // Dado
        DestinoDTO dtoActualizado = DestinoDTO.builder()
            .id(1L)
            .nombre("Timbuktu")
            .pais("Mali")
            .build();

        when(destinoRepository.findById(1L)).thenReturn(Optional.of(destino));
        when(destinoRepository.existsByNombreIgnoreCase("Timbuktu")).thenReturn(false);
        when(destinoRepository.save(any(Destino.class))).thenReturn(destino);
        when(destinoMapper.toDto(destino)).thenReturn(dtoActualizado);

        // Cuando
        DestinoDTO resultado = destinoService.update(1L, dtoActualizado);

        // Entonces
        assertThat(resultado).isNotNull();
        verify(destinoRepository).findById(1L);
        verify(destinoRepository).save(any(Destino.class));
    }

    @Test
    @DisplayName("Debe eliminar destino cuando existe")
    void shouldDeleteDestino_WhenExists() {
        // Dado
        when(destinoRepository.existsById(1L)).thenReturn(true);

        // Cuando
        destinoService.deleteById(1L);

        // Entonces
        verify(destinoRepository).existsById(1L);
        verify(destinoRepository).deleteById(1L);
    }

    @Test
    @DisplayName("Debe lanzar EntityNotFoundException cuando destino no existe después de eliminar")
    void shouldThrowEntityNotFoundException_WhenDestinoDoesNotExistAfterDelete() {
        // Dado
        when(destinoRepository.existsById(1L)).thenReturn(false);

        // Cuando / Entonces
        assertThatThrownBy(() -> destinoService.deleteById(1L))
            .isInstanceOf(EntityNotFoundException.class)
            .hasMessage("Destino no encontrado");

        verify(destinoRepository).existsById(1L);
        verify(destinoRepository, never()).deleteById(1L);
    }

}
