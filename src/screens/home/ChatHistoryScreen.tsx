import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  StatusBar,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../../theme/colors';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/types';
import { chatService, Conversation } from '../../services';
import toast from '../../utils/toast';

type ChatHistoryScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'ChatHistory'
>;

interface ChatHistoryScreenProps {
  navigation: ChatHistoryScreenNavigationProp;
}

const ChatHistoryScreen: React.FC<ChatHistoryScreenProps> = ({ navigation }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [filteredConversations, setFilteredConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch chat history when component mounts
  useEffect(() => {
    fetchChatHistory();
  }, []);

  // Filter conversations when search query changes
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredConversations(conversations);
    } else {
      const filtered = conversations.filter(
        (conv) => conv.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredConversations(filtered);
    }
  }, [searchQuery, conversations]);

  // Fetch chat history from API
  const fetchChatHistory = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await chatService.getChatHistory();
      
      if (response && response.conversations) {
        setConversations(response.conversations);
        setFilteredConversations(response.conversations);
      } else {
        setError('No conversations found');
      }
    } catch (error) {
      console.error('Failed to fetch chat history:', error);
      setError('Failed to load chat history. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Delete a conversation
  const deleteConversation = async (conversationId: string) => {
    Alert.alert(
      'Delete Conversation',
      'Are you sure you want to delete this conversation?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await chatService.deleteConversation(conversationId);
              
              if (response && response.success) {
                // Remove from state
                const updatedConversations = conversations.filter(
                  (conv) => conv.id !== conversationId
                );
                setConversations(updatedConversations);
                setFilteredConversations(
                  filteredConversations.filter((conv) => conv.id !== conversationId)
                );
                
                toast.success('Conversation deleted successfully');
              } else {
                toast.error('Failed to delete conversation');
              }
            } catch (error) {
              console.error('Failed to delete conversation:', error);
              toast.error('Failed to delete conversation', 'Please try again later');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  // Navigate to the chat screen with a specific conversation
  const navigateToConversation = (conversation: Conversation) => {
    // Navigate to Main tab first, then to the Chat screen with conversation parameters
    navigation.navigate('Main', { 
      screen: 'AI Chat',
      params: { 
        conversationId: conversation.id, 
        title: conversation.title 
      }
    });
  };

  // Render a chat history item
  const renderChatItem = ({ item }: { item: Conversation }) => {
    // Get a preview of the conversation
    const previewMessage = item.messages.length > 0 
      ? item.messages[item.messages.length - 1].text 
      : 'No messages';
    
    // Format the timestamp
    const timestamp = new Date(item.messages[item.messages.length - 1]?.timestamp || Date.now());
    const formattedDate = timestamp.toLocaleDateString();

    return (
      <TouchableOpacity 
        style={styles.chatItem}
        onPress={() => navigateToConversation(item)}
      >
        <View style={styles.chatItemContent}>
          <Text style={styles.chatTitle} numberOfLines={1}>{item.title}</Text>
          <Text style={styles.chatPreview} numberOfLines={2}>{previewMessage}</Text>
          <Text style={styles.chatDate}>{formattedDate}</Text>
        </View>
        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={() => deleteConversation(item.id)}
        >
          <Icon name="delete-outline" size={20} color={colors.error} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  // Render empty state when no conversations found
  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Icon name="chat-outline" size={64} color={colors.border} />
      <Text style={styles.emptyTitle}>No Conversations Yet</Text>
      <Text style={styles.emptyText}>
        Start a new conversation with the AI assistant to get information about blood donation.
      </Text>
      <TouchableOpacity 
        style={styles.newChatButton}
        onPress={() => navigation.navigate('Main', { screen: 'AI Chat' })}
      >
        <Text style={styles.newChatButtonText}>Start New Chat</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={colors.background} barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chat History</Text>
        <TouchableOpacity 
          style={styles.headerButton}
          onPress={() => navigation.navigate('Main', { screen: 'AI Chat' })}
        >
          <Icon name="plus" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Icon name="magnify" size={20} color={colors.textLight} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search conversations"
            placeholderTextColor={colors.textLight}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Icon name="close" size={20} color={colors.textLight} />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity 
          style={styles.refreshButton}
          onPress={fetchChatHistory}
        >
          <Icon name="refresh" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Chat History List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading conversations...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Icon name="alert-circle-outline" size={64} color={colors.error} />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={fetchChatHistory}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredConversations}
          renderItem={renderChatItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[
            styles.listContainer,
            filteredConversations.length === 0 && styles.emptyListContainer
          ]}
          ListEmptyComponent={renderEmptyList()}
        />
      )}
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
    width: 30,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  headerButton: {
    width: 30,
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
  },
  refreshButton: {
    marginLeft: 12,
    padding: 4,
  },
  listContainer: {
    padding: 16,
  },
  emptyListContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatItem: {
    flexDirection: 'row',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  chatItemContent: {
    flex: 1,
  },
  chatTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 4,
  },
  chatPreview: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 4,
  },
  chatDate: {
    fontSize: 12,
    color: colors.textLight,
  },
  deleteButton: {
    justifyContent: 'center',
    padding: 8,
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: colors.error,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 16,
    color: colors.secondary,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
    marginHorizontal: 24,
    marginBottom: 20,
    lineHeight: 20,
  },
  newChatButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  newChatButtonText: {
    fontSize: 16,
    color: colors.secondary,
    fontWeight: '600',
  },
});

export default ChatHistoryScreen; 