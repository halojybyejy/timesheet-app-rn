import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  Platform,
  ToastAndroid,
  Alert,
  KeyboardAvoidingView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// @ts-ignore
import Ionicons from 'react-native-vector-icons/Ionicons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { format } from 'date-fns';

type Props = NativeStackScreenProps<RootStackParamList, 'EditProfile'>;

// Helper function to validate email format
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Helper function to validate phone number
const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^\d{8,15}$/; // 8-15 digits
  return phoneRegex.test(phone.replace(/[^0-9]/g, ''));
};

// Helper function to check if date is in the future
const isFutureDate = (date: Date): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date > today;
};

// Helper function to check if user is at least 13 years old
const isAtLeast13YearsOld = (date: Date): boolean => {
  const today = new Date();
  const thirteenYearsAgo = new Date(
    today.getFullYear() - 13,
    today.getMonth(),
    today.getDate()
  );
  return date <= thirteenYearsAgo;
};

// Format phone number for display
const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  
  // Malaysian format: +601X-XXX XXXX
  if (cleaned.length >= 10) {
    if (cleaned.startsWith('60')) {
      return `+${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
    } else if (cleaned.startsWith('1')) {
      return `+60${cleaned.slice(0, 1)}-${cleaned.slice(1, 4)} ${cleaned.slice(4)}`;
    } else {
      return `+60${cleaned.slice(0, 2)}-${cleaned.slice(2, 5)} ${cleaned.slice(5)}`;
    }
  }
  return phone;
};

const EditProfileScreen = ({ navigation }: Props) => {
  // Mock user data - in a real app, this would come from a context or API
  const [originalUserData, setOriginalUserData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    username: 'john.doe',
    phone: '60123456789',
    email: 'john.doe@example.com',
    birthdate: new Date(1990, 0, 15), // January 15, 1990
  });

  // Form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [birthdate, setBirthdate] = useState(new Date());
  
  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDirty, setIsDirty] = useState(false);
  
  // Load user data into form
  useEffect(() => {
    // In a real app, you would fetch the user's data here
    setFirstName(originalUserData.firstName);
    setLastName(originalUserData.lastName);
    setUsername(originalUserData.username);
    setPhone(originalUserData.phone);
    setEmail(originalUserData.email);
    setBirthdate(originalUserData.birthdate);
  }, [originalUserData]);
  
  // Check if form is dirty (has changes)
  useEffect(() => {
    const hasChanges = 
      firstName !== originalUserData.firstName ||
      lastName !== originalUserData.lastName ||
      phone !== originalUserData.phone ||
      email !== originalUserData.email ||
      birthdate.getTime() !== originalUserData.birthdate.getTime();
      
    setIsDirty(hasChanges);
  }, [firstName, lastName, phone, email, birthdate, originalUserData]);

  const handleBirthdateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    
    if (selectedDate) {
      setBirthdate(selectedDate);
      
      // Validate birthdate
      if (isFutureDate(selectedDate)) {
        setErrors(prev => ({ ...prev, birthdate: 'Birthdate cannot be in the future' }));
      } else if (!isAtLeast13YearsOld(selectedDate)) {
        setErrors(prev => ({ ...prev, birthdate: 'You must be at least 13 years old' }));
      } else {
        // Clear error if valid
        setErrors(prev => {
          const { birthdate, ...rest } = prev;
          return rest;
        });
      }
    }
  };

  const handlePhoneChange = (text: string) => {
    // Allow only digits, plus, hyphens, and spaces
    const formattedPhone = text.replace(/[^\d\s+-]/g, '');
    setPhone(formattedPhone);
    
    // Validate phone number
    if (!isValidPhone(formattedPhone)) {
      setErrors(prev => ({ ...prev, phone: 'Please enter a valid phone number' }));
    } else {
      // Clear error if valid
      setErrors(prev => {
        const { phone, ...rest } = prev;
        return rest;
      });
    }
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    
    // Validate email
    if (!isValidEmail(text)) {
      setErrors(prev => ({ ...prev, email: 'Please enter a valid email address' }));
    } else {
      // Clear error if valid
      setErrors(prev => {
        const { email, ...rest } = prev;
        return rest;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // First name validation
    if (!firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (firstName.length > 30) {
      newErrors.firstName = 'First name must be less than 30 characters';
    }
    
    // Last name validation
    if (!lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (lastName.length > 30) {
      newErrors.lastName = 'Last name must be less than 30 characters';
    }
    
    // Phone validation
    if (!phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!isValidPhone(phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    // Email validation
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Birthdate validation
    if (isFutureDate(birthdate)) {
      newErrors.birthdate = 'Birthdate cannot be in the future';
    } else if (!isAtLeast13YearsOld(birthdate)) {
      newErrors.birthdate = 'You must be at least 13 years old';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call with setTimeout
      setTimeout(() => {
        // Update the original data - in a real app, this would be an API call
        setOriginalUserData({
          firstName,
          lastName,
          username,
          phone,
          email,
          birthdate,
        });
        
        setIsLoading(false);
        
        // Show success notification
        if (Platform.OS === 'android') {
          ToastAndroid.show('Profile updated successfully!', ToastAndroid.SHORT);
        } else {
          Alert.alert('Success', 'Your profile has been updated');
        }
        
        // Navigate back
        navigation.goBack();
      }, 1500);
    } catch (error) {
      console.error('Error updating profile:', error);
      setIsLoading(false);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    }
  };

  const handleReset = () => {
    // Reset form to original values
    setFirstName(originalUserData.firstName);
    setLastName(originalUserData.lastName);
    setPhone(originalUserData.phone);
    setEmail(originalUserData.email);
    setBirthdate(originalUserData.birthdate);
    setErrors({});
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
        <Text style={styles.headerTitle}>Edit Profile</Text>
      </View>
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView style={styles.scrollView} keyboardShouldPersistTaps="handled">
          <View style={styles.profileImageContainer}>
            <View style={styles.profileImage}>
              <Text style={styles.profileInitials}>
                {firstName.charAt(0)}{lastName.charAt(0)}
              </Text>
            </View>
            <TouchableOpacity style={styles.changePhotoButton}>
              <Text style={styles.changePhotoText}>Change Photo</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.formContainer}>
            {/* First Name */}
            <Text style={styles.inputLabel}>First Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter first name"
              value={firstName}
              onChangeText={setFirstName}
              autoCapitalize="words"
              maxLength={30}
            />
            {errors.firstName && (
              <Text style={styles.errorText}>{errors.firstName}</Text>
            )}
            
            {/* Last Name */}
            <Text style={styles.inputLabel}>Last Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter last name"
              value={lastName}
              onChangeText={setLastName}
              autoCapitalize="words"
              maxLength={30}
            />
            {errors.lastName && (
              <Text style={styles.errorText}>{errors.lastName}</Text>
            )}
            
            {/* Username (Read-only) */}
            <Text style={styles.inputLabel}>Username</Text>
            <TextInput
              style={[styles.input, styles.disabledInput]}
              value={username}
              editable={false}
            />
            <Text style={styles.helperText}>
              Username cannot be changed
            </Text>
            
            {/* Phone */}
            <Text style={styles.inputLabel}>Phone Number *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter phone number"
              value={formatPhoneNumber(phone)}
              onChangeText={handlePhoneChange}
              keyboardType="phone-pad"
            />
            {errors.phone ? (
              <Text style={styles.errorText}>{errors.phone}</Text>
            ) : (
              <Text style={styles.helperText}>
                Format: +601X-XXX XXXX
              </Text>
            )}
            
            {/* Email */}
            <Text style={styles.inputLabel}>Email *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter email address"
              value={email}
              onChangeText={handleEmailChange}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {errors.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
            )}
            
            {/* Birthdate */}
            <Text style={styles.inputLabel}>Birthdate *</Text>
            <TouchableOpacity 
              style={styles.datePickerButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.dateText}>
                {format(birthdate, 'MMMM d, yyyy')}
              </Text>
              <Ionicons name="calendar-outline" size={20} color="#007AFF" />
            </TouchableOpacity>
            {errors.birthdate && (
              <Text style={styles.errorText}>{errors.birthdate}</Text>
            )}
            
            {showDatePicker && (
              <DateTimePicker
                value={birthdate}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleBirthdateChange}
                maximumDate={new Date()}
              />
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.resetButton}
          onPress={handleReset}
          disabled={!isDirty || isLoading}
        >
          <Text style={[
            styles.resetButtonText,
            (!isDirty || isLoading) && styles.disabledButtonText
          ]}>
            Reset
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.saveButton,
            (!isDirty || isLoading || Object.keys(errors).length > 0) && styles.disabledButton
          ]}
          onPress={handleSave}
          disabled={!isDirty || isLoading || Object.keys(errors).length > 0}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.saveButtonText}>Save Changes</Text>
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
  profileImageContainer: {
    alignItems: 'center',
    paddingVertical: 24,
    backgroundColor: '#FFFFFF',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitials: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  changePhotoButton: {
    marginTop: 12,
  },
  changePhotoText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '500',
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
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#C8C8C8',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  disabledInput: {
    backgroundColor: '#F5F5F5',
    color: '#888',
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
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  helperText: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
    marginTop: 4,
  },
  footer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 0.5,
    borderTopColor: '#E0E0E0',
    flexDirection: 'row',
  },
  resetButton: {
    borderWidth: 1,
    borderColor: '#666',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    flex: 1,
  },
  resetButtonText: {
    color: '#666',
    fontWeight: '600',
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 2,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  disabledButton: {
    backgroundColor: '#A8A8A8',
  },
  disabledButtonText: {
    color: '#BBB',
  },
});

export default EditProfileScreen; 