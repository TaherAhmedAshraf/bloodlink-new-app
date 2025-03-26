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
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../../theme/colors';
import { ChatScreenProps } from '../../navigation/types';
import toast from '../../utils/toast';
import { chatService, Message } from '../../services';

// Define the QuickReply type
interface QuickReply {
  id: string;
  text: string;
  subtext: string;
}

// Sample quick replies for different contexts
const quickRepliesData = {
  default: [
    { id: '1', text: 'How to donate blood?', subtext: 'Learn about the process' },
    { id: '2', text: 'Find blood banks near me', subtext: 'Locate donation centers' }
  ],
  bloodRequest: [
    { id: '1', text: 'I need blood urgently', subtext: 'Create a blood request' },
    { id: '2', text: 'What blood types are compatible?', subtext: 'Blood type info' }
  ],
  donationInfo: [
    { id: '1', text: 'When can I donate again?', subtext: 'After last donation' },
    { id: '2', text: 'What should I eat before donating?', subtext: 'Donation preparation' }
  ],
  eligibility: [
    { id: '1', text: 'Am I eligible to donate?', subtext: 'Check eligibility criteria' },
    { id: '2', text: 'What disqualifies me from donating?', subtext: 'Restrictions' }
  ]
};

const ChatScreen: React.FC<ChatScreenProps> = ({ navigation, route }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [quickReplies, setQuickReplies] = useState<QuickReply[]>(quickRepliesData.default);
  const [conversationId, setConversationId] = useState<string | undefined>(undefined);
  const flatListRef = useRef<FlatList>(null);

  // Load conversation from route params or show initial greeting
  useEffect(() => {
    // If we have a conversationId in route params, load that conversation
    if (route.params?.conversationId) {
      loadConversation(route.params.conversationId);
    } else {
      // Otherwise show the initial greeting message
      const initialMessage: Message = {
        id: Date.now().toString(),
        text: 'Hello! I\'m your BloodLink AI assistant. How can I help you with blood donation today?',
        isUser: false,
        timestamp: new Date().toISOString(),
      };
      setMessages([initialMessage]);
    }
  }, [route.params?.conversationId]);

  // Update quick replies based on context from last message
  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (!lastMessage.isUser) {
        updateQuickRepliesBasedOnContext(lastMessage.text);
      }
    }
  }, [messages]);

  // Update quick replies based on message context
  const updateQuickRepliesBasedOnContext = (text: string) => {
    // Simple logic to detect context from AI's response
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('blood request') || lowerText.includes('need blood')) {
      setQuickReplies(quickRepliesData.bloodRequest);
    } else if (lowerText.includes('donate again') || lowerText.includes('donation process')) {
      setQuickReplies(quickRepliesData.donationInfo);
    } else if (lowerText.includes('eligible') || lowerText.includes('eligibility')) {
      setQuickReplies(quickRepliesData.eligibility);
    } else {
      setQuickReplies(quickRepliesData.default);
    }
  };

  // Load conversation from server if conversationId is provided
  const loadConversation = async (id: string) => {
    try {
      setIsLoading(true);
      const conversation = await chatService.getConversationDetails(id);
      if (conversation && conversation.messages) {
        setMessages(conversation.messages);
        setConversationId(conversation.id);
      }
    } catch (error: any) {
      console.error('Failed to load conversation:', error);
      
      // Check if it's a 404 error (conversation not found)
      if (error.response && error.response.status === 404) {
        toast.error('Conversation not found', 'Starting a new conversation for you');
        // Start a new conversation if the requested one doesn't exist
        startNewConversation();
      } else {
        // For other errors, show a generic message
        toast.error('Failed to load conversation', 'Please try again later');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Send message to the AI chatbot
  const sendMessage = async (text: string) => {
    if (!text.trim()) {
      toast.error('Please enter a message');
      return;
    }

    try {
      setIsSending(true);
      
      // Optimistically add user message to UI
      const tempUserMessage: Message = {
        id: `temp-${Date.now()}`,
        text,
        isUser: true,
        timestamp: new Date().toISOString(),
      };
      
      setMessages(prev => [...prev, tempUserMessage]);
      setInputText('');
      
      // Scroll to bottom
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
      
      // Send message to API
      const response = await chatService.sendMessage({
        text,
        conversationId
      });
      console.log(response)
      
      // Replace temp message with actual message from API and add AI response
      setMessages(prev => [
        ...prev.filter(msg => msg.id !== tempUserMessage.id),
        response.message,
        response.response
      ]);
      
      // Update conversation ID if this is a new conversation
      if (!conversationId && response.message) {
        setConversationId(response.conversationId);
      }
      
      // Scroll to bottom again after response received
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
      
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error('Failed to send message', 'Please try again later');
      
      // Remove the temp message on failure
      setMessages(prev => prev.filter(msg => msg.id !== `temp-${Date.now()}`));
    } finally {
      setIsSending(false);
    }
  };

  // Handle quick reply selection
  const handleQuickReply = (reply: QuickReply) => {
    sendMessage(reply.text);
  };

  // Navigate to chat history
  const navigateToChatHistory = () => {
    // Navigate directly to ChatHistory screen (it's a root stack screen)
    navigation.getParent()?.navigate('ChatHistory');
  };

  // Clear current conversation and start a new one
  const startNewConversation = () => {
    setConversationId(undefined);
    setMessages([{
      id: Date.now().toString(),
      text: 'Hello! I\'m your BloodLink AI assistant. How can I help you with blood donation today?',
      isUser: false,
      timestamp: new Date().toISOString(),
    }]);
    setQuickReplies(quickRepliesData.default);
  };

  // Render a chat message item
  const renderMessage = ({ item }: { item: Message }) => {
    // Format timestamp
    const timestamp = new Date(item.timestamp);
    const formattedTime = timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    return (
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
        <Text style={[
          styles.timestampText,
          item.isUser ? styles.userTimestampText : styles.botTimestampText
        ]}>
          {formattedTime}
        </Text>
      </View>
    );
  };

  // Render the header of the chat screen
  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>AI Chat</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={startNewConversation}
          >
            <Icon name="plus" size={24} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={navigateToChatHistory}
          >
            <Icon name="history" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // Render quick replies at the bottom of the chat
  const renderQuickReplies = () => {
    return (
      <View style={styles.quickRepliesContainer}>
        {quickReplies.map((reply) => (
          <TouchableOpacity 
            key={reply.id}
            style={styles.quickReplyButton}
            onPress={() => handleQuickReply(reply)}
            disabled={isSending}
          >
            <Text style={styles.quickReplyText}>{reply.text}</Text>
            <Text style={styles.quickReplySubtext}>{reply.subtext}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  // Render loading state
  const renderLoading = () => {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading conversation...</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={colors.background} barStyle="dark-content" />
      
      {renderHeader()}

      {isLoading ? (
        renderLoading()
      ) : (
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
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No messages yet. Start the conversation!</Text>
              </View>
            }
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
              maxLength={500}
              editable={!isSending}
            />
            {isSending ? (
              <View style={styles.sendButton}>
                <ActivityIndicator size="small" color={colors.secondary} />
              </View>
            ) : (
              <TouchableOpacity 
                style={styles.sendButton} 
                onPress={() => sendMessage(inputText)}
                disabled={!inputText.trim()}
              >
                <Icon name="send" size={24} color={colors.secondary} />
              </TouchableOpacity>
            )}
          </View>
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardAvoidingView: {
    flex: 1,
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
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    width: 40,
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  messagesContainer: {
    padding: 16,
    paddingBottom: 8,
    flexGrow: 1,
  },
  messageContainer: {
    maxWidth: '80%',
    padding: 12,
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
  timestampText: {
    fontSize: 10,
    marginTop: 4,
  },
  userTimestampText: {
    color: 'rgba(255, 255, 255, 0.7)',
    alignSelf: 'flex-end',
  },
  botTimestampText: {
    color: colors.textLight,
    alignSelf: 'flex-start',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: colors.textLight,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
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
    minHeight: 40,
    maxHeight: 80,
    paddingHorizontal: 16,
    fontSize: 14,
    color: colors.text,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
});

export default ChatScreen; 