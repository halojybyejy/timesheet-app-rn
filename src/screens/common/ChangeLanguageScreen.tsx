import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// @ts-ignore
import Ionicons from 'react-native-vector-icons/Ionicons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n/i18n';

type Props = NativeStackScreenProps<RootStackParamList, 'ChangeLanguage'>;

interface Language {
  code: string;
  name: string;
  localName: string;
  flag: string;
}

const LANGUAGES: Language[] = [
  { code: 'en', name: 'English', localName: 'English', flag: '🇺🇸' },
  { code: 'zh', name: 'Chinese', localName: '中文', flag: '🇨🇳' },
];

const ChangeLanguageScreen = ({ navigation }: Props) => {
  const { t } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);

  const handleLanguageSelect = (langCode: string) => {
    setSelectedLanguage(langCode);
  };

  const handleSaveLanguage = () => {
    i18n.changeLanguage(selectedLanguage);

    // Show confirmation
    if (Platform.OS === 'ios') {
      Alert.alert('Success', 'Language changed successfully');
    }
    
    // Navigate back to settings
    navigation.goBack();
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
        <Text style={styles.headerTitle}>{t('settings.language')}</Text>
      </View>
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.languageList}>
          {LANGUAGES.map((language) => (
            <TouchableOpacity
              key={language.code}
              style={[
                styles.languageItem,
                selectedLanguage === language.code && styles.selectedLanguageItem
              ]}
              onPress={() => handleLanguageSelect(language.code)}
            >
              <View style={styles.languageItemLeft}>
                <Text style={styles.languageFlag}>{language.flag}</Text>
                <View style={styles.languageInfo}>
                  <Text style={styles.languageName}>{language.name}</Text>
                  <Text style={styles.languageLocalName}>{language.localName}</Text>
                </View>
              </View>
              
              {selectedLanguage === language.code && (
                <Ionicons name="checkmark-circle" size={24} color="#007AFF" />
              )}
            </TouchableOpacity>
          ))}
        </View>
        
        <View style={styles.infoContainer}>
          <Ionicons name="information-circle" size={20} color="#666" />
          <Text style={styles.infoText}>
            {t('settings.languageInfo')}
          </Text>
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.saveButton}
          onPress={handleSaveLanguage}
        >
          <Text style={styles.saveButtonText}>{t('common.save')}</Text>
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
  languageList: {
    padding: 16,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: 12,
  },
  selectedLanguageItem: {
    borderColor: '#007AFF',
    backgroundColor: '#F0F8FF',
  },
  languageItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageFlag: {
    fontSize: 24,
    marginRight: 16,
  },
  languageInfo: {
    flexDirection: 'column',
  },
  languageName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  languageLocalName: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  infoContainer: {
    flexDirection: 'row',
    backgroundColor: '#F0F7FF',
    padding: 16,
    borderRadius: 8,
    margin: 16,
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
  saveButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default ChangeLanguageScreen; 