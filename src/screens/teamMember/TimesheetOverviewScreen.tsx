import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, DateData } from 'react-native-calendars';
import { FAB, Divider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TimesheetStackParamList } from '../../navigation/types';
import { format, startOfWeek, endOfWeek, isWithinInterval, addDays, isBefore } from 'date-fns';
import Ionicons from 'react-native-vector-icons/Ionicons';

type TimesheetNavigationProp = NativeStackNavigationProp<TimesheetStackParamList>;

// Define TimesheetEntry type to fix TypeScript errors
interface TimesheetEntry {
  clockIn: string;
  clockOut: string;
  hours: number;
  notes: string;
}

// Define Task type for due date alerts
interface Task {
  id: string;
  title: string;
  dueDate: string;
  category: string;
}

// Mock data with proper typing
const mockTimesheetData: Record<string, TimesheetEntry> = {
  '2025-04-15': { clockIn: '09:00', clockOut: '17:00', hours: 8, notes: 'Regular day' },
  '2025-04-16': { clockIn: '08:30', clockOut: '16:30', hours: 8, notes: 'Meeting with clients' },
  '2025-04-18': { clockIn: '09:15', clockOut: '18:15', hours: 9, notes: 'Overtime for project X' },
  '2025-04-19': { clockIn: '09:00', clockOut: '17:30', hours: 8.5, notes: 'Training session' },
};

// Mock data for tasks with due dates
const mockTasks: Task[] = [
  { 
    id: '1', 
    title: 'Fix Authentication Bug', 
    dueDate: format(addDays(new Date(), 1), 'yyyy-MM-dd'), 
    category: 'Urgent'
  },
  { 
    id: '2', 
    title: 'Submit Monthly Report', 
    dueDate: format(new Date(), 'yyyy-MM-dd'), 
    category: 'Documentation'
  },
  { 
    id: '3', 
    title: 'Update Dashboard UI', 
    dueDate: format(addDays(new Date(), 5), 'yyyy-MM-dd'), 
    category: 'Development'
  }
];

