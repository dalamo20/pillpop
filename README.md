# PillPop

PillPop is a mobile app built with **React Native** to help users manage their daily medication routine. It offers smart reminders, pill tracking, and AI powered autofill recommendations. Designed with caregivers, patients, and real-life routines in mind.

**NOTE:** Using the browser-based emulator from Appetizer.io means certain features that require device permissions (e.g. push notifications) may not work or be available.

## Features

- **Track daily & weekly pill intake** with visual progress
- **Smart reminder notifications** for scheduled times
- **AI medication autofill** _(in progress)_ – detects pill details from name
- **Firebase Auth** – supports email/password & Google Sign-In
- **Weekly pill completion history** and stats

## Tech Stack

- **Framework:** React Native (TypeScript)
- **Navigation:** React Navigation (Native Stack + Bottom Tabs)
- **Authentication:** Firebase Auth (Modular SDK + Google Sign-In)
- **Database:** Firebase Firestore
- **State Management:** React Context API (for Auth)
- **Notifications:** 'react-native-notifications'
- **Toast Alerts:** 'react-native-toast-message'
- **Styling:** React Native StyleSheets
- **Build Tooling:** Gradle, Java 17+, Android SDK

This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

**Clone the repo**
git clone https://github.com/dalamo20/pillpop.git
cd pillpop

# Getting Started

> **Note**: Make sure you have completed the [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment) guide before proceeding.

## Step 1: Setting Up

# Using npm

npm install

# Set up firebase

- Add your Firebase config to firebaseConfig.ts
- Enable Firebase Auth (email/password, Google)
- Create Firestore structure for medications
- Add google-services.json file to /android/app/ directory
- Set keys in .env

## Step 2: Build and run your app

With Metro running, open a new terminal window/pane from the root of your React Native project, and use one of the following commands to build and run your Android or iOS app:

### Android (If using Android Studio)

npx react-native run-android

### OR Run React Native (w/o Android Studio)

npx react-native start

## SUCCESS!

The app should be be working now. Make sure

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
