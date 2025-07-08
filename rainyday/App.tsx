import { StyleSheet, Text, View } from 'react-native';
import Dashboard from './src/screens/Dashboard';
import UserAuth from './src/screens/UserAuth';

export default function App() {
  return (
    <UserAuth />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
