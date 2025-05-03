import { type IConversation, type IMessage, MessageSender, MessageStatus, MessageType } from "./types"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Fetch all conversations
export async function fetchConversations(): Promise<IConversation[]> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/conversations`);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const { conversations } = await response.json();
        return conversations
    } catch (error) {
        console.error("Error fetching conversations:", error)
        throw new Error("Failed to fetch conversations")
    }
}

// Fetch messages for a conversation

export async function fetchMessages(conversationId: string): Promise<IMessage[]> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/conversations/${conversationId}/messages`);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const { messages } = await response.json();
        return messages
    } catch (error) {
        console.error("Error fetching messages:", error)
        throw new Error("Failed to fetch messages")
    }
}

// Send a new message
export async function sendMessage(conversationId: string, content: string): Promise<IMessage> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/conversations/${conversationId}/messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const res = await response.json();
        const { message } = res
        return message;
    } catch (error) {
        console.error("Error sending message:", error)
        throw new Error("Failed to send message")
    }
}

// Mark a conversation as read
export async function markConversationAsRead(conversationId: string): Promise<void> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/conversations/${conversationId}/read`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        await response.json();
    } catch (error) {
        console.error("Error marking conversation as read:", error);
        throw new Error("Failed to mark conversation as read");
    }
}