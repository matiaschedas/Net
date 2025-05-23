import { IUser } from "./users"

export enum MessageType{
    Text = 1,
    Media = 2
}

export interface IMessage
{
    content: string
    createdAt: Date
    sender: IUser
    id: string
    messageType: MessageType
    channelId: string
}

export interface IMessageFormValues 
{
    content: string
    channelId: string
}

export interface IMediaFormValues{
    file: Blob
    channelId: string
}

export interface ITypingNotification{
    sender: IUser
    channelId: string
}