import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TimesheetStackParamList } from '../../navigation/types';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Divider } from 'react-native-paper';
import { format } from 'date-fns';

type TimesheetNavigationProp = NativeStackNavigationProp<TimesheetStackParamList>;

// Mock data for demonstration
const mockDrafts = [
  { id: '1', date: '2025-04-15', startTime: '09:00', endTime: '17:00', task: 'Development' },
  { id: '2', date: '2025-04-16', startTime: '08:30', endTime: '16:30', task: 'Meeting' },
  { id: '3', date: '2025-04-18', startTime: '09:15', endTime: '18:15', task: 'Testing' },
];

const TimesheetDraftsScreen = () => {
  const navigation = useNavigation<TimesheetNavigationProp>();
  
  const handleEditDraft = (id: string) => {
    // In a real app, we would load the draft data and navigate to the form screen
    console.log('Editing draft:', id);
    navigation.navigate('TimesheetForm', { date: '2025-04-15' });
  };
  
  const renderItem = ({ item }: { item: typeof mockDrafts[0] }) => (
    <View>
      <TouchableOpacity 
        style={styles.draftItem}
        onPress={() => handleEditDraft(item.id)}
      >
        <View style={styles.draftInfo}>
          <View style={styles.draftHeader}>
            <Text style={styles.draftDate}>{item.date}</Text>
            <View style={styles.tagContainer}>
              <Text style={styles.tagText}>{item.task}</Text>
            </View>
          </View>
          
          <View style={styles.draftDetails}>
            <View style={styles.timeInfo}>
              <Ionicons name="time-outline" size={16} color="#777" />
              <Text style={styles.timeText}>{item.startTime} - {item.endTime}</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.actionButton}>
          <Ionicons name="chevron-forward" size={20} color="#2089dc" />
        </View>
      </TouchableOpacity>
      <Divider style={styles.itemDivider} />
    </View>
  );
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#2089dc" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Timesheet Drafts</Text>
      </View>
      
      {mockDrafts.length > 0 ? (
        <FlatList
          data={mockDrafts}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="document-outline" size={60} color="#e0e0e0" />
          <Text style={styles.emptyText}>No drafts available</Text>
          <TouchableOpacity 
            style={styles.createButton}
            onPress={() => navigation.navigate('TimesheetForm', { date: format(new Date(), 'yyyy-MM-dd') })}
          >
            <Text style={styles.createButtonText}>Create New Timesheet</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 16,
    color: '#333',
  },
  listContent: {
    paddingTop: 8,
  },
  draftItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  draftInfo: {
    flex: 1,
  },
  draftHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  draftDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  tagContainer: {
    backgroundColor: '#f0f7ff',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  tagText: {
    fontSize: 12,
    color: '#2089dc',
    fontWeight: '500',
  },
  draftDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 14,
    color: '#777',
    marginLeft: 6,
  },
  actionButton: {
    padding: 8,
  },
  itemDivider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginLeft: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 16,
    marginBottom: 24,
  },
  createButton: {
    backgroundColor: '#2089dc',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default TimesheetDraftsScreen; 