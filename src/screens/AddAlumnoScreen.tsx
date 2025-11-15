import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { useAlumnos } from '../context/AlumnosContext';

export default function AddAlumnoScreen({ navigation }: any) {

  const { addAlumno } = useAlumnos();

  const [nombre, setNombre] = useState('');
  const [apellido1, setApellido1] = useState('');
  const [apellido2, setApellido2] = useState('');
  const [curso, setCurso] = useState('');
  const [alergias, setAlergias] = useState('');

  function guardar() {
    if (!nombre || !apellido1) return;

    const alergiasList = alergias
      .split(',')
      .map(a => a.trim())
      .filter(a => a.length > 0);

    addAlumno({
      nombre,
      apellido1,
      apellido2,
      curso,
      alergias: alergiasList,
    });

    navigation.goBack();
  }

  return (
    <View style={styles.container}>
      <TextInput label="Nombre" value={nombre} onChangeText={setNombre} style={styles.input} />
      <TextInput label="Primer apellido" value={apellido1} onChangeText={setApellido1} style={styles.input} />
      <TextInput label="Segundo apellido" value={apellido2} onChangeText={setApellido2} style={styles.input} />
      <TextInput label="Curso" value={curso} onChangeText={setCurso} style={styles.input} />

      <TextInput
        label="Alergias (separadas por comas)"
        value={alergias}
        onChangeText={setAlergias}
        style={styles.input}
      />

      <Button mode="contained" onPress={guardar} style={styles.button}>
        Guardar alumno
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  input: { marginBottom: 15 },
  button: { marginTop: 20 },
});
