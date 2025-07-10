import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from './AuthContext';
import UserAuth from '../screens/UserAuth';
import Dashboard from '../screens/Dashboard';
import CreateRainCheck from '../screens/CreateRainCheck';
import ViewRainCheck from '../screens/ViewRainCheck';
import CompletedRainChecks from '../screens/CompletedRainChecks';

export type RootStackParamList = {
  UserAuth: undefined;
  Dashboard: undefined;
  CreateRainCheck: { rainCheck?: any } | undefined;
  ViewRainCheck: { rainCheck: any };
  CompletedRainChecks: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

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
            <Stack.Screen
              name="ViewRainCheck"
              component={ViewRainCheck}
              options={{ title: 'RainCheck Details' }}
            />
            <Stack.Screen
              name="CompletedRainChecks"
              component={CompletedRainChecks}
              options={{ title: 'Completed RainChecks' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
 
export default AppNavigator;