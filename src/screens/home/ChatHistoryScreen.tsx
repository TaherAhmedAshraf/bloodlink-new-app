import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  StatusBar,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../../theme/colors';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/types';

type ChatHistoryScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'ChatHistory'
>;

interface ChatHistoryScreenProps {
  navigation: ChatHistoryScreenNavigationProp;
}

// Sample chat history data
const CHAT_HISTORY = [
  {
    id: '1',
    title: 'I want to donate B+ Blood',
    messages: [
      { id: '1', text: 'I want to donate B+ Blood', isUser: true },
      { id: '2', text: 'How many month after should I donate again?', isUser: true },
    ]
  },
  {
    id: '2',
    title: 'I want to donate B+ Blood',
    messages: [
      { id: '1', text: 'I want to donate B+ Blood', isUser: true },
      { id: '2', text: 'How many month after should I donate again?', isUser: true },
    ]
  },
  {
    id: '3',
    title: 'I want to donate B+ Blood',
    messages: [
      { id: '1', text: 'I want to donate B+ Blood', isUser: true },
      { id: '2', text: 'How many month after should I donate again?', isUser: true },
    ]
  },
  {
    id: '4',
    title: 'I want to donate B+ Blood',
    messages: [
      { id: '1', text: 'I want to donate B+ Blood', isUser: true },
      { id: '2', text: 'How many month after should I donate again?', isUser: true },
    ]
  }
];

const ChatHistoryScreen: React.FC<ChatHistoryScreenProps> = ({ navigation }) => {
  const renderChatItem = ({ item }: { item: typeof CHAT_HISTORY[0] }) => (
    <TouchableOpacity 
      style={styles.chatItem}
      onPress={() => {
        // Navigate back to chat screen with this conversation
        navigation.goBack();
      }}
    >
      <Text style={styles.chatTitle}>{item.title}</Text>
      <Text style={styles.chatPreview}>{item.messages[1].text}</Text>
    </TouchableOpacity>
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
        <View style={styles.headerRight} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Icon name="magnify" size={20} color={colors.textLight} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor={colors.textLight}
          />
        </View>
        <TouchableOpacity style={styles.exportButton}>
          <Icon name="export-variant" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Chat History List */}
      <FlatList
        data={CHAT_HISTORY}
        renderItem={renderChatItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
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
  headerRight: {
    width: 30,
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
  exportButton: {
    marginLeft: 12,
    padding: 4,
  },
  listContainer: {
    padding: 16,
  },
  chatItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
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
  },
});

export default ChatHistoryScreen; 