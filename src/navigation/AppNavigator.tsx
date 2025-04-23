import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';

import LeaderTabs from './LeaderTabs';
import MemberTabs from './MemberTabs';
import LoginScreen from '../screens/common/LoginScreen';
import HomeScreen from '../screens/common/HomeScreen';
import SelectProjectScreen from '../screens/common/SelectProjectScreen';
import CreateProjectScreen from '../screens/common/CreateProjectScreen';
import JoinProjectScreen from '../screens/common/JoinProjectScreen';
import ChangePasswordScreen from '../screens/common/ChangePasswordScreen';
import EditProfileScreen from '../screens/common/EditProfileScreen';
import ChangeLanguageScreen from '../screens/common/ChangeLanguageScreen';
import TimesheetApproveScreen from '../screens/teamLeader/TimesheetApproveScreen';
import AssignTaskScreen from '../screens/teamLeader/AssignTaskScreen';
import LeaderTimesheetOverviewScreen from '../screens/teamLeader/LeaderTimesheetOverviewScreen';
import LeaderTimesheetDraftScreen from '../screens/teamLeader/LeaderTimesheetDraftScreen';
import TeamLeaderReportScreen from '../screens/teamLeader/TeamLeaderReportScreen';
import TeamMembersScreen from '../screens/teamLeader/TeamMembersScreen';
import ManageMembersScreen from '../screens/teamLeader/ManageMembersScreen';
import TimesheetScreen from '../screens/teamMember/TimesheetScreen';
import TimesheetOverviewScreen from '../screens/teamMember/TimesheetOverviewScreen';
import TaskScreen from '../screens/teamMember/TaskScreen';
import TaskDetailScreen from '../screens/teamMember/TaskDetailScreen';
import TeamMemberReportScreen from '../screens/teamMember/TeamMemberReportScreen';
import TimesheetDetailScreen from '../screens/teamLeader/TimesheetDetailScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SelectProject" component={SelectProjectScreen} />
        <Stack.Screen name="CreateProject" component={CreateProjectScreen} />
        <Stack.Screen name="JoinProject" component={JoinProjectScreen} />
        <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        <Stack.Screen name="ChangeLanguage" component={ChangeLanguageScreen} />
        <Stack.Screen name="LeaderTabs" component={LeaderTabs} />
        <Stack.Screen name="MemberTabs" component={MemberTabs} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="TimesheetApprove" component={TimesheetApproveScreen} />
        <Stack.Screen name="AssignTask" component={AssignTaskScreen} />
        <Stack.Screen name="TeamLeaderReport" component={TeamLeaderReportScreen} />
        <Stack.Screen name="TeamMembers" component={TeamMembersScreen} />
        <Stack.Screen name="ManageMembers" component={ManageMembersScreen} />
        <Stack.Screen name="Timesheet" component={TimesheetScreen} />
        <Stack.Screen name="TimesheetOverview" component={TimesheetOverviewScreen} />
        <Stack.Screen name="LeaderTimesheetOverview" component={LeaderTimesheetOverviewScreen} />
        <Stack.Screen name="LeaderTimesheetDraft" component={LeaderTimesheetDraftScreen} />
        <Stack.Screen name="Tasks" component={TaskScreen} />
        <Stack.Screen name="TaskDetail" component={TaskDetailScreen} />
        <Stack.Screen name="TeamMemberReport" component={TeamMemberReportScreen} />
        <Stack.Screen name="TimesheetDetail" component={TimesheetDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;