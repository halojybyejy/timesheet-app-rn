# Timesheet App (React Native)

## Project Overview

This is a React Native mobile application for timesheet management, designed for teams to track working hours, manage tasks, and generate reports. The app supports different user roles with role-specific interfaces.

## Project Structure

The app follows a role-based architecture, separating screens by user roles:
- **Team Member**: Regular employees who log their time and view assigned tasks
- **Team Leader**: Managers who oversee team activities and approve timesheets
- **Common**: Screens accessible to all users regardless of role

## Running the App in Android Studio Emulator

To run the app in Android Studio emulator using cmd:

1. Navigate to the app directory:
```
cd C:\timesheet-app-rn
```

2. Start the Metro bundler:
```
npx react-native start --port=8088
```

3. In a new terminal window, run the app on Android emulator:
```
npx react-native run-android --port=8088
```

Note: Port 8088 is used to avoid conflicts with other services.

## 🗂️ Screens Overview

---

### 📁 `screens/common/`

These screens are shared by **all users**, regardless of role.

| Screen                | Purpose                                                                |
|-----------------------|------------------------------------------------------------------------|
| `LoginScreen.tsx`     | Login UI for all users. Handles authentication.                        |
| `HomeScreen.tsx`      | Home dashboard. Can show personalized stats or shortcuts based on role.|
| `SettingsScreen.tsx`  | Settings for user. Shared by all roles.                               |

---

### 👷‍♀️ `screens/teamMember/`

Used only by **team members** (i.e., regular employees).

| Screen | Purpose |
|--------|---------|
| `TaskScreen.tsx` | Shows the list of tasks assigned to the logged-in user. |
| `TimesheetScreen.tsx` | Real-time clock in/clock out interface for logging working hours. |
| `TimesheetHistoryScreen.tsx` | Displays a history of the user's submitted timesheets and their approval status. |
| `SubmitTimesheetScreen.tsx` | Form for manually submitting time entries for a given day/task. |
| `TeamMemberReportScreen.tsx` | Personal report screen. Displays user's performance, hours worked, etc. |

---

### 🧑‍💼 `screens/teamLeader/`

Used by **team leaders or managers** who oversee others.

| Screen | Purpose |
|--------|---------|
| `TeamMembersScreen.tsx` | Shows a list of team members and their statuses. |
| `TimesheetApproveScreen.tsx` | Displays submitted timesheets by team members, with options to approve/reject. |
| `AssignTaskScreen.tsx` | Allows leader to assign new tasks to team members. |
| `TeamLeaderReportScreen.tsx` | Dashboard for viewing reports across the whole team. May include charts/stats. |

---

## 📂 Additional Project Directories

- **`/src/navigation`**: Contains navigation configuration including `AppNavigator.tsx`
- **`/src/components`**: Reusable UI components
- **`/src/services`**: API and data services
- **`/src/context`**: React Context providers
- **`/src/utils`**: Helper functions and utilities
- **`/src/assets`**: Images, icons and other static assets

## Development Workflow

### Quick Commands

- Start the development server: `npm start`
- Run on Android: `npm run android`
- Run on iOS: `npm run ios`

### Debugging Tips

- **Android**: Press <kbd>R</kbd> key twice or use <kbd>Ctrl</kbd> + <kbd>M</kbd> to access Dev Menu
- **iOS**: Press <kbd>R</kbd> key in iOS Simulator for reload

## Architecture Notes

- This application uses a role-based architecture for clear separation of concerns
- Navigation is conditionally rendered based on the user's role
- When role-based routing is implemented, users will only see screens relevant to their access level
