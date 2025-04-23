import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  TextInput,
  StatusBar,
  Modal
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, subWeeks, subMonths, startOfMonth, endOfMonth } from 'date-fns';

// Define the interfaces for member weekly stats and team summary
interface MemberWeeklyStats {
  id: string;
  name: string;
  totalHours: number;
  tasksCompleted: number;
  overtimeHours: number;
  timeByCategory: {
    [category: string]: number; // e.g., { "Development": 12, "Meeting": 5, ... }
  };
}

interface TeamSummary {
  totalHoursAll: number;
  averagePerMember: number;
  mostActive: string;
  leastActive: string;
  totalTasksCompleted: number;
}

// Define colors for different categories
const categoryColors: { [key: string]: string } = {
  Development: '#2196F3',
  Meeting: '#FF9800',
  Testing: '#4CAF50',
  Planning: '#9C27B0',
  Documentation: '#795548',
  Research: '#607D8B',
  Maintenance: '#E91E63',
  Other: '#9E9E9E'
};

// Mock data for 5 team members
const memberStatsData: MemberWeeklyStats[] = [
  {
    id: '1',
    name: 'Alice Wong',
    totalHours: 32,
    tasksCompleted: 15,
    overtimeHours: 0,
    timeByCategory: {
      Development: 20,
      Meeting: 6,
      Testing: 4,
      Documentation: 2
    }
  },
  {
    id: '2',
    name: 'Bob Johnson',
    totalHours: 40,
    tasksCompleted: 12,
    overtimeHours: 2,
    timeByCategory: {
      Development: 25,
      Meeting: 5,
      Testing: 8,
      Research: 2
    }
  },
  {
    id: '3',
    name: 'Carol Martinez',
    totalHours: 38,
    tasksCompleted: 8,
    overtimeHours: 0,
    timeByCategory: {
      Development: 15,
      Planning: 10,
      Testing: 8,
      Documentation: 5
    }
  },
  {
    id: '4',
    name: 'Dave Wilson',
    totalHours: 16,
    tasksCompleted: 4,
    overtimeHours: 0,
    timeByCategory: {
      Development: 6,
      Meeting: 5,
      Documentation: 5
    }
  },
  {
    id: '5',
    name: 'Eva Chen',
    totalHours: 42,
    tasksCompleted: 18,
    overtimeHours: 4,
    timeByCategory: {
      Development: 22,
      Meeting: 8,
      Testing: 6,
      Planning: 6
    }
  }
];

// Calculate team summary from member stats
const calculateTeamSummary = (members: MemberWeeklyStats[]): TeamSummary => {
  const totalHoursAll = members.reduce((sum, member) => sum + member.totalHours, 0);
  const totalTasksCompleted = members.reduce((sum, member) => sum + member.tasksCompleted, 0);
  
  // Find most and least active members
  const mostActiveMember = [...members].sort((a, b) => b.totalHours - a.totalHours)[0];
  const leastActiveMember = [...members].sort((a, b) => a.totalHours - b.totalHours)[0];
  
  return {
    totalHoursAll,
    averagePerMember: totalHoursAll / members.length,
    mostActive: mostActiveMember.name,
    leastActive: leastActiveMember.name,
    totalTasksCompleted
  };
};

// Generate mock data for daily hours over the past week
const generateDailyHoursData = () => {
  const today = new Date();
  const weekStart = startOfWeek(today);
  const weekDays = eachDayOfInterval({ start: weekStart, end: today });
  
  return weekDays.map(day => ({
    day: format(day, 'E'),
    hours: Math.floor(Math.random() * 30) + 20 // Random hours between 20-50
  }));
};

