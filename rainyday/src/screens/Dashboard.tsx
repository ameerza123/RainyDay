// The main homescreen of the app

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Dashboard = () => (
  <View style={styles.container}>
    <Text style={styles.text}>Welcome to RainyDay</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default Dashboard;
