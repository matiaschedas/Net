import React, { useEffect, useContext } from 'react'
import { Icon, Menu } from 'semantic-ui-react'
import { ChannelType, IChannel } from '../../Models/channels' 
import ChannelItem from './ChannelItem'
import ChannelForm from './ChannelForm'
import { RootStoreContext } from '../../Stores/rootStore'
import { observer } from 'mobx-react-lite'
import { useNavigate } from 'react-router-dom'
import { error } from 'console'

const Channels = () =>  {
  
    const rootStore = useContext(RootStoreContext);
    const channelStore = rootStore.channelStore
    const messageStore = rootStore.messageStore
    const navigate = useNavigate();
    useEffect(() => {
      channelStore.loadChannels(ChannelType.Channel)
      console.log("se cargaron los canales")
    }, [channelStore])//solo necesitamos que nos traiga 1 vez los channels desde la api asi que le pasamos dependencias en vacio ([])

    useEffect(() => {
      channelStore.setNavigate(navigate)
    },[navigate, channelStore])

    const { channels, setActiveChannel, getCurrentChannel} = channelStore
    const { loadMessages } = messageStore 
    
    const changeChannel = (channel: IChannel) => {
      setActiveChannel(channel)
      //console.log(getCurrentChannel())
      loadMessages(getCurrentChannel()?.id)
    } 
    const displayChannels = (channels: IChannel[]) => {
      return (
        channels.length > 0 && 
        channels.map((channel) => (
          <ChannelItem key={channel.id} channel={channel} changeChannel={changeChannel} />
        ))
      )
    }

    return (
      <React.Fragment>
        
        <Menu.Menu style={{ paddingBottom: '2em' }} >
          <Menu.Item>
            <span>
              <Icon name="exchange" /> CHANNELS
            </span> { }
            ({ channels.length }) <Icon name="add" onClick={() => channelStore.showModal(true)}/>
          </Menu.Item>

          {displayChannels(channels)}
        </Menu.Menu>

      <ChannelForm /> 

      </React.Fragment>

    )
}

export default observer(Channels)
