import 'react-native-get-random-values';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider } from 'react-native-paper';

import HomeScreen from './HomeScreen';
import ListaAlumnosScreen from './ListaAlumnosScreen';
import AddAlumnoScreen from './AddAlumnoScreen';
import ListaAlergiasScreen from './ListaAlergiasScreen';
import ListaCursosScreen from './ListaCursosScreen';
import ComidaScreen from './ComidaScreen';
import { AlumnosProvider } from '../context/AlumnosContext';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <PaperProvider>
      <AlumnosProvider>
        <NavigationContainer>
          <Stack.Navigator>

            <Stack.Screen 
              name="Home"
              component={HomeScreen}
              options={{ title: 'Menú de Alergias' }}
            />

            <Stack.Screen 
              name="ListaAlumnos"
              component={ListaAlumnosScreen}
              options={{ title: "Alumnos" }}
            />

            <Stack.Screen 
              name="AddAlumno"
              component={AddAlumnoScreen}
              options={{ title: "Añadir alumno" }}
            />

            <Stack.Screen 
              name="ListaAlergias"
              component={ListaAlergiasScreen}
              options={{ title: "Alergias" }}
            />

            <Stack.Screen 
              name="ListaCursos"
              component={ListaCursosScreen}
              options={{ title: "Cursos" }}
            />

            <Stack.Screen 
              name="Comida"
              component={ComidaScreen}
              options={{ title: "Comida del día" }}
            />

          </Stack.Navigator>
        </NavigationContainer>
      </AlumnosProvider>
    </PaperProvider>
  );
}
