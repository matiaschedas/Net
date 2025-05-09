import React from 'react'
import { Icon, Menu, Popup} from 'semantic-ui-react'
import { IUser } from '../../Models/users'

interface IProps {
  user: IUser,
  changeChannel: (user: IUser) => void
}

const DirectMessagesItem: React.FC<IProps>= ({ user, changeChannel }) => {

  const isUserOnline = (user: IUser) => {
    return user.isOnline
  }

  return (
        <Menu.Item key={user.email} onClick={() => changeChannel(user)} name={user.userName} style={{ opacity: 0.7, display: 'flex', alignItems: 'center' }}>
         <Popup
            content={isUserOnline(user) ? 'Disponible' : 'No disponible'}
            position="top center"
            trigger={
                    <Icon name="circle" color={isUserOnline(user) ? 'green': 'red'} style={{ marginRight: '0.5em'}} />
                          
            }/>
            {user.userName}
        </Menu.Item>
  )
}

export default DirectMessagesItem
