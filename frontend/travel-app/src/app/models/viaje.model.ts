export interface Viaje {
    id?: number;
    fechaInicio: Date | string;
    fechaFin: Date | string;
    precio: number;
    destinoId: number;
    destinoNombre?: string;
}