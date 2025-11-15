import React, { useState } from 'react';
import { View, StyleSheet, FlatList, ScrollView } from 'react-native';
import { Text, IconButton, List, Divider, Chip } from 'react-native-paper';
import { useAlumnos } from '../context/AlumnosContext';
import { Alert } from 'react-native';

export default function ListaAlumnosScreen() {
  const { alumnos, deleteAlumno, cursos } = useAlumnos();
  const [cursoSeleccionado, setCursoSeleccionado] = useState<string | null>(null);

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

  const alumnosFiltrados = cursoSeleccionado ? alumnos.filter(a => a.curso === cursoSeleccionado) : alumnos;

  return (
    <View style={styles.container}>

      <Text variant="titleLarge" style={styles.title}>Filtrar por curso</Text>
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

      <FlatList
        data={alumnosFiltrados}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
            <>
                <List.Item
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

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: { textAlign: 'left', paddingHorizontal: 16, paddingTop: 12, paddingBottom: 6 },
  filterScroll: { maxHeight: 56, paddingHorizontal: 8, marginBottom: 8 },
  filterContainer: { alignItems: 'center', paddingHorizontal: 8 },
  filterChip: { marginRight: 8 },
});
