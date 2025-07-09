import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../services/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const ViewRainCheck = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'ViewRainCheck'>>();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const { rainCheck } = route.params;

  const handleEdit = () => {
    navigation.navigate('CreateRainCheck', { rainCheck });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{rainCheck.title}</Text>
      <Text style={styles.emoji}>{rainCheck.emoji || '😊'}</Text>

      <Text style={styles.label}>Description:</Text>
      <Text style={styles.text}>{rainCheck.notes || 'No description.'}</Text>

      <Text style={styles.label}>Reminder Type:</Text>
      <Text style={styles.text}>{rainCheck.reminderType}</Text>

      {rainCheck.reminderType === 'fixed' && rainCheck.reminderValue && (
        <>
          <Text style={styles.label}>Reminder Date:</Text>
          <Text style={styles.text}>
            {new Date(rainCheck.reminderValue).toDateString()}
          </Text>
        </>
      )}

      {rainCheck.url ? (
        <>
          <Text style={styles.label}>URL:</Text>
          <Text style={styles.text}>{rainCheck.url}</Text>
        </>
      ) : null}

      <Text style={styles.label}>Visibility:</Text>
      <Text style={styles.text}>{rainCheck.isPublic ? 'Public' : 'Private'}</Text>

      {rainCheck.imageUri ? (
        <>
          <Text style={styles.label}>Image:</Text>
          <Image source={{ uri: rainCheck.imageUri }} style={styles.image} />
        </>
      ) : null}

      <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
        <Text style={styles.editButtonText}>Edit RainCheck</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  label: {
    fontWeight: '600',
    marginTop: 12,
  },
  text: {
    fontSize: 16,
    color: '#444',
  },
  image: {
    width: '100%',
    height: 200,
    marginTop: 12,
    borderRadius: 8,
  },
  editButton: {
    backgroundColor: 'orange',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  editButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ViewRainCheck;
