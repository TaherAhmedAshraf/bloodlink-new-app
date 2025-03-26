# Setting Up Firebase Push Notifications for BloodLink

This guide will help you set up Firebase Cloud Messaging (FCM) for push notifications in your BloodLink app.

## Prerequisites
- A Firebase account (https://firebase.google.com)
- A BloodLink project with React Native setup

## Firebase Project Setup

1. Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project or select an existing one
2. Add iOS and Android apps to your Firebase project with the following package names:
   - Android: `com.bloodlink`
   - iOS: `org.reactjs.native.example.bloodlink` (or your custom bundle identifier)

## Android Setup

1. Download the `google-services.json` file from the Firebase Console
2. Replace the placeholder file at `android/app/google-services.json` with your downloaded file
3. Make sure the file has the same package name as your application

## iOS Setup

1. Download the `GoogleService-Info.plist` file from the Firebase Console
2. Replace the placeholder file at `ios/bloodlink/GoogleService-Info.plist` with your downloaded file
3. Open your Xcode project and make sure that:
   - The `GoogleService-Info.plist` is added to your project
   - The `bloodlink.entitlements` file is included in your target's "Build Settings"
   - In Xcode's "Signing & Capabilities" tab, "Push Notifications" capability is enabled

## Additional Configuration

### iOS Application Setup 
1. If you plan to distribute your app, you will need to set up an APNs (Apple Push Notification service) certificate or key in the Firebase Console
2. Register an App ID in the Apple Developer portal with push notifications enabled
3. Update the `aps-environment` value in `bloodlink.entitlements` to `production` when building for distribution

### Android Channel Setup
- The default notification channel has been set up with the name "BloodLink" 
- You can modify the channel settings in `android/app/src/main/java/com/bloodlink/MainApplication.kt`

## Testing Push Notifications

You can test notifications from the Firebase Console:
1. Go to "Cloud Messaging" in the Firebase Console
2. Create a new notification
3. Target your test devices using Test Mode
4. Send the notification and check that it appears on your device

## Troubleshooting

### Android
- If notifications don't appear, check that:
  - Your device has Google Play Services installed
  - The app is not in battery optimization mode
  - You've granted notification permissions to the app

### iOS
- If notifications don't appear, check that:
  - You've granted notification permissions to the app
  - Your provisioning profile includes push notifications capability
  - For background notifications, ensure the payload includes the `content-available` flag

## Further Resources
- [Firebase Cloud Messaging Documentation](https://firebase.google.com/docs/cloud-messaging)
- [React Native Firebase Documentation](https://rnfirebase.io/messaging/usage)
- [React Native Push Notification Documentation](https://github.com/zo0r/react-native-push-notification) 