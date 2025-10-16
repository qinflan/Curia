import { Text, View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useState } from 'react';
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function faq() {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // NOTE this data should ideally be a json file and not inside the react component
  const faqData = [
    {
      question: 'What is Curia?',
      answer: 'Curia is a mobile app that helps U.S. citizens stay informed about congressional bills as they move through Congress and become laws.'
    },
    {
      question: 'How do I create an account?',
      answer: 'You can sign up using your email or social media accounts directly through the Curia app.'
    },
    {
      question: 'Is Curia available internationally?',
      answer: 'Yes! Curia offers connectivity and support for users across multiple countries.'
    },
    {
      question: 'What is Curia?',
      answer: 'Curia is a mobile app that helps U.S. citizens stay informed about congressional bills as they move through Congress and become laws.'
    },
    {
      question: 'How does Curia get its information?',
      answer: 'Curia uses data directly from the official U.S. Congress database and API to ensure all information is accurate, up-to-date, and non-partisan.'
    },
    {
      question: 'Can I follow specific policy areas?',
      answer: 'Yes! You can select categories like environment, civil rights, or foreign affairs to follow bills and receive updates about topics you care most about.'
    },
    {
      question: 'How can I track a bill’s progress?',
      answer: 'Each bill page shows real-time status updates as it moves through committees, votes, and stages on its way to becoming law.'
    },
    {
      question: 'Does Curia show political bias?',
      answer: 'No. Curia is completely non-partisan. It only provides verified data from official government sources, with no opinions or commentary.'
    },
    {
      question: 'Can I see which politicians support or oppose a bill?',
      answer: 'Yes. Curia shows which representatives and senators have sponsored or voted for specific bills so you can see who supports your interests.'
    },
    {
      question: 'How do I receive notifications about bills I follow?',
      answer: 'When you follow a bill or policy category, you’ll receive in-app updates and optional notifications whenever there’s progress or changes.'
    },
    {
      question: 'Do I need to create an account to use Curia?',
      answer: 'You can explore general bill information without an account, but creating one allows you to follow specific bills and receive personalized updates.'
    },
    {
      question: 'Is Curia free to use?',
      answer: 'Yes. Curia is completely free and uses publicly available congressional data to keep citizens informed.'
    },
    {
      question: 'How can I contact Curia support?',
      answer: 'You can reach our support team through the “Help & Support” section in the app settings or email us at support@curiaapp.com.'
    },
    {
      question: 'Is Curia available internationally?',
      answer: 'Yes! Curia offers connectivity and support for users across multiple countries.'
    },
    {
      question: 'How can I contact support?',
      answer: 'You can reach our support team via the “Help & Support” section in the app settings.'
    },
    {
      question: 'How can I contact support?',
      answer: 'You can reach our support team via the “Help & Support” section in the app settings.'
    },
  ];

  const toggleFAQ = (index: number) => {
    setActiveIndex(index === activeIndex ? null : index);
  };


  return (

    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back-circle-outline" size={40} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Frequently Asked Questions</Text>
      </View>
      <ScrollView style={styles.container}>

        {faqData.map((item, index) => (

          <View key={index} style={styles.faqItem}>

            <TouchableOpacity onPress={() => toggleFAQ(index)}>
              <Text style={styles.question}>{item.question}</Text>
            </TouchableOpacity>

            {activeIndex === index && <Text style={styles.answer}>{item.answer}</Text>}

          </View>

        ))}

      </ScrollView>
    </SafeAreaView>

  );

};


const styles = StyleSheet.create({

  container: {
    marginVertical: 50,
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 10,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    gap: 12,
  },

  headerText: {
    fontFamily: "InterSemiBold",
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
  },

  faqItem: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    paddingBottom: 10,
  },

  question: {
    fontFamily: "InterSemiBold",
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
  },

  answer: {
    fontFamily: "InterRegular",
    fontSize: 14,
    color: '#555',
    marginTop: 8,
    lineHeight: 20,
  },

  backButton: {
  }

});

