import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TimesheetScreen from '../screens/teamMember/TimesheetScreen';
import TimesheetHistoryScreen from '../screens/teamMember/TimesheetHistoryScreen';
import TimesheetOverviewScreen from '../screens/teamMember/TimesheetOverviewScreen';
import TimesheetFormScreen from '../screens/teamMember/TimesheetFormScreen';
import TimesheetDraftsScreen from '../screens/teamMember/TimesheetDraftsScreen';
import { TimesheetStackParamList } from './types';

const TimesheetStack = createNativeStackNavigator<TimesheetStackParamList>();

export default function TimesheetStackNavigator() {
  return (
    <TimesheetStack.Navigator screenOptions={{ headerShown: false }}>
      <TimesheetStack.Screen name="TimesheetOverview" component={TimesheetOverviewScreen} />
      <TimesheetStack.Screen name="TimesheetMain" component={TimesheetScreen} />
      <TimesheetStack.Screen name="TimesheetHistory" component={TimesheetHistoryScreen} />
      <TimesheetStack.Screen name="TimesheetForm" component={TimesheetFormScreen} />
      <TimesheetStack.Screen name="TimesheetDrafts" component={TimesheetDraftsScreen} />
    </TimesheetStack.Navigator>
  );
} 