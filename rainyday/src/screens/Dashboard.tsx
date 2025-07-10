import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { signOut } from 'firebase/auth';
import { auth, db } from '../services/firebase';
import { useAuth } from '../services/AuthContext';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../services/AppNavigator';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Dashboard = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { user } = useAuth();

  const [rainChecks, setRainChecks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  const fetchRainChecks = async () => {
    try {
      setLoading(true);
      const q = query(
        collection(db, 'rainchecks'),
        where('userId', '==', user?.uid),
        where('completed', '==', false)
      );
      const snapshot = await getDocs(q);
      const results = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRainChecks(results);
    } catch (error) {
      console.error('Error fetching RainChecks:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchRainChecks();
    }, [user])
  );

  const motivationalQuotes = [
    "Life is too short to wait for the perfect moment.",
    "What are you waiting for?",
    "Go for it. RainCheck later.",
    "Is there ever gonna be a better time?",
    "If not now, then when?"
  ];

  const quote =
    motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];

  return (
    <View style={styles.container}>
      <Text style={styles.quote}>{quote}</Text>

      <Text style={styles.subtitle}>
        {loading
          ? 'Loading...'
          : rainChecks.length > 0
          ? `You have ${rainChecks.length} pending RainCheck${
              rainChecks.length > 1 ? 's' : ''
            }.`
          : 'Tap the + button below to create a RainCheck!'}
      </Text>

      <ScrollView contentContainerStyle={styles.scrollArea}>
        {rainChecks.map((rc) => (
          <TouchableOpacity
            key={rc.id}
            style={styles.card}
            onPress={() => navigation.navigate('ViewRainCheck', { rainCheck: rc })}
          >
            <Text style={styles.cardText}>
              {rc.title} {rc.emoji || '😊'}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.createButton} onPress={goToCreateRainCheck}>
        <Text style={styles.createText}>+</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.completedButton}
        onPress={() => navigation.navigate('CompletedRainChecks')}
        accessibilityLabel="View Completed RainChecks"
      >
        <Icon name="clipboard-check-outline" size={28} color="white" />
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
    backgroundColor: 'orange',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
  },
  cardText: {
    fontSize: 18,
    color: '#fff',
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
    bottom: 32,
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
  completedButton: {
    position: 'absolute',
    bottom: 40,
    right: 40,
    backgroundColor: 'darkorange',
    width: 44,
    height: 44,
    borderRadius: 22,
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
