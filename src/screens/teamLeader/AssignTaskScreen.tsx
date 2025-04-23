import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
  ActivityIndicator,
  Platform,
  ToastAndroid,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
// @ts-ignore
import Ionicons from 'react-native-vector-icons/Ionicons';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { Divider } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

// Conditionally import DocumentPicker to avoid crashing
let DocumentPicker: any = null;
try {
  DocumentPicker = require('react-native-document-picker').default;
} catch (error) {
  console.log('DocumentPicker not available', error);
}

type Props = NativeStackScreenProps<RootStackParamList, 'AssignTask'>;

// Member type definition
interface Member {
  id: number;
  name: string;
  role: 'leader' | 'member';
}

// Priority options
type PriorityType = 'High' | 'Medium' | 'Low';
const PRIORITIES: PriorityType[] = ['High', 'Medium', 'Low'];

// Tag/Category options
type TagType = 'Design' | 'Development' | 'Testing' | 'Documentation' | 'Meeting';
const TAGS: TagType[] = ['Design', 'Development', 'Testing', 'Documentation', 'Meeting'];

// Add Attachment interface
interface Attachment {
  type: 'image' | 'document';
  uri: string;
  name: string;
  size?: number;
  mimeType?: string;
}

const AssignTaskScreen = ({ navigation }: Props) => {
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignToId, setAssignToId] = useState<number | null>(null);
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [priority, setPriority] = useState<PriorityType>('Medium');
  const [tag, setTag] = useState<TagType>('Development');
  
  // UI state
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Mock data - in a real app, you would fetch this from an API
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoadingMembers, setIsLoadingMembers] = useState(true);
  
  // Add attachment states
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isDocumentPickerAvailable, setIsDocumentPickerAvailable] = useState(false);
  
  // Check if DocumentPicker is available
  useEffect(() => {
    const checkDocumentPicker = async () => {
      try {
        if (DocumentPicker) {
          setIsDocumentPickerAvailable(true);
        }
      } catch (error) {
        console.log('Error checking DocumentPicker:', error);
        setIsDocumentPickerAvailable(false);
      }
    };
    
    checkDocumentPicker();
  }, []);
  
  // Fetch team members on mount
  useEffect(() => {
    // Simulating API call
    setTimeout(() => {
      const mockMembers: Member[] = [
        { id: 101, name: "John Smith", role: "leader" },
        { id: 102, name: "Bob Johnson", role: "member" },
        { id: 103, name: "Alice Wong", role: "member" },
        { id: 104, name: "Mike Davis", role: "member" },
      ];
      
      setMembers(mockMembers);
      setIsLoadingMembers(false);
    }, 1000);
  }, []);
  
  // Handle date change
  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    
    if (selectedDate) {
      setDueDate(selectedDate);
    }
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Validate title
    if (!title.trim()) {
      newErrors.title = 'Task title is required';
    }
    
    // Validate description
    if (!description.trim()) {
      newErrors.description = 'Task description is required';
    }
    
    // Validate assignee
    if (assignToId === null) {
      newErrors.assignTo = 'Please select a team member';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Function to pick an image from gallery
  const pickImage = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.8,
        selectionLimit: 1,
      });
      
      if (result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        setAttachments(prev => [
          ...prev, 
          {
            type: 'image',
            uri: asset.uri || '',
            name: asset.fileName || 'image.jpg',
            size: asset.fileSize,
            mimeType: asset.type
          }
        ]);
      }
    } catch (error) {
      console.log('Image picker error:', error);
    }
  };

  // Function to take a photo with camera
  const takePhoto = async () => {
    try {
      const result = await launchCamera({
        mediaType: 'photo',
        quality: 0.8,
        cameraType: 'back',
      });
      
      if (result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        setAttachments(prev => [
          ...prev, 
          {
            type: 'image',
            uri: asset.uri || '',
            name: asset.fileName || `photo_${Date.now()}.jpg`,
            size: asset.fileSize,
            mimeType: asset.type
          }
        ]);
      }
    } catch (error) {
      console.log('Camera error:', error);
    }
  };

  // Function to pick a document
  const pickDocument = async () => {
    if (!isDocumentPickerAvailable) {
      Alert.alert(
        "Feature Not Available",
        "Document picking is not available on this device. You can still use images.",
        [{ text: "OK" }]
      );
      return;
    }

    try {
      const results = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      
      const doc = results[0];
      setAttachments(prev => [
        ...prev, 
        {
          type: 'document',
          uri: doc.uri,
          name: doc.name || 'document',
          size: doc.size ? Number(doc.size) : undefined,
          mimeType: doc.type || undefined
        }
      ]);
    } catch (err) {
      if (DocumentPicker && !DocumentPicker.isCancel(err)) {
        console.log('Document picker error:', err);
      }
    }
  };

  // Function to remove an attachment
  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  // Render attachment item
  const renderAttachment = (attachment: Attachment, index: number) => {
    return (
      <View key={index} style={styles.attachmentItem}>
        {attachment.type === 'image' ? (
          <Image source={{ uri: attachment.uri }} style={styles.attachmentImage} />
        ) : (
          <View style={styles.documentIconContainer}>
            <Ionicons name="document-text" size={28} color="#4F8EF7" />
          </View>
        )}
        <View style={styles.attachmentDetails}>
          <Text style={styles.attachmentName} numberOfLines={1} ellipsizeMode="middle">
            {attachment.name}
          </Text>
          <Text style={styles.attachmentType}>
            {attachment.type === 'image' ? 'Image' : 'Document'}
          </Text>
        </View>
        <TouchableOpacity 
          style={styles.removeAttachmentButton}
          onPress={() => removeAttachment(index)}
        >
          <Ionicons name="close-circle" size={22} color="#FF3B30" />
        </TouchableOpacity>
      </View>
    );
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call with setTimeout
      setTimeout(() => {
        // In a real app, this would be an API call
        // POST /projects/:projectId/tasks
        
        console.log('Task assigned:', {
          title,
          description,
          assignToId,
          dueDate: dueDate ? format(dueDate, 'yyyy-MM-dd') : null,
          priority,
          tag,
          attachments // Include attachments in the data
        });
        
        setIsLoading(false);
        
        // Show success notification
        if (Platform.OS === 'android') {
          ToastAndroid.show('Task assigned successfully!', ToastAndroid.SHORT);
        } else {
          Alert.alert('Success', 'Task has been assigned');
        }
        
        // Navigate back
        navigation.goBack();
      }, 1500);
    } catch (error) {
      console.error('Error assigning task:', error);
      setIsLoading(false);
      Alert.alert('Error', 'Failed to assign task. Please try again.');
    }
  };
  
  // Handle clear form
  const handleClearForm = () => {
    Alert.alert(
      'Clear Form',
      'Are you sure you want to clear all fields?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Clear',
          onPress: () => {
            setTitle('');
            setDescription('');
            setAssignToId(null);
            setDueDate(null);
            setPriority('Medium');
            setTag('Development');
            setAttachments([]); // Clear attachments
            setErrors({});
          }
        }
      ]
    );
  };
  
  // Get priority color
  const getPriorityColor = (pri: PriorityType) => {
    switch (pri) {
      case 'High': return '#FF3B30';
      case 'Medium': return '#FF9500';
      case 'Low': return '#34C759';
      default: return '#007AFF';
    }
  };
  
  // Get tag color
  const getTagColor = (t: TagType) => {
    switch (t) {
      case 'Design': return '#9C27B0';
      case 'Development': return '#2196F3';
      case 'Testing': return '#8BC34A';
      case 'Documentation': return '#607D8B';
      case 'Meeting': return '#FF9800';
      default: return '#007AFF';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backIcon} 
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Assign New Task</Text>
      </View>
      
      <ScrollView style={styles.scrollView} keyboardShouldPersistTaps="handled">
        <View style={styles.formContainer}>
          {/* Task Title */}
          <Text style={styles.sectionTitle}>
            <Ionicons name="checkbox-outline" size={18} color="#007AFF" style={styles.sectionIcon} />
            Task Details
          </Text>
          
          <Text style={styles.inputLabel}>Task Title <Text style={styles.requiredStar}>*</Text></Text>
          <TextInput
            style={styles.input}
            placeholder="Enter task title (e.g., Design Login Page)"
            value={title}
            onChangeText={setTitle}
            maxLength={100}
          />
          {errors.title && (
            <Text style={styles.errorText}>{errors.title}</Text>
          )}
          
          {/* Task Description */}
          <Text style={styles.inputLabel}>Description <Text style={styles.requiredStar}>*</Text></Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Enter task description or instructions"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
          {errors.description && (
            <Text style={styles.errorText}>{errors.description}</Text>
          )}
          
          <Divider style={styles.divider} />
          
          {/* Assignee Selection */}
          <Text style={styles.sectionTitle}>
            <Ionicons name="people" size={18} color="#007AFF" style={styles.sectionIcon} />
            Assign To
          </Text>
          
          {isLoadingMembers ? (
            <ActivityIndicator size="small" color="#007AFF" style={styles.loadingIndicator} />
          ) : (
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={assignToId}
                onValueChange={(itemValue: number | null) => setAssignToId(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Select team member" value={null} />
                {members
                  .filter(member => member.role === 'member')
                  .map(member => (
                    <Picker.Item 
                      key={member.id.toString()} 
                      label={member.name} 
                      value={member.id} 
                    />
                  ))
                }
              </Picker>
            </View>
          )}
          {errors.assignTo && (
            <Text style={styles.errorText}>{errors.assignTo}</Text>
          )}
          
          <Divider style={styles.divider} />
          
          {/* Due Date */}
          <Text style={styles.sectionTitle}>
            <Ionicons name="calendar" size={18} color="#007AFF" style={styles.sectionIcon} />
            Scheduling
          </Text>
          
          <Text style={styles.inputLabel}>Due Date</Text>
          <TouchableOpacity 
            style={styles.datePickerButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.dateText}>
              {dueDate ? format(dueDate, 'MMMM d, yyyy') : 'Select due date (optional)'}
            </Text>
            <Ionicons name="calendar-outline" size={20} color="#007AFF" />
          </TouchableOpacity>
          
          {showDatePicker && (
            <DateTimePicker
              value={dueDate || new Date()}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleDateChange}
              minimumDate={new Date()}
            />
          )}
          
          <Divider style={styles.divider} />
          
          {/* Priority & Tag */}
          <Text style={styles.sectionTitle}>
            <Ionicons name="options" size={18} color="#007AFF" style={styles.sectionIcon} />
            Priority & Category
          </Text>
          
          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.inputLabel}>Priority</Text>
              <View style={styles.optionsContainer}>
                {PRIORITIES.map((p) => (
                  <TouchableOpacity 
                    key={p} 
                    style={[
                      styles.optionButton,
                      priority === p && styles.selectedOptionButton,
                      priority === p && { backgroundColor: getPriorityColor(p) }
                    ]}
                    onPress={() => setPriority(p)}
                  >
                    <Text style={[
                      styles.optionText,
                      priority === p && styles.selectedOptionText
                    ]}>
                      {p}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            <View style={styles.column}>
              <Text style={styles.inputLabel}>Category</Text>
              <View style={styles.optionsContainer}>
                {TAGS.map((t) => (
                  <TouchableOpacity 
                    key={t} 
                    style={[
                      styles.optionButton,
                      tag === t && styles.selectedOptionButton,
                      tag === t && { backgroundColor: getTagColor(t) }
                    ]}
                    onPress={() => setTag(t)}
                  >
                    <Text style={[
                      styles.optionText,
                      tag === t && styles.selectedOptionText
                    ]}>
                      {t}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          <Divider style={styles.divider} />
          
          {/* Attachments Section */}
          <Text style={styles.sectionTitle}>
            <Ionicons name="attach" size={18} color="#007AFF" style={styles.sectionIcon} />
            Attachments
          </Text>
          
          <View style={styles.attachmentSection}>
            <View style={styles.attachmentActions}>
              <TouchableOpacity 
                style={styles.attachmentButton}
                onPress={pickImage}
              >
                <Ionicons name="image-outline" size={22} color="#007AFF" />
                <Text style={styles.attachmentButtonText}>Gallery</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.attachmentButton}
                onPress={takePhoto}
              >
                <Ionicons name="camera-outline" size={22} color="#007AFF" />
                <Text style={styles.attachmentButtonText}>Camera</Text>
              </TouchableOpacity>
              
              {isDocumentPickerAvailable && (
                <TouchableOpacity 
                  style={styles.attachmentButton}
                  onPress={pickDocument}
                >
                  <Ionicons name="document-outline" size={22} color="#007AFF" />
                  <Text style={styles.attachmentButtonText}>File</Text>
                </TouchableOpacity>
              )}
            </View>
            
            {/* Display selected attachments */}
            {attachments.length > 0 && (
              <View style={styles.attachmentList}>
                {attachments.map((attachment, index) => 
                  renderAttachment(attachment, index)
                )}
              </View>
            )}
          </View>
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.clearButton}
          onPress={handleClearForm}
          disabled={isLoading}
        >
          <Text style={styles.clearButtonText}>Clear</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.submitButton,
            (!title || !description || assignToId === null) && styles.disabledButton
          ]}
          onPress={handleSubmit}
          disabled={!title || !description || assignToId === null || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.submitButtonText}>Assign Task</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  backIcon: {
    padding: 4,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginLeft: 12,
    textAlign: 'center',
    marginRight: 40, // to center the title with the back button
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  formContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionIcon: {
    marginRight: 8,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
    marginTop: 12,
  },
  requiredStar: {
    color: '#FF3B30',
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#C8C8C8',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#C8C8C8',
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#FFFFFF',
  },
  picker: {
    height: 50,
  },
  datePickerButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#C8C8C8',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 24,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  column: {
    flex: 1,
    marginHorizontal: 4,
  },
  optionsContainer: {
    flexDirection: 'column',
  },
  optionButton: {
    borderWidth: 1,
    borderColor: '#C8C8C8',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 8,
    alignItems: 'center',
  },
  selectedOptionButton: {
    borderColor: 'transparent',
  },
  optionText: {
    color: '#333',
    fontWeight: '500',
  },
  selectedOptionText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
    marginTop: 4,
    marginBottom: 8,
  },
  loadingIndicator: {
    marginVertical: 16,
  },
  footer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 0.5,
    borderTopColor: '#E0E0E0',
    flexDirection: 'row',
  },
  clearButton: {
    borderWidth: 1,
    borderColor: '#C8C8C8',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    flex: 1,
  },
  clearButtonText: {
    color: '#666',
    fontWeight: '600',
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 2,
  },
  disabledButton: {
    backgroundColor: '#A8A8A8',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  attachmentSection: {
    marginBottom: 24,
  },
  attachmentActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  attachmentButton: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f7ff',
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 4,
  },
  attachmentButtonText: {
    color: '#007AFF',
    fontSize: 12,
    marginTop: 4,
  },
  attachmentList: {
    marginTop: 16,
  },
  attachmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 10,
    marginVertical: 6,
  },
  attachmentImage: {
    width: 50,
    height: 50,
    borderRadius: 6,
    backgroundColor: '#e0e0e0',
  },
  documentIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 6,
    backgroundColor: '#e8f0fe',
    alignItems: 'center',
    justifyContent: 'center',
  },
  attachmentDetails: {
    flex: 1,
    marginLeft: 12,
  },
  attachmentName: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  attachmentType: {
    fontSize: 12,
    color: '#777',
    marginTop: 2,
  },
  removeAttachmentButton: {
    padding: 4,
  },
});

export default AssignTaskScreen;