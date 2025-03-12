import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TextInput,
  TouchableOpacity,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../../theme/colors';
import { ChatScreenProps } from '../../navigation/types';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

// Sample responses for common blood donation questions
const sampleResponses: Record<string, string> = {
  'hello': 'Hello! I\'m your BloodLink AI assistant. How can I help you with blood donation today?',
  'hi': 'Hi there! I\'m your BloodLink AI assistant. How can I help you with blood donation today?',
  'who can donate blood': 'Generally, anyone who is in good health, at least 17 years old (16 with parental consent in some states), and weighs at least 110 pounds can donate blood. However, there are some eligibility criteria and deferrals based on medical conditions, medications, travel history, and lifestyle factors.',
  'how often can i donate blood': 'You can donate whole blood every 56 days (8 weeks). If you donate platelets, you can give every 7 days up to 24 times a year. Plasma donors can donate every 28 days, and double red cell donors can give every 112 days.',
  'what happens during blood donation': 'The blood donation process includes registration, a mini-physical (checking temperature, blood pressure, pulse, and hemoglobin levels), the actual donation which takes about 8-10 minutes, and a brief rest period with refreshments. The entire process usually takes about an hour.',
  'is blood donation safe': 'Yes, blood donation is very safe. All equipment used is sterile and disposed of after a single use, eliminating any risk of contracting a disease from donating.',
  'what blood types are most needed': 'All blood types are needed, but O negative (universal donor) and O positive are in high demand. AB negative is the rarest blood type, while AB positive individuals are universal plasma donors.',
  'how long does it take to donate blood': 'The actual blood donation takes about 8-10 minutes, but the entire process including registration, health screening, and refreshments afterward takes about an hour.',
  'what should i eat before donating blood': 'Eat a healthy meal, avoiding fatty foods. Stay well hydrated by drinking plenty of water before and after donation. Iron-rich foods like red meat, spinach, and beans are good choices before donating.',
  'what are the benefits of donating blood': 'Benefits include a free health screening, potential health benefits from reducing iron stores, and the satisfaction of helping others. Each donation can save up to three lives!',
};

const ChatScreen: React.FC<ChatScreenProps> = ({ navigation }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your BloodLink AI assistant. How can I help you with blood donation today?',
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList>(null);

  const handleSend = () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputText('');

    // Simulate AI response
    setTimeout(() => {
      const botResponse = getBotResponse(inputText.toLowerCase());
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prevMessages) => [...prevMessages, botMessage]);
      
      // Scroll to bottom
      if (flatListRef.current) {
        flatListRef.current.scrollToEnd({ animated: true });
      }
    }, 1000);
  };

  const getBotResponse = (text: string): string => {
    // Check for exact matches in sample responses
    for (const key in sampleResponses) {
      if (text.includes(key)) {
        return sampleResponses[key];
      }
    }

    // Default response if no match found
    return "I'm not sure about that. Could you ask something about blood donation eligibility, process, or benefits?";
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View
      style={[
        styles.messageContainer,
        item.isUser ? styles.userMessageContainer : styles.botMessageContainer,
      ]}
    >
      <Text style={styles.messageText}>{item.text}</Text>
      <Text style={styles.timestamp}>
        {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={colors.background} barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>AI Chat Assistant</Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardAvoidingView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesContainer}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Ask about blood donation..."
            value={inputText}
            onChangeText={setInputText}
            multiline
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            <Icon name="send" size={24} color={colors.secondary} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  messagesContainer: {
    padding: 16,
    paddingBottom: 8,
  },
  messageContainer: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 8,
  },
  userMessageContainer: {
    alignSelf: 'flex-end',
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
  },
  botMessageContainer: {
    alignSelf: 'flex-start',
    backgroundColor: colors.border,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    color: colors.text,
  },
  timestamp: {
    fontSize: 12,
    color: colors.textLight,
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 100,
    backgroundColor: colors.secondary,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
});

export default ChatScreen; 