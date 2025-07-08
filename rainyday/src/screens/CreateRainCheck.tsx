import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const CreateRainCheck = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Create a RainCheck</Text>
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

export default CreateRainCheck;
