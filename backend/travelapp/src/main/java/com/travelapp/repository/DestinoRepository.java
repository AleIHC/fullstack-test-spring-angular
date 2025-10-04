package com.travelapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.travelapp.model.Destino;

public interface DestinoRepository extends JpaRepository<Destino, Long> {
    
}
