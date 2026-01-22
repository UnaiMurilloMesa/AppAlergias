import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { TextInput, Button, Text, Card, List } from 'react-native-paper';
import { useAlumnos } from '../context/AlumnosContext';

export default function BuscarAlergicosScreen() {
  const { comidas, alumnos } = useAlumnos();

  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [selected, setSelected] = useState<any | null>(null);
  const [resultados, setResultados] = useState<any[]>([]);

  function onChangeQuery(text: string) {
    setQuery(text);
    const q = text.trim().toLowerCase();
    if (!q) return setSuggestions([]);
    const matches = comidas.filter(c => c.nombre.toLowerCase().includes(q));
    setSuggestions(matches.slice(0, 8));
  }

  function selectComida(c: any) {
    setSelected(c);
    setQuery(c.nombre);
    setSuggestions([]);
    // buscar alumnos con alguna de las alergias de la comida
    const alergiasComida = c.alergias || [];
    const encontrados = alumnos.filter(a => a.alergias.some(al => alergiasComida.includes(al)));
    setResultados(encontrados);
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 100 }} style={styles.container}>
      <Text variant="titleLarge" style={styles.title}>Buscar alérgicos por comida</Text>

      <TextInput label="Buscar comida" value={query} onChangeText={onChangeQuery} style={styles.input} />

      {suggestions.length > 0 && (
        <Card style={styles.suggestionsCard}>
          {suggestions.map(s => (
            <List.Item key={s.id} title={s.nombre} onPress={() => selectComida(s)} />
          ))}
        </Card>
      )}

      <Button mode="contained" onPress={() => {
        const exact = comidas.find(c => c.nombre.toLowerCase() === query.trim().toLowerCase());
        if (exact) selectComida(exact);
      }} style={styles.button}>Seleccionar</Button>

      {selected && (
        <Card style={styles.card}>
          <Card.Title title={`Comida: ${selected.nombre}`} />
          <Card.Content>
            <Text variant="bodyLarge">Alergias de la comida: {selected.alergias.join(', ') || '—'}</Text>
          </Card.Content>
        </Card>
      )}

      <Text variant="titleMedium" style={styles.sectionTitle}>Alumnos con alergias a esta comida</Text>
      {resultados.length === 0 ? (
        <Text style={styles.emptyText}>No hay alumnos encontrados para la comida seleccionada.</Text>
      ) : (
        resultados.map(r => (
          <Card key={r.id} style={styles.cardSmall}>
            <Card.Content>
              <Text style={{ fontWeight: 'bold' }}>{`${r.nombre} ${r.apellido1} ${r.apellido2 ?? ''}`}</Text>
              <Text style={{ color: '#666', marginTop: 6 }}>Alergias: {r.alergias.join(', ')}</Text>
              <Text style={{ color: '#666', marginTop: 6 }}>Curso: {r.curso}</Text>
            </Card.Content>
          </Card>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: { textAlign: 'center', marginBottom: 16 },
  input: { marginBottom: 12 },
  suggestionsCard: { marginVertical: 6, backgroundColor: '#fff' },
  button: { marginBottom: 12 },
  sectionTitle: { marginTop: 12, marginBottom: 8 },
  card: { marginVertical: 8 },
  cardSmall: { marginVertical: 6 },
  emptyText: { color: '#999' },
});
