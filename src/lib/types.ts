// import type mongoose from "mongoose"

export interface IConversation {
    _id: string
    person: string | IPerson
    title?: string
    lastMessage?: string
    lastMessageTimestamp?: Date
    unreadCount: number
    isActive: boolean
    tags?: string[]
    createdAt: Date
    updatedAt: Date
}

export enum MessageSender {
    USER = "user",
    CONTACT = "contact",
    SYSTEM = "system",
}

export enum MessageType {
    TEXT = "text",
    IMAGE = "image",
    VIDEO = "video",
    AUDIO = "audio",
    DOCUMENT = "document",
}

export enum MessageStatus {
    SENT = "sent",
    DELIVERED = "delivered",
    READ = "read",
    FAILED = "failed",
}

export interface IMessage {
    _id: string
    conversation: string | IConversation
    sender: MessageSender
    type: MessageType
    content: string
    mediaUrl?: string
    status: MessageStatus
    metadata?: any
    timestamp: Date
    createdAt: Date
    updatedAt: Date
}

export interface IPerson {
    _id: string
    name: string
    phoneNumber: string
    email?: string
    tags?: string[]
    createdAt: Date
    updatedAt: Date
}
