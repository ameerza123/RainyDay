import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../services/AppNavigator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

const ViewRainCheck = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'ViewRainCheck'>>();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const { rainCheck } = route.params;

  const handleEdit = () => {
    navigation.navigate('CreateRainCheck', { rainCheck });
  };

  const handleDelete = async () => {
    Alert.alert(
      'Delete RainCheck',
      'Are you sure you want to delete this RainCheck?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'rainchecks', rainCheck.id));
              navigation.goBack();
            } catch (error) {
              console.error('Error deleting RainCheck:', error);
              Alert.alert('Failed to delete. Please try again.');
            }
          },
        },
      ]
    );
  };

  const handleComplete = async () => {
    Alert.alert(
      'Complete RainCheck',
      'Mark this RainCheck as completed?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Complete',
          style: 'default',
          onPress: async () => {
            try {
              const ref = doc(db, 'rainchecks', rainCheck.id);
              await updateDoc(ref, {
                completed: true,
                completedAt: new Date().toISOString(),
              });
              navigation.goBack(); // Remove it from Dashboard
            } catch (error) {
              console.error('Error marking complete:', error);
              Alert.alert('Failed to complete. Please try again.');
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{rainCheck.title}</Text>
      <Text style={styles.emoji}>{rainCheck.emoji || '😊'}</Text>

      <Text style={styles.label}>Description:</Text>
      <Text style={styles.text}>{rainCheck.notes || 'No description.'}</Text>

      <Text style={styles.label}>Reminder Type:</Text>
      <Text style={styles.text}>{rainCheck.reminderType}</Text>

      {rainCheck.reminderValue && (
        <>
          <Text style={styles.label}>Reminder Time:</Text>
          <Text style={styles.text}>
            {new Date(rainCheck.reminderValue).toLocaleString()}
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

      <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
        <Text style={styles.deleteButtonText}>Delete RainCheck</Text>
      </TouchableOpacity>

      {!rainCheck.completed && (
        <TouchableOpacity style={styles.completeButton} onPress={handleComplete}>
          <Text style={styles.completeButtonText}>Mark as Completed</Text>
        </TouchableOpacity>
      )}
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
  deleteButton: {
    backgroundColor: '#cc0000',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  completeButton: {
    backgroundColor: '#228B22',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  completeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ViewRainCheck;
