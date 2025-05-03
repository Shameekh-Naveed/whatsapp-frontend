'use client';

import { useState, useEffect } from 'react';
import ChatList from '@/components/chat-list';
import ChatWindow from '@/components/chat-window';
import { fetchConversations, fetchMessages, markConversationAsRead } from '@/lib/api';
import type { IConversation, IMessage } from '@/lib/types';
import { Loader2 } from 'lucide-react';

export default function Home() {
	const [conversations, setConversations] = useState<IConversation[]>([]);
	const [activeConversation, setActiveConversation] = useState<IConversation | null>(null);
	const [messages, setMessages] = useState<IMessage[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [showNoContacts, setShowNoContacts] = useState(true);

	useEffect(() => {
		const loadConversations = async () => {
			try {
				setLoading(true);
				const data = await fetchConversations();
				setConversations(data);
				if (data.length > 0 && !activeConversation) {
					setActiveConversation(data[0]);
				}
				setLoading(false);
			} catch (err) {
				setError('Failed to load conversations');
				setLoading(false);
				console.error('Error loading conversations:', err);
			}
		};

		// Initial load
		loadConversations();

		// Set up polling every 2 minutes (120000 ms)
		const pollingInterval = setInterval(() => {
			loadConversations();
		}, 120000);

		// Clean up interval on component unmount
		return () => clearInterval(pollingInterval);
	}, []);

	useEffect(() => {
		const loadMessages = async () => {
			if (!activeConversation) return;

			try {
				const data = await fetchMessages(activeConversation._id);
				setMessages(data);
				if (activeConversation) markConversationAsRead(activeConversation._id);
			} catch (err) {
				console.error('Error loading messages:', err);
				setError('Failed to load messages');
			}
		};

		loadMessages();

		// Set up polling for messages every 2 minutes (120000 ms)
		const messagesPollingInterval = setInterval(() => {
			if (activeConversation) loadMessages();
		}, 120000);

		// Clean up interval on component unmount or when active conversation changes
		return () => clearInterval(messagesPollingInterval);
	}, [activeConversation]);

	const handleConversationClick = async (conversation: IConversation) => {
		setActiveConversation(conversation);
	};

	if (loading) {
		return (
			<div className='flex items-center justify-center h-screen'>
				<Loader2 className='w-8 h-8 animate-spin text-gray-500' />
			</div>
		);
	}

	return (
		<div className='flex h-screen bg-gray-100'>
			<div className='w-full md:w-1/3 border-r border-gray-300 bg-white flex flex-col'>
				<ChatList
					conversations={conversations}
					activeConversation={activeConversation}
					onConversationClick={handleConversationClick}
					showNoContacts={showNoContacts}
					onCloseNoContacts={() => setShowNoContacts(false)}
				/>
			</div>
			<div className='hidden md:block md:w-2/3 bg-[#e5ddd5]'>
				{activeConversation ? (
					<ChatWindow conversation={activeConversation} messages={messages} />
				) : (
					<div className='flex items-center justify-center h-full text-gray-500'>Select a conversation to start chatting</div>
				)}
			</div>
		</div>
	);
}
