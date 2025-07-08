// Initial page for user logging in or signing up

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const UserAuth = () => (
  <View style={styles.container}>
    <Text style={styles.text}>Login or Sign up!</Text>
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

export default UserAuth;
