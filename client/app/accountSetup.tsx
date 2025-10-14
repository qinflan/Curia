import React, { use, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import { ResizeMode, Video } from "expo-av";
import { BlurView } from "expo-blur";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import {FED_POLICY_AREAS} from "./enums/BillsEnums"; 
import { useAuth } from "@/hooks/AuthContext";
import { useRouter } from "expo-router";

export default function AccountSetup() {
  const router = useRouter();
  const { update } = useAuth();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    city: "",
    state: "",
    dob: new Date(),
    interests: [] as string[],
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [step, setStep] = useState(1);

  const toggleInterest = (interest: string) => {
    setForm((prev) => {
      const alreadySelected = prev.interests.includes(interest);
      if (alreadySelected) {
        return { ...prev, interests: prev.interests.filter((i) => i !== interest) };
      }
      if (prev.interests.length >= 5) {
        Alert.alert("Limit reached", "You can select up to 5 interests.");
        return prev;
      }
      return { ...prev, interests: [...prev.interests, interest] };
    });
  };

  const handleNext = () => {
    // simple per-step validation
    switch (step) {
      case 1:
        if (!form.firstName || !form.lastName) {
          Alert.alert("Missing info", "Please enter your first and last name.");
          return;
        }
        break;
      case 2:
        if (!form.city || !form.state) {
          Alert.alert("Missing info", "Please enter your city and state.");
          return;
        }
        break;
      case 3:
        // no validation for date yet
        break;
      case 4:
        if (form.interests.length === 0) {
          Alert.alert("Select interests", "Please choose at least one interest.");
          return;
        }
        break;
    }
    if (step < 4) setStep(step + 1);
    else handleSubmit();
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    try {
      await update({
      firstName: form.firstName,
      lastName: form.lastName, 
      city: form.city,
      state: form.state,
      setupComplete: true,
      dateOfBirth: form.dob,
      preferences: {
        interests: form.interests,
      },
    });
    } catch (err) {
      Alert.alert("Error", "Failed to complete account setup. Please try again.");
      return;
    }
    router.replace("/homeDashboard");
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Video
        source={require("../assets/videos/gradient.mp4")}
        style={StyleSheet.absoluteFill}
        resizeMode={ResizeMode.COVER}
        isLooping
        shouldPlay
        isMuted
        />
      <View style={styles.container}>

        {step === 1 && (
          <BlurView intensity={20} tint="dark" style={styles.blurContainer}>
            <Text style={styles.header}>Let's setup your account.</Text>
            <Text style={styles.subHeader}>What’s your name?</Text>
            <TextInput
              placeholder="First Name"
              style={styles.input}
              placeholderTextColor={"rgba(255, 255, 255, 0.6)"}
              value={form.firstName}
              onChangeText={(t) => setForm({ ...form, firstName: t })}
            />
            <TextInput
              placeholder="Last Name"
              style={styles.input}
              placeholderTextColor={"rgba(255, 255, 255, 0.6)"}
              value={form.lastName}
              onChangeText={(t) => setForm({ ...form, lastName: t })}
            />
  
          </BlurView>
        )}

        {step === 2 && (
          <BlurView intensity={20} tint="dark" style={styles.blurContainer}>
            <Text style={styles.subHeader}>Where are you located?</Text>
            <TextInput
              placeholder="City"
              placeholderTextColor={"rgba(255, 255, 255, 0.6)"}
              style={styles.input}
              value={form.city}
              onChangeText={(t) => setForm({ ...form, city: t })}
            />
            <TextInput
              placeholder="State"
              placeholderTextColor={"rgba(255, 255, 255, 0.6)"}
              style={styles.input}
              value={form.state}
              onChangeText={(t) => setForm({ ...form, state: t })}
            />
          </BlurView>
        )}

        {step === 3 && (
          <>
            <Text style={styles.subHeader}>When’s your birthday?</Text>
            <TouchableOpacity
              // style={styles.dateButton}
              onPress={() => setShowDatePicker(true)}
            >
              <BlurView intensity={20} tint="dark" style={styles.blurContainer}>
                <Text style={styles.dateText}>{form.dob ? form.dob.toDateString() : "Select Date of Birth"}</Text>
              </BlurView>
            </TouchableOpacity>

            <DateTimePickerModal
                isVisible={showDatePicker}
                mode="date"
                maximumDate={new Date()}
                date={form.dob || new Date()}
                onConfirm={(date: Date) => {
                  setForm(prev => ({ ...prev, dob: date }));
                  setShowDatePicker(false);
                }}
                onCancel={() => setShowDatePicker(false)}
                />
          </>
        )}

        {step === 4 && (
          <>
            <Text style={styles.subHeader}>Select up to 5 interests</Text>
            <ScrollView contentContainerStyle={styles.interestContainer}>
              {FED_POLICY_AREAS.map((area) => {
                const selected = form.interests.includes(area);
                return (
                  <TouchableOpacity
                    key={area}
                    style={selected && styles.selectedTile}
                    onPress={() => toggleInterest(area)}
                  >
                    <BlurView intensity={selected ? 50 : 20} tint="dark" style={styles.interestTile}>
                    <Text style={[styles.interestText, selected && styles.selectedText]}>
                      {area}
                    </Text>
                    </BlurView>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </>
        )}

        <View style={styles.navigationRow}>
          {step > 1 && (
            <TouchableOpacity onPress={handleBack}>
              <BlurView intensity={20} tint="dark" style={styles.navButtonSecondary}>
                <Text style={styles.navText}>Back</Text>
              </BlurView>
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={handleNext}>
            <BlurView intensity={20} tint="dark" style={styles.navButtonPrimary}>
            <Text style={styles.navText}>{step < 4 ? "Next" : "Finish"}</Text>
            </BlurView>
          </TouchableOpacity>
        </View>
      </View>
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  header: {
    fontFamily: "InterSemiBold",
    letterSpacing: -1,
    color: "white",
    opacity: 0.8,
    fontSize: 28,
    marginBottom: 30,
    textAlign: "center",
    maxWidth: "70%",
    alignSelf: "center",
  },
  subHeader: {
    fontFamily: "InterRegular",
    letterSpacing: -1,
    color: "white",
    opacity: 0.8,
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    textAlign: "center",
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15, // this is the blur radius
  },
  input: {
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.5)",
    color: "white",
    overflow: "hidden", 
    borderRadius: 100,
    padding: 10,
    fontSize: 16,
    marginBottom: 15,
    paddingLeft: 20
  },
  blurContainer: {
    padding: 20,
    borderRadius: 50,
    overflow: "hidden",
    marginBottom: 15,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.5)",
  },
  dateButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    alignItems: "center",
    marginBottom: 20,
  },
  dateText: {
    fontFamily: "InterRegular",
    fontSize: 16,
    letterSpacing: -1,
    color: "white",
    opacity: 0.75,
    textAlign: "center",
  },
  interestContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 8,
    marginBottom: 30,
  },
  interestTile: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 100,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.5)",
  },
  selectedTile: {
    // backgroundColor: "#000",
    // borderColor: "#1d1d1d",
  },
  interestText: {
    fontFamily: "InterRegular",
    letterSpacing: -0.2,
    color: "white",
    fontSize: 14
  },
  selectedText: {
    color: "#fff",
    fontFamily: "InterSemiBold",
    letterSpacing: -0.2,
  },
  navigationRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    alignItems: "center",
    marginTop: 10,
  },
  navButtonPrimary: {
    borderRadius: 50,
    width: 175,
    padding: 12,
    textAlign: "center",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.5)",
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  navButtonSecondary: {
    padding: 12,
    borderRadius: 50,
    width: 100,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.5)",
    overflow: "hidden",
    flex: 1,
    marginRight: 10,
  },
  navText: {
    fontFamily: "InterRegular",
    fontSize: 20,
    letterSpacing: -1,
    color: "white",
    opacity: 0.75,
    textAlign: "center",
  },

  navIcon: {
    marginLeft: 8,
    opacity: 0.75,
    textAlign: "center",
    color: "white",
  }
});