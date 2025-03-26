import apiClient from './apiClient';

// Message type
export interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: string;
}

// Conversation type
export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
}

// Chat history response type
export interface ChatHistoryResponse {
  conversations: Conversation[];
}

// Send message request type
export interface SendMessageRequest {
  text: string;
  conversationId?: string;
}

// Send message response type
export interface SendMessageResponse {
  success: boolean;
  message: Message;
  response: Message;
  conversationId: string;
}

// Conversation details response type
export interface ConversationDetailsResponse extends Conversation {}

class ChatService {
  // Get chat history
  public async getChatHistory(): Promise<ChatHistoryResponse> {
    return apiClient.get<ChatHistoryResponse>('/chat/history');
  }

  // Get conversation details
  public async getConversationDetails(conversationId: string): Promise<ConversationDetailsResponse> {
    return apiClient.get<ConversationDetailsResponse>(`/chat/conversation/${conversationId}`);
  }

  // Send message
  public async sendMessage(messageData: SendMessageRequest): Promise<SendMessageResponse> {
    return apiClient.post<SendMessageResponse>('/chat/message', messageData);
  }

  // Delete conversation
  public async deleteConversation(conversationId: string): Promise<{ success: boolean; message: string }> {
    return apiClient.delete<{ success: boolean; message: string }>(`/chat/conversation/${conversationId}`);
  }

  // Create a new conversation
  public async createNewConversation(initialMessage: string): Promise<SendMessageResponse> {
    return this.sendMessage({ text: initialMessage }); // Without conversationId, a new conversation is created
  }
}

const chatService = new ChatService();
export default chatService; 