import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Button, TextInput, Card, IconButton, Text } from 'react-native-paper';
import { useAlumnos } from '../context/AlumnosContext';

export default function ListaAlergiasScreen() {
  const { alergias, addAlergia, deleteAlergia } = useAlumnos();
  const [nombreAlergia, setNombreAlergia] = useState('');

  function guardarAlergia() {
    if (!nombreAlergia.trim()) return;
    addAlergia(nombreAlergia.trim());
    setNombreAlergia('');
  }

  return (
    <View style={styles.container}>
      <Text variant="titleLarge" style={styles.title}>Alergias disponibles</Text>

      <View style={styles.inputContainer}>
        <TextInput
          label="Nueva alergia"
          value={nombreAlergia}
          onChangeText={setNombreAlergia}
          style={styles.input}
          placeholder="Ej: Cacahuetes, Gluten, etc."
        />
        <Button mode="contained" onPress={guardarAlergia} style={styles.addButton}>
          Añadir
        </Button>
      </View>

      {alergias.length === 0 ? (
        <Text style={styles.emptyText}>No hay alergias registradas</Text>
      ) : (
        <FlatList
          data={alergias}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Card style={styles.card}>
              <View style={styles.cardContent}>
                <Text variant="bodyLarge" style={styles.allergyName}>
                  {item.nombre}
                </Text>
                <IconButton
                  icon="delete"
                  onPress={() => deleteAlergia(item.id)}
                  size={20}
                />
              </View>
            </Card>
          )}
        />
      )}
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
  allergyName: {
    flex: 1,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    color: '#999',
  },
});