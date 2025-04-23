import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Divider } from 'react-native-paper';
import { format } from 'date-fns';

type LeaderNavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Define the Task Draft type
interface TaskDraft {
  id: string;
  title: string;
  assignee: string;
  dueDate: string;
  priority: 'High' | 'Medium' | 'Low';
  category: string;
}

// Mock data for demonstration
const mockTaskDrafts: TaskDraft[] = [
  { 
    id: '1', 
    title: 'Create Dashboard UI Components', 
    assignee: 'Alice Wong', 
    dueDate: '2025-05-15', 
    priority: 'Medium',
    category: 'Development' 
  },
  { 
    id: '2', 
    title: 'Fix Authentication Bug', 
    assignee: 'Bob Johnson', 
    dueDate: '2025-05-08', 
    priority: 'High',
    category: 'Testing' 
  },
  { 
    id: '3', 
    title: 'Write API Documentation', 
    assignee: 'Mike Davis', 
    dueDate: '2025-05-20', 
    priority: 'Low',
    category: 'Documentation' 
  },
];

const LeaderTimesheetDraftScreen = () => {
  const navigation = useNavigation<LeaderNavigationProp>();
  
  const handleEditDraft = (id: string) => {
    // In a real app, we would load the draft data and navigate to the form screen
    console.log('Editing task draft:', id);
    navigation.navigate('AssignTask');
  };
  
  // Get priority color
  const getPriorityColor = (priority: 'High' | 'Medium' | 'Low') => {
    switch (priority) {
      case 'High': return '#FF3B30';
      case 'Medium': return '#FF9500';
      case 'Low': return '#34C759';
      default: return '#007AFF';
    }
  };
  
  const renderItem = ({ item }: { item: TaskDraft }) => (
    <View>
      <TouchableOpacity 
        style={styles.draftItem}
        onPress={() => handleEditDraft(item.id)}
      >
        <View style={styles.draftInfo}>
          <View style={styles.draftHeader}>
            <Text style={styles.draftTitle}>{item.title}</Text>
            <View style={[styles.priorityContainer, { backgroundColor: getPriorityColor(item.priority) + '20' }]}>
              <Text style={[styles.priorityText, { color: getPriorityColor(item.priority) }]}>{item.priority}</Text>
            </View>
          </View>
          
          <View style={styles.draftDetails}>
            <View style={styles.detailItem}>
              <Ionicons name="person-outline" size={16} color="#777" />
              <Text style={styles.detailText}>{item.assignee}</Text>
            </View>
            
            <View style={styles.detailItem}>
              <Ionicons name="calendar-outline" size={16} color="#777" />
              <Text style={styles.detailText}>{format(new Date(item.dueDate), 'MMM d, yyyy')}</Text>
            </View>
            
            <View style={styles.tagContainer}>
              <Text style={styles.tagText}>{item.category}</Text>
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
        <Text style={styles.headerTitle}>Task Assignment Drafts</Text>
      </View>
      
      {mockTaskDrafts.length > 0 ? (
        <FlatList
          data={mockTaskDrafts}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="clipboard-outline" size={60} color="#e0e0e0" />
          <Text style={styles.emptyText}>No draft tasks available</Text>
          <TouchableOpacity 
            style={styles.createButton}
            onPress={() => navigation.navigate('AssignTask')}
          >
            <Text style={styles.createButtonText}>Create New Task Assignment</Text>
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
  draftTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    marginRight: 8,
  },
  priorityContainer: {
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '500',
  },
  draftDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 4,
  },
  detailText: {
    fontSize: 14,
    color: '#777',
    marginLeft: 6,
  },
  tagContainer: {
    backgroundColor: '#f0f7ff',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginLeft: 'auto',
  },
  tagText: {
    fontSize: 12,
    color: '#2089dc',
    fontWeight: '500',
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

export default LeaderTimesheetDraftScreen; 