import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, DateData } from 'react-native-calendars';
import { FAB, Divider, Menu, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { format, startOfWeek, endOfWeek, isWithinInterval } from 'date-fns';
import Ionicons from 'react-native-vector-icons/Ionicons';

type LeaderNavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Define TimesheetEntry type
interface TimesheetEntry {
  clockIn: string;
  clockOut: string;
  hours: number;
  notes: string;
}

// Define Team Member type
interface TeamMember {
  id: string;
  name: string;
}

// Mock team members data
const teamMembers: TeamMember[] = [
  { id: 'u123', name: 'Alice Wong' },
  { id: 'u456', name: 'Bob Johnson' },
  { id: 'u789', name: 'Mike Davis' },
  { id: 'u101', name: 'Sarah Chen' },
];

// Mock data with proper typing - updated structure for multiple members
const mockTimesheetData: Record<string, Record<string, TimesheetEntry>> = {
  '2025-04-15': {
    'u123': { clockIn: '09:00', clockOut: '17:00', hours: 8, notes: 'Regular day' },
    'u456': { clockIn: '08:30', clockOut: '16:30', hours: 8, notes: 'Client meeting' },
  },
  '2025-04-16': {
    'u123': { clockIn: '08:30', clockOut: '16:30', hours: 8, notes: 'Meeting with clients' },
    'u789': { clockIn: '09:15', clockOut: '17:15', hours: 8, notes: 'Documentation work' },
  },
  '2025-04-18': {
    'u456': { clockIn: '09:15', clockOut: '18:15', hours: 9, notes: 'Overtime for project X' },
    'u789': { clockIn: '08:45', clockOut: '17:45', hours: 9, notes: 'Sprint planning' },
    'u101': { clockIn: '09:30', clockOut: '18:30', hours: 9, notes: 'Code review' },
  },
  '2025-04-19': {
    'u123': { clockIn: '09:00', clockOut: '17:30', hours: 8.5, notes: 'Training session' },
    'u101': { clockIn: '08:45', clockOut: '16:45', hours: 8, notes: 'Development work' },
  },
};

const LeaderTimesheetOverviewScreen = () => {
  const navigation = useNavigation<LeaderNavigationProp>();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isFabOpen, setIsFabOpen] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);
  
  // Helper function to get member name from id
  const getMemberName = (memberId: string): string => {
    const member = teamMembers.find(m => m.id === memberId);
    return member ? member.name : 'Unknown Member';
  };
  
  // Calculate current week range
  const weekStart = startOfWeek(selectedDate);
  const weekEnd = endOfWeek(selectedDate);
  const weekRange = `${format(weekStart, 'MMM d')}–${format(weekEnd, 'MMM d')}`;
  
  // Calculate total hours for the current week across all team members or filtered by member
  const totalHoursThisWeek = Object.entries(mockTimesheetData)
    .filter(([dateString]) => {
      const entryDate = new Date(dateString);
      return isWithinInterval(entryDate, { start: weekStart, end: weekEnd });
    })
    .reduce((sum, [_, memberEntries]) => {
      if (selectedMemberId) {
        // If a member is selected, only count their hours
        return sum + (memberEntries[selectedMemberId]?.hours || 0);
      } else {
        // Sum up hours for all members
        return sum + Object.values(memberEntries).reduce((memberSum, entry) => memberSum + entry.hours, 0);
      }
    }, 0);
  
  // Mark days with timesheet entries
  const markedDates = Object.keys(mockTimesheetData).reduce((acc, date) => {
    const dateEntries = mockTimesheetData[date];
    
    // Check if we need to filter by member
    const hasEntryForMember = selectedMemberId 
      ? dateEntries[selectedMemberId] !== undefined
      : Object.keys(dateEntries).length > 0;
    
    if (hasEntryForMember) {
      acc[date] = { marked: true, dotColor: '#2089dc' };
    }
    
    return acc;
  }, {} as Record<string, any>);
  
  // Handle date selection
  const handleDayPress = (day: DateData) => {
    const formattedDate = day.dateString;
    setSelectedDate(new Date(formattedDate));
  };
  
  const handleAssignTask = () => {
    navigation.navigate('AssignTask');
    setIsFabOpen(false);
  };
  
  const handleViewDrafts = () => {
    navigation.navigate('LeaderTimesheetDraft');
    setIsFabOpen(false);
  };

  const formattedDateString = format(selectedDate, 'yyyy-MM-dd');
  const dateEntries = mockTimesheetData[formattedDateString] || {};
  
  // Get the selected entry based on selected member or null
  const selectedEntry = selectedMemberId 
    ? dateEntries[selectedMemberId]
    : null;
  
  // Toggle for member selection menu
  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Team Timesheet Overview</Text>
      </View>
      
      <ScrollView style={styles.scrollView}>
        {/* Member Filter */}
        <View style={styles.filterContainer}>
          <Text style={styles.filterLabel}>Filter by Member:</Text>
          <Menu
            visible={menuVisible}
            onDismiss={closeMenu}
            anchor={
              <Button
                mode="outlined"
                onPress={openMenu}
                style={styles.memberDropdown}
              >
                {selectedMemberId ? getMemberName(selectedMemberId) : "All Members"}
              </Button>
            }
          >
            <Menu.Item
              onPress={() => {
                setSelectedMemberId(null);
                closeMenu();
              }}
              title="All Members"
            />
            {teamMembers.map((member) => (
              <Menu.Item
                key={member.id}
                onPress={() => {
                  setSelectedMemberId(member.id);
                  closeMenu();
                }}
                title={member.name}
              />
            ))}
          </Menu>
        </View>
        
        {/* Weekly Summary */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="calendar-outline" size={20} color="#2089dc" />
            <Text style={styles.sectionTitle}>Week of {weekRange}</Text>
          </View>
          <View style={styles.weekSummary}>
            <Text style={styles.weekSummaryLabel}>
              Total hours {selectedMemberId ? `(${getMemberName(selectedMemberId)})` : '(Team)'}:
            </Text>
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
          
          {Object.keys(dateEntries).length > 0 ? (
            selectedMemberId ? (
              // Show single member entry if member is selected
              selectedEntry ? (
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
                  <Text style={styles.noEntryText}>No timesheet entry for this member on selected date</Text>
                  <TouchableOpacity 
                    style={styles.addEntryButton}
                    onPress={handleAssignTask}
                  >
                    <Text style={styles.addEntryButtonText}>Assign Task</Text>
                  </TouchableOpacity>
                </View>
              )
            ) : (
              // Show all member entries if no member selected
              <ScrollView>
                {Object.entries(dateEntries).map(([memberId, entry]) => (
                  <View key={memberId} style={styles.memberEntryContainer}>
                    <Text style={styles.memberName}>{getMemberName(memberId)}</Text>
                    <View style={styles.timeRow}>
                      <View style={styles.timeItem}>
                        <Text style={styles.timeItemLabel}>Clock In</Text>
                        <Text style={styles.timeItemValue}>{entry.clockIn}</Text>
                      </View>
                      <View style={styles.timeItem}>
                        <Text style={styles.timeItemLabel}>Clock Out</Text>
                        <Text style={styles.timeItemValue}>{entry.clockOut}</Text>
                      </View>
                      <View style={styles.timeItem}>
                        <Text style={styles.timeItemLabel}>Hours</Text>
                        <Text style={styles.timeItemValue}>{entry.hours}</Text>
                      </View>
                    </View>
                    <View style={styles.notesContainer}>
                      <Text style={styles.notesLabel}>Notes:</Text>
                      <Text style={styles.notesContent}>{entry.notes}</Text>
                    </View>
                    <Divider style={styles.memberDivider} />
                  </View>
                ))}
              </ScrollView>
            )
          ) : (
            <View style={styles.noEntryContainer}>
              <Text style={styles.noEntryText}>No team entries on this date</Text>
              <TouchableOpacity 
                style={styles.addEntryButton}
                onPress={handleAssignTask}
              >
                <Text style={styles.addEntryButtonText}>Assign Task</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
      
      {/* Floating Action Buttons */}
      <FAB.Group
        visible={true}
        open={isFabOpen}
        icon={isFabOpen ? 'close' : 'plus'}
        actions={[
          {
            icon: 'clipboard-plus-outline',
            label: 'Assign New Task',
            onPress: handleAssignTask,
          },
          {
            icon: 'clipboard-list-outline',
            label: 'View Draft Tasks',
            onPress: handleViewDrafts,
          },
        ]}
        onStateChange={({ open }) => setIsFabOpen(open)}
        fabStyle={{ backgroundColor: '#2089dc' }}
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
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingBottom: 8,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  memberDropdown: {
    minWidth: 180,
    borderColor: '#2089dc',
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
  memberDivider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 16,
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
  memberEntryContainer: {
    marginBottom: 12,
    paddingTop: 8,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2089dc',
    marginBottom: 8,
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
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
  },
  notesLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#555',
    marginBottom: 4,
  },
  notesContent: {
    fontSize: 15,
    color: '#333',
  },
  noEntryContainer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  noEntryText: {
    fontSize: 16,
    color: '#777',
    marginBottom: 16,
  },
  addEntryButton: {
    backgroundColor: '#2089dc',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  addEntryButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default LeaderTimesheetOverviewScreen; 