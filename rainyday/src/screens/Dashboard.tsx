import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../services/firebase';
import { useNavigation } from '@react-navigation/native';

const Dashboard = () => {
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.log('Error signing out:', error);
    }
  };

  const goToCreateRainCheck = () => {
    navigation.navigate('CreateRainCheck' as never);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to RainyDay</Text>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.createButton} onPress={goToCreateRainCheck}>
        <Text style={styles.createText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  logoutButton: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#ddd',
    borderRadius: 6,
  },
  logoutText: {
    color: '#333',
    fontSize: 14,
  },
  createButton: {
    position: 'absolute',
    bottom: 24,
    alignSelf: 'center',
    backgroundColor: 'orange',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  createText: {
    color: 'white',
    fontSize: 32,
    lineHeight: 36,
  },
});

export default Dashboard;
