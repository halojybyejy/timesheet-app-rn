import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, 
  ScrollView, TextInput, Image, Modal, Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { format, isBefore, addDays } from 'date-fns';
import { useNavigation } from '@react-navigation/core';
import { useRoute } from '@react-navigation/core';
import { Badge, Chip } from 'react-native-paper';

// Get screen dimensions for the full-screen image
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Attachment interface
interface Attachment {
  type: 'image' | 'document';
  uri: string;
  name: string;
  size?: number;
  mimeType?: string;
}

// Interface for completed tasks
interface CompletedTask {
  title: string;
  category: string;
  notes?: string;
}

// Interface for Timesheet
interface Timesheet {
  id: string;
  date: string;
  memberId: string;
  memberName: string;
  clockIn: string;
  clockOut: string;
  totalHours: number;
  completedTasks: CompletedTask[];
  status: 'Pending' | 'Approved' | 'Rejected';
  rejectionReason?: string;
  attachments?: Attachment[];
  description?: string;
}


// Route params type
type RouteParams = {
  timesheet: Timesheet;
  onStatusUpdate: (id: string, newStatus: 'Approved' | 'Rejected', reason?: string) => void;
};

const TimesheetDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { timesheet } = route.params as RouteParams;
  
  const [personalNote, setPersonalNote] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageViewerVisible, setImageViewerVisible] = useState(false);
  
  // Function to handle image tap
  const handleImageTap = (uri: string) => {
    setSelectedImage(uri);
    setImageViewerVisible(true);
  };
  
  // Function to close the image viewer
  const closeImageViewer = () => {
    setImageViewerVisible(false);
  };
  
  // Function to mark timesheet as completed
  const handleMarkAsCompleted = () => {
    // In a real app, this would update the timesheet in a database
    // For now, we just go back to the previous screen
    navigation.goBack();
  };
  
  // Function to get category color
  const getCategoryColor = (category: string) => {
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
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return '#ff9800';
      case 'Approved':
        return '#4caf50';
      case 'Rejected':
        return '#f44336';
      default:
        return '#888';
    }
  };
  
  const isDueSoon = timesheet.date && 
    isBefore(new Date(timesheet.date), addDays(new Date(), 2)) && 
    timesheet.status === 'Pending';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#2089dc" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Timesheet Details</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView style={styles.scrollView}>
        {timesheet.completedTasks && timesheet.completedTasks.length > 0 && 
          timesheet.completedTasks[0].category && (
          <View style={[
            styles.categoryTag, 
            { backgroundColor: getCategoryColor(timesheet.completedTasks[0].category) }
          ]}>
            <Text style={styles.categoryTagText}>{timesheet.completedTasks[0].category}</Text>
          </View>
        )}
        
        <Text style={styles.taskTitle}>{timesheet.memberName}'s Timesheet</Text>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Member</Text>
          <View style={styles.assigneeContainer}>
            <Ionicons name="person-outline" size={16} color="#777" />
            <Text style={styles.sectionContent}>
              {timesheet.memberName}
            </Text>
          </View>
        </View>
        
        <View style={styles.datesContainer}>
          <View style={styles.dateItem}>
            <Text style={styles.sectionTitle}>Date</Text>
            <View style={styles.assigneeContainer}>
              <Ionicons name="calendar-outline" size={16} color="#777" />
              <Text style={styles.sectionContent}>
                {format(new Date(timesheet.date), 'MMM d, yyyy')}
              </Text>
            </View>
          </View>
          
          <View style={styles.dateItem}>
            <Text style={styles.sectionTitle}>Clock In/Out</Text>
            <View style={styles.assigneeContainer}>
              <Ionicons 
                name="time-outline" 
                size={16} 
                color="#777" 
              />
              <Text style={styles.sectionContent}>
                {timesheet.clockIn} - {timesheet.clockOut}
              </Text>
            </View>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Status</Text>
          <View style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(timesheet.status) }
          ]}>
            <Text style={styles.statusText}>{timesheet.status}</Text>
          </View>
        </View>
        
        {timesheet.description && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.sectionContent}>
              {timesheet.description}
            </Text>
          </View>
        )}
        
        {timesheet.attachments && timesheet.attachments.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Attachments</Text>
            <View style={styles.attachmentList}>
              {timesheet.attachments.map((attachment, index) => (
                <View key={index} style={styles.attachmentItem}>
                  {attachment.type === 'image' ? (
                    <>
                      <TouchableOpacity
                        onPress={() => handleImageTap(attachment.uri)}
                      >
                        <View style={styles.imageContainer}>
                          <Image 
                            source={{ uri: attachment.uri }} 
                            style={styles.attachmentImage}
                            resizeMode="cover"
                          />
                          <View style={styles.imageOverlay}>
                            <Ionicons name="expand-outline" size={22} color="#fff" />
                          </View>
                        </View>
                      </TouchableOpacity>
                      <Text style={styles.attachmentName}>{attachment.name}</Text>
                    </>
                  ) : (
                    <>
                      <View style={styles.documentIconContainer}>
                        <Ionicons name="document-text" size={24} color="#4F8EF7" />
                      </View>
                      <Text style={styles.attachmentName}>{attachment.name}</Text>
                    </>
                  )}
                </View>
              ))}
            </View>
          </View>
        )}
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Add Personal Note</Text>
          <TextInput
            style={styles.noteInput}
            value={personalNote}
            onChangeText={setPersonalNote}
            placeholder="Add a note for yourself..."
            multiline
          />
        </View>
      </ScrollView>
      
      {timesheet.status === 'Pending' && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.completeButton}
            onPress={handleMarkAsCompleted}
          >
            <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
            <Text style={styles.completeButtonText}>Approve Timesheet</Text>
          </TouchableOpacity>
        </View>
      )}
      
      {/* Full-screen image viewer modal */}
      <Modal
        visible={imageViewerVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeImageViewer}
      >
        <View style={styles.imageViewerContainer}>
          <TouchableOpacity
            style={styles.fullScreenTouchable}
            activeOpacity={1}
            onPress={closeImageViewer}
          >
            <Image
              source={{ uri: selectedImage || '' }}
              style={styles.fullScreenImage}
              resizeMode="contain"
            />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.closeButton}
            onPress={closeImageViewer}
          >
            <Ionicons name="close" size={28} color="#fff" />
          </TouchableOpacity>
          
          <View style={styles.imageViewerFooter}>
            <Text style={styles.imageViewerText}>Tap anywhere to close</Text>
          </View>
        </View>
      </Modal>
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
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  backButton: {
    padding: 4,
  },
  placeholder: {
    width: 32,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  categoryTag: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    marginBottom: 12,
  },
  categoryTagText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '500',
  },
  taskTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    color: '#888',
    marginBottom: 4,
  },
  sectionContent: {
    fontSize: 16,
    color: '#333',
    marginLeft: 4,
  },
  datesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  dateItem: {
    flex: 1,
  },
  dueDateSoon: {
    color: '#f44336',
    fontWeight: '500',
  },
  assigneeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '500',
  },
  attachmentList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
  },
  attachmentItem: {
    margin: 4,
    alignItems: 'center',
    width: 100,
  },
  attachmentImage: {
    width: 90,
    height: 90,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
    marginBottom: 4,
  },
  documentIconContainer: {
    width: 90,
    height: 90,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e8f0fe',
    marginBottom: 4,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  attachmentName: {
    fontSize: 12,
    color: '#555',
    textAlign: 'center',
    width: 90,
    marginTop: 4,
  },
  noteInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    height: 100,
    textAlignVertical: 'top',
    fontSize: 14,
    color: '#333',
    marginTop: 8,
  },
  buttonContainer: {
    padding: 16,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  completeButton: {
    backgroundColor: '#4caf50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
  },
  completeButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
  // Image viewer styles
  imageViewerContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenImage: {
    width: screenWidth,
    height: screenHeight,
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
  },
  imageContainer: {
    position: 'relative',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 12,
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenTouchable: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageViewerFooter: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    padding: 8,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
  },
  imageViewerText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '400',
    textAlign: 'center',
  },
});


export default TimesheetDetailScreen; 