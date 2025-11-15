import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Button, TextInput, Card, IconButton, Text } from 'react-native-paper';
import { useAlumnos } from '../context/AlumnosContext';

export default function ListaAlergiasScreen() {
  const { alergias, addAlergia, deleteAlergia } = useAlumnos();
  const [nombreAlergia, setNombreAlergia] = useState('');


  const alergiasDisponibles = [
    'Pescado', 'Frutos secos', 'Almendras', 'Gambas', 'Cacahuete', 'Gluten', 'Leche',
    'Proteína de la leche', 'Lactosa', 'Huevo', 'Rebozado', 'Cocido', 'Judías blancas',
    'Lentejas', 'Guisantes', 'Legumbres', 'Frutas (todas)', 'Kiwi', 'Mango', 'Melón',
    'Tomate', 'Mandarina', 'Sandía', 'Melocotón', 'Albaricoque', 'Plátano', 'Manzana',
    'Paraguaya', 'Cerdo', 'Ternera', 'Gelatina', 'Crema de calabaza', 'Crema de zanahoria',
    'Lechuga', 'Champiñón', 'Yogur', 'Natillas', 'Azúcar', 'Diabetes'
  ];

  const alergiasAgregadas = alergias.map(a => a.nombre);
  const alergiasFaltantes = alergiasDisponibles.filter(a => !alergiasAgregadas.includes(a));

  function agregarAlergiaPredefinida(alergia: string) {
    if (!alergiasAgregadas.includes(alergia)) {
      addAlergia(alergia);
    }
  }

  function agregarAlergiasPersonalizada() {
    if (!nombreAlergia.trim()) return;
    addAlergia(nombreAlergia.trim());
    setNombreAlergia('');
  }
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text variant="titleLarge" style={styles.title}>Gestionar Alergias</Text>

        {alergiasFaltantes.length > 0 && (
          <>
            <Text variant="bodyLarge" style={styles.sectionTitle}>Alergias disponibles:</Text>
            <View style={styles.chipsContainer}>
              {alergiasFaltantes.map((alergia) => (
                <Button
                  key={alergia}
                  mode="outlined"
                  onPress={() => agregarAlergiaPredefinida(alergia)}
                  style={styles.chipButton}
                  compact
                >
                  + {alergia}
                </Button>
              ))}
            </View>
          </>
        )}

        <Text variant="bodyLarge" style={styles.sectionTitle}>O crear una personalizada:</Text>

      <View style={styles.inputContainer}>
        <TextInput
          label="Nueva alergia"
          value={nombreAlergia}
          onChangeText={setNombreAlergia}
          style={styles.input}
            placeholder="Ej: Apio, Soja, etc."
        />
          <Button mode="contained" onPress={agregarAlergiasPersonalizada} style={styles.addButton}>
          Añadir
        </Button>
      </View>

        <Text variant="bodyLarge" style={styles.sectionTitle}>Alergias registradas:</Text>
        {alergias.length === 0 ? (
          <Text style={styles.emptyText}>No hay alergias registradas</Text>
        ) : (
          <>
            {alergias.map(item => (
              <Card key={item.id} style={styles.card}>
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
            ))}
          </>
        )}
    </ScrollView>
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
  allergyName: {
    flex: 1,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    color: '#999',
  },
});