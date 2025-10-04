package com.travelapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.travelapp.model.Viaje;

public interface ViajeRepository extends JpaRepository<Viaje, Long> {
    
}
