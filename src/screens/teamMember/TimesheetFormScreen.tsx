import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/core';
import { useRoute, RouteProp } from '@react-navigation/core';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TimesheetStackParamList } from '../../navigation/types';
import { format } from 'date-fns';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Divider } from 'react-native-paper';

type TimesheetFormScreenRouteProp = RouteProp<TimesheetStackParamList, 'TimesheetForm'>;
type TimesheetNavigationProp = NativeStackNavigationProp<TimesheetStackParamList>;

// Mock data for tasks selection
const mockTasks = [
  { id: '1', name: 'Development' },
  { id: '2', name: 'Design' },
  { id: '3', name: 'Testing' },
  { id: '4', name: 'Meeting' },
  { id: '5', name: 'Documentation' },
];

const TimesheetFormScreen = () => {
  const navigation = useNavigation<TimesheetNavigationProp>();
  const route = useRoute<TimesheetFormScreenRouteProp>();
  
  // Initialize with current date or passed date
  const initialDate = route.params?.date 
    ? new Date(route.params.date) 
    : new Date();
  
  const [date, setDate] = useState(initialDate);
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date(Date.now() + 8 * 60 * 60 * 1000)); // Default to 8 hours later
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [task, setTask] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Calculate total hours
  const totalHours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
  const formattedTotalHours = totalHours.toFixed(2);
  
  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios');
    setDate(currentDate);
  };
  
  const handleStartTimeChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate || startTime;
    setShowStartPicker(Platform.OS === 'ios');
    setStartTime(currentDate);
    
    // Update errors
    if (currentDate >= endTime) {
      setErrors(prev => ({ ...prev, time: 'Start time must be before end time' }));
    } else {
      setErrors(prev => {
        const { time, ...rest } = prev;
        return rest;
      });
    }
  };
  
  const handleEndTimeChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate || endTime;
    setShowEndPicker(Platform.OS === 'ios');
    setEndTime(currentDate);
    
    // Update errors
    if (startTime >= currentDate) {
      setErrors(prev => ({ ...prev, time: 'End time must be after start time' }));
    } else {
      setErrors(prev => {
        const { time, ...rest } = prev;
        return rest;
      });
    }
  };
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!task) {
      newErrors.task = 'Please select a task';
    }
    
    if (startTime >= endTime) {
      newErrors.time = 'Start time must be before end time';
    }
    
    if (totalHours > 24) {
      newErrors.hours = 'Total hours cannot exceed 24';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = () => {
    if (validateForm()) {
      // In a real app, we would submit the data to an API
      console.log('Submitting timesheet:', {
        date: format(date, 'yyyy-MM-dd'),
        startTime: format(startTime, 'HH:mm'),
        endTime: format(endTime, 'HH:mm'),
        totalHours,
        task,
        notes,
      });
      
      // Navigate back to overview
      navigation.navigate('TimesheetOverview');
    }
  };
  
  const handleSaveDraft = () => {
    // In a real app, we would save the form data as a draft
    console.log('Saving draft:', {
      date: format(date, 'yyyy-MM-dd'),
      startTime: format(startTime, 'HH:mm'),
      endTime: format(endTime, 'HH:mm'),
      totalHours,
      task,
      notes,
    });
    
    // Navigate back to overview
    navigation.navigate('TimesheetOverview');
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#2089dc" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Timesheet Entry</Text>
      </View>
      
      <ScrollView style={styles.scrollView}>
        {/* Date Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="calendar-outline" size={20} color="#2089dc" />
            <Text style={styles.sectionTitle}>Date</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.dateSelector} 
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.dateText}>{format(date, 'EEEE, MMMM d, yyyy')}</Text>
            <Ionicons name="chevron-down" size={20} color="#2089dc" />
          </TouchableOpacity>
          
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleDateChange}
            />
          )}
        </View>
        
        <Divider style={styles.divider} />
        
        {/* Task Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="briefcase-outline" size={20} color="#2089dc" />
            <Text style={styles.sectionTitle}>Task</Text>
          </View>
          
          <View style={styles.taskContainer}>
            {mockTasks.map(item => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.taskOption,
                  task === item.id && styles.taskOptionSelected,
                ]}
                onPress={() => setTask(item.id)}
              >
                <Text style={[
                  styles.taskOptionText,
                  task === item.id && styles.taskOptionTextSelected,
                ]}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {errors.task && <Text style={styles.errorText}>{errors.task}</Text>}
        </View>
        
        <Divider style={styles.divider} />
        
        {/* Time Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="time-outline" size={20} color="#2089dc" />
            <Text style={styles.sectionTitle}>Time</Text>
          </View>
          
          <View style={styles.timeRow}>
            <View style={styles.timeItem}>
              <Text style={styles.timeLabel}>Start</Text>
              <TouchableOpacity 
                style={styles.timeSelector} 
                onPress={() => setShowStartPicker(true)}
              >
                <Text style={styles.timeText}>{format(startTime, 'h:mm a')}</Text>
                <Ionicons name="chevron-down" size={16} color="#2089dc" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.timeSeparator}>
              <Text style={styles.timeSeparatorText}>to</Text>
            </View>
            
            <View style={styles.timeItem}>
              <Text style={styles.timeLabel}>End</Text>
              <TouchableOpacity 
                style={styles.timeSelector} 
                onPress={() => setShowEndPicker(true)}
              >
                <Text style={styles.timeText}>{format(endTime, 'h:mm a')}</Text>
                <Ionicons name="chevron-down" size={16} color="#2089dc" />
              </TouchableOpacity>
            </View>
          </View>
          
          {errors.time && <Text style={styles.errorText}>{errors.time}</Text>}
          
          {showStartPicker && (
            <DateTimePicker
              value={startTime}
              mode="time"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleStartTimeChange}
            />
          )}
          
          {showEndPicker && (
            <DateTimePicker
              value={endTime}
              mode="time"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleEndTimeChange}
            />
          )}
          
          <View style={styles.totalHoursContainer}>
            <Text style={styles.totalHoursLabel}>Total Hours:</Text>
            <Text style={styles.totalHoursValue}>{formattedTotalHours}</Text>
          </View>
          
          {errors.hours && <Text style={styles.errorText}>{errors.hours}</Text>}
        </View>
        
        <Divider style={styles.divider} />
        
        {/* Notes Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="create-outline" size={20} color="#2089dc" />
            <Text style={styles.sectionTitle}>Notes</Text>
          </View>
          
          <TextInput
            style={styles.notesInput}
            multiline
            numberOfLines={4}
            value={notes}
            onChangeText={setNotes}
            placeholder="Add any additional notes..."
            placeholderTextColor="#999"
          />
        </View>
        
        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.draftButton} 
            onPress={handleSaveDraft}
          >
            <Ionicons name="save-outline" size={20} color="#2089dc" />
            <Text style={styles.draftButtonText}>Save Draft</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.submitButton} 
            onPress={handleSubmit}
          >
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
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
  dateSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  taskContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
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
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  timeItem: {
    flex: 1,
  },
  timeLabel: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
  },
  timeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  timeText: {
    fontSize: 16,
    color: '#333',
  },
  timeSeparator: {
    paddingHorizontal: 12,
    paddingTop: 24,
  },
  timeSeparatorText: {
    color: '#777',
  },
  totalHoursContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  totalHoursLabel: {
    fontSize: 16,
    color: '#555',
    marginRight: 8,
  },
  totalHoursValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2089dc',
  },
  notesInput: {
    height: 120,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
    textAlignVertical: 'top',
    fontSize: 16,
    color: '#333',
  },
  errorText: {
    color: '#ff3b30',
    marginTop: 8,
    fontSize: 14,
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: 16,
    paddingTop: 8,
  },
  draftButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#2089dc',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 8,
    flex: 1,
  },
  draftButtonText: {
    color: '#2089dc',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  submitButton: {
    backgroundColor: '#2089dc',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default TimesheetFormScreen; 