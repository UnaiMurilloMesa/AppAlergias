import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Button, TextInput, Card, IconButton, Text, Portal, Dialog } from 'react-native-paper';
import { useAlumnos } from '../context/AlumnosContext';

export default function ListaCursosScreen() {
  const { cursos, addCurso, deleteCurso, updateCurso } = useAlumnos();
  const [nombreCurso, setNombreCurso] = useState('');
  const [editingCurso, setEditingCurso] = useState<any>(null);
  const [editName, setEditName] = useState('');
  const [visible, setVisible] = useState(false);

  const showDialog = (curso: any) => {
    setEditingCurso(curso);
    setEditName(curso.nombre);
    setVisible(true);
  };

  const hideDialog = () => setVisible(false);

  const saveEdit = () => {
    if (editingCurso && editName.trim()) {
      updateCurso(editingCurso.id, editName.trim());
      hideDialog();
    }
  };

  const cursosDisponibles = ['1INF', '2INF', '3INF', '1PRIM', '2PRIM', '3PRIM', '4PRIM', '5PRIM', '6PRIM', '1ESO', '2ESO', '3ESO', '4ESO', 'BACH'];
  const cursosAgregados = cursos.map(c => c.nombre);
  const cursosFaltantes = cursosDisponibles.filter(c => !cursosAgregados.includes(c));

  function agregarCursoDisponible(curso: string) {
    if (!cursosAgregados.includes(curso)) {
      addCurso(curso);
    }
  }

  function agregarCursoPersonalizado() {
    if (!nombreCurso.trim()) return;
    addCurso(nombreCurso.trim());
    setNombreCurso('');
  }

  return (
    <View style={styles.container}>
      <Text variant="titleLarge" style={styles.title}>Gestionar Cursos</Text>

      {cursosFaltantes.length > 0 && (
        <>
          <Text variant="bodyLarge" style={styles.sectionTitle}>Cursos disponibles:</Text>
          <View style={styles.chipsContainer}>
            {cursosFaltantes.map((curso) => (
              <Button
                key={curso}
                mode="outlined"
                onPress={() => agregarCursoDisponible(curso)}
                style={styles.chipButton}
                compact
              >
                + {curso}
              </Button>
            ))}
          </View>
        </>
      )}

      <Text variant="bodyLarge" style={styles.sectionTitle}>O crear uno personalizado:</Text>
      <View style={styles.inputContainer}>
        <TextInput
          label="Nuevo curso"
          value={nombreCurso}
          onChangeText={setNombreCurso}
          style={styles.input}
          placeholder="Ej: 4ESOB"
        />
        <Button mode="contained" onPress={agregarCursoPersonalizado} style={styles.addButton}>
          Añadir
        </Button>
      </View>

      <Text variant="bodyLarge" style={styles.sectionTitle}>Cursos registrados:</Text>
      {cursos.length === 0 ? (
        <Text style={styles.emptyText}>No hay cursos registrados</Text>
      ) : (
        <FlatList
          data={cursos}
          contentContainerStyle={{ paddingBottom: 100 }}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Card style={styles.card}>
              <View style={styles.cardContent}>
                <Text variant="bodyLarge" style={styles.curseName}>
                  {item.nombre}
                </Text>
                <IconButton
                  icon="pencil"
                  onPress={() => showDialog(item)}
                  size={20}
                />
                <IconButton
                  icon="delete"
                  onPress={() => deleteCurso(item.id)}
                  size={20}
                />
              </View>
            </Card>
          )}
        />
      )}

      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Title>Editar Curso</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Nombre del curso"
              value={editName}
              onChangeText={setEditName}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>Cancelar</Button>
            <Button onPress={saveEdit}>Guardar</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    marginTop: 15,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
    gap: 8,
  },
  chipButton: {
    marginBottom: 5,
  },
  inputContainer: {
    marginBottom: 20,
    gap: 10,
  },
  input: {
    marginBottom: 10,
  },
  addButton: {
    paddingVertical: 5,
  },
  card: {
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  curseName: {
    flex: 1,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    color: '#999',
  },
});
