import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
// @ts-ignore
import Ionicons from 'react-native-vector-icons/Ionicons';

type Props = NativeStackScreenProps<RootStackParamList, 'JoinProject'>;

const JoinProject = ({ navigation }: Props) => {
  const [projectCode, setProjectCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleJoinProject = () => {
    if (!projectCode.trim()) {
      Alert.alert('Error', 'Please enter a project code');
      return;
    }

    setLoading(true);

    // In a real app, make API request to join project
    // POST /join-project {code: projectCode}
    setTimeout(() => {
      setLoading(false);
      
      // Simulate successful project join
      Alert.alert(
        'Success', 
        `You have joined the project with code: ${projectCode}`,
        [
          { 
            text: 'Continue', 
            onPress: () => navigation.replace('SelectProject') 
          }
        ]
      );
    }, 1500);
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
        <Text style={styles.headerTitle}>Join a Project</Text>
      </View>
      
      <View style={styles.content}>
        <View style={styles.infoContainer}>
          <Ionicons name="information-circle" size={24} color="#666" />
          <Text style={styles.infoText}>
            Enter the project code provided by your project leader to join their project.
          </Text>
        </View>
        
        <Text style={styles.inputLabel}>Project Code</Text>
        <TextInput
          style={styles.codeInput}
          placeholder="Enter project code (e.g. ABCD1234)"
          placeholderTextColor="#999"
          value={projectCode}
          onChangeText={setProjectCode}
          autoCapitalize="characters"
          maxLength={8}
        />
        
        <TouchableOpacity 
          style={[
            styles.joinButton,
            (!projectCode.trim() || loading) && styles.disabledButton
          ]}
          onPress={handleJoinProject}
          disabled={!projectCode.trim() || loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.joinButtonText}>Join Project</Text>
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
  content: {
    padding: 20,
  },
  infoContainer: {
    flexDirection: 'row',
    backgroundColor: '#F0F7FF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  infoText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
    marginLeft: 12,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  codeInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#C8C8C8',
    borderRadius: 8,
    padding: 16,
    fontSize: 18,
    letterSpacing: 2,
    textAlign: 'center',
    marginBottom: 24,
  },
  joinButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: '#A8A8A8',
  },
  joinButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default JoinProject; 