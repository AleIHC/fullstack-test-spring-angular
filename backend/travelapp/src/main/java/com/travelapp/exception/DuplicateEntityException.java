package com.travelapp.exception;

public class DuplicateEntityException extends RuntimeException{
    
    public DuplicateEntityException(String message) {
        super(message);
    }
    
    public DuplicateEntityException(String entityName, String field, String value) {
        super(String.format("%s ya existe con %s: %s", entityName, field, value));
    }
}
