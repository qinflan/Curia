import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

interface Notification {
  id: string;
  title: string;
  body: string;
}

interface NotificationDropdownProps {
  visible: boolean;
  onClose: () => void;
}

// Dummy notifications for emulator/fallback
const DUMMY_NOTIFICATIONS: Notification[] = [
  { id: '1', title: 'Bill HR 1767 updated', body: 'Significant action: Bill introduced in House' },
  { id: '2', title: 'Bill S 712 updated', body: 'Significant action: Bill introduced in Senate' },
  { id: '3', title: 'Bill HR 999 updated', body: 'Significant action: Passed House' },
];

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ visible, onClose }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (visible) {
      // Set dummy notifications initially
      setNotifications(DUMMY_NOTIFICATIONS);

      // TODO: Add Expo push notification fetching logic here
    }
  }, [visible]);

  if (!visible) return null;

  const renderItem = ({ item }: { item: Notification }) => (
    <TouchableOpacity style={styles.notificationItem} onPress={onClose}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.body}>{item.body}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.dropdown}>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.emptyText}>No notifications</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  dropdown: {
    position: 'absolute',
    top: 105,
    right: 20,
    width: 300,
    maxHeight: 400,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
    zIndex: 1000,
    paddingVertical: 5,
  },
  notificationItem: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 2,
  },
  body: {
    fontSize: 14,
    color: '#555',
  },
  emptyText: {
    padding: 12,
    textAlign: 'center',
    color: '#999',
  },
});

export default NotificationDropdown;
