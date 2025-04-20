import React from 'react';
import { useColorScheme, View, StatusBar } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import { Colors } from 'react-native/Libraries/NewAppScreen';

export default function App() {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundColor = isDarkMode ? Colors.darker : Colors.lighter;
  const statusBarStyle = isDarkMode ? 'light-content' : 'dark-content';

  return (
    <View style={{ flex: 1, backgroundColor }}>
      <StatusBar barStyle={statusBarStyle} backgroundColor={backgroundColor} />
      <AppNavigator />
    </View>
  );
}