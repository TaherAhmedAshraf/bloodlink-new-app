import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../../theme/colors';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/types';

type NotificationScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Notification'
>;

interface NotificationScreenProps {
  navigation: NotificationScreenNavigationProp;
}

// Define notification types
type NotificationType = 'request_accepted' | 'blood_needed';

interface Notification {
  id: string;
  type: NotificationType;
  userName?: string;
  userImage?: string;
  bloodType?: string;
  time: string;
  isRead: boolean;
}

const NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'request_accepted',
    userName: 'Austin Clark',
    userImage: 'https://randomuser.me/api/portraits/men/32.jpg',
    time: '1h',
    isRead: false,
  },
  {
    id: '2',
    type: 'request_accepted',
    userName: 'Austin Clark',
    userImage: 'https://randomuser.me/api/portraits/men/32.jpg',
    time: '1h',
    isRead: true,
  },
  {
    id: '3',
    type: 'blood_needed',
    bloodType: 'A+',
    time: '1h',
    isRead: false,
  },
  {
    id: '4',
    type: 'blood_needed',
    bloodType: 'A+',
    time: '1h',
    isRead: true,
  },
];

const NotificationScreen: React.FC<NotificationScreenProps> = ({ navigation }) => {
  const renderNotificationItem = ({ item }: { item: Notification }) => {
    if (item.type === 'request_accepted') {
      return (
        <TouchableOpacity 
          style={styles.notificationItem}
          onPress={() => handleNotificationPress(item)}
        >
          <Image 
            source={{ uri: item.userImage }} 
            style={styles.userImage} 
          />
          <View style={styles.notificationContent}>
            <Text style={styles.notificationText}>
              <Text style={styles.userName}>{item.userName}</Text> accepted your blood request
            </Text>
            <Text style={styles.timeText}>{item.time}</Text>
          </View>
          {!item.isRead && <View style={styles.unreadIndicator} />}
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity 
          style={styles.notificationItem}
          onPress={() => handleNotificationPress(item)}
        >
          <View style={styles.bloodTypeCircle}>
            <Text style={styles.bloodTypeText}>{item.bloodType}</Text>
          </View>
          <View style={styles.notificationContent}>
            <Text style={styles.notificationText}>
              <Text style={styles.bloodType}>{item.bloodType} Blood</Text> needed near your location
            </Text>
            <Text style={styles.timeText}>{item.time}</Text>
          </View>
          {!item.isRead && <View style={styles.unreadIndicator} />}
        </TouchableOpacity>
      );
    }
  };

  const handleNotificationPress = (notification: Notification) => {
    // Handle notification press based on type
    if (notification.type === 'request_accepted') {
      console.log('Navigate to request detail or chat with donor');
    } else if (notification.type === 'blood_needed') {
      console.log('Navigate to nearby blood request');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={colors.background} barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notification</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Notification List */}
      <FlatList
        data={NOTIFICATIONS}
        renderItem={renderNotificationItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    width: 40,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  headerRight: {
    width: 40,
  },
  listContainer: {
    paddingVertical: 8,
    gap: 10,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    borderWidth: .5,
    borderColor: colors.border,
    borderRadius: 10,
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  bloodTypeCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFEBEE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bloodTypeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
  notificationContent: {
    flex: 1,
    marginLeft: 12,
  },
  notificationText: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 4,
  },
  userName: {
    fontWeight: '600',
  },
  bloodType: {
    fontWeight: '600',
  },
  timeText: {
    fontSize: 14,
    color: colors.primary,
  },
  unreadIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginLeft: 8,
  }
});

export default NotificationScreen; 