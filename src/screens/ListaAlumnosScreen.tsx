import React, { useState } from 'react';
import { View, StyleSheet, FlatList, ScrollView } from 'react-native';
import { Text, IconButton, List, Divider, Chip, Portal, Modal, Card, Button, ActivityIndicator } from 'react-native-paper';
import { useAlumnos } from '../context/AlumnosContext';
import { Alert } from 'react-native';
import * as Sharing from 'expo-sharing';
import { generateAlumnosPdf } from '../utils/pdf';

export default function ListaAlumnosScreen() {
  const { alumnos, deleteAlumno, cursos, alergias } = useAlumnos();
  const [cursoSeleccionado, setCursoSeleccionado] = useState<string | null>(null);
  const [alergiaSeleccionada, setAlergiaSeleccionada] = useState<string | null>(null);
  const [selectedAlumno, setSelectedAlumno] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [exporting, setExporting] = useState(false);

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

  let alumnosFiltrados = cursoSeleccionado ? alumnos.filter(a => a.curso === cursoSeleccionado) : alumnos;
  if (alergiaSeleccionada) {
    alumnosFiltrados = alumnosFiltrados.filter(a => a.alergias.includes(alergiaSeleccionada));
  }

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

  return (
    <View style={styles.container}>

      <View style={{ paddingHorizontal: 16, marginBottom: 8, marginTop: 12 }}>
        <Button mode="contained" onPress={onExport} disabled={exporting} style={{ marginBottom: 8 }}>
          {exporting ? 'Generando PDF...' : 'Exportar alumnos a PDF'}
        </Button>
        {exporting && <ActivityIndicator animating size={24} />}
      </View>

      <Text variant="titleMedium" style={styles.title}>Filtrar por curso</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll} contentContainerStyle={styles.filterContainer}>
        <Chip
          selected={cursoSeleccionado === null}
          onPress={() => setCursoSeleccionado(null)}
          style={styles.filterChip}
        >
          Todos
        </Chip>
        {cursos.map(c => (
          <Chip
            key={c.id}
            selected={cursoSeleccionado === c.nombre}
            onPress={() => setCursoSeleccionado(prev => prev === c.nombre ? null : c.nombre)}
            style={styles.filterChip}
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
        >
          Todas
        </Chip>
        {alergias.map(a => (
          <Chip
            key={a.id}
            selected={alergiaSeleccionada === a.nombre}
            onPress={() => setAlergiaSeleccionada(prev => prev === a.nombre ? null : a.nombre)}
            style={styles.filterChip}
          >
            {a.nombre}
          </Chip>
        ))}
      </ScrollView>

      <FlatList
        data={alumnosFiltrados}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
            <>
            <List.Item
            onPress={() => { setSelectedAlumno(item); setModalVisible(true); }}
                title={`${item.nombre} ${item.apellido1} ${item.apellido2 ?? ""}`}
                description={
                    item.alergias.length > 0
                    ? `Alergias: ${item.alergias.join(", ")}`
                    : "Sin alergias registradas"
                }
                titleStyle={{ fontSize: 18, fontWeight: "bold" }}
                descriptionStyle={{ fontSize: 14, color: "#555" }}
                right={() => (
                    <IconButton
                    icon="delete"
                    iconColor="red"
                    onPress={() => confirmarEliminacion(item)}
                    />
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

      <Portal>
        <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)} contentContainerStyle={styles.modalContainer}>
          {selectedAlumno ? (
            <Card>
              <Card.Title title={`${selectedAlumno.nombre} ${selectedAlumno.apellido1} ${selectedAlumno.apellido2 ?? ''}`} />
              <Card.Content>
                <Text variant="titleSmall" style={{ marginBottom: 6 }}>Curso: {selectedAlumno.curso}</Text>
                <Text variant="titleSmall" style={{ marginBottom: 6 }}>Alergias:</Text>
                {selectedAlumno.alergias && selectedAlumno.alergias.length > 0 ? (
                  <View style={styles.modalAlergias}>
                    {selectedAlumno.alergias.map((a: string, idx: number) => (
                      <Chip key={idx} style={styles.modalChip}>{a}</Chip>
                    ))}
                  </View>
                ) : (
                  <Text>Sin alergias registradas</Text>
                )}
              </Card.Content>
              <Card.Actions>
                <Button onPress={() => setModalVisible(false)}>Cerrar</Button>
              </Card.Actions>
            </Card>
          ) : null}
        </Modal>
      </Portal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: { textAlign: 'left', paddingHorizontal: 16, paddingTop: 12, paddingBottom: 6 },
  subtitle: { textAlign: 'left', paddingHorizontal: 16, paddingTop: 6, paddingBottom: 6 },
  filterScroll: { maxHeight: 56, paddingHorizontal: 8, marginBottom: 8 },
  filterContainer: { alignItems: 'center', paddingHorizontal: 8 },
  filterChip: { marginRight: 8 },
  modalContainer: { margin: 20, backgroundColor: '#fff', padding: 16, borderRadius: 8 },
  modalAlergias: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 6 },
  modalChip: { marginRight: 6, marginBottom: 6 },
});
