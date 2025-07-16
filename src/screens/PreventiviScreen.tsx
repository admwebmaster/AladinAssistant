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
  Modal,
} from 'react-native';
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
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
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

  const handleViewQuote = (quote: Quote) => {
    setSelectedQuote(quote);
    setShowDetailModal(true);
  };

  const handleDeleteQuote = (quoteId: number) => {
    Alert.alert(
      'Elimina Preventivo',
      'Sei sicuro di voler eliminare questo preventivo?',
      [
        {
          text: 'Annulla',
          style: 'cancel',
        },
        {
          text: 'Elimina',
          style: 'destructive',
          onPress: () => {
            setQuotes(quotes.filter(q => q.id !== quoteId));
          },
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

  const getStatusBgColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'in attesa':
        return '#FEF3C7';
      case 'approvato':
        return '#D1FAE5';
      case 'rifiutato':
        return '#FEE2E2';
      default:
        return '#F3F4F6';
    }
  };

  const renderQuoteItem = ({ item }: { item: Quote }) => (
    <View style={styles.quoteCard}>
      <View style={styles.quoteHeader}>
        <Text style={styles.quoteName}>{item.nome} {item.cognome}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusBgColor(item.stato) }]}>
          <Text style={[styles.statusText, { color: getStatusColor(item.stato) }]}>
            {item.stato}
          </Text>
        </View>
      </View>
      
      <Text style={styles.quoteDate}>Richiesta: {new Date(item.created_at).toLocaleDateString('it-IT')}</Text>
      
      <View style={styles.quoteDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Importo:</Text>
          <Text style={styles.detailValue}>{item.importo_richiesto}€</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Rate:</Text>
          <Text style={styles.detailValue}>{item.numero_rate} mesi</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Rata mensile:</Text>
          <Text style={styles.detailValue}>{item.rata_mensile}€</Text>
        </View>
      </View>
      
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.viewButton}
          onPress={() => handleViewQuote(item)}
        >
          <Ionicons name="eye" size={20} color="#6B5CE7" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteQuote(item.id)}
        >
          <Ionicons name="trash" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6B5CE7" />
        <Text style={styles.loadingText}>Caricamento preventivi...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <Ionicons name="document-text" size={28} color="#6B5CE7" />
            <Text style={styles.headerTitle}>Richieste Prestiti</Text>
          </View>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('Speech')}
          >
            <Ionicons name="add" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={quotes}
        renderItem={renderQuoteItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#6B5CE7']}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="document-outline" size={64} color="#D1D5DB" />
            <Text style={styles.emptyText}>Nessun preventivo trovato</Text>
            <Text style={styles.emptySubtext}>Inizia creando la tua prima richiesta</Text>
          </View>
        }
      />

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => {}}>
          <Ionicons name="chatbubble-outline" size={24} color="#9CA3AF" />
          <Text style={styles.navText}>Chat</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItemActive} onPress={() => {}}>
          <Ionicons name="document-text" size={24} color="#6B5CE7" />
          <Text style={styles.navTextActive}>Prestiti</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={showDetailModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowDetailModal(false)}>
              <Ionicons name="arrow-back" size={24} color="#6B5CE7" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Dettaglio Prestito</Text>
            <View style={{ width: 24 }} />
          </View>
          
          {selectedQuote && (
            <View style={styles.modalContent}>
              <Text style={styles.modalName}>{selectedQuote.nome} {selectedQuote.cognome}</Text>
              <Text style={styles.modalDate}>
                Richiesta: {new Date(selectedQuote.created_at).toLocaleDateString('it-IT')}
              </Text>
              <View style={[styles.statusBadge, { backgroundColor: getStatusBgColor(selectedQuote.stato), alignSelf: 'flex-start', marginBottom: 24 }]}>
                <Text style={[styles.statusText, { color: getStatusColor(selectedQuote.stato) }]}>
                  {selectedQuote.stato}
                </Text>
              </View>
              
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Dettagli Prestito</Text>
                <View style={styles.modalDetailRow}>
                  <Text style={styles.modalDetailLabel}>Importo richiesto:</Text>
                  <Text style={styles.modalDetailValue}>{selectedQuote.importo_richiesto}€</Text>
                </View>
                <View style={styles.modalDetailRow}>
                  <Text style={styles.modalDetailLabel}>Numero rate:</Text>
                  <Text style={styles.modalDetailValue}>{selectedQuote.numero_rate} mesi</Text>
                </View>
                <View style={styles.modalDetailRow}>
                  <Text style={styles.modalDetailLabel}>Rata mensile:</Text>
                  <Text style={styles.modalDetailValue}>{selectedQuote.rata_mensile}€</Text>
                </View>
                <View style={styles.modalDetailRow}>
                  <Text style={styles.modalDetailLabel}>Finalità:</Text>
                  <Text style={styles.modalDetailValue}>{selectedQuote.finalita || 'Non specificata'}</Text>
                </View>
              </View>
              
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Dati Personali</Text>
                <View style={styles.modalDetailRow}>
                  <Text style={styles.modalDetailLabel}>Data di nascita:</Text>
                  <Text style={styles.modalDetailValue}>{selectedQuote.data_nascita || 'Non specificata'}</Text>
                </View>
                <View style={styles.modalDetailRow}>
                  <Text style={styles.modalDetailLabel}>Codice fiscale:</Text>
                  <Text style={styles.modalDetailValue}>{selectedQuote.codice_fiscale || 'Non specificato'}</Text>
                </View>
                <View style={styles.modalDetailRow}>
                  <Text style={styles.modalDetailLabel}>Indirizzo:</Text>
                  <Text style={styles.modalDetailValue}>{selectedQuote.indirizzo || 'Non specificato'}</Text>
                </View>
                <View style={styles.modalDetailRow}>
                  <Text style={styles.modalDetailLabel}>Telefono:</Text>
                  <Text style={styles.modalDetailValue}>{selectedQuote.numero_telefono || 'Non specificato'}</Text>
                </View>
                <View style={styles.modalDetailRow}>
                  <Text style={styles.modalDetailLabel}>Email:</Text>
                  <Text style={styles.modalDetailValue}>{selectedQuote.email || 'Non specificata'}</Text>
                </View>
                <View style={styles.modalDetailRow}>
                  <Text style={styles.modalDetailLabel}>Occupazione:</Text>
                  <Text style={styles.modalDetailValue}>{selectedQuote.occupazione || 'Non specificata'}</Text>
                </View>
                <View style={styles.modalDetailRow}>
                  <Text style={styles.modalDetailLabel}>Reddito mensile:</Text>
                  <Text style={styles.modalDetailValue}>{selectedQuote.reddito_mensile || 'Non specificato'}</Text>
                </View>
              </View>
              
              <View style={styles.modalActions}>
                <TouchableOpacity style={styles.approveButton}>
                  <Text style={styles.approveButtonText}>Approva</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.rejectButton}>
                  <Text style={styles.rejectButtonText}>Rifiuta</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
  },
  header: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#B8B5FF',
    marginLeft: 12,
  },
  addButton: {
    backgroundColor: '#6B5CE7',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 16,
  },
  quoteCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quoteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  quoteName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  quoteDate: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  quoteDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  viewButton: {
    backgroundColor: '#F3F4F6',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#EF4444',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
  },
  navItemActive: {
    flex: 1,
    alignItems: 'center',
  },
  navText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
  },
  navTextActive: {
    fontSize: 12,
    color: '#6B5CE7',
    marginTop: 4,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 8,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#B8B5FF',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  modalName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  modalDate: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  modalSection: {
    marginBottom: 24,
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  modalDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  modalDetailLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  modalDetailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  approveButton: {
    flex: 1,
    backgroundColor: '#10B981',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  approveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  rejectButton: {
    flex: 1,
    backgroundColor: '#EF4444',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  rejectButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});