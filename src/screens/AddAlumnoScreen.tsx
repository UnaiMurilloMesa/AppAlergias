import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Button, TextInput, Chip, Text } from 'react-native-paper';
import { useAlumnos } from '../context/AlumnosContext';

export default function AddAlumnoScreen({ navigation }: any) {

  const { addAlumno, alergias, cursos } = useAlumnos();

  const [nombre, setNombre] = useState('');
  const [apellido1, setApellido1] = useState('');
  const [apellido2, setApellido2] = useState('');
  const [cursoSeleccionado, setCursoSeleccionado] = useState<string>('');
  const [alergiasSeleccionadas, setAlergiasSeleccionadas] = useState<string[]>([]);

  function toggleAlergia(alergia: string) {
    setAlergiasSeleccionadas(prev =>
      prev.includes(alergia)
        ? prev.filter(a => a !== alergia)
        : [...prev, alergia]
    );
  }

  function guardar() {
    if (!nombre || !apellido1 || !cursoSeleccionado) return;

    addAlumno({
      nombre,
      apellido1,
      apellido2,
      curso: cursoSeleccionado,
      alergias: alergiasSeleccionadas,
    });

    navigation.goBack();
  }

  return (
    <ScrollView style={styles.container}>
      <TextInput label="Nombre" value={nombre} onChangeText={setNombre} style={styles.input} />
      <TextInput label="Primer apellido" value={apellido1} onChangeText={setApellido1} style={styles.input} />
      <TextInput label="Segundo apellido" value={apellido2} onChangeText={setApellido2} style={styles.input} />

      <Text variant="bodyLarge" style={styles.label}>Selecciona curso:</Text>
      {cursos.length === 0 ? (
        <Text style={styles.emptyText}>No hay cursos disponibles. Contacta al administrador.</Text>
      ) : (
        <View style={styles.chipsContainer}>
          {cursos.map(curso => (
            <Chip
              key={curso.id}
              selected={cursoSeleccionado === curso.nombre}
              onPress={() => setCursoSeleccionado(curso.nombre)}
              style={styles.chip}
            >
              {curso.nombre}
            </Chip>
          ))}
        </View>
      )}

      <Text variant="bodyLarge" style={styles.label}>Selecciona alergias:</Text>
      {alergias.length === 0 ? (
        <Text style={styles.emptyText}>No hay alergias disponibles. Ve a "Lista de alergias" para crearlas.</Text>
      ) : (
        <View style={styles.chipsContainer}>
          {alergias.map(alergia => (
            <Chip
              key={alergia.id}
              selected={alergiasSeleccionadas.includes(alergia.nombre)}
              onPress={() => toggleAlergia(alergia.nombre)}
              style={styles.chip}
            >
              {alergia.nombre}
            </Chip>
          ))}
        </View>
      )}

      <Button mode="contained" onPress={guardar} style={styles.button}>
        Guardar alumno
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, marginBottom: 50 },
  input: { marginBottom: 15 },
  label: { marginTop: 10, marginBottom: 10, fontWeight: 'bold' },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
    gap: 8,
  },
  chip: { marginBottom: 5 },
  emptyText: {
    marginBottom: 20,
    color: '#999',
    fontStyle: 'italic',
  },
  button: { marginTop: 20, marginBottom: 30 },
});
