import React, { useEffect, useContext } from 'react'
import { Icon, Menu } from 'semantic-ui-react'
import { IChannel } from '../../Models/channels' 
import ChannelItem from './ChannelItem'
import ChannelForm from './ChannelForm'
import ChannelStore from '../../Stores/ChannelStore'
import { observer } from 'mobx-react-lite'

const Channels = () =>  {
  
    const channelStore = useContext(ChannelStore);
    useEffect(() => {
      channelStore.loadChannels()
    }, [channelStore])//solo necesitamos que nos traiga 1 vez los channels desde la api asi que le pasamos dependencias en vacio ([])
    const { channels } = channelStore
    
    
    const displayChannels = (channels: IChannel[]) => {
      return (
        channels.length > 0 && 
        channels.map((channel) => (
          <ChannelItem key={channel.id} channel={channel}/>
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
