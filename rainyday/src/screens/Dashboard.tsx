import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { signOut } from 'firebase/auth';
import { auth, db } from '../services/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../services/AuthContext';

const quotes = [
  "What are you waiting for?",
  "Life is too short to wait for the perfect moment.",
  "Is there ever gonna be a better time?"
];

const Dashboard = () => {
  const { user } = useAuth();
  const navigation = useNavigation();

  const [rainChecks, setRainChecks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [quote, setQuote] = useState('');

  useEffect(() => {
    // Set a random quote on mount
    const random = quotes[Math.floor(Math.random() * quotes.length)];
    setQuote(random);
  }, []);

  useEffect(() => {
    const fetchRainChecks = async () => {
      try {
        const q = query(
          collection(db, 'rainchecks'),
          where('userId', '==', user?.uid),
          where('completed', '==', false)
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRainChecks(data);
      } catch (err) {
        console.error('Error fetching RainChecks:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchRainChecks();
  }, [user]);

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

  const renderRainCheck = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <Text style={styles.cardText}>
        {item.title} {item.emoji || '🙂'}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.quote}>{quote}</Text>

      {loading ? (
        <ActivityIndicator size="large" color="orange" style={{ marginTop: 20 }} />
      ) : rainChecks.length === 0 ? (
        <Text style={styles.message}>Tap the + button below to create a RainCheck!</Text>
      ) : (
        <Text style={styles.message}>You have {rainChecks.length} pending RainChecks</Text>
      )}

      <FlatList
        data={rainChecks}
        keyExtractor={(item) => item.id}
        renderItem={renderRainCheck}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

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
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  quote: {
    fontSize: 18,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 12,
    color: '#333',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
  },
  listContainer: {
    paddingBottom: 120,
  },
  card: {
    backgroundColor: 'orange',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
  },
  cardText: {
    fontSize: 18,
    color: 'white',
    fontWeight: '600',
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
    bottom: 32, // lifted a little
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
