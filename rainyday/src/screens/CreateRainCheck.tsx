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
import {
  addDoc,
  collection,
  doc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../services/AuthContext';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../services/types';

const CreateRainCheck = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'CreateRainCheck'>>();
  const existing = route.params?.rainCheck;

  const [title, setTitle] = useState(existing?.title || '');
  const [notes, setNotes] = useState(existing?.notes || '');
  const [reminderType, setReminderType] = useState<'fixed' | 'random' | 'rain'>(
    existing?.reminderType || 'rain'
  );
  const [fixedDate, setFixedDate] = useState<Date | null>(
    existing?.reminderType === 'fixed' && existing.reminderValue
      ? new Date(existing.reminderValue)
      : null
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(existing?.imageUri || null);
  const [emoji, setEmoji] = useState(existing?.emoji || '');
  const [url, setUrl] = useState(existing?.url || '');
  const [isPublic, setIsPublic] = useState(existing?.isPublic || false);

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
    const emojiRegex = /^(?:\p{Emoji_Presentation}|\p{Emoji}\uFE0F)$/u;
    return emojiRegex.test(str);
  };

  const handleSave = async () => {
    if (!title.trim()) {
      alert('Title is required');
      return;
    }

    if (title.trim().length > 50) {
      alert('Title must be 50 characters or less.');
      return;
    }

    if (notes.trim().length > 280) {
      alert('Description must be 280 characters or less.');
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

    const rainCheckData = {
      userId: user?.uid,
      title: title.trim(),
      notes: notes.trim(),
      reminderType,
      reminderValue: reminderType === 'fixed' ? fixedDate?.toISOString() : null,
      imageUri: imageUri || '',
      emoji: emoji.trim(),
      url: url.trim(),
      isPublic,
      completed: existing?.completed || false,
    };

    try {
      if (existing?.id) {
        const ref = doc(db, 'rainchecks', existing.id);
        await updateDoc(ref, rainCheckData);
        console.log('✅ RainCheck updated:', existing.id);
      } else {
        const ref = await addDoc(collection(db, 'rainchecks'), {
          ...rainCheckData,
          createdAt: serverTimestamp(),
        });
        console.log('✅ RainCheck created:', ref.id);
      }

      navigation.goBack();
    } catch (err) {
      console.error('Error saving RainCheck:', err);
      alert('Failed to save RainCheck. Please try again.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>
        {existing ? 'Edit RainCheck' : 'Create a RainCheck'}
      </Text>

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
          {/* Date Picker Trigger */}
          <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
            <Text>
              {fixedDate ? fixedDate.toDateString() : 'Select a date to be reminded.'}
            </Text>
          </TouchableOpacity>

          {/* Date Picker */}
          {showDatePicker && (
            <DateTimePicker
              value={fixedDate || new Date()}
              mode="date"
              display={Platform.OS === 'ios' ? 'inline' : 'default'}
              minimumDate={new Date()}
              onChange={(_, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) {
                  const current = fixedDate || new Date();
                  const newDate = new Date(
                    selectedDate.getFullYear(),
                    selectedDate.getMonth(),
                    selectedDate.getDate(),
                    current.getHours(),
                    current.getMinutes()
                  );
                  setFixedDate(newDate);
                }
              }}
            />
          )}

          {/* Time Picker Trigger */}
          <TouchableOpacity style={styles.input} onPress={() => setShowTimePicker(true)}>
            <Text>
              {fixedDate
                ? fixedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : 'Select time of day'}
            </Text>
          </TouchableOpacity>

          {/* Time Picker */}
          {showTimePicker && (
            <DateTimePicker
              value={fixedDate || new Date()}
              mode="time"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              is24Hour={false}
              onChange={(_, selectedTime) => {
                setShowTimePicker(false);
                if (selectedTime) {
                  const current = fixedDate || new Date();
                  const newDate = new Date(
                    current.getFullYear(),
                    current.getMonth(),
                    current.getDate(),
                    selectedTime.getHours(),
                    selectedTime.getMinutes()
                  );
                  setFixedDate(newDate);
                }
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
        <Text style={styles.saveButtonText}>
          {existing ? 'Update RainCheck' : 'Save RainCheck'}
        </Text>
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
