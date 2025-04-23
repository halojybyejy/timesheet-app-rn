import React, { Component } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, 
  ScrollView, TextInput, Image, Dimensions, Modal, Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Badge, Button, IconButton } from 'react-native-paper';
import { format, parseISO } from 'date-fns';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { RootStackParamList } from '../../navigation/types';

// Document picker
let DocumentPicker: any = null;
try {
  DocumentPicker = require('react-native-document-picker').default;
} catch (error) {
  console.log('DocumentPicker not available', error);
}

// Get screen dimensions for the full-screen image
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Interface for completed tasks
interface CompletedTask {
  title: string;
  category: string;
  notes?: string;
}

// Interface for attachments
interface Attachment {
  type: 'image' | 'document';
  uri: string;
  name: string;
  size?: number;
  mimeType?: string;
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

type DetailScreenRouteProp = RouteProp<RootStackParamList, 'TimesheetDetail'>;
type DetailScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface Props {
  route: DetailScreenRouteProp;
  navigation: DetailScreenNavigationProp;
}

interface State {
  selectedImage: string | null;
  imageViewerVisible: boolean;
  confirmModalVisible: boolean;
  confirmAction: 'approve' | 'reject';
  rejectionReason: string;
  attachments: Attachment[];
  displayTimesheet: Timesheet;
}

class TimesheetDetailScreen extends Component<Props, State> {
  timesheet: Timesheet;
  onStatusUpdate: (id: string, newStatus: 'Approved' | 'Rejected', reason?: string) => void;

  constructor(props: Props) {
    super(props);
    
    try {
      // Check if route.params exists and has the expected properties
      if (!props.route.params) {
        throw new Error('No params received in TimesheetDetailScreen');
      }
      
      if (!props.route.params.timesheet) {
        throw new Error('No timesheet data received');
      }
      
      if (!props.route.params.onStatusUpdate || typeof props.route.params.onStatusUpdate !== 'function') {
        throw new Error('onStatusUpdate function not received or invalid');
      }
      
      this.timesheet = props.route.params.timesheet;
      this.onStatusUpdate = props.route.params.onStatusUpdate;
    } catch (error) {
      console.error('Route params error:', error);
      Alert.alert(
        'Error',
        `There was an error loading the timesheet: ${error instanceof Error ? error.message : 'Unknown error'}`,
        [{ text: 'Go Back', onPress: () => props.navigation.goBack() }]
      );
      
      // Provide fallback values to prevent the app from crashing
      this.timesheet = {
        id: 'error',
        date: new Date().toISOString(),
        memberId: 'error',
        memberName: 'Error Loading Data',
        clockIn: '00:00',
        clockOut: '00:00',
        totalHours: 0,
        completedTasks: [],
        status: 'Pending'
      };
      this.onStatusUpdate = () => {
        console.log('Fallback onStatusUpdate called');
        props.navigation.goBack();
      };
    }
    
    this.state = {
      selectedImage: null,
      imageViewerVisible: false,
      confirmModalVisible: false,
      confirmAction: 'approve',
      rejectionReason: '',
      attachments: [],
      displayTimesheet: this.timesheet,
    };
  }

  componentDidMount() {
    // Create an updated timesheet with demo data if needed
    const updatedTimesheet = { ...this.timesheet };
    
    // Add a description if not present
    if (!updatedTimesheet.description) {
      updatedTimesheet.description = "This timesheet includes work on implementing the login screen UI and fixing the navigation bug that was causing issues with the back button. All required fields and validation were completed, and the back button issue was resolved successfully.";
    }
    
    // Add demo attachments if none exist
    if (!updatedTimesheet.attachments || updatedTimesheet.attachments.length === 0) {
      // Create demo attachments
      updatedTimesheet.attachments = [
        {
          type: 'image' as const,
          uri: 'https://images.unsplash.com/photo-1517849845537-4d257902454a',
          name: 'screenshot_1.jpg',
          size: 24500,
        },
        {
          type: 'document' as const,
          uri: 'https://example.com/doc.pdf',
          name: 'time_report.pdf',
          size: 125000,
        },
        {
          type: 'image' as const,
          uri: 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac',
          name: 'work_evidence.jpg',
          size: 35200,
        }
      ];
    }
    
    // Update the displayed timesheet
    this.setState({ displayTimesheet: updatedTimesheet });
  }
  
