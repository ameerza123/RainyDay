import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../services/AuthContext';
import { RootStackParamList } from '../services/AppNavigator';

const CompletedRainChecks = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { user } = useAuth();
  const [completedChecks, setCompletedChecks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCompleted = async () => {
    try {
      setLoading(true);
      const q = query(
        collection(db, 'rainchecks'),
        where('userId', '==', user?.uid),
        where('completed', '==', true)
      );
      const snapshot = await getDocs(q);
      const results = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCompletedChecks(results);
    } catch (error) {
      console.error('Error fetching completed RainChecks:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchCompleted();
    }, [user])
  );

  const quotes = [
    "Look at what you've accomplished.",
    "Progress never looked so good.",
    "Well done — you made it happen.",
    "These RainChecks met their moment.",
    "One check at a time, you're doing great.",
  ];

  const quote = quotes[Math.floor(Math.random() * quotes.length)];

  return (
    <View style={styles.container}>
      <Text style={styles.quote}>{quote}</Text>

      <Text style={styles.subtitle}>
        {loading
          ? 'Loading...'
          : completedChecks.length > 0
          ? `You've completed ${completedChecks.length} RainCheck${completedChecks.length > 1 ? 's' : ''}.`
          : 'No completed RainChecks yet, why not go create one?'}
      </Text>

      <ScrollView contentContainerStyle={styles.scrollArea}>
        {completedChecks.map((rc) => (
          <TouchableOpacity
            key={rc.id}
            style={styles.card}
            onPress={() => navigation.navigate('ViewRainCheck', { rainCheck: rc })}
          >
            <Text style={styles.cardText}>
              {rc.title} {rc.emoji || '✅'}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 48,
    paddingHorizontal: 24,
  },
  quote: {
    fontSize: 18,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 16,
    color: '#444',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  scrollArea: {
    paddingBottom: 100,
  },
  card: {
    backgroundColor: '#999',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
  },
  cardText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
  },
  backButton: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#ddd',
    borderRadius: 6,
  },
  backText: {
    color: '#333',
    fontSize: 14,
  },
});

export default CompletedRainChecks;