import React from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { useRouter } from 'expo-router'
import Ionicons from '@expo/vector-icons/Ionicons';

const BackButton = () => {
    const router = useRouter();
  return (
    <View>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  backButton: {
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#ddd',
  },
});

export default BackButton