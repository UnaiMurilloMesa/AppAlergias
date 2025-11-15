import React, { createContext, useContext, useEffect, useState } from 'react';
import { Alumno } from '../types/Alumno';
import { Alergia } from '../types/Alergia';
import { Curso } from '../types/Curso';
import { saveAlumnos, loadAlumnos, saveAlergias, loadAlergias, saveCursos, loadCursos } from '../storage/alumnosStorage';
import { v4 as uuidv4 } from 'uuid';

interface AlumnosContextType {
  alumnos: Alumno[];
  addAlumno: (a: Omit<Alumno, "id">) => void;
  deleteAlumno: (id: string) => void;
  alergias: Alergia[];
  addAlergia: (nombre: string) => void;
  deleteAlergia: (id: string) => void;
  cursos: Curso[];
  addCurso: (nombre: string) => void;
  deleteCurso: (id: string) => void;
}

const AlumnosContext = createContext<AlumnosContextType | undefined>(undefined);

export const AlumnosProvider = ({ children }: any) => {
  const [alumnos, setAlumnos] = useState<Alumno[]>([]);
  const [alergias, setAlergias] = useState<Alergia[]>([]);
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    (async () => {
      const cargados = await loadAlumnos();
      setAlumnos(cargados);
      const cargadasAlergias = await loadAlergias();
      setAlergias(cargadasAlergias);
      const cargadosCursos = await loadCursos();
      setCursos(cargadosCursos);
      setInitialized(true);
    })();
  }, []);

  useEffect(() => {
    if (!initialized) return;
    saveAlumnos(alumnos);
  }, [alumnos]);

  useEffect(() => {
    if (!initialized) return;
    saveAlergias(alergias);
  }, [alergias]);

  useEffect(() => {
    if (!initialized) return;
    saveCursos(cursos);
  }, [cursos]);


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

  const addAlergia = (nombre: string) => {
    const nueva: Alergia = {
      id: uuidv4(),
      nombre,
    };
    setAlergias(prev => [...prev, nueva]);
  };

  const deleteAlergia = (id: string) => {
    setAlergias(prev => prev.filter(a => a.id !== id));
  };

  const addCurso = (nombre: string) => {
    const nuevo: Curso = {
      id: uuidv4(),
      nombre,
    };
    setCursos(prev => [...prev, nuevo]);
  };

  const deleteCurso = (id: string) => {
    setCursos(prev => prev.filter(c => c.id !== id));
  };

  return (
    <AlumnosContext.Provider value={{ alumnos, addAlumno, deleteAlumno, alergias, addAlergia, deleteAlergia, cursos, addCurso, deleteCurso }}>
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
