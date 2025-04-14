import React from 'react'
import { Menu } from 'semantic-ui-react'
import { IChannel } from '../../Models/channels'

interface IChannelItemProps
{
  channel: IChannel
}

const ChannelItem: React.FC<IChannelItemProps> = ({ channel }) => {
  return (

        <Menu.Item key={channel.id} onClick={() => console.log(channel)} name={channel.name} style={{ opacity: 0.7 }}>
          # {channel.name}
        </Menu.Item>
    )
  }


export default ChannelItem
