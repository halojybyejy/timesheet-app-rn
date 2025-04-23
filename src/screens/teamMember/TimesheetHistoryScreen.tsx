import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TimesheetStackParamList } from '../../navigation/types';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Divider } from 'react-native-paper';
import { format, parseISO, getWeek, getMonth } from 'date-fns';

type TimesheetHistoryScreenNavigationProp = NativeStackNavigationProp<
  TimesheetStackParamList,
  'TimesheetHistory'
>;

// Mock data for timesheet history
const mockHistoryData = [
  { 
    id: '1', 
    date: '2025-05-12', 
    startTime: '09:00', 
    endTime: '17:30', 
    hours: 8.5, 
    task: 'Development',
    notes: 'Frontend implementation for dashboard components'
  },
  { 
    id: '2', 
    date: '2025-05-11', 
    startTime: '08:45', 
    endTime: '16:45', 
    hours: 8, 
    task: 'Meeting',
    notes: 'Sprint planning and task allocation'
  },
  { 
    id: '3', 
    date: '2025-05-10', 
    startTime: '09:15', 
    endTime: '18:00', 
    hours: 8.75, 
    task: 'Testing',
    notes: 'System testing for new features'
  },
  { 
    id: '4', 
    date: '2025-05-09', 
    startTime: '09:00', 
    endTime: '17:00', 
    hours: 8, 
    task: 'Documentation',
    notes: 'API documentation update'
  },
  { 
    id: '5', 
    date: '2025-05-08', 
    startTime: '08:30', 
    endTime: '16:30', 
    hours: 8, 
    task: 'Development',
    notes: 'Bug fixes and performance improvements'
  },
  { 
    id: '6', 
    date: '2025-05-05', 
    startTime: '09:00', 
    endTime: '17:30', 
    hours: 8.5, 
    task: 'Design',
    notes: 'UI/UX improvements for mobile screens'
  },
  { 
    id: '7', 
    date: '2025-05-04', 
    startTime: '09:30', 
    endTime: '18:30', 
    hours: 9, 
    task: 'Development',
    notes: 'Integration with backend APIs'
  },
  { 
    id: '8', 
    date: '2025-05-03', 
    startTime: '09:00', 
    endTime: '17:00', 
    hours: 8, 
    task: 'Meeting',
    notes: 'Client demo and feedback collection'
  },
];

type FilterOption = 'all' | 'week' | 'month';

const TimesheetHistoryScreen = () => {
  const navigation = useNavigation<TimesheetHistoryScreenNavigationProp>();
  const [activeFilter, setActiveFilter] = useState<FilterOption>('all');
  
  // Function to filter entries based on selected filter
  const getFilteredEntries = () => {
    const currentDate = new Date();
    const currentWeek = getWeek(currentDate);
    const currentMonth = getMonth(currentDate);
    
    switch (activeFilter) {
      case 'week':
        return mockHistoryData.filter(entry => {
          const entryDate = parseISO(entry.date);
          return getWeek(entryDate) === currentWeek;
        });
      case 'month':
        return mockHistoryData.filter(entry => {
          const entryDate = parseISO(entry.date);
          return getMonth(entryDate) === currentMonth;
        });
      default:
        return mockHistoryData;
    }
  };
  
  // Calculate total hours
  const totalHours = getFilteredEntries().reduce((sum, entry) => sum + entry.hours, 0);
  
  const renderItem = ({ item }: { item: typeof mockHistoryData[0] }) => (
    <View>
      <View style={styles.entryItem}>
        <View style={styles.entryInfo}>
          <View style={styles.entryHeader}>
            <Text style={styles.entryDate}>{format(parseISO(item.date), 'EEE, MMM d')}</Text>
            <View style={styles.tagContainer}>
              <Text style={styles.tagText}>{item.task}</Text>
            </View>
          </View>
          
          <View style={styles.entryDetails}>
            <View style={styles.timeInfo}>
              <Ionicons name="time-outline" size={16} color="#777" />
              <Text style={styles.timeText}>{item.startTime} - {item.endTime}</Text>
            </View>
            <View style={styles.hoursInfo}>
              <Ionicons name="hourglass-outline" size={16} color="#2089dc" />
              <Text style={styles.hoursText}>{item.hours} hrs</Text>
            </View>
          </View>
          
          {item.notes && (
            <Text style={styles.notesText}>
              {item.notes}
            </Text>
          )}
        </View>
      </View>
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
        <Text style={styles.headerTitle}>Timesheet History</Text>
        <View style={{ width: 24 }} />
      </View>
      
      <View style={styles.filterContainer}>
        <TouchableOpacity 
          style={[styles.filterOption, activeFilter === 'all' && styles.activeFilter]}
          onPress={() => setActiveFilter('all')}
        >
          <Text style={[styles.filterText, activeFilter === 'all' && styles.activeFilterText]}>
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.filterOption, activeFilter === 'week' && styles.activeFilter]}
          onPress={() => setActiveFilter('week')}
        >
          <Text style={[styles.filterText, activeFilter === 'week' && styles.activeFilterText]}>
            This Week
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.filterOption, activeFilter === 'month' && styles.activeFilter]}
          onPress={() => setActiveFilter('month')}
        >
          <Text style={[styles.filterText, activeFilter === 'month' && styles.activeFilterText]}>
            This Month
          </Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryLabel}>Total Hours:</Text>
        <Text style={styles.summaryValue}>{totalHours.toFixed(2)}</Text>
      </View>
      
      <FlatList
        data={getFilteredEntries()}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="calendar-outline" size={60} color="#e0e0e0" />
            <Text style={styles.emptyText}>No timesheet entries found</Text>
          </View>
        }
      />
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
    justifyContent: 'space-between',
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
    color: '#333',
  },
  filterContainer: {
    flexDirection: 'row',
    padding: 16,
    paddingBottom: 8,
  },
  filterOption: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginRight: 8,
    backgroundColor: '#f5f5f5',
  },
  activeFilter: {
    backgroundColor: '#e6f2ff',
  },
  filterText: {
    fontSize: 14,
    color: '#666',
  },
  activeFilterText: {
    color: '#2089dc',
    fontWeight: '500',
  },
  summaryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  summaryLabel: {
    fontSize: 15,
    color: '#555',
    marginRight: 8,
  },
  summaryValue: {
    fontSize: 17,
    fontWeight: '600',
    color: '#2089dc',
  },
  listContent: {
    paddingTop: 8,
  },
  entryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  entryInfo: {
    flex: 1,
  },
  entryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  entryDate: {
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
  entryDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  timeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  timeText: {
    fontSize: 14,
    color: '#777',
    marginLeft: 6,
  },
  hoursInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hoursText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2089dc',
    marginLeft: 6,
  },
  notesText: {
    fontSize: 13,
    color: '#666',
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
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 16,
  },
});

export default TimesheetHistoryScreen;