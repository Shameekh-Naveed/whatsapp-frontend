'use client';

import type React from 'react';

import { useState } from 'react';
import { type IConversation, type IMessage, MessageSender } from '@/lib/types';
import { Search, MoreVertical, Paperclip, Send } from 'lucide-react';
import Image from 'next/image';
import { sendMessage } from '@/lib/api';

interface ChatWindowProps {
	conversation: IConversation;
	messages: IMessage[];
}

export default function ChatWindow({ conversation, messages }: ChatWindowProps) {
	const [newMessage, setNewMessage] = useState('');
	const [sending, setSending] = useState(false);

	const person = typeof conversation.person === 'object' ? conversation.person : { name: 'Unknown' };

	const formatTime = (date: Date) => {
		const d = new Date(date);
		return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
	};

	const formatDate = (date: Date) => {
		const today = new Date();
		const messageDate = new Date(date);

		if (
			messageDate.getDate() === today.getDate() &&
			messageDate.getMonth() === today.getMonth() &&
			messageDate.getFullYear() === today.getFullYear()
		) {
			return 'TODAY';
		}

		return messageDate.toLocaleDateString();
	};

	const handleSendMessage = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!newMessage.trim() || sending) return;

		try {
			setSending(true);
			await sendMessage(conversation._id, newMessage);
			setNewMessage('');
		} catch (error) {
			console.error('Error sending message:', error);
		} finally {
			setSending(false);
		}
	};

	// Group messages by date
	const groupedMessages: { [key: string]: IMessage[] } = {};
	messages.forEach((message) => {
		const date = formatDate(message.timestamp);
		if (!groupedMessages[date]) {
			groupedMessages[date] = [];
		}
		groupedMessages[date].push(message);
	});

	return (
		<div className='flex flex-col h-full'>
			{/* Header */}
			<div className='flex items-center p-2 bg-[#f0f2f5]'>
				<div className='flex items-center flex-grow'>
					<div className='w-10 h-10 rounded-full overflow-hidden mr-3'>
						<Image src='/placeholder.svg?height=40&width=40' alt={person.name} width={40} height={40} className='object-cover' />
					</div>
					<h2 className='font-medium'>{person.name}</h2>
				</div>
				<div className='flex space-x-4'>
					<button className='text-[#54656f]'>
						<Search size={20} />
					</button>
					<button className='text-[#54656f]'>
						<MoreVertical size={20} />
					</button>
				</div>
			</div>

			{/* Encryption Notice */}
			<div className='bg-[#fdf4c4] p-2 text-center text-xs text-[#54656f]'>
				<span className='flex items-center justify-center'>
					<span className='mr-1'>🔒</span>
					Messages are end-to-end encrypted. No one outside of this chat, not even WhatsApp, can read or listen to them. Click to learn
					more.
				</span>
			</div>

			{/* Messages */}
			<div
				className='flex-grow overflow-y-auto p-4'
				style={{
					backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23d1d8de' fillOpacity='0.2' fillRule='evenodd'/%3E%3C/svg%3E")`,
					backgroundColor: '#e5ddd5',
				}}>
				{Object.entries(groupedMessages).map(([date, dateMessages]) => (
					<div key={date}>
						<div className='flex justify-center mb-4'>
							<div className='bg-white rounded-lg px-3 py-1 text-xs text-gray-500 shadow-sm'>{date}</div>
						</div>
						{dateMessages.map((message) => (
							<div
								key={message._id.toString()}
								className={`flex ${message.sender === MessageSender.SYSTEM ? 'justify-end' : 'justify-start'} mb-2`}>
								<div
									className={`max-w-[70%] rounded-lg px-3 py-2 ${
										message.sender === MessageSender.SYSTEM ? 'bg-[#d9fdd3] rounded-tr-none' : 'bg-white rounded-tl-none'
									}`}>
									<p className='text-sm'>{message.content}</p>
									<div className='flex justify-end'>
										<span className='text-xs text-gray-500'>
											{formatTime(message.timestamp)}
											{message.sender === MessageSender.SYSTEM && <span className='ml-1 text-[#53bdeb]'>✓✓</span>}
										</span>
									</div>
								</div>
							</div>
						))}
					</div>
				))}
			</div>

			{/* Message Input */}
			<form onSubmit={handleSendMessage} className='p-2 bg-[#f0f2f5] flex items-center'>
				<button type='button' className='text-[#54656f] p-2'>
					<Paperclip size={24} />
				</button>
				<input
					type='text'
					placeholder='Type a message here...'
					className='flex-grow bg-white rounded-lg px-4 py-2 mx-2 outline-none'
					value={newMessage}
					onChange={(e) => setNewMessage(e.target.value)}
				/>
				<button type='submit' className='text-[#54656f] p-2' disabled={!newMessage.trim() || sending}>
					<Send size={24} />
				</button>
			</form>
		</div>
	);
}
