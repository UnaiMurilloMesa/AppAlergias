import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alumno } from '../types/Alumno';
import { Alergia } from '../types/Alergia';
import { Curso } from '../types/Curso';

const KEY_ALUMNOS = "@AlergiasApp:ALUMNOS";
const KEY_ALERGIAS = "@AlergiasApp:ALERGIAS";
const KEY_CURSOS = "@AlergiasApp:CURSOS";

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
