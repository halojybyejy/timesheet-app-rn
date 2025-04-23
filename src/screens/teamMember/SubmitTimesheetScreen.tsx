import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TimesheetStackParamList } from '../../navigation/types';

type TimesheetNavigationProp = NativeStackNavigationProp<TimesheetStackParamList>;

const SubmitTimesheetScreen = () => {
  const navigation = useNavigation<TimesheetNavigationProp>();

  useEffect(() => {
    // Redirect to the new TimesheetOverviewScreen
    navigation.replace('TimesheetOverview');
  }, [navigation]);

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#2089dc" />
    </SafeAreaView>
  );
};

export default SubmitTimesheetScreen;