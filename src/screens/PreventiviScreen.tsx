import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  FlatList,
  RefreshControl,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { quotesAPI, Quote } from '../api/api';

interface PreventiviScreenProps {
  navigation: any;
}

export default function PreventiviScreen({ navigation }: PreventiviScreenProps) {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user, logout, token } = useAuth();

  useEffect(() => {
    loadQuotes();
  }, []);

  const loadQuotes = async () => {
    if (!token) return;
    
    try {
      const quotesData = await quotesAPI.getQuotes(token);
      setQuotes(quotesData);
    } catch (error: any) {
      Alert.alert('Errore', error.message || 'Errore nel caricamento dei preventivi');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadQuotes();
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Sei sicuro di voler uscire?',
      [
        {
          text: 'Annulla',
          style: 'cancel',
        },
        {
          text: 'Esci',
          onPress: logout,
        },
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'in attesa':
        return '#F59E0B';
      case 'approvato':
        return '#10B981';
      case 'rifiutato':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const formatCurrency = (amount: string) => {
    return `€${parseFloat(amount).toLocaleString('it-IT', { minimumFractionDigits: 2 })}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('it-IT');
  };

  const renderQuoteItem = ({ item }: { item: Quote }) => (
    <View style={styles.quoteCard}>
      <View style={styles.quoteHeader}>
        <Text style={styles.quoteName}>{item.nome} {item.cognome}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.stato) }]}>
          <Text style={styles.statusText}>{item.stato}</Text>
        </View>
      </View>
      
      <View style={styles.quoteInfo}>
        <Text style={styles.quoteLabel}>Importo richiesto:</Text>
        <Text style={styles.quoteValue}>{formatCurrency(item.importo_richiesto)}</Text>
      </View>
      
      <View style={styles.quoteInfo}>
        <Text style={styles.quoteLabel}>Rata mensile:</Text>
        <Text style={styles.quoteValue}>{formatCurrency(item.rata_mensile)}</Text>
      </View>
      
      <View style={styles.quoteInfo}>
        <Text style={styles.quoteLabel}>Numero rate:</Text>
        <Text style={styles.quoteValue}>{item.numero_rate}</Text>
      </View>
      
      <View style={styles.quoteInfo}>
        <Text style={styles.quoteLabel}>Data creazione:</Text>
        <Text style={styles.quoteValue}>{formatDate(item.created_at)}</Text>
      </View>
      
      <View style={styles.quoteActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="eye" size={20} color="#4F46E5" />
          <Text style={styles.actionButtonText}>Visualizza</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="trash" size={20} color="#EF4444" />
          <Text style={[styles.actionButtonText, { color: '#EF4444' }]}>Elimina</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="document-text-outline" size={64} color="#9CA3AF" />
      <Text style={styles.emptyStateText}>Nessun preventivo trovato</Text>
      <Text style={styles.emptyStateSubtext}>
        I tuoi preventivi appariranno qui una volta creati
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#8B5CF6" />
      
      <LinearGradient
        colors={['#8B5CF6', '#A855F7', '#C084FC']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerTitle}>Preventivi</Text>
            <Text style={styles.headerSubtitle}>
              Ciao {user?.nome} {user?.cognome}
            </Text>
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Ionicons name="log-out-outline" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#8B5CF6" />
            <Text style={styles.loadingText}>Caricamento preventivi...</Text>
          </View>
        ) : (
          <FlatList
            data={quotes}
            renderItem={renderQuoteItem}
            keyExtractor={(item) => item.id.toString()}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            contentContainerStyle={styles.listContainer}
            ListEmptyComponent={renderEmptyState}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => navigation.navigate('Speech')}
      >
        <Ionicons name="mic" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  logoutButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
  },
  listContainer: {
    flexGrow: 1,
    padding: 20,
  },
  quoteCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  quoteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  quoteName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  quoteInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  quoteLabel: {
    fontSize: 14,
    color: '#6B7280',
    flex: 1,
  },
  quoteValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  quoteActions: {
    flexDirection: 'row',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  actionButtonText: {
    fontSize: 14,
    color: '#4F46E5',
    marginLeft: 4,
    fontWeight: '500',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 16,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 8,
    textAlign: 'center',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#8B5CF6',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
});