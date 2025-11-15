import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alumno } from '../types/Alumno';

const KEY = "@AlergiasApp:ALUMNOS";

export async function saveAlumnos(alumnos: Alumno[]) {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(alumnos));
  } catch (error) {
    console.log("Error guardando alumnos", error);
  }
}

export async function loadAlumnos(): Promise<Alumno[]> {
  try {
    const data = await AsyncStorage.getItem(KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.log("Error cargando alumnos", error);
    return [];
  }
}
