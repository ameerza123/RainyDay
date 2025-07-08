import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Switch,
  Image,
  ScrollView,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../services/AuthContext';
import { useNavigation } from '@react-navigation/native';

const CreateRainCheck = () => {
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [reminderType, setReminderType] = useState<'fixed' | 'random' | 'rain'>('rain');
  const [fixedDate, setFixedDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [emoji, setEmoji] = useState('');
  const [url, setUrl] = useState('');
  const [isPublic, setIsPublic] = useState(false);

  const { user } = useAuth();
  const navigation = useNavigation();

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.6,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const isSingleEmoji = (str: string) => {
    const emojiRegex =
      /^(?:\p{Emoji_Presentation}|\p{Emoji}\uFE0F)$/u;
    return emojiRegex.test(str);
  };

  const handleSave = async () => {
    if (!title.trim()) {
      alert('Title is required');
      return;
    }

    if (!emoji.trim() || !isSingleEmoji(emoji.trim())) {
      alert('Please enter a valid emoji.');
      return;
    }

    if (reminderType === 'fixed' && !fixedDate) {
      alert('Please select a reminder date.');
      return;
    }

    try {
      const docRef = await addDoc(collection(db, 'rainchecks'), {
        userId: user?.uid,
        title: title.trim(),
        notes: notes.trim() || '',
        reminderType,
        reminderValue:
          reminderType === 'fixed' ? fixedDate?.toISOString() : null,
        imageUri: imageUri || '',
        emoji: emoji || '',
        url: url.trim() || '',
        isPublic,
        createdAt: serverTimestamp(),
        completed: false,
      });

      console.log('✅ RainCheck saved with ID:', docRef.id);
      navigation.goBack();
    } catch (err) {
      console.error('Error saving RainCheck:', err);
      alert('Failed to save RainCheck. Please try again.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Create a RainCheck</Text>

      <TextInput
        style={styles.input}
        placeholder="What do you wanna do?"
        value={title}
        onChangeText={setTitle}
        maxLength={50}
      />
      <Text style={styles.charCount}>{title.length}/50</Text>

      <TextInput
        style={[styles.input, styles.textarea]}
        placeholder="Got any info to add?"
        value={notes}
        onChangeText={setNotes}
        multiline
        maxLength={280}
      />
      <Text style={styles.charCount}>{notes.length}/280</Text>

      <TextInput
        style={styles.input}
        placeholder="Pick a representative emoji (🍷, 💌, 🌮)"
        value={emoji}
        onChangeText={setEmoji}
        keyboardType="default"
        maxLength={2}
        autoCorrect={false}
        autoCapitalize="none"
      />

      <Text style={styles.label}>Reminder Type:</Text>
      <View style={styles.radioGroup}>
        {['rain', 'random', 'fixed'].map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.radioOption,
              reminderType === type && styles.radioSelected,
            ]}
            onPress={() => setReminderType(type as any)}
          >
            <Text>{type}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {reminderType === 'fixed' && (
        <>
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowDatePicker(true)}
          >
            <Text>
              {fixedDate
                ? fixedDate.toDateString()
                : 'When do you wanna be reminded?'}
            </Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={fixedDate || new Date()}
              mode="date"
              display={Platform.OS === 'ios' ? 'inline' : 'default'}
              minimumDate={new Date()}
              onChange={(_, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) setFixedDate(selectedDate);
              }}
            />
          )}
        </>
      )}

      <Text style={styles.label}>Got a pic? (optional):</Text>
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.image} />
      ) : (
        <TouchableOpacity style={styles.button} onPress={pickImage}>
          <Text>Select Image</Text>
        </TouchableOpacity>
      )}

      <TextInput
        style={styles.input}
        placeholder="Optional URL"
        value={url}
        onChangeText={setUrl}
        keyboardType="url"
        autoCapitalize="none"
      />

      <View style={styles.switchRow}>
        <Text>Public</Text>
        <Switch value={isPublic} onValueChange={setIsPublic} />
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save RainCheck</Text>
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
    marginBottom: 24,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 16,
    borderRadius: 8,
  },
  textarea: {
    height: 100,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 12,
    color: '#888',
    alignSelf: 'flex-end',
    marginTop: -12,
    marginBottom: 12,
  },
  label: {
    fontWeight: '600',
    marginBottom: 4,
  },
  radioGroup: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  radioOption: {
    borderWidth: 1,
    borderColor: '#aaa',
    padding: 8,
    borderRadius: 6,
    marginRight: 8,
  },
  radioSelected: {
    backgroundColor: '#ddd',
  },
  button: {
    backgroundColor: '#eee',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 12,
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 12,
    borderRadius: 8,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 16,
  },
  saveButton: {
    backgroundColor: 'orange',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default CreateRainCheck;
