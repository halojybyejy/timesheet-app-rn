import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Switch, TouchableOpacity, ScrollView, StatusBar, Clipboard, ToastAndroid, Platform, Alert, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { LightTheme, DarkTheme } from '../../theme'; // 👈 Theme import

interface SettingItemProps {
  icon: string;
  iconColor: string;
  title: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
  showChevron?: boolean;
}

interface ProjectInfo {
  id: string;
  name: string;
  code: string;
  role: 'leader' | 'member';
}

const SettingsScreen = () => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? DarkTheme : LightTheme;

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [activeProject, setActiveProject] = useState<ProjectInfo | null>(null);

  // Mock function to get the active project - in a real app, this would come from a global state or context
  useEffect(() => {
    // Simulate fetching active project
    setTimeout(() => {
      setActiveProject({
        id: 'abc123',
        name: 'AuditX Dev',
        code: 'ABCD1234',
        role: 'leader' // Change to 'member' to test non-leader view
      });
    }, 500);
  }, []);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  const toggleNotifications = () => {
    setNotificationsEnabled((prev) => !prev);
  };

  const handleSelectProject = () => {
    navigation.replace('SelectProject');
  };

  const handleManageMembers = () => {
    navigation.navigate('ManageMembers');
  };

  const handleLogout = () => {
    // Here you should clear auth state and navigate to Login
    navigation.replace('Login');
  };

  const handleChangePassword = () => {
    navigation.navigate('ChangePassword');
  };

  const handleEditProfile = () => {
    navigation.navigate('EditProfile');
  };

  const handleChangeLanguage = () => {
    navigation.navigate('ChangeLanguage');
  };

  const handleCopyProjectCode = () => {
    if (activeProject) {
      Clipboard.setString(activeProject.code);
      
      // Show a toast notification on Android
      if (Platform.OS === 'android') {
        ToastAndroid.show('Project code copied to clipboard', ToastAndroid.SHORT);
      } else {
        // For iOS, we can use Alert as a simple alternative
        Alert.alert('Copied!', 'Project code copied to clipboard');
      }
    }
  };

  const SettingItem = ({ 
    icon, 
    iconColor, 
    title, 
    onPress, 
    rightElement, 
    showChevron = false 
  }: SettingItemProps) => (
    <TouchableOpacity 
      style={styles.settingItem} 
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.settingItemLeft}>
        <View style={[styles.iconContainer, { backgroundColor: iconColor }]}>
          <Ionicons name={icon} size={18} color="#FFFFFF" />
        </View>
        <Text style={styles.settingTitle}>{title}</Text>
      </View>
      <View style={styles.settingItemRight}>
        {rightElement}
        {showChevron && <Ionicons name="chevron-forward" size={18} color="#C8C8C8" />}
      </View>
    </TouchableOpacity>
  );

  const SectionHeader = ({ title }: { title: string }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {/* Profile Section */}
        <View style={styles.profileContainer}>
          <Image
            source={{ uri: 'https://fakeimg.pl/600x400' }}
            style={styles.profilePic}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.username}>Username</Text>
            <TouchableOpacity>
              <Text style={styles.userRole}>Role</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.profileArrow}>
            <Ionicons name="chevron-forward" size={20} color="#C8C8C8" />
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />
        
        <SectionHeader title="Project" />
        
        {/* Current Project Section - Only for leaders */}
        {activeProject && activeProject.role === 'leader' && (
          <View style={styles.projectInfoContainer}>
            <Text style={styles.projectName}>{activeProject.name}</Text>
            
            <View style={styles.projectCodeContainer}>
              <Text style={styles.projectCodeLabel}>Project Code:</Text>
              <View style={styles.projectCodeRow}>
                <Text style={styles.projectCode}>{activeProject.code}</Text>
                <TouchableOpacity 
                  style={styles.copyButton}
                  onPress={handleCopyProjectCode}
                >
                  <Ionicons name="copy-outline" size={16} color="#007AFF" />
                  <Text style={styles.copyText}>Copy</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.projectCodeHelper}>
                Share this code with team members so they can join your project.
              </Text>
            </View>
          </View>
        )}
        
        {/* Project Settings */}
        <SettingItem 
          icon="apps" 
          iconColor="#007AFF"
          title="Switch Project" 
          onPress={handleSelectProject}
          showChevron
        />
        
        {/* Manage Members Option - Only for leaders */}
        {activeProject && activeProject.role === 'leader' && (
          <SettingItem 
            icon="people" 
            iconColor="#4CD964"
            title="Manage Members" 
            onPress={handleManageMembers}
            showChevron
          />
        )}
        
        <View style={styles.divider} />
        <SectionHeader title="Appearance" />
        
        {/* Dark Mode Toggle */}
        <SettingItem 
          icon="moon" 
          iconColor="#787878"
          title="Dark Mode" 
          rightElement={
            <Switch
              value={isDarkMode}
              onValueChange={toggleTheme}
              trackColor={{ false: '#E0E0E0', true: '#4CD964' }}
              thumbColor="#FFFFFF"
            />
          }
        />
        
        <View style={styles.divider} />
        <SectionHeader title="Profile" />
        
        <SettingItem 
          icon="person" 
          iconColor="#FF9500"
          title="Edit Profile" 
          onPress={handleEditProfile}
          showChevron
        />
        
        <SettingItem 
          icon="key" 
          iconColor="#007AFF"
          title="Change Password" 
          onPress={handleChangePassword}
          showChevron
        />
        
        <View style={styles.divider} />
        <SectionHeader title="Notifications" />
        
        <SettingItem 
          icon="notifications" 
          iconColor="#34C759"
          title="Notifications" 
          rightElement={
            <Switch
              value={notificationsEnabled}
              onValueChange={toggleNotifications}
              trackColor={{ false: '#E0E0E0', true: '#4CD964' }}
              thumbColor="#FFFFFF"
            />
          }
        />
        
        <View style={styles.divider} />
        <SectionHeader title="Regional" />
        
        <SettingItem 
          icon="globe" 
          iconColor="#5856D6"
          title="Language" 
          onPress={handleChangeLanguage}
          showChevron
        />
        
        <View style={styles.divider} />
        <SettingItem 
          icon="log-out" 
          iconColor="#FF3B30"
          title="Logout" 
          onPress={handleLogout}
          showChevron
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
  },
  profilePic: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
  },
  profileInfo: {
    flex: 1,
    marginLeft: 12,
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  userRole: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  profileArrow: {
    padding: 4,
  },
  divider: {
    height: 0.5,
    backgroundColor: '#E0E0E0',
    marginVertical: 8,
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
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 0.5,
    borderBottomColor: '#FFFFFF',
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingTitle: {
    fontSize: 15,
    color: '#333',
  },
  // Project code section styles
  projectInfoContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
  },
  projectName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  projectCodeContainer: {
    backgroundColor: '#F0F7FF',
    borderRadius: 8,
    padding: 12,
    marginTop: 4,
  },
  projectCodeLabel: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  projectCodeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  projectCode: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1,
    color: '#333',
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  copyText: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '600',
    marginLeft: 4,
  },
  projectCodeHelper: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
});
