import React, { useState, useEffect } from 'react';
import { 
  View, Text, FlatList, StyleSheet, TouchableOpacity, 
  ActivityIndicator, Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Divider } from 'react-native-paper';
import { format, isAfter, isBefore, addDays } from 'date-fns';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Type for the navigation stack
type RootStackParamList = {
  TaskScreen: undefined;
  TaskDetail: { task: Task };
};

type TaskScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'TaskScreen'
>;

// Attachment interface
interface Attachment {
  type: 'image' | 'document';
  uri: string;
  name: string;
  size?: number;
  mimeType?: string;
}

// Task type definition
interface Task {
  id: string;
  title: string;
  notes: string;
  assignedBy: string;
  assignedDate: string;
  dueDate?: string;
  category: 'Development' | 'Design' | 'Meeting' | 'Documentation' | 'Testing' | 'Urgent';
  status: 'Pending' | 'In Progress' | 'Completed';
  attachments?: Attachment[];
}

// Filter option type
type FilterOption = 'all' | 'pending' | 'completed' | 'urgent';

const TaskScreen = () => {
  // State variables
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<FilterOption>('all');
  const navigation = useNavigation<TaskScreenNavigationProp>();
  
  // Mock data for tasks
  const mockTasks: Task[] = [
    {
      id: '1',
      title: 'Implement New Dashboard UI Components',
      notes: 'Create reusable UI components for the dashboard following our design system. Include charts, activity feed, and notification panels. Make sure everything is responsive and follows accessibility guidelines.',
      assignedBy: 'Sarah Johnson',
      assignedDate: '2025-05-01',
      dueDate: '2025-05-15',
      category: 'Development',
      status: 'In Progress',
      attachments: [
        {
          type: 'image',
          uri: 'https://picsum.photos/id/231/200/300',
          name: 'dashboard_mockup.jpg'
        },
        {
          type: 'document',
          uri: 'https://example.com/doc',
          name: 'design_specs.pdf'
        }
      ]
    },
    {
      id: '2',
      title: 'Write API Documentation',
      notes: 'Document all API endpoints for the timesheet feature. Include request/response examples, error codes, and authentication requirements.',
      assignedBy: 'Michael Chen',
      assignedDate: '2025-05-03',
      dueDate: '2025-05-10',
      category: 'Documentation',
      status: 'Pending',
      attachments: [
        {
          type: 'document',
          uri: 'https://example.com/doc',
          name: 'api_template.md'
        },
        {
          type: 'document',
          uri: 'https://example.com/doc',
          name: 'endpoints_list.xlsx'
        }
      ]
    },
    {
      id: '3',
      title: 'Fix Authentication Bug',
      notes: 'Users are getting logged out randomly after 30 minutes despite selecting "Remember me". Investigate and fix the issue.',
      assignedBy: 'Sarah Johnson',
      assignedDate: '2025-05-02',
      dueDate: '2025-05-06',
      category: 'Urgent',
      status: 'Pending',
      attachments: [
        {
          type: 'image',
          uri: 'https://picsum.photos/id/24/200/300',
          name: 'error_screenshot.png'
        }
      ]
    },
    {
      id: '4',
      title: 'Sprint Planning Meeting',
      notes: 'Attend sprint planning meeting to discuss upcoming tasks for the next two weeks.',
      assignedBy: 'Michael Chen',
      assignedDate: '2025-05-03',
      dueDate: '2025-05-08',
      category: 'Meeting',
      status: 'Pending'
    },
    {
      id: '5',
      title: 'Redesign Mobile Navigation',
      notes: 'Improve the mobile navigation experience based on user feedback. Focus on making it more intuitive and accessible.',
      assignedBy: 'Emily Rodriguez',
      assignedDate: '2025-04-28',
      dueDate: '2025-05-12',
      category: 'Design',
      status: 'In Progress',
      attachments: [
        {
          type: 'image',
          uri: 'https://picsum.photos/id/60/200/300',
          name: 'navigation_wireframe.jpg'
        },
        {
          type: 'image',
          uri: 'https://picsum.photos/id/42/200/300',
          name: 'mobile_menu.jpg'
        },
        {
          type: 'document',
          uri: 'https://example.com/doc',
          name: 'user_feedback.docx'
        }
      ]
    },
    {
      id: '6',
      title: 'QA Testing for Version 2.1',
      notes: 'Perform thorough testing of all new features in version 2.1 before release. Create detailed test reports.',
      assignedBy: 'Sarah Johnson',
      assignedDate: '2025-05-04',
      dueDate: '2025-05-11',
      category: 'Testing',
      status: 'Pending'
    },
    {
      id: '7',
      title: 'Update User Onboarding Flow',
      notes: 'Implement the new user onboarding flow as per the latest designs. Include tutorial screens and tooltips.',
      assignedBy: 'Emily Rodriguez',
      assignedDate: '2025-04-25',
      dueDate: '2025-05-05',
      category: 'Development',
      status: 'Completed'
    }
  ];
  
  // Load tasks on component mount
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setTasks(mockTasks);
      setLoading(false);
    }, 1000);
  }, []);
  
  // Function to get filtered tasks
  const getFilteredTasks = () => {
    switch (activeFilter) {
      case 'pending':
        return tasks.filter(task => task.status !== 'Completed');
      case 'completed':
        return tasks.filter(task => task.status === 'Completed');
      case 'urgent':
        return tasks.filter(task => task.category === 'Urgent' || 
          (task.dueDate && isBefore(new Date(task.dueDate), addDays(new Date(), 2))));
      default:
        return tasks;
    }
  };
  
  // Function to handle task selection
  const handleTaskPress = (task: Task) => {
    navigation.navigate('TaskDetail', { task });
  };
  
  // Function to get category color
  const getCategoryColor = (category: Task['category']) => {
    switch (category) {
      case 'Development':
        return '#4a6da7';
      case 'Design':
        return '#9c27b0';
      case 'Meeting':
        return '#ff9800';
      case 'Documentation':
        return '#607d8b';
      case 'Testing':
        return '#8bc34a';
      case 'Urgent':
        return '#f44336';
      default:
        return '#2089dc';
    }
  };
  
  // Function to get status color
  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'Pending':
        return '#ff9800';
      case 'In Progress':
        return '#2089dc';
      case 'Completed':
        return '#4caf50';
      default:
        return '#888';
    }
  };
  
  // Function to render the task item
  const renderTaskItem = ({ item }: { item: Task }) => {
    const isDueSoon = item.dueDate && 
      isBefore(new Date(item.dueDate), addDays(new Date(), 2)) && 
      item.status !== 'Completed';
    
    return (
      <TouchableOpacity
        style={styles.taskItem}
        onPress={() => handleTaskPress(item)}
      >
        <View style={styles.taskHeader}>
          <View style={[styles.categoryTag, { backgroundColor: getCategoryColor(item.category) }]}>
            <Text style={styles.categoryTagText}>{item.category}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>
        
        <Text style={styles.taskTitle}>{item.title}</Text>
        
        <View style={styles.taskDetails}>
          <View style={styles.assigneeContainer}>
            <Ionicons name="person-outline" size={14} color="#777" />
            <Text style={styles.assignedByText}>
              {item.assignedBy}
            </Text>
          </View>
          
          {item.dueDate && (
            <View style={styles.dueDateContainer}>
              <Ionicons 
                name="calendar-outline" 
                size={14} 
                color={isDueSoon ? "#f44336" : "#777"} 
              />
              <Text style={[
                styles.dueDateText, 
                isDueSoon && styles.dueDateSoon
              ]}>
                Due: {format(new Date(item.dueDate), 'MMM d')}
              </Text>
            </View>
          )}
          
          {item.attachments && item.attachments.length > 0 && (
            <View style={styles.attachmentIndicator}>
              <Ionicons name="attach" size={14} color="#777" />
              <Text style={styles.attachmentIndicatorText}>
                {item.attachments.length}
              </Text>
            </View>
          )}
        </View>
        
        <Text 
          style={styles.taskNotes} 
          numberOfLines={1} 
          ellipsizeMode="tail"
        >
          {item.notes}
        </Text>
        
        <Divider style={styles.itemDivider} />
      </TouchableOpacity>
    );
  };
  
  // Function to render empty state
  const renderEmptyState = () => {
    if (loading) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color="#2089dc" />
          <Text style={styles.emptyText}>Loading tasks...</Text>
        </View>
      );
    }
    
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="checkmark-done-circle-outline" size={60} color="#e0e0e0" />
        <Text style={styles.emptyText}>You have no tasks right now!</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>My Tasks</Text>
        </View>
        <TouchableOpacity
          style={styles.historyButton}
        >
          <Ionicons name="options-outline" size={20} color="#2089dc" />
          <Text style={styles.historyButtonText}>Sort</Text>
        </TouchableOpacity>
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
          style={[styles.filterOption, activeFilter === 'pending' && styles.activeFilter]}
          onPress={() => setActiveFilter('pending')}
        >
          <Text style={[styles.filterText, activeFilter === 'pending' && styles.activeFilterText]}>
            Pending
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.filterOption, activeFilter === 'completed' && styles.activeFilter]}
          onPress={() => setActiveFilter('completed')}
        >
          <Text style={[styles.filterText, activeFilter === 'completed' && styles.activeFilterText]}>
            Completed
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.filterOption, activeFilter === 'urgent' && styles.activeFilter]}
          onPress={() => setActiveFilter('urgent')}
        >
          <Text style={[styles.filterText, activeFilter === 'urgent' && styles.activeFilterText]}>
            Urgent
          </Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={getFilteredTasks()}
        renderItem={renderTaskItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.taskList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
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
  taskList: {
    padding: 16,
    paddingTop: 8,
  },
  taskItem: {
    marginBottom: 16,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  categoryTag: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  categoryTagText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '500',
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '500',
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  taskDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  assigneeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  assignedByText: {
    fontSize: 13,
    color: '#777',
    marginLeft: 4,
  },
  dueDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dueDateText: {
    fontSize: 13,
    color: '#777',
    marginLeft: 4,
  },
  dueDateSoon: {
    color: '#f44336',
    fontWeight: '500',
  },
  taskNotes: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  itemDivider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginTop: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 16,
  },
  attachmentIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  attachmentIndicatorText: {
    fontSize: 12,
    color: '#777',
    marginLeft: 4,
  },
});

export default TaskScreen;
