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
  const { timesheet, onStatusUpdate } = route.params as RouteParams;
  
  const [personalNote, setPersonalNote] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageViewerVisible, setImageViewerVisible] = useState(false);
  const [rejectionModalVisible, setRejectionModalVisible] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  console.log('timesheet');
  console.log(timesheet);
  // Function to handle image tap
  const handleImageTap = (uri: string) => {
    setSelectedImage(uri);
    setImageViewerVisible(true);
  };
  
  // Function to close the image viewer
  const closeImageViewer = () => {
    setImageViewerVisible(false);
  };
  
  // Function to approve timesheet
  const handleApproveTimesheet = () => {
    onStatusUpdate(timesheet.id, 'Approved');
    navigation.goBack();
  };
  
  // Function to open rejection modal
  const openRejectionModal = () => {
    setRejectionModalVisible(true);
  };
  
  // Function to close rejection modal
  const closeRejectionModal = () => {
    setRejectionModalVisible(false);
    setRejectionReason('');
  };
  
  // Function to submit rejection
  const handleRejectTimesheet = () => {
    onStatusUpdate(timesheet.id, 'Rejected', rejectionReason);
    setRejectionModalVisible(false);
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
  
  // Get main category from timesheet for header tag
  const mainCategory = timesheet.completedTasks && 
    timesheet.completedTasks.length > 0 && 
    timesheet.completedTasks[0].category ? 
    timesheet.completedTasks[0].category : 'Development';
  
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
        {/* Category Tag */}
        <View style={[
          styles.categoryTag, 
          { backgroundColor: getCategoryColor(mainCategory) }
        ]}>
          <Text style={styles.categoryTagText}>{mainCategory}</Text>
        </View>
        
        {/* Title */}
        <Text style={styles.taskTitle}>{timesheet.memberName}'s Timesheet</Text>
        
        {/* Assigned By Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Assigned By</Text>
          <View style={styles.assigneeContainer}>
            <Ionicons name="person-outline" size={16} color="#777" />
            <Text style={styles.sectionContent}>
              {timesheet.memberName}
            </Text>
          </View>
        </View>
        
        {/* Date Information */}
        <View style={styles.datesContainer}>
          <View style={styles.dateItem}>
            <Text style={styles.sectionTitle}>Assigned Date</Text>
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
        
        {/* Status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Status</Text>
          <View style={styles.statusContainer}>
            <View style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(timesheet.status) }
            ]}>
              <Text style={styles.statusText}>{timesheet.status}</Text>
            </View>
          </View>
        </View>
        
        {/* Task Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Task Description</Text>
          <Text style={styles.descriptionText}>
            {timesheet.description || "Create reusable UI components for the dashboard following our design system. Include charts, activity feed, and notification panels. Make sure everything is responsive and follows accessibility guidelines."}
          </Text>
        </View>
        
        {/* Attachments */}
        {(timesheet.attachments && timesheet.attachments.length > 0) ? (
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
                          <View style={styles.expandIcon}>
                            <Ionicons name="expand-outline" size={16} color="#fff" />
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
        ) : (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Attachments</Text>
            <Text style={styles.sectionContent}>No attachments found</Text>
          </View>
        )}

        {/* Personal Note */}
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
      
      {/* Action Buttons */}
      {timesheet.status === 'Pending' && (
        <View style={styles.buttonContainer}>
          <View style={styles.buttonsRow}>
            <TouchableOpacity
              style={[styles.button, styles.approveButton]}
              onPress={handleApproveTimesheet}
            >
              <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
              <Text style={styles.buttonText}>Approve</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.button, styles.rejectButton]}
              onPress={openRejectionModal}
            >
              <Ionicons name="close-circle-outline" size={20} color="#fff" />
              <Text style={styles.buttonText}>Reject</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      
      {/* Mark as Completed Button (for status other than 'Pending') */}
      {timesheet.status !== 'Pending' && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.completeButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
            <Text style={styles.completeButtonText}>Back to Timesheets</Text>
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
      
      {/* Rejection reason modal */}
      <Modal
        visible={rejectionModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closeRejectionModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.rejectionModalContent}>
            <Text style={styles.rejectionModalTitle}>Reject Timesheet</Text>
            
            <Text style={styles.rejectionModalLabel}>
              Please provide a reason for rejection:
            </Text>
            
            <TextInput
              style={styles.rejectionInput}
              value={rejectionReason}
              onChangeText={setRejectionReason}
              placeholder="Enter rejection reason..."
              multiline
              autoFocus
            />
            
            <View style={styles.rejectionModalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={closeRejectionModal}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.modalButton, 
                  styles.submitButton,
                  !rejectionReason.trim() && styles.disabledButton
                ]}
                onPress={handleRejectTimesheet}
                disabled={!rejectionReason.trim()}
              >
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>
            </View>
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
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginBottom: 16,
  },
  categoryTagText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },
  taskTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    color: '#888',
    marginBottom: 8,
  },
  sectionContent: {
    fontSize: 16,
    color: '#333',
    marginLeft: 8,
  },
  datesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
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
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },
  descriptionText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  attachmentList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  attachmentItem: {
    marginRight: 16,
    marginBottom: 16,
    alignItems: 'center',
    width: 110,
  },
  attachmentImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
    marginBottom: 4,
  },
  documentIconContainer: {
    width: 100,
    height: 100,
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
    width: 100,
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
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 8,
    marginHorizontal: 6,
  },
  approveButton: {
    backgroundColor: '#4caf50',
  },
  rejectButton: {
    backgroundColor: '#f44336',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
  completeButton: {
    backgroundColor: '#4caf50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 8,
  },
  completeButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
  // Image viewer styles
  imageContainer: {
    position: 'relative',
  },
  expandIcon: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 12,
    padding: 4,
  },
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
  // Rejection modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  rejectionModalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    maxWidth: 500,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  rejectionModalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  rejectionModalLabel: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
  },
  rejectionInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    height: 120,
    textAlignVertical: 'top',
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  rejectionModalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginLeft: 10,
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
  },
  cancelButtonText: {
    color: '#555',
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#f44336',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: '#e0e0e0',
    opacity: 0.7,
  },
});


export default TimesheetDetailScreen; 