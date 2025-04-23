import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity,
  Alert,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  Platform,
  ToastAndroid
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// @ts-ignore
import Ionicons from 'react-native-vector-icons/Ionicons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'ChangePassword'>;

const ChangePasswordScreen = ({ navigation }: Props) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Validate current password
    if (!currentPassword.trim()) {
      newErrors.currentPassword = 'Current password is required';
    }
    
    // Validate new password
    if (!newPassword.trim()) {
      newErrors.newPassword = 'New password is required';
    } else if (newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    } else if (newPassword === currentPassword) {
      newErrors.newPassword = 'New password must be different from current password';
    }
    
    // Validate confirm password
    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call with setTimeout
      setTimeout(() => {
        // In a real app, you would make an API call here:
        // PUT /users/change-password { currentPassword, newPassword }
        
        setIsLoading(false);
        
        // Show success notification
        if (Platform.OS === 'android') {
          ToastAndroid.show('Password updated successfully!', ToastAndroid.SHORT);
        } else {
          Alert.alert('Success', 'Your password has been updated');
        }
        
        // Navigate back
        navigation.goBack();
      }, 1500);
    } catch (error) {
      console.error('Error changing password:', error);
      setIsLoading(false);
      Alert.alert('Error', 'Failed to change password. Please try again.');
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
        <Text style={styles.headerTitle}>Change Password</Text>
      </View>
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.formContainer}>
          {/* Current Password */}
          <Text style={styles.inputLabel}>Current Password *</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter current password"
              value={currentPassword}
              onChangeText={setCurrentPassword}
              secureTextEntry={!showCurrentPassword}
            />
            <TouchableOpacity 
              style={styles.passwordToggle}
              onPress={() => setShowCurrentPassword(!showCurrentPassword)}
            >
              <Ionicons 
                name={showCurrentPassword ? "eye-off-outline" : "eye-outline"} 
                size={20} 
                color="#666" 
              />
            </TouchableOpacity>
          </View>
          {errors.currentPassword && (
            <Text style={styles.errorText}>{errors.currentPassword}</Text>
          )}
          
          {/* New Password */}
          <Text style={styles.inputLabel}>New Password *</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter new password"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry={!showNewPassword}
            />
            <TouchableOpacity 
              style={styles.passwordToggle}
              onPress={() => setShowNewPassword(!showNewPassword)}
            >
              <Ionicons 
                name={showNewPassword ? "eye-off-outline" : "eye-outline"} 
                size={20} 
                color="#666" 
              />
            </TouchableOpacity>
          </View>
          {errors.newPassword && (
            <Text style={styles.errorText}>{errors.newPassword}</Text>
          )}
          <Text style={styles.passwordHint}>
            Password must be at least 8 characters
          </Text>
          
          {/* Confirm New Password */}
          <Text style={styles.inputLabel}>Confirm New Password *</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.input}
              placeholder="Confirm new password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
            />
            <TouchableOpacity 
              style={styles.passwordToggle}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <Ionicons 
                name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} 
                size={20} 
                color="#666" 
              />
            </TouchableOpacity>
          </View>
          {errors.confirmPassword && (
            <Text style={styles.errorText}>{errors.confirmPassword}</Text>
          )}
          
          <View style={styles.infoContainer}>
            <Ionicons name="information-circle" size={20} color="#666" />
            <Text style={styles.infoText}>
              For security reasons, you may be required to log in again after changing your password.
            </Text>
          </View>
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <TouchableOpacity 
          style={[
            styles.submitButton,
            (!currentPassword || !newPassword || !confirmPassword) && styles.disabledButton
          ]}
          onPress={handleSubmit}
          disabled={!currentPassword || !newPassword || !confirmPassword || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.submitButtonText}>Change Password</Text>
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
    backgroundColor: '#FFFFFF',
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 16,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#C8C8C8',
    borderRadius: 8,
  },
  input: {
    flex: 1,
    padding: 12,
    fontSize: 16,
  },
  passwordToggle: {
    padding: 12,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
    marginTop: 4,
  },
  passwordHint: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
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
  submitButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: '#A8A8A8',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default ChangePasswordScreen; 