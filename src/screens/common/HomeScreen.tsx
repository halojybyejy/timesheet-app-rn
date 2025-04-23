import { View, Text, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import React from 'react';

const HomeScreen = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Welcome to Home Screen</Text>
      <Button title="Go to Tasks" onPress={() => navigation.navigate('Tasks')} />
      <Button title="Go to Timesheet" onPress={() => navigation.navigate('Timesheet')} />
    </View>
  );
};

export default HomeScreen;