  // Function to handle image tap
  handleImageTap = (uri: string) => {
    if (!uri) {
      console.log('Image URI is empty or invalid');
      return;
    }
    this.setState({
      selectedImage: uri,
      imageViewerVisible: true
    });
  };
  
  // Function to close the image viewer
  closeImageViewer = () => {
    this.setState({ imageViewerVisible: false });
  };
  
  // Handle showing confirmation modal
  handleConfirmation = (action: 'approve' | 'reject') => {
    this.setState({
      confirmAction: action,
      rejectionReason: '',
      confirmModalVisible: true
    });
  };
  
  // Handle status update
  handleStatusUpdate = () => {
    this.onStatusUpdate(
      this.timesheet.id, 
      this.state.confirmAction === 'approve' ? 'Approved' : 'Rejected',
      this.state.confirmAction === 'reject' ? this.state.rejectionReason : undefined
    );
    this.setState({ confirmModalVisible: false });
    this.props.navigation.goBack();
  };
  
  // Function to pick an image from gallery
  pickImage = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.8,
        selectionLimit: 1,
      });
      
      if (result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        this.setState(prev => ({
          attachments: [
            ...prev.attachments, 
            {
              type: 'image',
              uri: asset.uri || '',
              name: asset.fileName || 'image.jpg',
              size: asset.fileSize,
              mimeType: asset.type
            }
          ]
        }));
      }
    } catch (error) {
      console.log('Image picker error:', error);
    }
  };

  // Function to take a photo with camera
  takePhoto = async () => {
    try {
      const result = await launchCamera({
        mediaType: 'photo',
        quality: 0.8,
        cameraType: 'back',
      });
      
      if (result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        this.setState(prev => ({
          attachments: [
            ...prev.attachments, 
            {
              type: 'image',
              uri: asset.uri || '',
              name: asset.fileName || 'image.jpg',
              size: asset.fileSize,
              mimeType: asset.type
            }
          ]
        }));
      }
    } catch (error) {
      console.log('Camera error:', error);
    }
  };

  // Function to pick a document
  pickDocument = async () => {
    if (!DocumentPicker) return;
    
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      
      if (result) {
        this.setState(prev => ({
          attachments: [
            ...prev.attachments,
            {
              type: 'document',
              uri: result.uri,
              name: result.name || 'document',
              size: result.size,
              mimeType: result.type
            }
          ]
        }));
      }
    } catch (error) {
      if (!DocumentPicker.isCancel(error)) {
        console.log('Document picker error:', error);
      }
    }
  };

  // Function to remove an attachment
  removeAttachment = (index: number) => {
    this.setState(prev => ({
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  // Render an attachment in the rejection form
  renderAttachment = (attachment: Attachment, index: number) => (
    <View key={index} style={styles.attachmentItem}>
      {attachment.type === 'image' ? (
        <Image source={{ uri: attachment.uri }} style={styles.attachmentThumbnail} />
      ) : (
        <View style={styles.documentIcon}>
          <Ionicons name="document-text" size={24} color="#4F8EF7" />
        </View>
      )}
      <Text style={styles.attachmentName} numberOfLines={1} ellipsizeMode="middle">
        {attachment.name}
      </Text>
      <IconButton
        icon="close-circle"
        size={20}
        onPress={() => this.removeAttachment(index)}
        style={styles.removeButton}
      />
    </View>
  );

  render() {
    const { 
      selectedImage, 
      imageViewerVisible, 
      confirmModalVisible, 
      confirmAction, 
      rejectionReason, 
      attachments, 
      displayTimesheet 
    } = this.state;

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => this.props.navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#2089dc" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Timesheet Details</Text>
          <View style={styles.placeholder} />
        </View>
        
        <ScrollView style={styles.scrollView}>
          <View style={styles.statusSection}>
            <View 
              style={[
                styles.statusBadge,
                displayTimesheet.status === 'Pending' ? styles.pendingBadge : 
                displayTimesheet.status === 'Approved' ? styles.approvedBadge : 
                styles.rejectedBadge
              ]}
            >
              <Text style={styles.statusText}>{displayTimesheet.status}</Text>
            </View>
          </View>

          <Text style={styles.timesheetTitle}>{format(parseISO(this.timesheet.date), 'EEEE, MMMM d, yyyy')}</Text>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Member</Text>
            <View style={styles.infoContainer}>
              <Ionicons name="person-outline" size={20} color="#777" style={styles.infoIcon} />
              <Text style={styles.sectionContent}>
                {this.timesheet.memberName}
              </Text>
            </View>
          </View>

          <View style={styles.datesContainer}>
            <View style={styles.dateItem}>
              <Text style={styles.sectionTitle}>Clock In</Text>
              <View style={styles.infoContainer}>
                <Ionicons name="time-outline" size={20} color="#777" style={styles.infoIcon} />
                <Text style={styles.sectionContent}>
                  {this.timesheet.clockIn}
                </Text>
              </View>
            </View>
            
            <View style={styles.dateItem}>
              <Text style={styles.sectionTitle}>Clock Out</Text>
              <View style={styles.infoContainer}>
                <Ionicons name="time-outline" size={20} color="#777" style={styles.infoIcon} />
                <Text style={styles.sectionContent}>
                  {this.timesheet.clockOut}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Total Hours</Text>
            <View style={styles.infoContainer}>
              <Ionicons name="hourglass-outline" size={20} color="#777" style={styles.infoIcon} />
              <Text style={styles.sectionContent}>
                {displayTimesheet.totalHours} hours
              </Text>
            </View>
          </View>
          
          {displayTimesheet.description && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.sectionContent}>
                {displayTimesheet.description}
              </Text>
            </View>
          )}
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Completed Tasks</Text>
            {displayTimesheet.completedTasks.map((task, index) => (
              <View key={index} style={styles.taskItem}>
                <View style={styles.taskHeader}>
                  <Text style={styles.taskTitle}>{task.title}</Text>
                  <View style={[styles.categoryTag, { backgroundColor: getCategoryColor(task.category) }]}>
                    <Text style={styles.categoryTagText}>{task.category}</Text>
                  </View>
                </View>
                {task.notes && (
                  <Text style={styles.taskNotes}>{task.notes}</Text>
                )}
              </View>
            ))}
          </View>
          
          {/* Display rejection reason if timesheet was rejected */}
          {displayTimesheet.status === 'Rejected' && displayTimesheet.rejectionReason && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Rejection Reason</Text>
              <View style={styles.rejectionReasonBox}>
                <Text style={styles.rejectionReasonText}>{displayTimesheet.rejectionReason}</Text>
              </View>
            </View>
          )}
          
          {/* Display attachments if any */}
          {displayTimesheet.attachments && displayTimesheet.attachments.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Attachments</Text>
              <View style={styles.attachmentList}>
                {displayTimesheet.attachments.map((attachment, index) => (
                  <View key={index} style={styles.attachmentItem}>
                    {attachment.type === 'image' ? (
                      <TouchableOpacity
                        onPress={() => this.handleImageTap(attachment.uri)}
                      >
                        <Image 
                          source={{ uri: attachment.uri }} 
                          style={styles.attachmentImage}
                          resizeMode="cover"
                        />
                        <View style={styles.imageOverlay}>
                          <Ionicons name="expand-outline" size={18} color="#fff" />
                        </View>
                        <Text style={styles.attachmentName}>
                          {attachment.name}
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity>
                        <View style={styles.documentIconContainer}>
                          <Ionicons name="document-text" size={24} color="#4F8EF7" />
                        </View>
                        <Text style={styles.attachmentName}>{attachment.name}</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
              </View>
            </View>
          )}
          
          {this.timesheet.status === 'Pending' && (
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.approveButton}
                onPress={() => this.handleConfirmation('approve')}
              >
                <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
                <Text style={styles.buttonText}>Approve Timesheet</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.rejectButton}
                onPress={() => this.handleConfirmation('reject')}
              >
                <Ionicons name="close-circle-outline" size={20} color="#fff" />
                <Text style={styles.buttonText}>Reject Timesheet</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
        
        {/* Confirmation Modal */}
        <Modal
          visible={confirmModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => this.setState({ confirmModalVisible: false })}
        >
          <View style={styles.modalContainer}>
            <View style={styles.confirmModalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {confirmAction === 'approve' ? 'Approve Timesheet' : 'Reject Timesheet'}
                </Text>
                <TouchableOpacity onPress={() => this.setState({ confirmModalVisible: false })}>
                  <Ionicons name="close" size={24} color="#333" />
                </TouchableOpacity>
              </View>
              
              <ScrollView style={styles.confirmBody}>
                <Text style={styles.confirmText}>
                  {confirmAction === 'approve' 
                    ? 'Are you sure you want to approve this timesheet?'
                    : 'Are you sure you want to reject this timesheet?'
                  }
                </Text>
                
                {/* Rejection reason input field - only show when rejecting */}
                {confirmAction === 'reject' && (
                  <>
                    <TextInput
                      style={styles.rejectionInput}
                      placeholder="Please provide reason for rejection"
                      value={rejectionReason}
                      onChangeText={(text) => this.setState({ rejectionReason: text })}
                      multiline
                      textAlignVertical="top"
                      numberOfLines={3}
                    />
                    
                    {/* Attachment section */}
                    <View style={styles.attachmentSection}>
                      <Text style={styles.attachmentSectionTitle}>Attachments</Text>
                      
                      <View style={styles.attachmentActions}>
                        <TouchableOpacity 
                          style={styles.attachmentButton}
                          onPress={this.pickImage}
                        >
                          <Ionicons name="image-outline" size={22} color="#007AFF" />
                          <Text style={styles.attachmentButtonText}>Gallery</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                          style={styles.attachmentButton}
                          onPress={this.takePhoto}
                        >
                          <Ionicons name="camera-outline" size={22} color="#007AFF" />
                          <Text style={styles.attachmentButtonText}>Camera</Text>
                        </TouchableOpacity>
                        
                        {DocumentPicker && (
                          <TouchableOpacity 
                            style={styles.attachmentButton}
                            onPress={this.pickDocument}
                          >
                            <Ionicons name="document-outline" size={22} color="#007AFF" />
                            <Text style={styles.attachmentButtonText}>Document</Text>
                          </TouchableOpacity>
                        )}
                      </View>
                      
                      {/* Display selected attachments */}
                      {attachments.length > 0 && (
                        <View style={styles.selectedAttachments}>
                          {attachments.map((attachment, index) => 
                            this.renderAttachment(attachment, index)
                          )}
                        </View>
                      )}
                    </View>
                  </>
                )}
                
                <View style={styles.confirmButtons}>
                  <Button
                    mode="outlined"
                    style={styles.cancelButton}
                    onPress={() => this.setState({ confirmModalVisible: false })}
                  >
                    Cancel
                  </Button>
                  <Button
                    mode="contained"
                    style={[
                      styles.confirmButton,
                      confirmAction === 'approve' ? styles.approveButton : styles.rejectButton
                    ]}
                    disabled={confirmAction === 'reject' && !rejectionReason}
                    onPress={this.handleStatusUpdate}
                  >
                    {confirmAction === 'approve' ? 'Approve' : 'Reject'}
                  </Button>
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
        
        {/* Full-screen image viewer modal */}
        <Modal
          visible={imageViewerVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={this.closeImageViewer}
        >
          <View style={styles.imageViewerContainer}>
            <TouchableOpacity
              style={styles.fullScreenTouchable}
              activeOpacity={1}
              onPress={this.closeImageViewer}
            >
              <Image
                source={{ uri: selectedImage || '' }}
                style={styles.fullScreenImage}
                resizeMode="contain"
                onError={(e) => console.log('Error loading image:', e.nativeEvent.error)}
              />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.closeButton}
              onPress={this.closeImageViewer}
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
  }
}

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'Development':
      return '#3f51b5';
    case 'Design':
      return '#9c27b0';
    case 'Meeting':
      return '#ff9800';
    case 'Documentation':
      return '#607d8b';
    case 'Testing':
      return '#8bc34a';
    case 'Bug Fix':
      return '#2196f3';
    case 'Urgent':
      return '#f44336';
    default:
      return '#2089dc';
  }
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
  timesheetTitle: {
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
    marginBottom: 8,
  },
  sectionContent: {
    fontSize: 16,
    color: '#333',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoIcon: {
    marginRight: 8,
  },
  datesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  dateItem: {
    flex: 1,
  },
  statusSection: {
    alignSelf: 'flex-start',
    marginTop: 8,
    marginBottom: 16,
  },
  statusBadge: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  pendingBadge: {
    backgroundColor: '#ff9800',
  },
  approvedBadge: {
    backgroundColor: '#4caf50',
  },
  rejectedBadge: {
    backgroundColor: '#f44336',
  },
  taskItem: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    flex: 1,
  },
  categoryTag: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  categoryTagText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '500',
  },
  taskNotes: {
    fontSize: 14,
    color: '#666',
  },
  rejectionReasonBox: {
    backgroundColor: '#ffebee',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ffcdd2',
  },
  rejectionReasonText: {
    fontSize: 14,
    color: '#d32f2f',
  },
  attachmentList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
  },
  attachmentItem: {
    margin: 4,
    marginRight: 12,
    alignItems: 'center',
    width: 84,
  },
  attachmentImage: {
    width: 84,
    height: 84,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
  },
  documentIconContainer: {
    width: 84,
    height: 84,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e8f0fe',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  attachmentName: {
    fontSize: 12,
    color: '#555',
    textAlign: 'center',
    marginTop: 8,
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 12,
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    marginTop: 10,
    marginBottom: 24,
    gap: 12,
  },
  approveButton: {
    backgroundColor: '#4caf50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
  },
  rejectButton: {
    backgroundColor: '#f44336',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 16,
  },
  confirmModalContent: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  confirmBody: {
    padding: 16,
  },
  confirmText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 16,
  },
  rejectionInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    height: 100,
    fontSize: 16,
    color: '#333',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  attachmentSection: {
    marginBottom: 16,
  },
  attachmentSectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 12,
  },
  attachmentActions: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  attachmentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f7ff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
  },
  attachmentButtonText: {
    fontSize: 14,
    color: '#007AFF',
    marginLeft: 4,
  },
  selectedAttachments: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  attachmentThumbnail: {
    width: 60,
    height: 60,
    borderRadius: 4,
    backgroundColor: '#e0e0e0',
  },
  documentIcon: {
    width: 60,
    height: 60,
    borderRadius: 4,
    backgroundColor: '#e8f0fe',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  removeButton: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#fff',
    borderRadius: 12,
    margin: 0,
    padding: 0,
  },
  confirmButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
  },
  cancelButton: {
    marginRight: 8,
  },
  confirmButton: {
    minWidth: 100,
  },
  imageViewerContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenTouchable: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
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
  imageViewerFooter: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    padding: 8,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageViewerText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '400',
    textAlign: 'center',
  },
});

export default TimesheetDetailScreen; 