const TeamLeaderReportScreen = () => {
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<string>('This Week');
  const [showMemberSelector, setShowMemberSelector] = useState(false);
  const [showDateRangeSelector, setShowDateRangeSelector] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<'Week' | 'Month'>('Week');
  
  // Calculate date range based on selected date and view mode
  const getDateRange = () => {
    if (viewMode === 'Week') {
      const weekStart = startOfWeek(selectedDate);
      const weekEnd = endOfWeek(selectedDate);
      return {
        start: weekStart,
        end: weekEnd,
        label: `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')}`
      };
    } else {
      const monthStart = startOfMonth(selectedDate);
      const monthEnd = endOfMonth(selectedDate);
      return {
        start: monthStart,
        end: monthEnd,
        label: format(monthStart, 'MMMM yyyy')
      };
    }
  };

  const currentDateRange = getDateRange();
  
  // Navigation functions
  const goToPrevious = () => {
    if (viewMode === 'Week') {
      setSelectedDate(subWeeks(selectedDate, 1));
    } else {
      setSelectedDate(subMonths(selectedDate, 1));
    }
  };

  const goToNext = () => {
    if (viewMode === 'Week') {
      setSelectedDate(date => new Date(date.setDate(date.getDate() + 7)));
    } else {
      setSelectedDate(date => new Date(date.setMonth(date.getMonth() + 1)));
    }
  };
  
  // Filter members based on selection (or show all if none selected)
  const filteredMembers = selectedMember 
    ? memberStatsData.filter(member => member.id === selectedMember)
    : memberStatsData;
  
  // Calculate team summary based on filtered members
  const teamSummary = calculateTeamSummary(filteredMembers);
  
  // Daily hours data for the line chart - use the selected date range
  const generateDailyHoursDataForRange = () => {
    const { start, end } = currentDateRange;
    const daysInRange = eachDayOfInterval({ start, end });
    
    return daysInRange.map(day => ({
      day: format(day, 'd MMM'),
      date: format(day, 'MMM d'),
      hours: Math.floor(Math.random() * 30) + 20 // Random hours between 20-50
    }));
  };
  
  const dailyHoursData = generateDailyHoursDataForRange();
  
  // Toggle member selection
  const toggleMemberSelection = (memberId: string) => {
    setSelectedMember(prevId => prevId === memberId ? null : memberId);
    setShowMemberSelector(false);
  };
  
  // Calculate max hours for the bar chart
  const maxHours = Math.max(...filteredMembers.map(member => member.totalHours));
  
  // Calculate percentage for a time category
  const calculatePercentage = (hours: number, total: number): number => {
    return Math.round((hours / total) * 100);
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header */}
      {/* <View style={styles.header}>
        <Text style={styles.headerTitle}>Team Report</Text>
      </View> */}
      
      {/* Date Navigation */}
      <View style={styles.dateNavigationContainer}>
        <View style={styles.viewModeToggle}>
          <TouchableOpacity 
            style={[
              styles.viewModeButton, 
              viewMode === 'Week' && styles.viewModeButtonActive
            ]}
            onPress={() => setViewMode('Week')}
          >
            <Text 
              style={[
                styles.viewModeButtonText,
                viewMode === 'Week' && styles.viewModeButtonTextActive
              ]}
            >
              Week
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.viewModeButton, 
              viewMode === 'Month' && styles.viewModeButtonActive
            ]}
            onPress={() => setViewMode('Month')}
          >
            <Text 
              style={[
                styles.viewModeButtonText,
                viewMode === 'Month' && styles.viewModeButtonTextActive
              ]}
            >
              Month
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.dateNavigation}>
          <TouchableOpacity onPress={goToPrevious}>
            <Ionicons name="chevron-back" size={24} color="#2196F3" />
          </TouchableOpacity>
          
          <Text style={styles.dateRangeText}>
            {viewMode === 'Week' 
              ? `${format(currentDateRange.start, 'MMM d')} - ${format(currentDateRange.end, 'MMM d, yyyy')}` 
              : format(selectedDate, 'MMMM yyyy')
            }
          </Text>
          
          <TouchableOpacity onPress={goToNext}>
            <Ionicons name="chevron-forward" size={24} color="#2196F3" />
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Member Filter */}
      <View style={styles.filtersContainer}>
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setShowMemberSelector(!showMemberSelector)}
        >
          <Ionicons name="people-outline" size={18} color="#666" />
          <Text style={styles.filterButtonText}>
            {selectedMember 
              ? memberStatsData.find(m => m.id === selectedMember)?.name 
              : 'All Members'}
          </Text>
          <Ionicons name="chevron-down" size={16} color="#666" />
        </TouchableOpacity>
      </View>
      
      {/* Member Selector Dropdown */}
      {showMemberSelector && (
        <View style={styles.memberSelector}>
          <TouchableOpacity
            style={styles.memberOption}
            onPress={() => {
              setSelectedMember(null);
              setShowMemberSelector(false);
            }}
          >
            <Text style={styles.memberOptionText}>All Members</Text>
          </TouchableOpacity>
          
          {memberStatsData.map(member => (
            <TouchableOpacity
              key={member.id}
              style={styles.memberOption}
              onPress={() => toggleMemberSelection(member.id)}
            >
              <Text style={styles.memberOptionText}>{member.name}</Text>
              {selectedMember === member.id && (
                <Ionicons name="checkmark" size={18} color="#2196F3" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Team Overview Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <Ionicons name="stats-chart-outline" size={20} color="#333" /> Team Overview
          </Text>
          
          <View style={styles.overviewGrid}>
            <View style={styles.overviewItem}>
              <Ionicons name="time-outline" size={24} color="#2196F3" />
              <Text style={styles.overviewItemValue}>{teamSummary.totalHoursAll}h</Text>
              <Text style={styles.overviewItemLabel}>Total Hours</Text>
            </View>
            
            <View style={styles.overviewItem}>
              <Ionicons name="calculator-outline" size={24} color="#FF9800" />
              <Text style={styles.overviewItemValue}>
                {teamSummary.averagePerMember.toFixed(1)}h
              </Text>
              <Text style={styles.overviewItemLabel}>Avg per Member</Text>
            </View>
            
            <View style={styles.overviewItem}>
              <Ionicons name="checkmark-done-outline" size={24} color="#4CAF50" />
              <Text style={styles.overviewItemValue}>{teamSummary.totalTasksCompleted}</Text>
              <Text style={styles.overviewItemLabel}>Tasks Done</Text>
            </View>
            
            <View style={styles.overviewItem}>
              <Ionicons name="trending-up-outline" size={24} color="#9C27B0" />
              <Text style={styles.overviewItemValue} numberOfLines={1}>
                {teamSummary.mostActive.split(' ')[0]}
              </Text>
              <Text style={styles.overviewItemLabel}>Most Active</Text>
            </View>
          </View>
        </View>
        
        {/* Hours Per Member Bar Chart - Simple Version */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <Ionicons name="bar-chart-outline" size={20} color="#333" /> Hours Per Member
          </Text>
          
          <View style={styles.simpleBarsContainer}>
            {filteredMembers.map(member => (
              <View key={member.id} style={styles.simpleBarItem}>
                <Text style={styles.simpleBarLabel}>{member.name.split(' ')[0]}</Text>
                <View style={styles.simpleBarWrapper}>
                  <View 
                    style={[
                      styles.simpleBar, 
                      { 
                        width: `${(member.totalHours / maxHours) * 100}%`,
                        backgroundColor: '#2196F3' 
                      }
                    ]} 
                  />
                </View>
                <Text style={styles.simpleBarValue}>{member.totalHours}h</Text>
              </View>
            ))}
          </View>
        </View>
        
        {/* Daily Team Hours - Simple Version */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <Ionicons name="trending-up-outline" size={20} color="#333" /> Daily Team Hours
          </Text>
          
          <View style={styles.simpleBarsContainer}>
            {dailyHoursData.map((day, index) => (
              <View key={index} style={styles.simpleBarItem}>
                <Text style={styles.simpleBarLabel}>{day.day}</Text>
                <View style={styles.simpleBarWrapper}>
                  <View 
                    style={[
                      styles.simpleBar, 
                      { 
                        width: `${(day.hours / 50) * 100}%`, // Using 50 as the max possible hours
                        backgroundColor: '#FF9800' 
                      }
                    ]} 
                  />
                </View>
                <Text style={styles.simpleBarValue}>{day.hours}h</Text>
              </View>
            ))}
          </View>
        </View>
        
        {/* Team Member Detailed Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <Ionicons name="people-outline" size={20} color="#333" /> Member Breakdown
          </Text>
          
          {filteredMembers.map((member) => (
            <View key={member.id} style={styles.memberBreakdown}>
              <View style={styles.memberHeader}>
                <View style={styles.memberAvatar}>
                  <Text style={styles.memberAvatarText}>
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </Text>
                </View>
                
                <View style={styles.memberHeaderInfo}>
                  <Text style={styles.memberName}>{member.name}</Text>
                  
                  <View style={styles.memberStats}>
                    <View style={styles.memberStatItem}>
                      <Ionicons name="time-outline" size={14} color="#666" />
                      <Text style={styles.memberStatText}>{member.totalHours}h total</Text>
                    </View>
                    
                    <View style={styles.memberStatItem}>
                      <Ionicons name="checkmark-circle-outline" size={14} color="#666" />
                      <Text style={styles.memberStatText}>{member.tasksCompleted} tasks</Text>
                    </View>
                    
                    {member.overtimeHours > 0 && (
                      <View style={styles.memberStatItem}>
                        <Ionicons name="flash-outline" size={14} color="#666" />
                        <Text style={styles.memberStatText}>{member.overtimeHours}h overtime</Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>
              
              {/* Time by Category - Simple Pie Chart Alternative */}
              <View style={styles.pieChartContainer}>
                <Text style={styles.pieChartTitle}>Time Breakdown</Text>
                
                {/* Time Category Bars */}
                <View style={styles.categoryBarsContainer}>
                  {Object.entries(member.timeByCategory).map(([category, hours], index) => {
                    const totalHoursInCategories = Object.values(member.timeByCategory).reduce((sum, h) => sum + h, 0);
                    const percentage = calculatePercentage(hours, totalHoursInCategories);
                    
                    return (
                      <View key={category} style={styles.categoryBarItem}>
                        <View style={styles.categoryBarHeader}>
                          <View 
                            style={[
                              styles.categoryColorDot, 
                              { backgroundColor: categoryColors[category] || '#9E9E9E' }
                            ]} 
                          />
                          <Text style={styles.categoryBarLabel}>{category}</Text>
                          <Text style={styles.categoryBarValue}>{hours}h ({percentage}%)</Text>
                        </View>
                        
                        <View style={styles.categoryBarWrapper}>
                          <View 
                            style={[
                              styles.categoryBar, 
                              { 
                                width: `${percentage}%`,
                                backgroundColor: categoryColors[category] || '#9E9E9E' 
                              }
                            ]} 
                          />
                        </View>
                      </View>
                    );
                  })}
                </View>
              </View>
            </View>
          ))}
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
  },
  filtersContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 12,
  },
  filterButtonText: {
    fontSize: 14,
    color: '#666',
    marginHorizontal: 8,
  },
  memberSelector: {
    position: 'absolute',
    top: 120,
    right: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 1000,
    minWidth: 180,
  },
  memberOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  memberOptionText: {
    fontSize: 14,
    color: '#333',
  },
  dateRangeSelector: {
    position: 'absolute',
    top: 120,
    left: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 1000,
    minWidth: 180,
  },
  dateRangeOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dateRangeOptionText: {
    fontSize: 14,
    color: '#333',
  },
  scrollView: {
    flex: 1,
  },
  dateRangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  dateRangeText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginLeft: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  overviewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  overviewItem: {
    width: '48%',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  overviewItemValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    marginTop: 8,
    marginBottom: 4,
  },
  overviewItemLabel: {
    fontSize: 12,
    color: '#666',
  },
  simpleBarsContainer: {
    paddingHorizontal: 16,
  },
  simpleBarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  simpleBarLabel: {
    width: 50,
    fontSize: 12,
    color: '#666',
    marginRight: 8,
  },
  simpleBarWrapper: {
    flex: 1,
    height: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    overflow: 'hidden',
  },
  simpleBar: {
    height: '100%',
    borderRadius: 8,
  },
  simpleBarValue: {
    width: 40,
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
    textAlign: 'right',
    marginLeft: 8,
  },
  memberBreakdown: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
  },
  memberHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  memberAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e1f5fe',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  memberAvatarText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0288d1',
  },
  memberHeaderInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  memberStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  memberStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
    marginBottom: 4,
  },
  memberStatText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  pieChartContainer: {
    marginTop: 8,
  },
  pieChartTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 12,
  },
  categoryBarsContainer: {
    marginTop: 8,
  },
  categoryBarItem: {
    marginBottom: 12,
  },
  categoryBarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  categoryColorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  categoryBarLabel: {
    flex: 1,
    fontSize: 12,
    color: '#666',
  },
  categoryBarValue: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
  },
  categoryBarWrapper: {
    height: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
    overflow: 'hidden',
  },
  categoryBar: {
    height: '100%',
    borderRadius: 6,
  },
  dateNavigationContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  viewModeToggle: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  viewModeButton: {
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 4,
  },
  viewModeButtonActive: {
    backgroundColor: '#2196F3',
  },
  viewModeButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  viewModeButtonTextActive: {
    color: 'white',
  },
  dateNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
});

export default TeamLeaderReportScreen;