import { observer } from 'mobx-react-lite'
import React, { useContext, useDeferredValue, useEffect, useRef, useState} from 'react'
import { Segment, Comment, CommentGroup} from 'semantic-ui-react'
import { IMessage } from '../../Models/messages'
import { RootStoreContext } from '../../Stores/rootStore'
import MessageForm from './MessageForm'
import MessagesHeader from './MessagesHeader'
import Message from './Message'
import ImageModal from './ImageModal'

const Messages = () => {
  const rootStore= useContext(RootStoreContext)
  const channelStore = rootStore.channelStore
  const { setCurrentUser, user} = rootStore.userStore
  const { getCurrentChannel, isChannelLoaded, activeChannel } = channelStore
  const { messages, loadMessages } = rootStore.messageStore
  const messagesContainerRef = useRef<HTMLDivElement>(null)
/*
// innecesario usando SignalR:
  useEffect(() => {
    if(isChannelLoaded){
      const currentChannelId = getCurrentChannel()?.id
      loadMessages(currentChannelId) //no se porque no funciona bien esto
      console.log("se cambian los mensajes")
    }
  },[loadMessages, getCurrentChannel, isChannelLoaded ,activeChannel])*/

  useEffect(() => {
    console.log("se scrollea")
    const timer = setTimeout(() => {
      if (messagesContainerRef.current) {
        const messagesContainer = messagesContainerRef.current
        messagesContainer.scrollTo({
        top: messagesContainer.scrollHeight,
        behavior: 'smooth' // Desplazamiento suave
      })
      }
    }, 600) // 200 ms de retraso, ajusta este valor si es necesario
    return () => clearTimeout(timer)
  }, [messages, loadMessages, getCurrentChannel, isChannelLoaded]);

  useEffect(() => {
    setCurrentUser()
  }, [])

  const displayMessages = (messages: IMessage[]) => {
    //console.log(messages.map(m => ({ createdAt: m.createdAt, type: typeof m.createdAt, isDate: m.createdAt instanceof Date })));
    const sortedMessages = [...messages].sort((a,b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())

    return (sortedMessages.length > 0 && sortedMessages.map((message, index) => { 
      const previousMessage = index > 0 ? sortedMessages[index - 1] : null
      return(
              <Message message={message} key={message.id} currentUser={user} previousMessage={previousMessage} />
            )
    }))
  }
  return (
    <React.Fragment>
      <MessagesHeader currentChannel={getCurrentChannel()} currentUser={user}/>
      {!user ? (
        <div>Cargando Usuario...</div>
      ): (
      <div ref={messagesContainerRef}  style={{   maxHeight: '70vh',
                                                  overflowY: 'auto', 
                                              }}>
        <Segment>
            <CommentGroup size='large' className="messages"  style={{ width: '100%'  }}>
              {displayMessages(messages)}
            </CommentGroup>
        </Segment>
      </div>
      )}
      <MessageForm />
      <ImageModal />
    </React.Fragment>
  )
}

export default observer(Messages)
