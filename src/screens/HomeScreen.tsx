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

      <View style={styles.rowContainer}>
        <Button 
          mode="contained" 
          style={[styles.rowButton]}
          onPress={() => navigation.navigate("ListaAlergias")}
        >
          Gestionar alergias
        </Button>

        <Button 
          mode="contained" 
          style={[styles.rowButton]}
          onPress={() => navigation.navigate("ListaCursos")}
        >
          Gestionar cursos
        </Button>
      </View>

      <Button 
        mode="contained" 
        style={[styles.button, styles.comidaButton]}
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
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  rowButton: {
    flex: 1,
    marginHorizontal: 6,
    padding: 5,
  },
  comidaButton: {
    backgroundColor: '#b8772dff',
  },
});
