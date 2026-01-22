import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, ScrollView, Alert } from 'react-native';
import { Text, IconButton, List, Divider, Chip, Portal, Dialog, Card, Button, ActivityIndicator, TextInput, FAB } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useAlumnos } from '../context/AlumnosContext';
import * as Sharing from 'expo-sharing';
import { generateAlumnosPdf } from '../utils/pdf';
import { Alumno } from '../types/Alumno';

export default function ListaAlumnosScreen() {
  const { alumnos, deleteAlumno, updateAlumno, cursos, alergias } = useAlumnos();
  const [cursoSeleccionado, setCursoSeleccionado] = useState<string | null>(null);
  const [alergiaSeleccionada, setAlergiaSeleccionada] = useState<string | null>(null);

  // Edit State
  const [visible, setVisible] = useState(false);
  const [editingAlumno, setEditingAlumno] = useState<Alumno | null>(null);
  const [editNombre, setEditNombre] = useState('');
  const [editApellido1, setEditApellido1] = useState('');
  const [editApellido2, setEditApellido2] = useState('');
  const [editCurso, setEditCurso] = useState('');
  const [editAlergias, setEditAlergias] = useState<string[]>([]);

  const [exporting, setExporting] = useState(false);
  const navigation = useNavigation();

  function confirmarEliminacion(alumno: any) {
    Alert.alert(
      "Eliminar alumno",
      `¿Estás seguro que quieres eliminar a ${alumno.nombre} ${alumno.apellido1}?`,
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Eliminar", style: "destructive", onPress: () => deleteAlumno(alumno.id) }
      ]
    );
  }

  const ORDERED_CURSOS = ['1INF', '2INF', '3INF', '1PRIM', '2PRIM', '3PRIM', '4PRIM', '5PRIM', '6PRIM', '1BACH', '2BACH'];

  let alumnosFiltrados = cursoSeleccionado ? alumnos.filter(a => a.curso === cursoSeleccionado) : alumnos;
  if (alergiaSeleccionada) {
    alumnosFiltrados = alumnosFiltrados.filter(a => a.alergias.includes(alergiaSeleccionada));
  }

  // Sort by course index
  alumnosFiltrados.sort((a, b) => {
    const indexA = ORDERED_CURSOS.indexOf(a.curso);
    const indexB = ORDERED_CURSOS.indexOf(b.curso);
    const valA = indexA === -1 ? 999 : indexA;
    const valB = indexB === -1 ? 999 : indexB;
    return valA - valB;
  });

  async function onExport() {
    setExporting(true);
    try {
      const uri = await generateAlumnosPdf(alumnos);
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri);
      } else {
        Alert.alert('PDF generado', `Archivo creado en: ${uri}`);
      }
    } catch (e) {
      console.error('Error exportando PDF', e);
      Alert.alert('Error', 'No se pudo generar el PDF.');
    } finally {
      setExporting(false);
    }
  }

  // Edit Logic
  function showEditDialog(alumno: Alumno) {
    setEditingAlumno(alumno);
    setEditNombre(alumno.nombre);
    setEditApellido1(alumno.apellido1);
    setEditApellido2(alumno.apellido2 || '');
    setEditCurso(alumno.curso);
    setEditAlergias(alumno.alergias);
    setVisible(true);
  }

  function hideDialog() {
    setVisible(false);
    setEditingAlumno(null);
  }

  function saveEdit() {
    if (!editingAlumno) return;
    if (!editNombre.trim() || !editApellido1.trim() || !editCurso) {
      Alert.alert('Error', 'Nombre, Primer Apellido y Curso son obligatorios.');
      return;
    }

    updateAlumno(editingAlumno.id, {
      nombre: editNombre.trim(),
      apellido1: editApellido1.trim(),
      apellido2: editApellido2.trim(),
      curso: editCurso,
      alergias: editAlergias
    });
    hideDialog();
  }

  function toggleEditAlergia(nombreA: string) {
    setEditAlergias(prev => prev.includes(nombreA) ? prev.filter(a => a !== nombreA) : [...prev, nombreA]);
  }

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <Card style={styles.filterCard}>
        <Card.Content>
          <View style={{ marginBottom: 12 }}>
            <Button mode="contained" onPress={onExport} disabled={exporting}>
              {exporting ? 'Generando PDF...' : 'Exportar alumnos a PDF'}
            </Button>
            {exporting && <ActivityIndicator animating size={24} style={{ marginTop: 8 }} />}
          </View>

          <Text variant="titleMedium" style={styles.title}>Filtrar por curso</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll} contentContainerStyle={styles.filterContainer}>
            <Chip
              selected={cursoSeleccionado === null}
              onPress={() => setCursoSeleccionado(null)}
              style={styles.filterChip}
              showSelectedOverlay
            >
              Todos
            </Chip>
            {cursos.map(c => (
              <Chip
                key={c.id}
                selected={cursoSeleccionado === c.nombre}
                onPress={() => setCursoSeleccionado(prev => prev === c.nombre ? null : c.nombre)}
                style={styles.filterChip}
                showSelectedOverlay
              >
                {c.nombre}
              </Chip>
            ))}
          </ScrollView>

          <Text variant="titleMedium" style={styles.title}>Filtrar por alergia</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll} contentContainerStyle={styles.filterContainer}>
            <Chip
              selected={alergiaSeleccionada === null}
              onPress={() => setAlergiaSeleccionada(null)}
              style={styles.filterChip}
              showSelectedOverlay
            >
              Todas
            </Chip>
            {alergias.map(a => (
              <Chip
                key={a.id}
                selected={alergiaSeleccionada === a.nombre}
                onPress={() => setAlergiaSeleccionada(prev => prev === a.nombre ? null : a.nombre)}
                style={styles.filterChip}
                showSelectedOverlay
              >
                {a.nombre}
              </Chip>
            ))}
          </ScrollView>
        </Card.Content>
      </Card>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        ListHeaderComponent={renderHeader}
        data={alumnosFiltrados}
        contentContainerStyle={{ paddingBottom: 100 }}
        keyboardShouldPersistTaps="handled"
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <>
            <List.Item
              title={`${item.nombre} ${item.apellido1} ${item.apellido2 ?? ""}`}
              description={
                (item.alergias.length > 0
                  ? `Alergias: ${item.alergias.join(", ")}`
                  : "Sin alergias registradas") + `\nCurso: ${item.curso}`
              }
              titleStyle={{ fontSize: 18, fontWeight: "bold" }}
              descriptionStyle={{ fontSize: 14, color: "#555" }}
              descriptionNumberOfLines={3}
              right={() => (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <IconButton
                    icon="pencil"
                    onPress={() => showEditDialog(item)}
                  />
                  <IconButton
                    icon="trash-can"
                    iconColor="red"
                    onPress={() => confirmarEliminacion(item)}
                  />
                </View>
              )}
            />
            <Divider />
          </>
        )}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 40 }}>
            {alumnosFiltrados.length === 0 ? 'No hay alumnos para este filtro.' : 'No hay alumnos aún.'}
          </Text>
        }
      />

      {/* Edit Dialog */}
      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog} style={{ maxHeight: '80%' }}>
          <Dialog.Title>Editar Alumno</Dialog.Title>
          <Dialog.ScrollArea>
            <ScrollView contentContainerStyle={{ paddingVertical: 10 }}>
              <TextInput label="Nombre" value={editNombre} onChangeText={setEditNombre} style={styles.input} />
              <TextInput label="Primer Apellido" value={editApellido1} onChangeText={setEditApellido1} style={styles.input} />
              <TextInput label="Segundo Apellido" value={editApellido2} onChangeText={setEditApellido2} style={styles.input} />

              <Text variant="bodyMedium" style={styles.label}>Curso</Text>
              <View style={[styles.chipsContainer, { marginBottom: 15 }]}>
                {cursos.map(c => (
                  <Chip
                    key={c.id}
                    selected={editCurso === c.nombre}
                    onPress={() => setEditCurso(c.nombre)}
                    style={styles.chip}
                    showSelectedOverlay
                  >
                    {c.nombre}
                  </Chip>
                ))}
              </View>

              <Text variant="bodyMedium" style={styles.label}>Alergias</Text>
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
          </Dialog.ScrollArea>
          <Dialog.Actions>
            <Button onPress={hideDialog}>Cancelar</Button>
            <Button onPress={saveEdit}>Guardar</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('AddAlumno' as never)}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f0f0' },
  headerContainer: { padding: 10, paddingBottom: 0 },
  filterCard: { marginBottom: 10, elevation: 4 },
  title: { textAlign: 'left', marginBottom: 6, marginTop: 10 },
  filterScroll: { marginBottom: 8 },
  filterContainer: { paddingVertical: 5 },
  filterChip: { marginRight: 8, height: 50 },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  input: { marginBottom: 10, backgroundColor: 'transparent' },
  label: { marginBottom: 8, fontWeight: 'bold' },
  chipsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: { marginRight: 6, marginBottom: 6 },
});
