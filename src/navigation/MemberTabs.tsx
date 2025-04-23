import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import TaskScreen from '../screens/teamMember/TaskScreen';
import TimesheetScreen from '../screens/teamMember/TimesheetScreen';
import TimesheetHistoryScreen from '../screens/teamMember/TimesheetHistoryScreen';
import TimesheetOverviewScreen from '../screens/teamMember/TimesheetOverviewScreen';
import TeamMemberReportScreen from '../screens/teamMember/TeamMemberReportScreen';
import SettingsScreen from '../screens/common/SettingsScreen';
import TimesheetStackNavigator from './TimesheetStack';
import { TimesheetStackParamList } from './types';

const Tab = createBottomTabNavigator();
const TimesheetStack = createNativeStackNavigator<TimesheetStackParamList>();

// Nested navigator for Timesheet screens
const TimesheetNavigator = () => {
  return (
    <TimesheetStack.Navigator screenOptions={{ headerShown: false }}>
      <TimesheetStack.Screen name="TimesheetMain" component={TimesheetScreen} />
      <TimesheetStack.Screen name="TimesheetHistory" component={TimesheetHistoryScreen} />
    </TimesheetStack.Navigator>
  );
};

export type MemberTabParamList = {
  Tasks: undefined;
  Timesheet: undefined;
  TimesheetOverview: undefined;
  TeamMemberReport: undefined;
  Settings: undefined;
};

const MemberTabs = ({ route }: any) => {
  const initialRoute = route?.params?.initialTab || 'TimesheetOverview';

  return (
    <Tab.Navigator screenOptions={{ headerShown: false }} initialRouteName={initialRoute}>
      <Tab.Screen name="Tasks" component={TaskScreen}
        options={{
            tabBarLabel: "Tasks",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="list-outline" size={size} color={color} />
            ),
        }}
      />
      <Tab.Screen name="Timesheet" component={TimesheetNavigator}
        options={{
            tabBarLabel: "Clock In/Out",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="time-outline" size={size} color={color} />
            ),
        }}
      />
      <Tab.Screen name="TimesheetOverview" component={TimesheetStackNavigator}
        options={{
            tabBarLabel: "Timesheet",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="calendar-outline" size={size} color={color} />
            ),
        }}
      />
      <Tab.Screen name="TeamMemberReport" component={TeamMemberReportScreen}
        options={{
            tabBarLabel: "Report",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="bar-chart-outline" size={size} color={color} />
            ),
        }}
      />
      <Tab.Screen name="Settings" component={SettingsScreen}
        options={{
            tabBarLabel: "Settings",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="settings-outline" size={size} color={color} />
            ),
        }}
      />
    </Tab.Navigator>
  );
};

export default MemberTabs;
