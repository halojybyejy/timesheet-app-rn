# Timesheet App (React Native)

## Running the App in Android Studio Emulator

To run the app in Android Studio emulator using cmd:

1. Navigate to the app directory:
```
cd C:\timesheet-app-rn\app
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


# 🗂️ Screens Overview – Timesheet App

This project separates screens by user roles: **Team Member**, **Team Leader**, and **Common** screens. Each screen serves a unique function in the timesheet and task management workflow.

---

## 📁 `screens/common/`

These screens are shared by **all users**, regardless of role.

| Screen | Purpose |
|--------|---------|
| `LoginScreen.tsx` | Login UI for all users. Handles authentication. |
| `HomeScreen.tsx` | Home dashboard. Can show personalized stats or shortcuts based on role. |
| `TimesheetScreen.tsx` | Real-time clock in/clock out interface for logging working hours. Shared by all roles. |

---

## 👷‍♀️ `screens/teamMember/`

Used only by **team members** (i.e., regular employees).

| Screen | Purpose |
|--------|---------|
| `TaskScreen.tsx` | Shows the list of tasks assigned to the logged-in user. |
| `MyTimesheetsScreen.tsx` | Displays a history of the user’s submitted timesheets and their approval status. |
| `SubmitTimesheetScreen.tsx` | Form for manually submitting time entries for a given day/task. |
| `TeamMemberReportScreen.tsx` | Personal report screen. Displays user's performance, hours worked, etc. |

---

## 🧑‍💼 `screens/teamLeader/`

Used by **team leaders or managers** who oversee others.

| Screen | Purpose |
|--------|---------|
| `TeamMembersScreen.tsx` | Shows a list of team members and their statuses. |
| `ApproveTimesheetsScreen.tsx` | Displays submitted timesheets by team members, with options to approve/reject. |
| `AssignTaskScreen.tsx` | Allows leader to assign new tasks to team members. |
| `TeamLeaderReportScreen.tsx` | Dashboard for viewing reports across the whole team. May include charts/stats. |

---

## 🧠 Notes

- This structure promotes **clarity**, **role separation**, and **scalability**.
- When role-based routing is implemented, users will only see screens relevant to their access level.

You can add/update this documentation as your app evolves.











This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

# Getting Started

> **Note**: Make sure you have completed the [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment) guide before proceeding.

## Step 1: Start Metro

First, you will need to run **Metro**, the JavaScript build tool for React Native.

To start the Metro dev server, run the following command from the root of your React Native project:

```sh
# Using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Build and run your app

With Metro running, open a new terminal window/pane from the root of your React Native project, and use one of the following commands to build and run your Android or iOS app:

### Android

```sh
# Using npm
npm run android

# OR using Yarn
yarn android
```

### iOS

For iOS, remember to install CocoaPods dependencies (this only needs to be run on first clone or after updating native deps).

The first time you create a new project, run the Ruby bundler to install CocoaPods itself:

```sh
bundle install
```

Then, and every time you update your native dependencies, run:

```sh
bundle exec pod install
```

For more information, please visit [CocoaPods Getting Started guide](https://guides.cocoapods.org/using/getting-started.html).

```sh
# Using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up correctly, you should see your new app running in the Android Emulator, iOS Simulator, or your connected device.

This is one way to run your app — you can also build it directly from Android Studio or Xcode.

## Step 3: Modify your app

Now that you have successfully run the app, let's make changes!

Open `App.tsx` in your text editor of choice and make some changes. When you save, your app will automatically update and reflect these changes — this is powered by [Fast Refresh](https://reactnative.dev/docs/fast-refresh).

When you want to forcefully reload, for example to reset the state of your app, you can perform a full reload:

- **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Dev Menu**, accessed via <kbd>Ctrl</kbd> + <kbd>M</kbd> (Windows/Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (macOS).
- **iOS**: Press <kbd>R</kbd> in iOS Simulator.

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [docs](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you're having issues getting the above steps to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.