const TimesheetOverviewScreen = () => {
  const navigation = useNavigation<TimesheetNavigationProp>();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isFabOpen, setIsFabOpen] = useState(false);
  const [showDueDateAlert, setShowDueDateAlert] = useState(true);
  const [urgentTasks, setUrgentTasks] = useState<Task[]>([]);
  
  // Get tasks with due dates less than 1 day away
  useEffect(() => {
    const tasksWithNearDueDate = mockTasks.filter(task => {
      const dueDate = new Date(task.dueDate);
      const tomorrow = addDays(new Date(), 1);
      return isBefore(dueDate, tomorrow);
    });
    
    setUrgentTasks(tasksWithNearDueDate);
  }, []);
  
  // Calculate current week range
  const weekStart = startOfWeek(selectedDate);
  const weekEnd = endOfWeek(selectedDate);
  const weekRange = `${format(weekStart, 'MMM d')}–${format(weekEnd, 'MMM d')}`;
  
  // Calculate total hours for the current week
  const totalHoursThisWeek = Object.entries(mockTimesheetData)
    .filter(([dateString]) => {
      const entryDate = new Date(dateString);
      return isWithinInterval(entryDate, { start: weekStart, end: weekEnd });
    })
    .reduce((sum, [_, data]) => sum + data.hours, 0);
  
  // Mark days with timesheet entries
  const markedDates = Object.keys(mockTimesheetData).reduce((acc, date) => {
    acc[date] = { marked: true, dotColor: '#2089dc' };
    return acc;
  }, {} as Record<string, any>);
  
  // Handle date selection
  const handleDayPress = (day: DateData) => {
    const formattedDate = day.dateString;
    setSelectedDate(new Date(formattedDate));
  };
  
  const handleAddTimesheet = () => {
    navigation.navigate('TimesheetForm', { 
      date: format(selectedDate, 'yyyy-MM-dd') 
    });
    setIsFabOpen(false);
  };
  
  const handleViewDrafts = () => {
    navigation.navigate('TimesheetDrafts');
    setIsFabOpen(false);
  };

  const formattedDateString = format(selectedDate, 'yyyy-MM-dd');
  const selectedEntry = mockTimesheetData[formattedDateString];
  
  const navigateToTasks = () => {
    // Navigate to TaskScreen using the root navigation
    // @ts-ignore - Ignoring type error as we need to navigate outside the current stack
    navigation.navigate('Tasks');
    setShowDueDateAlert(false);
  };
  
  return (
    <SafeAreaView style={styles.container}>
      {showDueDateAlert && urgentTasks.length > 0 && (
        <View style={styles.alertContainer}>
          <TouchableOpacity 
            style={styles.alertContent}
            onPress={navigateToTasks}
          >
            <View style={styles.alertIconContainer}>
              <Ionicons name="alert-circle" size={24} color="#fff" />
            </View>
            <View style={styles.alertTextContainer}>
              <Text style={styles.alertTitle}>Due Soon: {urgentTasks.length} task{urgentTasks.length > 1 ? 's' : ''}</Text>
              <Text style={styles.alertDescription}>
                {urgentTasks[0].title}{urgentTasks.length > 1 ? ` and ${urgentTasks.length - 1} more` : ''}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.dismissButton}
            onPress={() => setShowDueDateAlert(false)}
          >
            <Ionicons name="close" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      )}
      
      <ScrollView style={styles.scrollView}>
        {/* Weekly Summary */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="calendar-outline" size={20} color="#2089dc" />
            <Text style={styles.sectionTitle}>Week of {weekRange}</Text>
          </View>
          <View style={styles.weekSummary}>
            <Text style={styles.weekSummaryLabel}>Total hours:</Text>
            <Text style={styles.weekSummaryValue}>{totalHoursThisWeek}</Text>
          </View>
        </View>
        
        <Divider style={styles.divider} />
        
        {/* Calendar Section */}
        <View style={styles.section}>
          <Calendar
            markedDates={{
              ...markedDates,
              [format(selectedDate, 'yyyy-MM-dd')]: {
                ...(markedDates[format(selectedDate, 'yyyy-MM-dd')] || {}),
                selected: true,
                selectedColor: '#2089dc',
              }
            }}
            onDayPress={handleDayPress}
            theme={{
              todayTextColor: '#2089dc',
              selectedDayBackgroundColor: '#2089dc',
              dotColor: '#2089dc',
              arrowColor: '#2089dc',
              textDayFontSize: 14,
              textMonthFontSize: 16,
              textDayHeaderFontSize: 14,
              calendarBackground: 'white',
            }}
          />
        </View>
        
        <Divider style={styles.divider} />
        
        {/* Selected Day Details */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="time-outline" size={20} color="#2089dc" />
            <Text style={styles.sectionTitle}>
              {format(selectedDate, 'EEEE, MMMM d, yyyy')}
            </Text>
          </View>
          
          {selectedEntry ? (
            <View style={styles.timeDetails}>
              <View style={styles.timeRow}>
                <View style={styles.timeItem}>
                  <Text style={styles.timeItemLabel}>Clock In</Text>
                  <Text style={styles.timeItemValue}>{selectedEntry.clockIn}</Text>
                </View>
                <View style={styles.timeItem}>
                  <Text style={styles.timeItemLabel}>Clock Out</Text>
                  <Text style={styles.timeItemValue}>{selectedEntry.clockOut}</Text>
                </View>
                <View style={styles.timeItem}>
                  <Text style={styles.timeItemLabel}>Hours</Text>
                  <Text style={styles.timeItemValue}>{selectedEntry.hours}</Text>
                </View>
              </View>
              
              <View style={styles.notesContainer}>
                <Text style={styles.notesLabel}>Notes:</Text>
                <Text style={styles.notesContent}>{selectedEntry.notes}</Text>
              </View>
            </View>
          ) : (
            <View style={styles.noEntryContainer}>
              <Text style={styles.noEntryText}>No timesheet entry for this date</Text>
              <TouchableOpacity 
                style={styles.addEntryButton}
                onPress={handleAddTimesheet}
              >
                <Text style={styles.addEntryButtonText}>Add Entry</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
      
      {/* Floating Action Buttons */}
      <FAB.Group
        open={isFabOpen}
        visible
        icon={isFabOpen ? 'close' : 'plus'}
        actions={[
          {
            icon: 'file-document-edit',
            label: 'Add New Form',
            onPress: handleAddTimesheet,
            color: '#2089dc',
          },
          {
            icon: 'file-document',
            label: 'Open Drafts',
            onPress: handleViewDrafts,
            color: '#2089dc',
          },
        ]}
        onStateChange={({ open }) => setIsFabOpen(open)}
        fabStyle={styles.fab}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  alertContainer: {
    backgroundColor: '#f44336',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  alertContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  alertIconContainer: {
    marginRight: 12,
  },
  alertTextContainer: {
    flex: 1,
  },
  alertTitle: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
  alertDescription: {
    color: '#fff',
    fontSize: 13,
    opacity: 0.9,
    marginTop: 2,
  },
  dismissButton: {
    padding: 4,
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#fff',
  },
  section: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
  divider: {
    height: 8,
    backgroundColor: '#f5f5f5',
  },
  weekSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  weekSummaryLabel: {
    fontSize: 16,
    color: '#555',
  },
  weekSummaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2089dc',
    marginLeft: 8,
  },
  timeDetails: {
    paddingTop: 8,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  timeItem: {
    alignItems: 'center',
    flex: 1,
  },
  timeItemLabel: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  timeItemValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  notesContainer: {
    marginTop: 8,
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
  },
  notesLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    color: '#555',
  },
  notesContent: {
    fontSize: 14,
    color: '#333',
  },
  noEntryContainer: {
    alignItems: 'center',
    padding: 24,
  },
  noEntryText: {
    fontSize: 16,
    color: '#888',
    marginBottom: 16,
  },
  addEntryButton: {
    backgroundColor: '#2089dc',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  addEntryButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  fab: {
    backgroundColor: '#2089dc',
  },
});

export default TimesheetOverviewScreen; 