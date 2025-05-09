import React from 'react'
import { Icon, Menu } from 'semantic-ui-react'

const Starred = () => {
  return (
    <React.Fragment>
      <Menu.Menu style={{ paddingBottom: '2em' }}>
        <Menu.Item>
          <span>
            <Icon name="exchange"/> STARRED
          </span> {' '}
          ({0}){' '}
        </Menu.Item>
      </Menu.Menu>
    </React.Fragment>
  )
}

export default Starred
