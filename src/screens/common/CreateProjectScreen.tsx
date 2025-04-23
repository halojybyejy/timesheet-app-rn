import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView,
  Alert,
  ActivityIndicator,
  StatusBar,
  Clipboard,
  ToastAndroid,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
// @ts-ignore
import Ionicons from 'react-native-vector-icons/Ionicons';

type Props = NativeStackScreenProps<RootStackParamList, 'CreateProject'>;

interface ProjectResponse {
  projectId: string;
  name: string;
  code: string;
  role: 'leader';
}

const CreateProjectScreen = ({ navigation }: Props) => {
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [createdProject, setCreatedProject] = useState<ProjectResponse | null>(null);

  const generateProjectCode = () => {
    // Simple implementation: 4 letters + 4 digits
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const digits = '0123456789';
    
    let code = '';
    for (let i = 0; i < 4; i++) {
      code += letters.charAt(Math.floor(Math.random() * letters.length));
    }
    
    for (let i = 0; i < 4; i++) {
      code += digits.charAt(Math.floor(Math.random() * digits.length));
    }
    
    return code;
  };

  const handleCreateProject = async () => {
    if (!projectName.trim()) {
      Alert.alert('Error', 'Project name is required');
      return;
    }

    setIsLoading(true);

    try {
      // Mock API call with setTimeout
      setTimeout(() => {
        // Generate a unique project code
        const projectCode = generateProjectCode();
        
        // Mock project creation response
        const newProject: ProjectResponse = {
          projectId: `proj-${Date.now()}`,
          name: projectName.trim(),
          code: projectCode,
          role: 'leader'
        };
        
        setCreatedProject(newProject);
        setIsLoading(false);
        
        // In a real app, you would make an API call here
        // POST /create-project {name: projectName, description: description}
      }, 1500);
    } catch (error) {
      console.error('Error creating project:', error);
      setIsLoading(false);
      Alert.alert('Error', 'Failed to create project. Please try again.');
    }
  };

  const handleCopyCode = () => {
    if (createdProject) {
      Clipboard.setString(createdProject.code);
      
      // Show a toast notification on Android
      if (Platform.OS === 'android') {
        ToastAndroid.show('Project code copied to clipboard', ToastAndroid.SHORT);
      } else {
        // For iOS, we can use Alert as a simple alternative
        Alert.alert('Copied!', 'Project code copied to clipboard');
      }
    }
  };

  const handleGoBack = () => {
    navigation.replace('SelectProject');
  };

  // Render success screen after project creation
  if (createdProject) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        
        <View style={styles.successContainer}>
          <View style={styles.successIcon}>
            <Ionicons name="checkmark-circle" size={80} color="#4CD964" />
          </View>
          
          <Text style={styles.successTitle}>Project Created!</Text>
          <Text style={styles.successDescription}>
            Your new project "{createdProject.name}" has been created successfully.
          </Text>
          
          <View style={styles.codeContainer}>
            <Text style={styles.codeLabel}>Project Join Code:</Text>
            <View style={styles.codeDisplay}>
              <Text style={styles.codeText}>{createdProject.code}</Text>
              <TouchableOpacity 
                style={styles.copyButton} 
                onPress={handleCopyCode}
              >
                <Ionicons name="copy-outline" size={20} color="#007AFF" />
              </TouchableOpacity>
            </View>
            <Text style={styles.codeHelper}>
              Share this code with your team members so they can join the project.
            </Text>
          </View>
          
          <TouchableOpacity 
            style={styles.backButton}
            onPress={handleGoBack}
          >
            <Text style={styles.backButtonText}>Go to Projects</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

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
        <Text style={styles.headerTitle}>Create New Project</Text>
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formContainer}>
          <Text style={styles.formLabel}>Project Name*</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter project name"
            value={projectName}
            onChangeText={setProjectName}
            maxLength={50}
          />
          
          <Text style={styles.formLabel}>Description (optional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Enter project description"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
          
          <View style={styles.infoContainer}>
            <Ionicons name="information-circle" size={20} color="#666" />
            <Text style={styles.infoText}>
              Creating a project will make you the project leader. 
              You will receive a unique code to share with team members.
            </Text>
          </View>
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.createButton, !projectName.trim() && styles.disabledButton]}
          onPress={handleCreateProject}
          disabled={!projectName.trim() || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <Ionicons name="rocket" size={20} color="#FFFFFF" />
              <Text style={styles.createButtonText}>Create Project</Text>
            </>
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
  scrollContent: {
    paddingBottom: 24,
  },
  formContainer: {
    padding: 16,
  },
  formLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 16,
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
  infoContainer: {
    flexDirection: 'row',
    backgroundColor: '#F0F7FF',
    padding: 12,
    borderRadius: 8,
    marginTop: 24,
  },
  infoText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
    marginLeft: 8,
  },
  footer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 0.5,
    borderTopColor: '#E0E0E0',
  },
  createButton: {
    backgroundColor: '#4CD964',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: '#A8A8A8',
  },
  createButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
  // Success screen styles
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#FFFFFF',
  },
  successIcon: {
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  successDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 36,
  },
  codeContainer: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 36,
  },
  codeLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  codeDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  codeText: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 2,
    color: '#333',
  },
  copyButton: {
    padding: 8,
  },
  codeHelper: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  backButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default CreateProjectScreen; 