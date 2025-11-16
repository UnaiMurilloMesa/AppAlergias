import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alumno } from '../types/Alumno';
import { Alergia } from '../types/Alergia';
import { Curso } from '../types/Curso';
import { Comida } from '../types/Comida';

const KEY_ALUMNOS = "@AlergiasApp:ALUMNOS";
const KEY_ALERGIAS = "@AlergiasApp:ALERGIAS";
const KEY_CURSOS = "@AlergiasApp:CURSOS";
const KEY_COMIDAS = "@AlergiasApp:COMIDAS";

export async function saveAlumnos(alumnos: Alumno[]) {
  try {
    await AsyncStorage.setItem(KEY_ALUMNOS, JSON.stringify(alumnos));
  } catch (error) {
    console.log("Error guardando alumnos", error);
  }
}

export async function loadAlumnos(): Promise<Alumno[]> {
  try {
    const data = await AsyncStorage.getItem(KEY_ALUMNOS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.log("Error cargando alumnos", error);
    return [];
  }
}

export async function saveAlergias(alergias: Alergia[]) {
  try {
    await AsyncStorage.setItem(KEY_ALERGIAS, JSON.stringify(alergias));
  } catch (error) {
    console.log("Error guardando alergias", error);
  }
}

export async function loadAlergias(): Promise<Alergia[]> {
  try {
    const data = await AsyncStorage.getItem(KEY_ALERGIAS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.log("Error cargando alergias", error);
    return [];
  }
}

export async function saveCursos(cursos: Curso[]) {
  try {
    await AsyncStorage.setItem(KEY_CURSOS, JSON.stringify(cursos));
  } catch (error) {
    console.log("Error guardando cursos", error);
  }
}

export async function loadCursos(): Promise<Curso[]> {
  try {
    const data = await AsyncStorage.getItem(KEY_CURSOS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.log("Error cargando cursos", error);
    return [];
  }
}

export async function saveComidas(comidas: Comida[]) {
  try {
    await AsyncStorage.setItem(KEY_COMIDAS, JSON.stringify(comidas));
  } catch (error) {
    console.log("Error guardando comidas", error);
  }
}

export async function loadComidas(): Promise<Comida[]> {
  try {
    const data = await AsyncStorage.getItem(KEY_COMIDAS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.log("Error cargando comidas", error);
    return [];
  }
}
