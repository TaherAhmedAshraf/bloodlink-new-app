# Splash Screen Setup for BloodLink App

We've set up a splash screen for your BloodLink app that displays your custom splash image when the app launches. Here's a summary of what's been implemented:

## Android Implementation (Completed)

1. ✅ Installed the `react-native-splash-screen` library
2. ✅ Created a drawable resource with your splash screen image
3. ✅ Created a layout for the splash screen in `android/app/src/main/res/layout/launch_screen.xml`
4. ✅ Added a splash theme in `styles.xml`
5. ✅ Updated `AndroidManifest.xml` to use the splash theme
6. ✅ Modified `MainActivity.kt` to show the splash screen
7. ✅ Fixed resource naming issue by renaming `SplashScreen.png` to `splashscreen.png` (Android requires lowercase filenames)

## iOS Implementation (Partially Completed)

1. ✅ Added the splash screen image to `ios/bloodlink/Images.xcassets/SplashScreen.imageset/`
2. ✅ Created `Contents.json` for the image asset
3. ✅ Updated `LaunchScreen.storyboard` to use the splash screen image
4. ✅ Added the `react-native-splash-screen` pod to the Podfile

### Steps to Complete iOS Setup

Since CocoaPods is not installed on your system, you'll need to complete these steps:

1. Install CocoaPods if not already installed:
   ```bash
   sudo gem install cocoapods
   ```

2. Navigate to the iOS directory and install the pods:
   ```bash
   cd ios
   pod install
   ```

## React Native Implementation (Completed)

1. ✅ Created a `SplashScreenWrapper` component that hides the splash screen after 1.5 seconds
2. ✅ Updated `App.tsx` to use the `SplashScreenWrapper` component

## Testing the Splash Screen

To test the splash screen:

1. For Android:
   ```bash
   npx react-native run-android
   ```

2. For iOS (after completing the setup):
   ```bash
   npx react-native run-ios
   ```

The splash screen should display when the app launches and disappear after 1.5 seconds.

## Important Notes

1. **Android Resource Naming**: Android requires resource filenames to contain only lowercase letters, numbers, and underscores. We've renamed the splash screen image from `SplashScreen.png` to `splashscreen.png` to comply with this requirement.

## Customization

If you want to modify the splash screen duration, edit the timeout value in `src/components/SplashScreen.tsx`.

## Troubleshooting

If the splash screen doesn't show or disappear correctly:

1. Check that the splash screen image is correctly named and located
2. Make sure `react-native-splash-screen` is properly installed
3. Verify that the `SplashScreen.hide()` method is being called in the `SplashScreenWrapper` component 