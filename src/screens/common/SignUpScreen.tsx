import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Alert,
  Keyboard,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import Ionicons from 'react-native-vector-icons/Ionicons';

type Props = NativeStackScreenProps<RootStackParamList, 'SignUp'>;

type LoginMethod = 'email' | 'phone';
type FormErrors = {
  username?: string;
  email?: string;
  phone?: string;
  password?: string;
};

const SignUpScreen = ({ navigation }: Props) => {
  const { t } = useTranslation();
  
  // Form state
  const [loginMethod, setLoginMethod] = useState<LoginMethod>('email');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isFormValid, setIsFormValid] = useState(false);
  
  // References for input fields for auto-focus
  const emailInputRef = useRef<TextInput>(null);
  const phoneInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);
  
  // Validate form fields
  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    
    // Username validation
    if (!username.trim()) {
      errors.username = t('signUp.errors.usernameRequired') || 'Username is required';
    }
    
    // Email validation (if email method is selected)
    if (loginMethod === 'email') {
      if (!email.trim()) {
        errors.email = t('signUp.errors.emailRequired') || 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(email)) {
        errors.email = t('signUp.errors.emailInvalid') || 'Please enter a valid email';
      }
    }
    
    // Phone validation (if phone method is selected)
    if (loginMethod === 'phone') {
      if (!phone.trim()) {
        errors.phone = t('signUp.errors.phoneRequired') || 'Phone number is required';
      } else if (!/^\d{10,15}$/.test(phone.replace(/\D/g, ''))) {
        errors.phone = t('signUp.errors.phoneInvalid') || 'Please enter a valid phone number';
      }
    }
    
    // Password validation
    if (!password) {
      errors.password = t('signUp.errors.passwordRequired') || 'Password is required';
    } else if (password.length < 6) {
      errors.password = 
        t('signUp.errors.passwordLength') || 'Password must be at least 6 characters';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Handle form submission
  const handleSignUp = async () => {
    Keyboard.dismiss();
    
    if (!isFormValid) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Sample implementation - Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Construct payload based on login method
      const signUpData = {
        username,
        password,
        ...(loginMethod === 'email' ? { email } : { phone }),
      };
      
      console.log('Sign up data:', signUpData);
      
      // Navigate to next screen on success
      // or show confirmation
      navigation.replace('SelectProject');
    } catch (error) {
      Alert.alert(
        'Sign Up Failed',
        typeof error === 'string' 
          ? error 
          : 'An error occurred during sign up. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Toggle between login methods
  const toggleLoginMethod = (method: LoginMethod) => {
    if (method !== loginMethod) {
      setLoginMethod(method);
      setFormErrors({});
      // Re-validate the form after changing the method
      setTimeout(() => {
        const isValid = validateForm();
        setIsFormValid(isValid);
      }, 0);
    }
  };
  
  // Add initial validation check
  useEffect(() => {
    // Initial validation
    const isValid = validateForm();
    setIsFormValid(isValid);
  }, []);
  
  // Real-time validation when fields change
  useEffect(() => {
    if (username || email || phone || password) {
      const isValid = validateForm();
      setIsFormValid(isValid);
    }
  }, [username, email, phone, password, loginMethod]);
  
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <Text style={styles.title}>
            {t('signUp.title') || 'Sign Up'}
          </Text>
          
          {/* Toggle between email and phone */}
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                loginMethod === 'email' && styles.activeToggle
              ]}
              onPress={() => toggleLoginMethod('email')}
            >
              <Text
                style={[
                  styles.toggleText,
                  loginMethod === 'email' && styles.activeToggleText
                ]}
              >
                {t('signUp.email') || 'Email'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.toggleButton,
                loginMethod === 'phone' && styles.activeToggle
              ]}
              onPress={() => toggleLoginMethod('phone')}
            >
              <Text
                style={[
                  styles.toggleText,
                  loginMethod === 'phone' && styles.activeToggleText
                ]}
              >
                {t('signUp.phone') || 'Phone'}
              </Text>
            </TouchableOpacity>
          </View>
          
          {/* Username input */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder={t('signUp.username') || 'Username'}
              value={username}
              onChangeText={setUsername}
              returnKeyType="next"
              onSubmitEditing={() => {
                if (loginMethod === 'email') {
                  emailInputRef.current?.focus();
                } else {
                  phoneInputRef.current?.focus();
                }
              }}
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isSubmitting}
            />
            {formErrors.username && (
              <Text style={styles.errorText}>{formErrors.username}</Text>
            )}
          </View>
          
          {/* Email input (shown only if email method is selected) */}
          {loginMethod === 'email' && (
            <View style={styles.inputContainer}>
              <TextInput
                ref={emailInputRef}
                style={styles.input}
                placeholder={t('signUp.emailAddress') || 'Email Address'}
                value={email}
                onChangeText={setEmail}
                returnKeyType="next"
                onSubmitEditing={() => passwordInputRef.current?.focus()}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isSubmitting}
              />
              {formErrors.email && (
                <Text style={styles.errorText}>{formErrors.email}</Text>
              )}
            </View>
          )}
          
          {/* Phone input (shown only if phone method is selected) */}
          {loginMethod === 'phone' && (
            <View style={styles.inputContainer}>
              <TextInput
                ref={phoneInputRef}
                style={styles.input}
                placeholder={t('signUp.phoneNumber') || 'Phone Number'}
                value={phone}
                onChangeText={setPhone}
                returnKeyType="next"
                onSubmitEditing={() => passwordInputRef.current?.focus()}
                keyboardType="phone-pad"
                editable={!isSubmitting}
              />
              {formErrors.phone && (
                <Text style={styles.errorText}>{formErrors.phone}</Text>
              )}
            </View>
          )}
          
          {/* Password input */}
          <View style={styles.inputContainer}>
            <View style={styles.passwordContainer}>
              <TextInput
                ref={passwordInputRef}
                style={styles.passwordInput}
                placeholder={t('signUp.password') || 'Password'}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                returnKeyType="done"
                editable={!isSubmitting}
              />
              <TouchableOpacity
                style={styles.passwordToggle}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? 'eye-off' : 'eye'}
                  size={24}
                  color="#666"
                />
              </TouchableOpacity>
            </View>
            {formErrors.password && (
              <Text style={styles.errorText}>{formErrors.password}</Text>
            )}
          </View>
          
          {/* Sign Up button */}
          <TouchableOpacity
            style={[
              styles.signUpButton,
              (!isFormValid || isSubmitting) && styles.disabledButton
            ]}
            onPress={handleSignUp}
            disabled={!isFormValid || isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.signUpButtonText}>
                {t('signUp.button') || 'Sign Up'}
              </Text>
            )}
          </TouchableOpacity>
          
          {/* Link to login */}
          <View style={styles.loginLinkContainer}>
            <Text style={styles.loginText}>
              {t('signUp.alreadyHaveAccount') || 'Already have an account?'}
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Login')}
              disabled={isSubmitting}
            >
              <Text style={styles.loginLink}>
                {t('signUp.loginLink') || 'Log In'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 32,
    color: '#333333',
    textAlign: 'center',
  },
  toggleContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    backgroundColor: '#F6F6F6',
    borderRadius: 12,
    padding: 4,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeToggle: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  toggleText: {
    fontWeight: '500',
    color: '#888888',
  },
  activeToggleText: {
    color: '#333333',
    fontWeight: '600',
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#F6F6F6',
    paddingHorizontal: 16,
    paddingVertical: 15,
    borderRadius: 12,
    fontSize: 16,
    color: '#333333',
  },
  passwordContainer: {
    flexDirection: 'row',
    backgroundColor: '#F6F6F6',
    borderRadius: 12,
    alignItems: 'center',
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 15,
    fontSize: 16,
    color: '#333333',
  },
  passwordToggle: {
    paddingHorizontal: 16,
  },
  errorText: {
    color: '#FF3B30',
    marginTop: 6,
    marginLeft: 4,
    fontSize: 14,
  },
  signUpButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  disabledButton: {
    backgroundColor: '#A0A0A0',
  },
  signUpButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loginLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  loginText: {
    color: '#666666',
    marginRight: 4,
  },
  loginLink: {
    color: '#007AFF',
    fontWeight: '600',
  },
});

export default SignUpScreen; 