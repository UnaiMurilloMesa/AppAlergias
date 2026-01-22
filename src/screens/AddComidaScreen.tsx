import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, Alert } from 'react-native';
import { TextInput, Button, Text, Card, Chip, IconButton, Portal, Dialog } from 'react-native-paper';
import { useAlumnos } from '../context/AlumnosContext';
import { Comida } from '../types/Comida';

export default function AddComidaScreen({ navigation }: any) {
  const { comidas, addComida, updateComida, deleteComida, alergias } = useAlumnos();

  // Create state
  const [nombre, setNombre] = useState('');
  const [selectedAlergias, setSelectedAlergias] = useState<string[]>([]);

  // Edit state
  const [visible, setVisible] = useState(false);
  const [editingComida, setEditingComida] = useState<Comida | null>(null);
  const [editName, setEditName] = useState('');
  const [editAlergias, setEditAlergias] = useState<string[]>([]);

  // Toggle for Create
  function toggleAlergia(nombreA: string) {
    setSelectedAlergias(prev => prev.includes(nombreA) ? prev.filter(a => a !== nombreA) : [...prev, nombreA]);
  }

  // Toggle for Edit
  function toggleEditAlergia(nombreA: string) {
    setEditAlergias(prev => prev.includes(nombreA) ? prev.filter(a => a !== nombreA) : [...prev, nombreA]);
  }

  function guardar() {
    const nombreTrim = nombre.trim();
    if (!nombreTrim) return;
    const existente = comidas.find(c => c.nombre.toLowerCase() === nombreTrim.toLowerCase());
    if (existente) {
      Alert.alert('Error', 'Ya existe una comida con ese nombre');
      return;
    }
    addComida({ nombre: nombreTrim, alergias: selectedAlergias });
    setNombre('');
    setSelectedAlergias([]);
  }

  function confirmarEliminar(comidaId: string, comidaNombre: string) {
    Alert.alert(
      'Eliminar comida',
      `¿Estás seguro de que quieres eliminar "${comidaNombre}"?`,
      [
        { text: 'Cancelar', onPress: () => { }, style: 'cancel' },
        { text: 'Eliminar', onPress: () => deleteComida(comidaId), style: 'destructive' },
      ]
    );
  }

  function showDialog(comida: Comida) {
    setEditingComida(comida);
    setEditName(comida.nombre);
    setEditAlergias(comida.alergias || []);
    setVisible(true);
  }

  function hideDialog() {
    setVisible(false);
    setEditingComida(null);
    setEditName('');
    setEditAlergias([]);
  }

  function saveEdit() {
    if (!editingComida || !editName.trim()) return;

    // Check duplication (excluding itself)
    const exists = comidas.find(c => c.nombre.toLowerCase() === editName.trim().toLowerCase() && c.id !== editingComida.id);
    if (exists) {
      Alert.alert('Error', 'Ya existe otra comida con ese nombre');
      return;
    }

    updateComida(editingComida.id, { nombre: editName.trim(), alergias: editAlergias });
    hideDialog();
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 100 }} style={styles.container} keyboardShouldPersistTaps="handled">
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
              showSelectedOverlay
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
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View style={{ flex: 1 }}>
                <Text variant="titleMedium">{c.nombre}</Text>
                <Text style={{ color: '#666', marginTop: 4 }}>{c.alergias.join(', ') || 'Sin alergias'}</Text>
              </View>
            </View>
          </Card.Content>
          <Card.Actions>
            <IconButton icon="pencil" onPress={() => showDialog(c)} />
            <IconButton icon="trash-can" iconColor="red" onPress={() => confirmarEliminar(c.id, c.nombre)} />
          </Card.Actions>
        </Card>
      ))}

      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog} style={{ position: 'absolute', top: 20, width: '90%', alignSelf: 'center' }}>
          <Dialog.Title>Editar Comida</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Nombre"
              value={editName}
              onChangeText={setEditName}
              style={{ marginBottom: 15 }}
            />
            <Text variant="bodyMedium" style={{ marginBottom: 8 }}>Alergias asociadas:</Text>
            <ScrollView style={{ maxHeight: 200 }}>
              <View style={styles.chipsContainer}>
                {alergias.map(a => (
                  <Chip
                    key={a.id}
                    selected={editAlergias.includes(a.nombre)}
                    onPress={() => toggleEditAlergia(a.nombre)}
                    style={styles.chip}
                    showSelectedOverlay
                  >
                    {a.nombre}
                  </Chip>
                ))}
              </View>
            </ScrollView>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>Cancelar</Button>
            <Button onPress={saveEdit}>Guardar</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
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
