import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  ScrollView, 
  StatusBar, 
  Alert,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
// @ts-ignore
import Ionicons from 'react-native-vector-icons/Ionicons';

type Props = NativeStackScreenProps<RootStackParamList, 'SelectProject'>;

interface Project {
  id: string;
  name: string;
  role: 'leader' | 'member';
  isDefault: boolean;
}

const SelectProjectScreen = ({ navigation }: Props) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  // Mock fetch projects - replace with actual API call
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // Simulating API call
        setTimeout(() => {
          const mockProjects = [
            {
              id: "abc123",
              name: "AuditX Dev",
              role: "leader",
              isDefault: true
            },
            {
              id: "xyz456",
              name: "Client Beta Project",
              role: "member",
              isDefault: false
            },
            {
              id: "def789",
              name: "Marketing Campaign",
              role: "member",
              isDefault: false
            }
          ] as Project[];
          
          setProjects(mockProjects);
          setLoading(false);
          
          // Auto-select default project if exists
          const defaultProject = mockProjects.find(p => p.isDefault);
          if (defaultProject) {
            setActiveProject(defaultProject);
          }
        }, 1000);
      } catch (error) {
        console.error('Error fetching projects:', error);
        setLoading(false);
        Alert.alert('Error', 'Failed to load projects');
      }
    };

    fetchProjects();
  }, []);

  const handleSelectProject = (project: Project) => {
    setActiveProject(project);
  };

  const handleSetDefaultProject = (projectId: string) => {
    // Update projects locally
    const updatedProjects = projects.map(p => ({
      ...p,
      isDefault: p.id === projectId
    }));
    
    setProjects(updatedProjects);
    
    // In a real app, you would also update this on the backend
    // API call to update default project
  };

  const handleProceedToProject = () => {
    if (!activeProject) {
      Alert.alert('Error', 'Please select a project first');
      return;
    }

    // Store in global state
    // In a real app, you would use context or redux to store this
    console.log('Setting active project:', activeProject);
    
    // Navigate based on role
    if (activeProject.role === 'leader') {
      navigation.replace('LeaderTabs');
    } else {
      navigation.replace('MemberTabs');
    }
  };

  const handleGoToJoinProject = () => {
    navigation.navigate('JoinProject');
  };

  const handleCreateProject = () => {
    navigation.navigate('CreateProject');
  };

  const SectionHeader = ({ title }: { title: string }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );

  const ProjectItem = ({ project }: { project: Project }) => {
    const isActive = activeProject?.id === project.id;
    
    return (
      <TouchableOpacity
        style={[
          styles.projectItem,
          isActive && styles.activeProjectItem
        ]}
        onPress={() => handleSelectProject(project)}
      >
        <View style={styles.projectItemLeft}>
          <View style={[
            styles.projectIcon,
            { backgroundColor: project.role === 'leader' ? '#4CD964' : '#007AFF' }
          ]}>
            <Ionicons 
              name={project.role === 'leader' ? 'briefcase' : 'people'} 
              size={18} 
              color="#FFFFFF" 
            />
          </View>
          <View style={styles.projectInfo}>
            <Text style={styles.projectName}>{project.name}</Text>
            <Text style={styles.projectRole}>
              {project.role === 'leader' ? 'Leader' : 'Member'}
            </Text>
          </View>
        </View>
        
        <View style={styles.projectItemRight}>
          {project.isDefault ? (
            <View style={styles.defaultBadge}>
              <Ionicons name="star" size={14} color="#FF9500" />
              <Text style={styles.defaultText}>Default</Text>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.setDefaultButton}
              onPress={() => handleSetDefaultProject(project.id)}
            >
              <Ionicons name="star-outline" size={14} color="#787878" />
            </TouchableOpacity>
          )}
          <Ionicons 
            name="chevron-forward" 
            size={16} 
            color={isActive ? "#007AFF" : "#C8C8C8"} 
          />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <View style={styles.header}>
        <Text style={styles.welcomeText}>
          Welcome back, <Text style={styles.userName}>User</Text>
        </Text>
        <Text style={styles.selectPrompt}>Select a project to continue</Text>
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <SectionHeader title="Your Projects" />
        
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>Loading your projects...</Text>
          </View>
        ) : projects.length === 0 ? (
          <View style={styles.emptyStateContainer}>
            <Ionicons name="folder-open-outline" size={40} color="#C8C8C8" />
            <Text style={styles.emptyStateText}>You don't have any projects yet</Text>
          </View>
        ) : (
          <View style={styles.projectsList}>
            {projects.map(project => (
              <ProjectItem key={project.id} project={project} />
            ))}
          </View>
        )}
        
        <SectionHeader title="Project Options" />
        
        <View style={styles.optionsList}>
          <TouchableOpacity 
            style={styles.optionItem}
            onPress={handleGoToJoinProject}
          >
            <View style={styles.optionItemLeft}>
              <View style={[styles.optionIcon, { backgroundColor: '#5856D6' }]}>
                <Ionicons name="enter-outline" size={18} color="#FFFFFF" />
              </View>
              <Text style={styles.optionText}>Join a Project</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#C8C8C8" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.optionItem}
            onPress={handleCreateProject}
          >
            <View style={styles.optionItemLeft}>
              <View style={[styles.optionIcon, { backgroundColor: '#4CD964' }]}>
                <Ionicons name="add" size={18} color="#FFFFFF" />
              </View>
              <Text style={styles.optionText}>Create New Project</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#C8C8C8" />
          </TouchableOpacity>
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <TouchableOpacity 
          style={[
            styles.proceedButton,
            !activeProject && styles.disabledButton
          ]}
          onPress={handleProceedToProject}
          disabled={!activeProject}
        >
          <Text style={styles.proceedButtonText}>
            {activeProject 
              ? `Continue to ${activeProject.name}` 
              : 'Select a project to continue'}
          </Text>
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
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E0E0E0',
  },
  welcomeText: {
    fontSize: 20,
    color: '#333',
  },
  userName: {
    fontWeight: 'bold',
  },
  selectPrompt: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#555',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    color: '#666',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#FFFFFF',
  },
  emptyStateText: {
    marginTop: 12,
    color: '#666',
  },
  projectsList: {
    backgroundColor: '#FFFFFF',
  },
  projectItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 0.5,
    borderBottomColor: '#E0E0E0',
  },
  activeProjectItem: {
    backgroundColor: '#F0F8FF',
  },
  projectItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  projectIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  projectInfo: {
    flex: 1,
  },
  projectName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
  },
  projectRole: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  projectItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  defaultBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9E6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  defaultText: {
    fontSize: 12,
    color: '#FF9500',
    marginLeft: 4,
  },
  setDefaultButton: {
    padding: 8,
    marginRight: 8,
  },
  optionsList: {
    backgroundColor: '#FFFFFF',
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 0.5,
    borderBottomColor: '#E0E0E0',
  },
  optionItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  optionText: {
    fontSize: 15,
    color: '#333',
  },
  footer: {
    padding: 16,
    borderTopWidth: 0.5,
    borderTopColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  proceedButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: '#A8A8A8',
  },
  proceedButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default SelectProjectScreen; 