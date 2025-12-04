import { Text, View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useState } from 'react';
import { useRouter } from "expo-router";
import BackButton from "@/components/BackButton";

export default function Faq() {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // NOTE this data should ideally be in a separate file and not inside the react component
  const faqData = [
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
      question: 'Is Curia free to use?',
      answer: 'Yes. Curia is completely free and uses publicly available congressional data to keep citizens informed.'
    },
    {
      question: 'How can I contact Curia support?',
      answer: 'You can reach our support team through the “Help & Support” section in the app settings or email us at support@curiaapp.com.'
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
      <ScrollView contentContainerStyle={{ padding: 24 }} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
          <BackButton/>
        <Text style={styles.headerText}>Frequently Asked Questions</Text>
      </View>

        <View style={styles.faqItemContainer}>

        {faqData.map((item, index) => (

          <View key={index} style={styles.faqItem}>

            <TouchableOpacity onPress={() => toggleFAQ(index)}>
              <Text style={styles.question}>{item.question}</Text>
            </TouchableOpacity>

            {activeIndex === index && <Text style={styles.answer}>{item.answer}</Text>}

          </View>

        ))}
        </View>

      </ScrollView>

  );

};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  headerText: {
    fontSize: 20,
    textAlign: "center",
    fontFamily: "InterSemiBold",
    letterSpacing: -0.5
  },

  faqItemContainer: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    marginTop: 20,
  },

  faqItem: {
    width: "100%",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },

  question: {
    fontFamily: "InterSemiBold",
    fontSize: 16,
    color: '#222',
  },

  answer: {
    fontFamily: "InterRegular",
    fontSize: 14,
    color: '#555',
    marginTop: 8,
    lineHeight: 20,
  },
});

