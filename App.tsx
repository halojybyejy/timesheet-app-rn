import React from 'react';
import { useColorScheme, View, StatusBar } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import { Provider as PaperProvider } from 'react-native-paper';
// Define our own Colors object since NewAppScreen is no longer available in this path
const Colors = {
  darker: '#121212',
  lighter: '#F3F3F3',
};
import './src/i18n/i18n'; // only once in App.tsx

export default function App() {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundColor = isDarkMode ? Colors.darker : Colors.lighter;
  const statusBarStyle = isDarkMode ? 'light-content' : 'dark-content';

  return (
    <PaperProvider>
      <View style={{ flex: 1, backgroundColor }}>
        <StatusBar barStyle={statusBarStyle} backgroundColor={backgroundColor} />
        <AppNavigator />
      </View>
    </PaperProvider>
  );
}