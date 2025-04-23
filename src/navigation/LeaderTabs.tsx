import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import TeamMembersScreen from '../screens/teamLeader/TeamMembersScreen';
import TimesheetApproveScreen from '../screens/teamLeader/TimesheetApproveScreen';
import AssignTaskScreen from '../screens/teamLeader/AssignTaskScreen';
import LeaderTimesheetOverviewScreen from '../screens/teamLeader/LeaderTimesheetOverviewScreen';
import TeamLeaderReportScreen from '../screens/teamLeader/TeamLeaderReportScreen';
import SettingsScreen from '../screens/common/SettingsScreen';

const Tab = createBottomTabNavigator();

export type LeaderTabParamList = {
  TeamMembers: undefined;
  TimesheetApprove: undefined;
  AssignTask: undefined;
  LeaderTimesheetOverview: undefined;
  TeamLeaderReport: undefined;
  Settings: undefined;
};

const LeaderTabs = ({ route }: any) => {
  const initialRoute = route?.params?.initialTab || 'LeaderTimesheetOverview';

  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={initialRoute}
    >
      <Tab.Screen name="TeamMembers" component={TeamMembersScreen}
        options={{
            tabBarLabel: "Team",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="people-outline" size={size} color={color} />
            ),
        }}
      />
      <Tab.Screen name="TimesheetApprove" component={TimesheetApproveScreen}
        options={{
            tabBarLabel: "Approve Timesheets",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="checkmark-done-outline" size={size} color={color} />
            ),
        }}
      />
      <Tab.Screen name="LeaderTimesheetOverview" component={LeaderTimesheetOverviewScreen}
        options={{
            tabBarLabel: "Timesheets",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="calendar-outline" size={size} color={color} />
            ),
        }}
      />
      <Tab.Screen name="TeamLeaderReport" component={TeamLeaderReportScreen}
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

export default LeaderTabs;
