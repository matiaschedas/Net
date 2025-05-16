import React, { useContext } from 'react'
import { Menu } from 'semantic-ui-react'
import UserPanel from './UserPanel'
import Channels from './Channels'
import DirectMessages from './DirectMessages'
import { observer } from 'mobx-react-lite'
import Starred from './Starred'
import { RootStoreContext } from '../../Stores/rootStore'


const SidePanel = () => {
  const rootStore = useContext(RootStoreContext)
  const { isChannelLoaded, channels } = rootStore.channelStore
  return(
    <Menu size="large" inverted fixed="left" vertical style={{background: '#4c3c4c', fontSize: '1.2rem'}}>  
      <UserPanel/>
      <Starred/>
      <Channels/>
      {(isChannelLoaded && channels.length>0) && <DirectMessages/>}
    </Menu>
  )
}

export default observer(SidePanel)