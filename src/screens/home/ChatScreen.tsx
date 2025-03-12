import React, { useState, useRef, useEffect } from 'react';
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
  Image,
  Dimensions,
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

// Sample chat history for different views
const chatHistory = {
  main: [
    {
      id: '1',
      text: 'Hello! I\'m your BloodLink AI assistant. How can I help you with blood donation today?',
      isUser: false,
      timestamp: new Date(),
    }
  ],
  bloodRequest: [
    {
      id: '1',
      text: 'Hello! I\'m your BloodLink AI assistant. How can I help you with blood donation today?',
      isUser: false,
      timestamp: new Date(),
    },
    {
      id: '2',
      text: 'I need B+ blood',
      isUser: true,
      timestamp: new Date(),
    },
    {
      id: '3',
      text: 'I need B+ blood',
      isUser: false,
      timestamp: new Date(),
    }
  ],
  donationInfo: [
    {
      id: '1',
      text: 'Hello! I\'m your BloodLink AI assistant. How can I help you with blood donation today?',
      isUser: false,
      timestamp: new Date(),
    },
    {
      id: '2',
      text: 'I want to donate B+ Blood',
      isUser: true,
      timestamp: new Date(),
    },
    {
      id: '3',
      text: 'How many month after should I donate again?',
      isUser: true,
      timestamp: new Date(),
    },
    {
      id: '4',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit.',
      isUser: false,
      timestamp: new Date(),
    },
    {
      id: '5',
      text: 'I want to donate B+ Blood',
      isUser: true,
      timestamp: new Date(),
    },
    {
      id: '6',
      text: 'How many month after should I donate again?',
      isUser: true,
      timestamp: new Date(),
    },
    {
      id: '7',
      text: 'I want to donate B+ Blood',
      isUser: true,
      timestamp: new Date(),
    },
    {
      id: '8',
      text: 'How many month after should I donate again?',
      isUser: true,
      timestamp: new Date(),
    }
  ]
};

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
  'i need b+ blood': 'I understand you need B+ blood. To request blood, you can create a blood request through the app. Go to the "Create" tab and fill in the required details. Your request will be shared with potential donors in your area. Would you like me to guide you through the process?',
  'i want to donate b+ blood': 'That\'s wonderful! To donate B+ blood, you can check nearby blood donation camps or blood banks through the "Blood Banks" tab. You can also respond to specific blood requests that match your blood type. Would you like me to show you available donation opportunities near you?',
};

const ChatScreen: React.FC<ChatScreenProps> = ({ navigation }) => {
  const [activeView, setActiveView] = useState<'main' | 'bloodRequest' | 'donationInfo'>('main');
  const [messages, setMessages] = useState<Message[]>(chatHistory.main);
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    // For demo purposes, we'll cycle through the different views
    const timer = setTimeout(() => {
      if (activeView === 'main') {
        setActiveView('bloodRequest');
        setMessages(chatHistory.bloodRequest);
      } else if (activeView === 'bloodRequest') {
        setActiveView('donationInfo');
        setMessages(chatHistory.donationInfo);
      } else {
        setActiveView('main');
        setMessages(chatHistory.main);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [activeView]);

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
      <Text style={[
        styles.messageText,
        item.isUser ? styles.userMessageText : styles.botMessageText
      ]}>
        {item.text}
      </Text>
    </View>
  );

  const renderHeader = () => {
    let title = 'AI Chat';
    
    if (activeView === 'bloodRequest') {
      title = 'I Need B+ blood';
    } else if (activeView === 'donationInfo') {
      title = 'I want to donate B+ Blood';
    }
    
    return (
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>
        <TouchableOpacity 
          style={styles.historyButton}
          onPress={() => {
            // Navigate to chat history screen
            const rootNavigation = navigation.getParent();
            if (rootNavigation) {
              rootNavigation.navigate('ChatHistory');
            }
          }}
        >
          <Icon name="history" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>
    );
  };

  const renderQuickReplies = () => {
    if (activeView === 'main') {
      return (
        <View style={styles.quickRepliesContainer}>
          <TouchableOpacity 
            style={styles.quickReplyButton}
            onPress={() => {
              const text = 'I need B+ blood';
              setInputText(text);
              handleSend();
            }}
          >
            <Text style={styles.quickReplyText}>I need B+ blood</Text>
            <Text style={styles.quickReplySubtext}>urgent today</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickReplyButton}
            onPress={() => {
              const text = 'I want to donate blood';
              setInputText(text);
              handleSend();
            }}
          >
            <Text style={styles.quickReplyText}>I want to donate blood</Text>
            <Text style={styles.quickReplySubtext}>today in mirpur</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return null;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={colors.background} barStyle="dark-content" />
      
      {renderHeader()}

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

        {renderQuickReplies()}

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Message AI"
            placeholderTextColor={colors.textLight}
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

const { width } = Dimensions.get('window');

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
    width: 30,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  historyButton: {
    width: 30,
    alignItems: 'flex-end',
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
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  userMessageContainer: {
    alignSelf: 'flex-end',
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
  },
  botMessageContainer: {
    alignSelf: 'flex-start',
    backgroundColor: '#F5F5F5',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  userMessageText: {
    color: colors.secondary,
  },
  botMessageText: {
    color: colors.text,
  },
  quickRepliesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  quickReplyButton: {
    width: (width - 48) / 2,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.background,
  },
  quickReplyText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  quickReplySubtext: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 40,
    paddingHorizontal: 16,
    fontSize: 14,
    color: colors.text,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ChatScreen; 