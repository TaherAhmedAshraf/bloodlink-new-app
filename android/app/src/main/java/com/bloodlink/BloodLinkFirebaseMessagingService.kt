package com.bloodlink

import android.util.Log
import com.google.firebase.messaging.FirebaseMessagingService
import com.google.firebase.messaging.RemoteMessage

class BloodLinkFirebaseMessagingService : FirebaseMessagingService() {
    private val TAG = "BloodLinkFCM"

    override fun onMessageReceived(remoteMessage: RemoteMessage) {
        Log.d(TAG, "From: ${remoteMessage.from}")

        // Check if message contains a data payload
        if (remoteMessage.data.isNotEmpty()) {
            Log.d(TAG, "Message data payload: ${remoteMessage.data}")
            
            // Let the react-native-push-notification library handle the notification
            // This is handled by RNPushNotificationListenerService which we've registered in AndroidManifest.xml
        }

        // Check if message contains a notification payload
        remoteMessage.notification?.let {
            Log.d(TAG, "Message Notification Body: ${it.body}")
            
            // Let the react-native-push-notification library handle it
            // The notification will automatically be displayed by RNPushNotificationListenerService
        }
    }

    override fun onNewToken(token: String) {
        Log.d(TAG, "Refreshed token: $token")
        
        // Store the token in your server or update it
        // This will be handled by the JavaScript code that calls the getDeviceToken function
    }
} 