import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from './AuthContext';
import UserAuth from '../screens/UserAuth';
import Dashboard from '../screens/Dashboard';
import CreateRainCheck from '../screens/CreateRainCheck';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { user } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!user ? (
          <Stack.Screen
            name="UserAuth"
            component={UserAuth}
            options={{ headerShown: false }}
          />
        ) : (
          <>
            <Stack.Screen
              name="Dashboard"
              component={Dashboard}
              options={{ title: 'RainyDay' }}
            />
            <Stack.Screen
              name="CreateRainCheck"
              component={CreateRainCheck}
              options={{ title: 'New RainCheck' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
