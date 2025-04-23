import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Divider } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { format, startOfWeek, endOfWeek, addWeeks, subWeeks, 
         subMonths, startOfMonth, endOfMonth, differenceInDays } from 'date-fns';

// Define types
interface Timesheet {
  id: string;
  date: string;
  clockIn: string;
  clockOut: string;
  hours: number;
  taskCategory: string;
  status: 'approved' | 'pending' | 'rejected';
  notes?: string;
}

// Mock data
const mockTimesheets: Timesheet[] = [
  { id: '1', date: '2025-04-15', clockIn: '09:00', clockOut: '17:00', hours: 8, taskCategory: 'Development', status: 'approved', notes: 'Regular day' },
  { id: '2', date: '2025-04-16', clockIn: '08:30', clockOut: '16:30', hours: 8, taskCategory: 'Meeting', status: 'approved', notes: 'Project planning' },
  { id: '3', date: '2025-04-17', clockIn: '09:00', clockOut: '18:00', hours: 9, taskCategory: 'Development', status: 'approved', notes: 'Sprint work' },
  { id: '4', date: '2025-04-18', clockIn: '09:15', clockOut: '18:15', hours: 9, taskCategory: 'Testing', status: 'approved', notes: 'Bug fixes' },
  { id: '5', date: '2025-04-19', clockIn: '09:00', clockOut: '17:30', hours: 8.5, taskCategory: 'Documentation', status: 'approved', notes: 'API docs' },
  { id: '6', date: '2025-04-20', clockIn: '09:30', clockOut: '17:30', hours: 8, taskCategory: 'Development', status: 'pending', notes: 'Feature work' },
  { id: '7', date: '2025-04-21', clockIn: '09:00', clockOut: '16:00', hours: 7, taskCategory: 'Meeting', status: 'pending', notes: 'Client call' },
  { id: '8', date: '2025-04-22', clockIn: '10:00', clockOut: '14:00', hours: 4, taskCategory: 'Training', status: 'pending', notes: 'React Native workshop' },
  { id: '9', date: '2025-04-10', clockIn: '09:00', clockOut: '17:00', hours: 8, taskCategory: 'Development', status: 'approved', notes: 'Regular day' },
  { id: '10', date: '2025-04-11', clockIn: '08:30', clockOut: '16:30', hours: 8, taskCategory: 'Meeting', status: 'rejected', notes: 'Team standup' },
  { id: '11', date: '2025-04-12', clockIn: '09:00', clockOut: '18:00', hours: 9, taskCategory: 'Development', status: 'approved', notes: 'Sprint work' },
  { id: '12', date: '2025-04-13', clockIn: '09:15', clockOut: '18:15', hours: 9, taskCategory: 'Testing', status: 'approved', notes: 'Integration tests' },
  { id: '13', date: '2025-04-14', clockIn: '09:00', clockOut: '17:30', hours: 8.5, taskCategory: 'Documentation', status: 'approved', notes: 'Sprint docs' },
];

// Date filter options
type DateRange = 'week' | 'month' | 'custom';

