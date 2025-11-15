import React, { createContext, useContext, useEffect, useState } from 'react';
import { Alumno } from '../types/Alumno';
import { saveAlumnos, loadAlumnos } from '../storage/alumnosStorage';
import { v4 as uuidv4 } from 'uuid';

interface AlumnosContextType {
  alumnos: Alumno[];
  addAlumno: (a: Omit<Alumno, "id">) => void;
  deleteAlumno: (id: string) => void;   // <= NUEVO
}

const AlumnosContext = createContext<AlumnosContextType | undefined>(undefined);

export const AlumnosProvider = ({ children }: any) => {
  const [alumnos, setAlumnos] = useState<Alumno[]>([]);

  useEffect(() => {
    (async () => {
      const cargados = await loadAlumnos();
      setAlumnos(cargados);
    })();
  }, []);

  useEffect(() => {
    saveAlumnos(alumnos);
  }, [alumnos]);


  const addAlumno = (a: Omit<Alumno, "id">) => {
    const nuevo: Alumno = {
      ...a,
      id: uuidv4(),
    };
    setAlumnos(prev => [...prev, nuevo]);
  };

  const deleteAlumno = (id: string) => {
    setAlumnos(prev => prev.filter(a => a.id !== id));
  };

  return (
    <AlumnosContext.Provider value={{ alumnos, addAlumno, deleteAlumno }}>
      {children}
    </AlumnosContext.Provider>
  );
};

export function useAlumnos() {
  const context = useContext(AlumnosContext);
  if (!context) {
    throw new Error("useAlumnos debe usarse dentro de AlumnosProvider");
  }
  return context;
}
