export interface Alumno {
  id: string;
  nombre: string;
  apellido1: string;
  apellido2?: string;
  curso: string;
  alergias: string[];
}