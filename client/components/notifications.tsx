// NotificationsAllInOne.tsx
// FULL ALL-IN-ONE: Push Notifications + Dropdown Inbox + Token Registration

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Platform,
} from 'react-native';

import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Ionicons } from '@expo/vector-icons';

// ----------------------------
// Notification Type
// ----------------------------
export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

// ----------------------------
// Dummy Notifications (fallback until backend implemented)
// ----------------------------
const dummyNotifications: NotificationItem[] = [
  {
    id: '1',
    title: 'New Bill Introduced',
    message: 'A new healthcare reform bill was introduced.',
    timestamp: new Date().toISOString(),
    read: false,
  },
  {
    id: '2',
    title: 'Bill Update',
    message: 'Student loan relief bill moved to committee review.',
    timestamp: new Date().toISOString(),
    read: true,
  },
];

// ----------------------------
// Register for Push Notifications
// ----------------------------
async function registerForPushNotificationsAsync(): Promise<string | null> {
  let token: string | null = null;

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.warn('Permission for push notifications not granted.');
      return null;
    }

    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log('Expo Push Token Registered:', token);
  } else {
    console.warn('Push notifications require a physical device.');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
    });
  }

  return token;
}

// ----------------------------
// ALL-IN-ONE NOTIFICATION DROPDOWN COMPONENT
// ----------------------------
const NotificationsAllInOne: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] =
    useState<NotificationItem[]>(dummyNotifications);

  // Register push notifications on mount
  useEffect(() => {
    const setup = async () => {
      const token = await registerForPushNotificationsAsync();

      // OPTIONAL: send token to backend later
      // fetch("YOUR_BACKEND_URL", { method: "POST", body: JSON.stringify({ token }) })
    };

    setup();
  }, []);

  // Handle receiving notifications
  useEffect(() => {
    // When notification arrives while app is open
    const receiveSub = Notifications.addNotificationReceivedListener((notif) => {
      const newItem: NotificationItem = {
        id: Math.random().toString(),
        title: notif.request.content.title ?? 'New Notification',
        message: notif.request.content.body ?? '',
        timestamp: new Date().toISOString(),
        read: false,
      };

      setNotifications((prev) => [newItem, ...prev]);
    });

    // When user taps the notification
    const tapSub = Notifications.addNotificationResponseReceivedListener(() => {
      setOpen(true); // automatically open dropdown
    });

    return () => {
      receiveSub.remove();
      tapSub.remove();
    };
  }, []);

  return (
    <View style={styles.container}>
      {/* Toggle Button */}
      <TouchableOpacity style={styles.button} onPress={() => setOpen(!open)}>
        <Ionicons name="notifications-outline" size={24} color="white" />
        <Text style={styles.buttonText}>Notifications</Text>
        <Ionicons
          name={open ? 'chevron-up-outline' : 'chevron-down-outline'}
          size={20}
          color="white"
        />
      </TouchableOpacity>

      {/* Dropdown */}
      {open && (
        <View style={styles.dropdown}>
          <FlatList
            data={notifications}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View
                style={[styles.notificationItem, !item.read && styles.unread]}
              >
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.message}>{item.message}</Text>
                <Text style={styles.time}>
                  {new Date(item.timestamp).toLocaleString()}
                </Text>
              </View>
            )}
          />
        </View>
      )}
    </View>
  );
};

export default NotificationsAllInOne;

// ----------------------------
// Styles
// ----------------------------
const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    padding: 10,
    borderRadius: 8,
    justifyContent: 'space-between',
  },
  buttonText: {
    flex: 1,
    marginLeft: 8,
    color: 'white',
    fontWeight: '600',
  },
  dropdown: {
    marginTop: 8,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 10,
    maxHeight: 300,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 5,
  },
  notificationItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  unread: {
    backgroundColor: '#E0F2FE',
  },
  title: {
    fontWeight: '700',
    color: '#0F172A',
  },
  message: {
    color: '#334155',
    marginTop: 2,
  },
  time: {
    fontSize: 12,
    marginTop: 4,
    color: '#64748B',
  },
});

