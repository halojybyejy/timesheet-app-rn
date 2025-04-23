import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const LoginScreen = ({ navigation }: Props) => {
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const users = [
    { username: 'leader1', password: 'pass123', role: 'leader' },
    { username: 'member1', password: 'pass123', role: 'member' },
    { username: 'member2', password: 'pass123', role: 'member' },
  ];

  const handleLogin = () => {
    const matchedUser = users.find(
      (user) => user.username === username && user.password === password
    );

    if (!matchedUser) {
      Alert.alert('Login Failed', 'Invalid username or password');
      return;
    }

    // Navigate to project selection after successful login
    navigation.replace('SelectProject');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('login.title')}</Text>

      <TextInput
        style={styles.input}
        placeholder={t('login.username')}
        onChangeText={setUsername}
        autoCapitalize="none"
        value={username}
      />
      <TextInput
        style={styles.input}
        placeholder={t('login.password')}
        onChangeText={setPassword}
        secureTextEntry
        value={password}
      />

      <Button title={t('login.button')} onPress={handleLogin} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20,
  },
  title: {
    fontSize: 28, fontWeight: 'bold', marginBottom: 20,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
});

export default LoginScreen;
