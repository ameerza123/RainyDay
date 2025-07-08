import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../services/firebase';

const Dashboard = () => {
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.log('Error signing out:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to RainyDay</Text>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Log Out</Text>
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
});

export default Dashboard;
