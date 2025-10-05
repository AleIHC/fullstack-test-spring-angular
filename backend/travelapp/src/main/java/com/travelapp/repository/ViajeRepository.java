package com.travelapp.repository;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.travelapp.model.Viaje;

@Repository
public interface ViajeRepository extends JpaRepository<Viaje, Long> {
    
    // Buscar viajes por ID de destino
    Page<Viaje> findByDestinoId(Long destinoId, Pageable pageable);
}
