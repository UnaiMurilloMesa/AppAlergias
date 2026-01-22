import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';

export default function HomeScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Text variant="titleLarge" style={styles.title}>Alergias - Zurbarán</Text>


      <Button
        mode="contained"
        style={styles.button}
        onPress={() => navigation.navigate("ListaAlumnos")}
      >
        Ver alumnos
      </Button>

      <Button
        mode="contained"
        style={[styles.gestionarButton]}
        onPress={() => navigation.navigate("ListaAlergias")}
      >
        Gestionar alergias
      </Button>
      <Button
        mode="contained"
        style={[styles.gestionarButton]}
        onPress={() => navigation.navigate("ListaCursos")}
      >
        Gestionar cursos
      </Button>

      <Button
        mode="contained"
        style={[styles.alergicosButton]}
        onPress={() => navigation.navigate("AddComida")}
      >
        Añadir comida
      </Button>
      <Button
        mode="contained"
        style={[styles.alergicosButton]}
        onPress={() => navigation.navigate("BuscarAlergicos")}
      >
        Buscar alumnos alérgicos
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: 40,
  },
  button: {
    marginVertical: 10,
    padding: 5,
  },
  gestionarButton: {
    marginVertical: 10,
    padding: 5,
    backgroundColor: '#0e8628ff'
  },
  alergicosButton: {
    marginTop: 10,
    marginVertical: 10,
    padding: 5,
    backgroundColor: '#b8772dff',
  },
});
