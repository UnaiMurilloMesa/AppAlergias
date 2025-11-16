import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, Alert } from 'react-native';
import { TextInput, Button, Text, Card, Chip } from 'react-native-paper';
import { useAlumnos } from '../context/AlumnosContext';

export default function AddComidaScreen({ navigation }: any) {
  const { comidas, addComida, deleteComida, alergias } = useAlumnos();

  const [nombre, setNombre] = useState('');
  const [selectedAlergias, setSelectedAlergias] = useState<string[]>([]);

  function toggleAlergia(nombreA: string) {
    setSelectedAlergias(prev => prev.includes(nombreA) ? prev.filter(a => a !== nombreA) : [...prev, nombreA]);
  }

  function guardar() {
    const nombreTrim = nombre.trim();
    if (!nombreTrim) return;
    const existente = comidas.find(c => c.nombre.toLowerCase() === nombreTrim.toLowerCase());
    if (existente) return;
    addComida({ nombre: nombreTrim, alergias: selectedAlergias });
    setNombre('');
    setSelectedAlergias([]);
  }

  function confirmarEliminar(comidaId: string, comidaNombre: string) {
    Alert.alert(
      'Eliminar comida',
      `¿Estás seguro de que quieres eliminar "${comidaNombre}"?`,
      [
        { text: 'Cancelar', onPress: () => {}, style: 'cancel' },
        { text: 'Eliminar', onPress: () => deleteComida(comidaId), style: 'destructive' },
      ]
    );
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }} style={styles.container}>
      <Text variant="titleLarge" style={styles.title}>Añadir comida</Text>

      <TextInput label="Nombre de la comida" value={nombre} onChangeText={setNombre} style={styles.input} />

      <Text variant="bodyLarge" style={styles.sectionTitle}>Selecciona las alergias asociadas:</Text>
      <View style={styles.chipsContainer}>
        {alergias.length === 0 ? (
          <Text style={styles.emptyText}>No hay alergias registradas. Añade algunas primero.</Text>
        ) : (
          alergias.map(a => (
            <Chip
              key={a.id}
              selected={selectedAlergias.includes(a.nombre)}
              onPress={() => toggleAlergia(a.nombre)}
              style={styles.chip}
            >
              {a.nombre}
            </Chip>
          ))
        )}
      </View>

      <Button mode="contained" onPress={guardar} style={styles.saveButton}>Guardar comida</Button>

      <Text variant="titleMedium" style={styles.sectionTitle}>Comidas guardadas</Text>
      {comidas.map(c => (
        <Card key={c.id} style={styles.cardSmall}>
          <Card.Content>
            <Text>{c.nombre}</Text>
            <Text style={{ color: '#666', marginTop: 4 }}>{c.alergias.join(', ') || '—'}</Text>
          </Card.Content>
          <Card.Actions>
            <Button mode="text" onPress={() => confirmarEliminar(c.id, c.nombre)}>Eliminar</Button>
          </Card.Actions>
        </Card>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: { textAlign: 'center', marginBottom: 16 },
  input: { marginBottom: 12 },
  sectionTitle: { marginTop: 12, marginBottom: 8 },
  chipsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { marginRight: 6, marginBottom: 6 },
  saveButton: { marginTop: 12, marginBottom: 20 },
  cardSmall: { marginVertical: 6 },
  emptyText: { color: '#999' },
});
