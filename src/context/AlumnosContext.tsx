import React, { createContext, useContext, useEffect, useState } from 'react';
import { Alumno } from '../types/Alumno';
import { Alergia } from '../types/Alergia';
import { Curso } from '../types/Curso';
import { Comida } from '../types/Comida';
import { saveAlumnos, loadAlumnos, saveAlergias, loadAlergias, saveCursos, loadCursos, saveComidas, loadComidas } from '../storage/alumnosStorage';
import { v4 as uuidv4 } from 'uuid';

interface AlumnosContextType {
  alumnos: Alumno[];
  addAlumno: (a: Omit<Alumno, "id">) => void;
  updateAlumno: (id: string, data: Partial<Alumno>) => void;
  deleteAlumno: (id: string) => void;
  alergias: Alergia[];
  addAlergia: (nombre: string) => void;
  updateAlergia: (id: string, nombre: string) => void;
  deleteAlergia: (id: string) => void;
  cursos: Curso[];
  comidas: Comida[];
  addComida: (c: Omit<Comida, 'id'>) => void;
  deleteComida: (id: string) => void;
}

const AlumnosContext = createContext<AlumnosContextType | undefined>(undefined);

const ORDERED_CURSOS = ['1INF', '2INF', '3INF', '1PRIM', '2PRIM', '3PRIM', '4PRIM', '5PRIM', '6PRIM', '1BACH', '2BACH'];

export const AlumnosProvider = ({ children }: any) => {
  const [alumnos, setAlumnos] = useState<Alumno[]>([]);
  const [alergias, setAlergias] = useState<Alergia[]>([]);
  // Initialize courses as static list
  const [cursos] = useState<Curso[]>(ORDERED_CURSOS.map(nombre => ({ id: nombre, nombre })));
  const [comidas, setComidas] = useState<Comida[]>([]);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    (async () => {
      const cargados = await loadAlumnos();
      setAlumnos(cargados);
      const cargadasAlergias = await loadAlergias();
      setAlergias(cargadasAlergias);
      // No need to load courses
      const cargadasComidas = await loadComidas();
      setComidas(cargadasComidas);
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

  // No need to save courses

  useEffect(() => {
    if (!initialized) return;
    saveComidas(comidas);
  }, [comidas]);


  const addAlumno = (a: Omit<Alumno, "id">) => {
    const nuevo: Alumno = {
      ...a,
      id: uuidv4(),
    };
    setAlumnos(prev => [...prev, nuevo]);
  };

  const updateAlumno = (id: string, data: Partial<Alumno>) => {
    setAlumnos(prev => prev.map(a => a.id === id ? { ...a, ...data } : a));
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

  const updateAlergia = (id: string, nombre: string) => {
    const oldAlergia = alergias.find(a => a.id === id);
    if (!oldAlergia) return;
    const oldName = oldAlergia.nombre;

    // 1. Update the allergy name
    setAlergias(prev => prev.map(a => a.id === id ? { ...a, nombre } : a));

    // 2. Cascade update to Alumnos
    setAlumnos(prev => prev.map(alumno => ({
      ...alumno,
      alergias: alumno.alergias.map(a => a === oldName ? nombre : a)
    })));

    // 3. Cascade update to Comidas
    setComidas(prev => prev.map(comida => ({
      ...comida,
      alergias: comida.alergias.map(a => a === oldName ? nombre : a)
    })));
  };

  const deleteAlergia = (id: string) => {
    setAlergias(prev => prev.filter(a => a.id !== id));
  };

  const addComida = (c: Omit<Comida, 'id'>) => {
    const nueva: Comida = { ...c, id: uuidv4() };
    setComidas(prev => [...prev, nueva]);
  };

  const deleteComida = (id: string) => {
    setComidas(prev => prev.filter(c => c.id !== id));
  };

  return (
    <AlumnosContext.Provider value={{ alumnos, addAlumno, updateAlumno, deleteAlumno, alergias, addAlergia, updateAlergia, deleteAlergia, cursos, comidas, addComida, deleteComida }}>
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