const TeamMemberReportScreen = () => {
  const [dateRange, setDateRange] = useState<DateRange>('week');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [filteredTimesheets, setFilteredTimesheets] = useState<Timesheet[]>([]);
  
  // Get date range for filtering
  const getDateRange = () => {
    let startDate, endDate;
    
    if (dateRange === 'week') {
      startDate = startOfWeek(currentDate);
      endDate = endOfWeek(currentDate);
    } else if (dateRange === 'month') {
      startDate = startOfMonth(currentDate);
      endDate = endOfMonth(currentDate);
    } else {
      // Fallback for custom (currently not used)
      startDate = startOfWeek(currentDate);
      endDate = endOfWeek(currentDate);
    }
    
    return { startDate, endDate };
  };
  
  // Calculate total hours
  const getTotalHours = () => {
    return filteredTimesheets.reduce((sum, timesheet) => sum + timesheet.hours, 0);
  };
  
  // Count statuses
  const getStatusCounts = () => {
    const approved = filteredTimesheets.filter(t => t.status === 'approved').length;
    const pending = filteredTimesheets.filter(t => t.status === 'pending').length;
    const rejected = filteredTimesheets.filter(t => t.status === 'rejected').length;
    
    return { approved, pending, rejected };
  };
  
  // Get category breakdown 
  const getCategoryBreakdown = () => {
    const categories = filteredTimesheets.reduce((acc, timesheet) => {
      if (!acc[timesheet.taskCategory]) {
        acc[timesheet.taskCategory] = 0;
      }
      acc[timesheet.taskCategory] += timesheet.hours;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(categories).map(([name, hours]) => {
      const percentage = Math.round((hours / getTotalHours()) * 100);
      return { name, hours, percentage };
    });
  };
  
  // Get hours by day
  const getHoursByDay = () => {
    const { startDate, endDate } = getDateRange();
    const days = differenceInDays(endDate, startDate) + 1;
    
    // Initialize data array with zeros for all days in range
    const data = Array.from({ length: days }, (_, i) => {
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + i);
      return { 
        date: format(day, 'yyyy-MM-dd'),
        day: format(day, 'EEE'),
        formattedDate: format(day, 'dd MMM'), // Format as "01 Apr"
        hours: 0
      };
    });
    
    // Fill in actual hours data
    filteredTimesheets.forEach(timesheet => {
      const index = data.findIndex(d => d.date === timesheet.date);
      if (index !== -1) {
        data[index].hours += timesheet.hours;
      }
    });
    
    return data;
  };
  
  // Get productivity trend (compare to previous period)
  const getProductivityTrend = () => {
    const { startDate, endDate } = getDateRange();
    const currentHours = getTotalHours();
    
    let previousStartDate, previousEndDate;
    
    if (dateRange === 'week') {
      previousStartDate = subWeeks(startDate, 1);
      previousEndDate = subWeeks(endDate, 1);
    } else {
      previousStartDate = subMonths(startDate, 1);
      previousEndDate = subMonths(endDate, 1);
    }
    
    // Filter timesheets for previous period
    const previousTimesheets = mockTimesheets.filter(timesheet => {
      const date = new Date(timesheet.date);
      return date >= previousStartDate && date <= previousEndDate;
    });
    
    const previousHours = previousTimesheets.reduce((sum, timesheet) => sum + timesheet.hours, 0);
    
    if (previousHours === 0) return { percentage: 0, isIncrease: true };
    
    const percentage = Math.round(((currentHours - previousHours) / previousHours) * 100);
    return {
      percentage: Math.abs(percentage),
      isIncrease: percentage >= 0
    };
  };
  
  // Filter timesheets based on current date range
  useEffect(() => {
    const { startDate, endDate } = getDateRange();
    
    const filtered = mockTimesheets.filter(timesheet => {
      const date = new Date(timesheet.date);
      return date >= startDate && date <= endDate;
    });
    
    setFilteredTimesheets(filtered);
  }, [dateRange, currentDate]);
  
  // Navigation functions
  const navigatePrevious = () => {
    if (dateRange === 'week') {
      setCurrentDate(subWeeks(currentDate, 1));
    } else if (dateRange === 'month') {
      setCurrentDate(subMonths(currentDate, 1));
    }
  };
  
  const navigateNext = () => {
    if (dateRange === 'week') {
      setCurrentDate(addWeeks(currentDate, 1));
    } else if (dateRange === 'month') {
      setCurrentDate(subMonths(currentDate, -1)); // Using negative to add
    }
  };
  
  // Format date range for display
  const formatDateRangeText = () => {
    const { startDate, endDate } = getDateRange();
    
    if (dateRange === 'week') {
      return `${format(startDate, 'MMM d')} - ${format(endDate, 'MMM d, yyyy')}`;
    } else if (dateRange === 'month') {
      return format(startDate, 'MMMM yyyy');
    }
    
    return '';
  };
  
  // Format productivity trend
  const formatProductivityTrend = () => {
    const { percentage, isIncrease } = getProductivityTrend();
    return `${isIncrease ? '+' : '-'}${percentage}% ${isIncrease ? 'more' : 'less'} hours than last ${dateRange}`;
  };
  
  const statusCounts = getStatusCounts();
  const productivityTrend = getProductivityTrend();
  const categoryBreakdown = getCategoryBreakdown();
  const hoursByDay = getHoursByDay();
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        {/* <View style={styles.header}>
          <Text style={styles.headerTitle}>Performance Report</Text>
        </View> */}
        
        {/* Date Range Selector */}
        <View style={styles.dateRangeSelector}>
          <TouchableOpacity 
            style={[styles.dateRangeButton, dateRange === 'week' ? styles.selectedDateRange : null]}
            onPress={() => setDateRange('week')}
          >
            <Text style={[styles.dateRangeText, dateRange === 'week' ? styles.selectedDateRangeText : null]}>Week</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.dateRangeButton, dateRange === 'month' ? styles.selectedDateRange : null]}
            onPress={() => setDateRange('month')}
          >
            <Text style={[styles.dateRangeText, dateRange === 'month' ? styles.selectedDateRangeText : null]}>Month</Text>
          </TouchableOpacity>
        </View>
        
        {/* Date Navigation */}
        <View style={styles.dateNavigation}>
          <TouchableOpacity onPress={navigatePrevious}>
            <Ionicons name="chevron-back-outline" size={24} color="#2089dc" />
          </TouchableOpacity>
          <Text style={styles.dateRangeTitle}>{formatDateRangeText()}</Text>
          <TouchableOpacity onPress={navigateNext}>
            <Ionicons name="chevron-forward-outline" size={24} color="#2089dc" />
          </TouchableOpacity>
        </View>
        
        <Divider style={styles.divider} />
        
        {/* Total Hours & Productivity Trend */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="time-outline" size={20} color="#2089dc" />
            <Text style={styles.sectionTitle}>Total Hours</Text>
          </View>
          
          <View style={styles.totalHoursContainer}>
            <Text style={styles.totalHours}>{getTotalHours()}</Text>
            <Text style={styles.totalHoursLabel}>hours</Text>
          </View>
          
          <View style={styles.productivityTrend}>
            <Ionicons 
              name={productivityTrend.isIncrease ? "trending-up-outline" : "trending-down-outline"} 
              size={16} 
              color={productivityTrend.isIncrease ? "#4caf50" : "#f44336"} 
            />
            <Text style={[
              styles.productivityTrendText,
              { color: productivityTrend.isIncrease ? "#4caf50" : "#f44336" }
            ]}>
              {formatProductivityTrend()}
            </Text>
          </View>
        </View>
        
        <Divider style={styles.divider} />
        
        {/* Hours Chart (simplified version) */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="bar-chart-outline" size={20} color="#2089dc" />
            <Text style={styles.sectionTitle}>Hours Worked</Text>
          </View>
          
          <View style={styles.chartContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.hoursByDayScrollView}>
              {hoursByDay.map((day, index) => (
                <View key={day.date} style={[
                  styles.dayColumn,
                  dateRange === 'month' ? styles.monthDayColumn : null
                ]}>
                  <View style={styles.barContainer}>
                    <View 
                      style={[
                        styles.dayBar, 
                        { 
                          height: day.hours === 0 ? 2 : Math.max(day.hours * 20, 5),
                          backgroundColor: day.hours === 0 ? '#ddd' : '#2089dc' 
                        }
                      ]} 
                    />
                  </View>
                  <Text style={styles.dayHours}>{day.hours}h</Text>
                  <Text style={[
                    styles.dayName,
                    dateRange === 'month' ? styles.monthDateText : null,
                  ]}>
                    {dateRange === 'month' ? day.formattedDate : day.day}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
        
        <Divider style={styles.divider} />
        
        {/* Task Breakdown (simplified version) */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="pie-chart-outline" size={20} color="#2089dc" />
            <Text style={styles.sectionTitle}>Task Breakdown</Text>
          </View>
          
          {categoryBreakdown.map((category, index) => (
            <View key={category.name} style={styles.categoryRow}>
              <View style={styles.categoryInfo}>
                <Text style={styles.categoryName}>{category.name}</Text>
                <Text style={styles.categoryHours}>{category.hours} hours</Text>
              </View>
              <View style={styles.categoryBarContainer}>
                <View 
                  style={[
                    styles.categoryBar, 
                    { width: `${category.percentage}%`, backgroundColor: getCategoryColor(index) }
                  ]} 
                />
                <Text style={styles.categoryPercentage}>{category.percentage}%</Text>
              </View>
            </View>
          ))}
        </View>
        
        <Divider style={styles.divider} />
        
        {/* Timesheet Status */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="checkmark-done-outline" size={20} color="#2089dc" />
            <Text style={styles.sectionTitle}>Timesheet Status</Text>
          </View>
          
          <View style={styles.statusContainer}>
            <View style={styles.statusItem}>
              <View style={[styles.statusDot, { backgroundColor: "#4caf50" }]} />
              <Text style={styles.statusLabel}>Approved</Text>
              <Text style={styles.statusCount}>{statusCounts.approved}</Text>
            </View>
            
            <View style={styles.statusItem}>
              <View style={[styles.statusDot, { backgroundColor: "#ff9800" }]} />
              <Text style={styles.statusLabel}>Pending</Text>
              <Text style={styles.statusCount}>{statusCounts.pending}</Text>
            </View>
            
            <View style={styles.statusItem}>
              <View style={[styles.statusDot, { backgroundColor: "#f44336" }]} />
              <Text style={styles.statusLabel}>Rejected</Text>
              <Text style={styles.statusCount}>{statusCounts.rejected}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Helper function to get a color for a category based on index
const getCategoryColor = (index: number) => {
  const colors = ["#2089dc", "#4caf50", "#ff9800", "#f44336", "#9c27b0"];
  return colors[index % colors.length];
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  dateRangeSelector: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  dateRangeButton: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 10,
  },
  selectedDateRange: {
    backgroundColor: '#2089dc',
  },
  dateRangeText: {
    fontSize: 14,
    color: '#666',
  },
  selectedDateRangeText: {
    color: '#fff',
    fontWeight: '500',
  },
  dateNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  dateRangeTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 10,
  },
  section: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
    marginLeft: 8,
  },
  totalHoursContainer: {
    alignItems: 'center',
    marginVertical: 15,
  },
  totalHours: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#2089dc',
  },
  totalHoursLabel: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  productivityTrend: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  productivityTrendText: {
    fontSize: 14,
    marginLeft: 5,
  },
  // Simplified chart styles
  hoursByDayScrollView: {
    marginTop: 15,
  },
  chartContainer: {
    paddingBottom: 10,
    paddingTop: 10,
    marginHorizontal: -10,
  },
  dayColumn: {
    width: 60,
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginHorizontal: 5,
  },
  monthDayColumn: {
    width: 70,
  },
  barContainer: {
    height: 180,
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  dayBar: {
    width: 40,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    minHeight: 5,
  },
  dayHours: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    marginBottom: 4,
    textAlign: 'center',
  },
  dayName: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  monthDateText: {
    fontSize: 12,
    width: 70,
  },
  // Category breakdown styles
  categoryRow: {
    flexDirection: 'row',
    marginBottom: 15,
    alignItems: 'center',
  },
  categoryInfo: {
    width: '30%',
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  categoryHours: {
    fontSize: 12,
    color: '#666',
  },
  categoryBarContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryBar: {
    height: 10,
    borderRadius: 5,
  },
  categoryPercentage: {
    marginLeft: 8,
    fontSize: 12,
    color: '#666',
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 15,
  },
  statusItem: {
    alignItems: 'center',
  },
  statusDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginBottom: 5,
  },
  statusLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  statusCount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default TeamMemberReportScreen;