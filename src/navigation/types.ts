export type RootStackParamList = {
  LeaderTabs: undefined;
  MemberTabs: undefined;
  Login: undefined;
  Home: undefined;
  Timesheet: undefined;
  TimesheetApprove: undefined;
  AssignTask: undefined;
  TeamLeaderReport: undefined;
  TeamMembers: undefined;
  TimesheetOverview: undefined;
  LeaderTimesheetOverview: undefined;
  LeaderTimesheetDraft: undefined;
  Tasks: undefined;
  TeamMemberReport: undefined;
  SelectProject: undefined;
  CreateProject: undefined;
  JoinProject: undefined;
  ManageMembers: undefined;
  ChangePassword: undefined;
  EditProfile: undefined;
  ChangeLanguage: undefined;
  TaskDetail: { task: any };
  TimesheetDetail: { 
    timesheet: any;
    onStatusUpdate: (id: string, newStatus: 'Approved' | 'Rejected', reason?: string) => void;
  };
};

export type TimesheetStackParamList = {
  TimesheetMain: undefined;
  TimesheetHistory: undefined;
  TimesheetOverview: undefined;
  TimesheetForm: { date?: string };
  TimesheetDrafts: undefined;
};
