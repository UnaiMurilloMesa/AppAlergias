import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';

export default function HomeScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Text variant="titleLarge" style={styles.title}>Alergias - Comedor</Text>

      <Button 
        mode="contained" 
        style={styles.button}
        onPress={() => navigation.navigate("AddAlumno")}
      >
        Añadir alumno
      </Button>

      <Button 
        mode="contained" 
        style={styles.button}
        onPress={() => navigation.navigate("ListaAlumnos")}
      >
        Ver alumnos
      </Button>

      <Button 
        mode="contained" 
        style={styles.button}
        onPress={() => navigation.navigate("ListaAlergias")}
      >
        Lista de alergias
      </Button>

      <Button 
        mode="contained" 
        style={styles.button}
        onPress={() => navigation.navigate("ListaCursos")}
      >
        Gestionar cursos
      </Button>

      <Button 
        mode="contained" 
        style={styles.button}
        onPress={() => navigation.navigate("Comida")}
      >
        Comprobar comida
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
});
