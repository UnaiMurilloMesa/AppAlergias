import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, Text, Card, Chip, List } from 'react-native-paper';
import { useAlumnos } from '../context/AlumnosContext';

export default function ComidaScreen() {
  const { comidas, addComida, alergias } = useAlumnos();

  const [nombre, setNombre] = useState('');
  const [found, setFound] = useState<any | null>(null);
  const [selectedAlergias, setSelectedAlergias] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<any[]>([]);

  function buscar() {
    const nombreTrim = nombre.trim().toLowerCase();
    if (!nombreTrim) return;
    const existente = comidas.find(c => c.nombre.toLowerCase() === nombreTrim);
    if (existente) {
      setFound(existente);
      setSelectedAlergias(existente.alergias || []);
    } else {
      setFound(null);
      setSelectedAlergias([]);
    }
    setSuggestions([]);
  }

  function onChangeNombre(text: string) {
    setNombre(text);
    const q = text.trim().toLowerCase();
    if (!q) {
      setSuggestions([]);
      return;
    }
    const matches = comidas.filter(c => c.nombre.toLowerCase().includes(q));
    setSuggestions(matches.slice(0, 6));
  }

  function toggleAlergia(nombreA: string) {
    setSelectedAlergias(prev => prev.includes(nombreA) ? prev.filter(a => a !== nombreA) : [...prev, nombreA]);
  }

  function guardar() {
    const nombreTrim = nombre.trim();
    if (!nombreTrim) return;
    // si ya existe no crear duplicado
    const existente = comidas.find(c => c.nombre.toLowerCase() === nombreTrim.toLowerCase());
    if (existente) {
      setFound(existente);
      return;
    }
    addComida({ nombre: nombreTrim, alergias: selectedAlergias });
    setNombre('');
    setSelectedAlergias([]);
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
      <Text variant="titleLarge" style={styles.title}>Comprobar / Añadir comida</Text>

      <TextInput label="Nombre de la comida" value={nombre} onChangeText={onChangeNombre} style={styles.input} />

      {suggestions.length > 0 && (
        <Card style={styles.suggestionsCard}>
          {suggestions.map(s => (
            <List.Item
              key={s.id}
              title={s.nombre}
              onPress={() => {
                setNombre(s.nombre);
                setFound(s);
                setSelectedAlergias(s.alergias || []);
                setSuggestions([]);
              }}
            />
          ))}
        </Card>
      )}

      <Button mode="contained" onPress={buscar} style={styles.button}>Buscar</Button>

      {found ? (
        <Card style={styles.card}>
          <Card.Title title={found.nombre} />
          <Card.Content>
            <Text variant="bodyLarge">Alergias asociadas:</Text>
            <View style={styles.chipsContainer}>
              {found.alergias && found.alergias.length > 0 ? (
                found.alergias.map((a: string, idx: number) => (
                  <Chip key={idx} style={styles.chip}>{a}</Chip>
                ))
              ) : (
                <Text style={{ marginTop: 8 }}>No hay alergias asociadas</Text>
              )}
            </View>
          </Card.Content>
        </Card>
      ) : (
        <>
          <Text variant="bodyLarge" style={styles.sectionTitle}>Si la comida no existe, selecciona las alergias correspondientes y guarda:</Text>
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
        </>
      )}

      <Text variant="titleMedium" style={styles.sectionTitle}>Comidas guardadas</Text>
      {comidas.map(c => (
        <Card key={c.id} style={styles.cardSmall}>
          <Card.Content>
            <Text>{c.nombre}</Text>
            <Text style={{ color: '#666', marginTop: 4 }}>{c.alergias.join(', ')}</Text>
          </Card.Content>
        </Card>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: { textAlign: 'center', marginBottom: 16 },
  input: { marginBottom: 12 },
  button: { marginBottom: 12 },
  sectionTitle: { marginTop: 12, marginBottom: 8 },
  chipsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { marginRight: 6, marginBottom: 6 },
  saveButton: { marginTop: 12, marginBottom: 20 },
  card: { marginVertical: 8 },
  cardSmall: { marginVertical: 6 },
  emptyText: { color: '#999' },
  suggestionsCard: { marginVertical: 6, backgroundColor: '#fff' },
});