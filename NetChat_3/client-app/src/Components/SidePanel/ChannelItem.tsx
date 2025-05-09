import { observer } from 'mobx-react-lite'
import React from 'react'
import { Menu } from 'semantic-ui-react'
import { IChannel } from '../../Models/channels'

interface IChannelItemProps
{
  channel: IChannel
  changeChannel: (channel: IChannel) => void
}

const ChannelItem: React.FC<IChannelItemProps> = ({ channel, changeChannel }) => {
  return (

        <Menu.Item key={channel.id} onClick={() => changeChannel(channel)} name={channel.name} style={{ opacity: 0.7 }}>
          # {channel.name}
        </Menu.Item>
    )
  }

export default observer(ChannelItem)
