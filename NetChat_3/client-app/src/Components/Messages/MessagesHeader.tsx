import React from 'react'
import { Header, Icon, Segment } from 'semantic-ui-react'
import { ChannelType, IChannel } from '../../Models/channels'
import { IUser } from '../../Models/users'
import SearchInput from './SearchInput'


interface IProps {
  currentChannel: IChannel | null
  currentUser: IUser | null 
}

const MessagesHeader : React.FC<IProps> = ({ currentChannel, currentUser}) => {
  const isPrivateChannel = () => {
    console.log((currentChannel?.channelType === ChannelType.Room))
    return currentChannel?.channelType === ChannelType.Room
  }
  const channelDisplayName = () => {
    const IsPrivateChannel = isPrivateChannel()
    var DisplayName : string = "" 
    if(IsPrivateChannel){
      DisplayName+="@"
      if(currentUser?.userName == currentChannel?.name){
        DisplayName+=currentChannel?.description
      }
      else{
        DisplayName+= currentChannel?.name
      }
    }
    else{
      DisplayName+=currentChannel?.name
    }
    return DisplayName
  }
  return (
    <Segment clearing>
      <Header fluid="true" as="h2" floated="left" style={{ marginBottom: 0 }}>
        <span>
          {channelDisplayName()}
          <Icon name={'star outline'} color="black"/>
        </span>
        <Header.Subheader>2 Users</Header.Subheader>
      </Header>
      <SearchInput />
    </Segment>
  )
}

export default MessagesHeader
