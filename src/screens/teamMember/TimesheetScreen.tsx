import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, ActivityIndicator, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { TimesheetStackParamList } from '../../navigation/types';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { format } from 'date-fns';
import { Divider } from 'react-native-paper';

interface TimeEntry {
  clockIn: Date;
  clockOut: Date | null;
  task: string;
  notes: string;
}
type Props = NativeStackScreenProps<TimesheetStackParamList, 'TimesheetMain'>;

const TimesheetScreen = ({ navigation }: Props) => {
  // Current status and times
  const [currentStatus, setCurrentStatus] = useState<'in' | 'out'>('out');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [clockInTime, setClockInTime] = useState<Date | null>(null);
  const [clockOutTime, setClockOutTime] = useState<Date | null>(null);
  const [totalHours, setTotalHours] = useState<string | null>(null);
  
  // Form fields
  const [selectedTask, setSelectedTask] = useState('Development');
  const [notes, setNotes] = useState('');
  
  // Today's timesheet entries
  const [todaysEntries, setTodaysEntries] = useState<TimeEntry[]>([]);

  // Tasks
  const tasks = ['Development', 'Meeting', 'Documentation', 'Testing', 'Other'];

  // Update current time every second
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  // Calculate total hours when clock out happens
  useEffect(() => {
    if (clockInTime && clockOutTime) {
      const diffMs = clockOutTime.getTime() - clockInTime.getTime();
      const diffHrs = diffMs / (1000 * 60 * 60);
      setTotalHours(diffHrs.toFixed(2));
    }
  }, [clockInTime, clockOutTime]);

  const handleClockIn = () => {
    setIsProcessing(true);
    
    // Simulate API call
    setTimeout(() => {
      const now = new Date();
      setClockInTime(now);
      setCurrentStatus('in');
      setIsProcessing(false);
      
      // Add to entries
      setTodaysEntries([
        ...todaysEntries,
        {
          clockIn: now,
          clockOut: null,
          task: selectedTask,
          notes: notes
        }
      ]);
    }, 1000);
  };

  const handleClockOut = () => {
    setIsProcessing(true);
    
    // Simulate API call
    setTimeout(() => {
      const now = new Date();
      setClockOutTime(now);
      setCurrentStatus('out');
      setIsProcessing(false);
      
      // Update the last entry
      if (todaysEntries.length > 0) {
        const updatedEntries = [...todaysEntries];
        const lastEntryIndex = updatedEntries.length - 1;
        updatedEntries[lastEntryIndex] = {
          ...updatedEntries[lastEntryIndex],
          clockOut: now,
        };
        setTodaysEntries(updatedEntries);
      }
    }, 1000);
  };

  const formatTimeForDisplay = (date: Date | null): string => {
    if (!date) return '--:-- --';
    return format(date, 'h:mm a');
  };

  const formatDateForHeader = (date: Date): string => {
    return format(date, 'EEEE, MMMM d, yyyy');
  };
  
  const formatTimeForClock = (date: Date): string => {
    return format(date, 'HH:mm:ss');
  };

  const calculateDuration = (entry: TimeEntry): string => {
    if (!entry.clockOut) return 'In progress';
    
    const diffMs = entry.clockOut.getTime() - entry.clockIn.getTime();
    const diffHrs = diffMs / (1000 * 60 * 60);
    return `${diffHrs.toFixed(2)} hrs`;
  };

  const renderStatusMessage = () => {
    if (currentStatus === 'in' && clockInTime) {
      return `You are clocked in since ${formatTimeForDisplay(clockInTime)}`;
    }
    return 'You are not clocked in';
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.dateText}>{formatDateForHeader(currentTime)}</Text>
          <Text style={styles.clockText}>{formatTimeForClock(currentTime)}</Text>
        </View>
        <TouchableOpacity
          style={styles.historyButton}
          onPress={() => navigation.navigate('TimesheetHistory')}
        >
          <Ionicons name="calendar-outline" size={20} color="#2089dc" />
          <Text style={styles.historyButtonText}>History</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Status Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Ionicons name="time-outline" size={20} color="#2089dc" />
              <Text style={styles.sectionTitle}>Current Status</Text>
            </View>
            <View style={[
              styles.statusIndicator, 
              {backgroundColor: currentStatus === 'in' ? '#34C759' : '#FF3B30'}
            ]} />
          </View>
          
          <Text style={styles.statusMessage}>{renderStatusMessage()}</Text>
          
          <View style={styles.timeRow}>
            <View style={styles.timeItem}>
              <Text style={styles.timeLabel}>Clock In</Text>
              <Text style={styles.timeValue}>
                {formatTimeForDisplay(clockInTime)}
              </Text>
            </View>
            <View style={styles.timeItem}>
              <Text style={styles.timeLabel}>Clock Out</Text>
              <Text style={styles.timeValue}>
                {formatTimeForDisplay(clockOutTime)}
              </Text>
            </View>
            <View style={styles.timeItem}>
              <Text style={styles.timeLabel}>Total Hours</Text>
              <Text style={styles.timeValue}>
                {totalHours ? `${totalHours} hrs` : '--:--'}
              </Text>
            </View>
          </View>
        </View>

        {/* Clock In/Out Button */}
        <TouchableOpacity 
          style={[
            styles.clockButton,
            currentStatus === 'in' ? styles.clockOutButton : styles.clockInButton,
            isProcessing && styles.disabledButton
          ]}
          onPress={currentStatus === 'in' ? handleClockOut : handleClockIn}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Ionicons 
                name={currentStatus === 'in' ? 'exit-outline' : 'enter-outline'} 
                size={24} 
                color="#FFFFFF" 
              />
              <Text style={styles.clockButtonText}>
                {currentStatus === 'in' ? 'Clock Out' : 'Clock In'}
              </Text>
            </>
          )}
        </TouchableOpacity>

        {currentStatus === 'out' && (
          <>
            <Divider style={styles.divider} />
            
            {/* Task Selection Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="briefcase-outline" size={20} color="#2089dc" />
                <Text style={styles.sectionTitle}>Select Task</Text>
              </View>
              
              <View style={styles.taskContainer}>
                {tasks.map((task) => (
                  <TouchableOpacity
                    key={task}
                    style={[
                      styles.taskOption,
                      selectedTask === task && styles.taskOptionSelected
                    ]}
                    onPress={() => setSelectedTask(task)}
                  >
                    <Text 
                      style={[
                        styles.taskOptionText,
                        selectedTask === task && styles.taskOptionTextSelected
                      ]}
                    >
                      {task}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              
              <View style={styles.notesContainer}>
                <Text style={styles.notesLabel}>Notes</Text>
                <TextInput
                  style={styles.notesInput}
                  placeholder="What are you working on? (optional)"
                  value={notes}
                  onChangeText={setNotes}
                  multiline
                  placeholderTextColor="#999"
                />
              </View>
            </View>
          </>
        )}

        {/* Today's Entries */}
        {todaysEntries.length > 0 && (
          <>
            <Divider style={styles.divider} />
            
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="list-outline" size={20} color="#2089dc" />
                <Text style={styles.sectionTitle}>Today's Entries</Text>
              </View>
              
              {todaysEntries.map((entry, index) => (
                <View key={index} style={styles.entryItem}>
                  <View style={styles.entryHeader}>
                    <View style={styles.entryTask}>
                      <View style={styles.taskTag}>
                        <Ionicons 
                          name={
                            entry.task === 'Meeting' ? 'people-outline' :
                            entry.task === 'Documentation' ? 'document-text-outline' :
                            entry.task === 'Testing' ? 'bug-outline' :
                            'code-slash-outline' // Default for Development
                          } 
                          size={14} 
                          color="#2089dc" 
                        />
                        <Text style={styles.taskTagText}>{entry.task}</Text>
                      </View>
                      <Text style={styles.entryDuration}>{calculateDuration(entry)}</Text>
                    </View>
                    
                    <TouchableOpacity style={styles.editButton}>
                      <Ionicons name="pencil-outline" size={16} color="#8E8E93" />
                    </TouchableOpacity>
                  </View>
                  
                  <View style={styles.entryDetails}>
                    <View style={styles.entryTimeBlock}>
                      <Text style={styles.entryTimeLabel}>Clock In</Text>
                      <Text style={styles.entryTimeValue}>{formatTimeForDisplay(entry.clockIn)}</Text>
                    </View>
                    
                    <View style={styles.entryTimeBlock}>
                      <Text style={styles.entryTimeLabel}>Clock Out</Text>
                      <Text style={styles.entryTimeValue}>
                        {entry.clockOut ? formatTimeForDisplay(entry.clockOut) : 'In progress'}
                      </Text>
                    </View>
                  </View>
                  
                  {entry.notes && (
                    <View style={styles.entryNotesContainer}>
                      <Text style={styles.entryNotes}>{entry.notes}</Text>
                    </View>
                  )}
                  
                  {index < todaysEntries.length - 1 && <Divider style={styles.entryDivider} />}
                </View>
              ))}
            </View>
          </>
        )}
      </ScrollView>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dateText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  clockText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
  },
  historyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f7ff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  historyButtonText: {
    color: '#2089dc',
    fontWeight: '500',
    marginLeft: 4,
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
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  statusMessage: {
    fontSize: 15,
    color: '#666',
    marginBottom: 16,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#f5f5f5',
    paddingTop: 16,
  },
  timeItem: {
    flex: 1,
    alignItems: 'center',
  },
  timeLabel: {
    fontSize: 13,
    color: '#777',
    marginBottom: 4,
  },
  timeValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  divider: {
    height: 8,
    backgroundColor: '#f5f5f5',
  },
  clockButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: 28,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  clockInButton: {
    backgroundColor: '#34C759',
  },
  clockOutButton: {
    backgroundColor: '#FF3B30',
  },
  disabledButton: {
    opacity: 0.7,
  },
  clockButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  taskContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  taskOption: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  taskOptionSelected: {
    backgroundColor: '#2089dc',
    borderColor: '#2089dc',
  },
  taskOptionText: {
    color: '#555',
  },
  taskOptionTextSelected: {
    color: '#fff',
  },
  notesContainer: {
    marginTop: 8,
  },
  notesLabel: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
  },
  notesInput: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
    height: 80,
    textAlignVertical: 'top',
    fontSize: 14,
    color: '#333',
  },
  entryItem: {
    paddingVertical: 12,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  entryTask: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  taskTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f7ff',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  taskTagText: {
    fontSize: 12,
    color: '#2089dc',
    fontWeight: '500',
    marginLeft: 4,
  },
  entryDuration: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2089dc',
    marginLeft: 8,
  },
  editButton: {
    padding: 4,
  },
  entryDetails: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  entryTimeBlock: {
    flex: 1,
  },
  entryTimeLabel: {
    fontSize: 12,
    color: '#777',
    marginBottom: 2,
  },
  entryTimeValue: {
    fontSize: 14,
    color: '#333',
  },
  entryNotesContainer: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  entryNotes: {
    fontSize: 13,
    color: '#666',
    fontStyle: 'italic',
  },
  entryDivider: {
    height: 1,
    backgroundColor: '#f0f0f0',
  },
});

export default TimesheetScreen;
