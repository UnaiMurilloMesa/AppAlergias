import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, IconButton, List, Divider } from 'react-native-paper';
import { useAlumnos } from '../context/AlumnosContext';
import { Alert } from 'react-native';

export default function ListaAlumnosScreen() {
  const { alumnos, deleteAlumno } = useAlumnos();

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

  return (
    <View style={styles.container}>

      <FlatList
        data={alumnos}
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
            No hay alumnos aún.
          </Text>
        }
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
