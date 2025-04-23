import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity, ActivityIndicator, ScrollView, Keyboard, Platform, KeyboardAvoidingView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import Ionicons from 'react-native-vector-icons/Ionicons';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const LoginScreen = ({ navigation }: Props) => {
  const { t } = useTranslation();
  const [username, setUsername] = useState('leader1');
  const [password, setPassword] = useState('pass123');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const passwordInputRef = useRef<TextInput>(null);

  const users = [
    { username: 'leader1', password: 'pass123', role: 'leader' },
    { username: 'member1', password: 'pass123', role: 'member' },
    { username: 'member2', password: 'pass123', role: 'member' },
  ];

  const handleLogin = () => {
    Keyboard.dismiss();
    setIsSubmitting(true);
    
    // Simulate network request
    setTimeout(() => {
      const matchedUser = users.find(
        (user) => user.username === username && user.password === password
      );

      setIsSubmitting(false);

      if (!matchedUser) {
        Alert.alert(
          t('login.failedTitle') || 'Login Failed', 
          t('login.failedMessage') || 'Invalid username or password'
        );
        return;
      }

      // Navigate to project selection after successful login
      navigation.replace('SelectProject');
    }, 800);
  };

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
          <Text style={styles.title}>{t('login.title')}</Text>
          
          {/* Username input */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder={t('login.username') || 'Username'}
              value={username}
              onChangeText={setUsername}
              returnKeyType="next"
              onSubmitEditing={() => passwordInputRef.current?.focus()}
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isSubmitting}
            />
          </View>
          
          {/* Password input */}
          <View style={styles.inputContainer}>
            <View style={styles.passwordContainer}>
              <TextInput
                ref={passwordInputRef}
                style={styles.passwordInput}
                placeholder={t('login.password') || 'Password'}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                returnKeyType="done"
                onSubmitEditing={handleLogin}
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
          </View>

          {/* Login button */}
          <TouchableOpacity
            style={[
              styles.loginButton,
              isSubmitting && styles.disabledButton
            ]}
            onPress={handleLogin}
            disabled={isSubmitting || !username || !password}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.loginButtonText}>
                {t('login.button') || 'Login'}
              </Text>
            )}
          </TouchableOpacity>
          
          {/* Link to sign up */}
          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>
              {t('login.noAccount') || "Don't have an account?"}
            </Text>
            <TouchableOpacity 
              onPress={() => navigation.navigate('SignUp')}
              disabled={isSubmitting}
            >
              <Text style={styles.signupLink}>
                {t('login.signUp') || 'Sign Up'}
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
  loginButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  disabledButton: {
    backgroundColor: '#A0A0A0',
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  signupText: {
    color: '#666666',
    marginRight: 4,
  },
  signupLink: {
    color: '#007AFF',
    fontWeight: '600',
  },
});

export default LoginScreen;
