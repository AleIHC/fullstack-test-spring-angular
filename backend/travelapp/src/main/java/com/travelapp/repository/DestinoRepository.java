package com.travelapp.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.travelapp.model.Destino;

@Repository
public interface DestinoRepository extends JpaRepository<Destino, Long> {
    // Buscar por país
    Page<Destino> findByPaisContainingIgnoreCase(String pais, Pageable pageable);

    // Verificar existencia por nombre (para evitar duplicados)
    boolean existsByNombreIgnoreCase(String nombre);
}
