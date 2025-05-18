import { observer } from 'mobx-react-lite'
import React, { useContext, useDeferredValue, useEffect, useRef, useState} from 'react'
import { Segment, Comment, CommentGroup, Image, Icon, Button} from 'semantic-ui-react'
import { IMessage, ITypingNotification } from '../../Models/messages'
import { RootStoreContext } from '../../Stores/rootStore'
import MessageForm from './MessageForm'
import MessagesHeader from './MessagesHeader'
import Message from './Message'
import ImageModal from './ImageModal'
import Typing from './Typing'
import { max } from 'moment'

interface ISearchFormState {
  searchTerm?: string
  searchLoading: boolean
}

const Messages = () => {
  const searchFormInitialState: ISearchFormState = {
    searchTerm: '',
    searchLoading: false
  }
  const [searchState, setSearchState] = useState<ISearchFormState>(searchFormInitialState)
  const rootStore= useContext(RootStoreContext)
  const channelStore = rootStore.channelStore
  const { setCurrentUser, user} = rootStore.userStore
  const { getCurrentChannel, isChannelLoaded, activeChannel, setChannelStarred } = channelStore
  const { messages, loadMessages, typingsNotifications, appendPreviousMessages, noMorePreviousMessages} = rootStore.messageStore
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const [messageState, setMessageState] = useState<IMessage[]>([])
  const [numUniqueUsers, setNumUniqueUsers] = useState(0)
  const [charginPreviousMessages, setCharginPreviousMessages] = useState(false)
  const [seClickeoCargarMasAntiguos, setSeClickeoCargarMasAntiguos] = useState(false)
  const [tieneScroll, setTieneScroll] = useState(false);
  const [estaAbajoDelTodo, setEstaAbajoDelTodo] = useState(true);

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
    const checkScroll = () => {
      if (messagesContainerRef.current) {
        const el = messagesContainerRef.current;
        setTieneScroll(el.scrollHeight > el.clientHeight);
      }
    };

    checkScroll();

    // También lo podés volver a chequear cuando la ventana cambie de tamaño
    window.addEventListener('resize', checkScroll);

    return () => {
      window.removeEventListener('resize', checkScroll);
    };
  }, [messages, messageState]);

  useEffect(() => {
    const checkScroll = () => {
      if (messagesContainerRef.current) {
        const el = messagesContainerRef.current;
        setTieneScroll(el.scrollHeight > el.clientHeight);

        const estaAbajo =
          el.scrollTop + el.clientHeight >= el.scrollHeight - 10; // margen de 10px
        setEstaAbajoDelTodo(estaAbajo);
      }
    };

    checkScroll();

    // Escuchar scroll del contenedor además de resize
    const el = messagesContainerRef.current;
    el?.addEventListener('scroll', checkScroll);
    window.addEventListener('resize', checkScroll);

    return () => {
      el?.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [messages, messageState]);


  useEffect(() => {
      if(seClickeoCargarMasAntiguos === false){
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
      }
    }, [messages, loadMessages, getCurrentChannel, isChannelLoaded]);

  useEffect(() => {
    setCurrentUser()
  }, [])

  const displayMessages = (messages: IMessage[]) => {
    //console.log(messages.map(m => ({ createdAt: m.createdAt, type: typeof m.createdAt, isDate: m.createdAt instanceof Date })));
    const sortedMessages = [...messages].sort((a,b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    const filteredMessages = sortedMessages.filter(m => m.channelId === getCurrentChannel().id)
    return (filteredMessages.length > 0 && filteredMessages.map((message, index) => { 
      const previousMessage = index > 0 ? filteredMessages[index - 1] : null
      return(
              <Message message={message} key={message.id} currentUser={user} previousMessage={previousMessage} />
            )
    }))
  }
  const handleStar = () => {
    setChannelStarred(activeChannel!)
  }

  const handleSearchChange = (event: any) => {
    setSearchState({
      searchTerm: event.target.value,
      searchLoading: true,
    })
  }

  const handleSearchMessages = () => {
    if(searchState.searchTerm === ''){
      setMessageState([])
      setSearchState({ searchLoading: true })
      return
    }

    const channelMessages = [...messages]
    const regex = new RegExp(searchState.searchTerm!, 'gi')
    const searchResult = channelMessages.reduce(
      (acc: IMessage[], message) => {
        if(message.content && (message.content.match(regex) || message.sender.userName.match(regex))){
          acc.push(message)
        }
        return acc
      }, []
    )

    setMessageState(searchResult)
    setSearchState({ searchLoading: false})
  }

  const countUniqueUsers = (messages: IMessage[]) => {
    const uniqueUsers = messages.reduce((acc: string[], message) => {
      if(!acc.includes(message.sender.userName)){
        acc.push(message.sender.userName)
      }
      return acc
    }, [])
    return uniqueUsers.length
  }

  const hayTypings = (typings: ITypingNotification[]): boolean => {
    return typings.some(t => t.channelId === getCurrentChannel().id);
  }

  const diplayTypingsAvatars = (typings: ITypingNotification[]) => {
    const maxVisible = 3
    const visibles = typings.slice(0, maxVisible)
    const excedentes = typings.length - maxVisible

    return visibles.map(typing => (
      <>
        <Image src={typing.sender.avatar} avatar style={{ width: 24, height: 24, marginRight: 8 }}/>
        {excedentes > 0 && (
          <div
          title={`+${excedentes} personas escribiendo`}
          style={{
            width: 24,
            height: 24,
            marginRight: 4,
            borderRadius: '50%',
            backgroundColor: '#ccc',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '0.75rem',
            fontWeight: 'bold',
          }}
        >
          +{excedentes}
        </div>
        )}
      </>
    ))
  }

  const handleLoadMoreMessages = () => {
    setSeClickeoCargarMasAntiguos(true)
    setCharginPreviousMessages(true)
    const sortedMessages = [...messages].sort((a,b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    appendPreviousMessages(getCurrentChannel().id, sortedMessages[0])
    setCharginPreviousMessages(false)
  }

  useEffect(() =>{
    console.log(searchState)
    if(searchState.searchLoading){
      handleSearchMessages()
    }
    setNumUniqueUsers(countUniqueUsers(messageState.length>0 ? messageState: messages))
    console.log("se setearon: "+countUniqueUsers(messageState.length>0 ? messageState: messages))

  },[handleSearchChange, handleSearchMessages])

  return (
    <React.Fragment>
      <MessagesHeader numUniqueUsers={numUniqueUsers} handleSearchChange={handleSearchChange} currentChannel={getCurrentChannel()} currentUser={user} handleStar={handleStar}/>
      {!user ? (
        <div>Cargando Usuario...</div>
      ): (
      <div style={{ position: 'relative' }}>
        <div ref={messagesContainerRef}  style={{   maxHeight: '70vh',
                                                    overflowY: 'auto', 
                                                }}>
          <Segment>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
                {noMorePreviousMessages===false ? <Button size="small" onClick={handleLoadMoreMessages} loading={charginPreviousMessages}>
                  Cargar mensajes anteriores
                </Button>: <span>No hay mas mensajes anteriores</span>}
              </div>
              <CommentGroup size='large' className="messages"  style={{ width: '100%'  }}>
                {/* Botón para cargar mensajes anteriores */}
                {displayMessages(messageState.length > 0 ? messageState : messages)}
                {hayTypings(typingsNotifications) && <div style={{ display: 'flex', alignItems: 'center' }}> <>{diplayTypingsAvatars(typingsNotifications)} <Typing/></></div>}
              </CommentGroup>
              
          </Segment>

          {tieneScroll && !estaAbajoDelTodo && <Icon
                    name="arrow down"
                    size="large"
                    color="blue"
                    circular
                    link
                    onClick={() => {
                      messagesContainerRef.current?.scrollTo({
                        top: messagesContainerRef.current.scrollHeight,
                        behavior: 'smooth',
                      });
                    }}
                    style={{
                      position: 'absolute',
                      bottom: '20px',
                      right: '20px',
                      zIndex: 1000,
                      cursor: 'pointer',
                      backgroundColor: 'white',
                      boxShadow: '0px 2px 10px rgba(0,0,0,0.2)'
                    }}
                  />}
        </div>
      </div>
      )}
      <MessageForm />
      <ImageModal />
    </React.Fragment>
  )
}

export default observer(Messages)
