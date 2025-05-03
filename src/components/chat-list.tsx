'use client';

import { useState } from 'react';
import type { IConversation } from '@/lib/types';
import { Search, X, RefreshCw, MessageSquare, Moon, MoreVertical } from 'lucide-react';
import Image from 'next/image';

interface ChatListProps {
	conversations: IConversation[];
	activeConversation: IConversation | null;
	onConversationClick: (conversation: IConversation) => void;
	showNoContacts: boolean;
	onCloseNoContacts: () => void;
}

export default function ChatList({ conversations, activeConversation, onConversationClick, showNoContacts, onCloseNoContacts }: ChatListProps) {
	const [searchQuery, setSearchQuery] = useState('');

	const filteredConversations = conversations.filter((conversation) => {
		const personName = typeof conversation.person === 'object' ? conversation.person.name : '';
		return personName.toLowerCase().includes(searchQuery.toLowerCase());
	});

	const formatTime = (date: Date | undefined) => {
		if (!date) return '';
		const d = new Date(date);
		return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
	};

	return (
		<div className='flex flex-col h-full'>
			{/* Header */}
			<div className='flex items-center p-2 bg-[#f0f2f5]'>
				<div className='w-10 h-10 rounded-full overflow-hidden mr-4'>
					<Image src='/placeholder.svg?height=40&width=40' alt='Profile' width={40} height={40} className='object-cover' />
				</div>
				<div className='flex-grow'></div>
				<div className='flex space-x-4'>
					<button className='text-[#54656f]'>
						<Moon size={20} />
					</button>
					<button className='text-[#54656f]'>
						<RefreshCw size={20} />
					</button>
					<button className='text-[#54656f]'>
						<MessageSquare size={20} />
					</button>
					<button className='text-[#54656f]'>
						<MoreVertical size={20} />
					</button>
				</div>
			</div>

			{/* No Contacts Banner */}
			{showNoContacts && (
				<div className='bg-[#a3e0f5] p-3 flex items-start'>
					<div className='bg-white rounded-full p-2 mr-3'>
						<MessageSquare size={24} className='text-[#a3e0f5]' />
					</div>
					<div className='flex-grow'>
						<p className='font-medium'>No Contacts</p>
						<p className='text-sm'>
							You can import Contacts from Google <span className='text-[#53bdeb] cursor-pointer'>Learn more.</span>
						</p>
					</div>
					<button onClick={onCloseNoContacts} className='text-gray-500'>
						<X size={20} />
					</button>
				</div>
			)}

			{/* Search */}
			<div className='p-2 bg-white'>
				<div className='bg-[#f0f2f5] rounded-lg flex items-center px-3 py-1'>
					<Search size={18} className='text-[#54656f] mr-2' />
					<input
						type='text'
						placeholder='Search or start a new chat'
						className='bg-transparent border-none outline-none w-full text-sm py-1'
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
					/>
				</div>
			</div>

			{/* Conversation List */}
			<div className='flex-grow overflow-y-auto'>
				{filteredConversations.map((conversation) => {
					const person = typeof conversation.person === 'object' ? conversation.person : { name: 'Unknown' };
					const isActive = activeConversation?._id === conversation._id;

					return (
						<div
							key={conversation._id.toString()}
							className={`flex items-center p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-100 ${
								isActive ? 'bg-[#f0f2f5]' : ''
							}`}
							onClick={() => onConversationClick(conversation)}>
							<div className='w-12 h-12 rounded-full overflow-hidden mr-3'>
								<Image src='/placeholder.svg?height=48&width=48' alt={person.name} width={48} height={48} className='object-cover' />
							</div>
							<div className='flex-grow'>
								<div className='flex justify-between'>
									<h3 className='font-medium'>{person.name}</h3>
									<span className='text-xs text-gray-500'>{formatTime(conversation.lastMessageTimestamp)}</span>
								</div>
								<div className='flex items-center'>
									<span className='text-sm text-gray-500 truncate max-w-[200px]'>
										{conversation.lastMessage || 'No messages yet'}
									</span>
								</div>
							</div>
							{conversation.unreadCount > 0 && (
								<div className='ml-2 bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs'>
									{conversation.unreadCount}
								</div>
							)}
						</div>
					);
				})}
			</div>
		</div>
	);
}
