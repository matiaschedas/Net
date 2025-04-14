import React, { ChangeEvent, useContext, useState } from 'react'
import { Button, Form, Icon, Input, Modal, ModalActions } from 'semantic-ui-react'
import { IChannel } from '../../Models/channels'
import { v4 as uuid } from 'uuid'
import ChannelStore from '../../Stores/ChannelStore'
import { observer } from 'mobx-react-lite'


const ChannelForm: React.FC = () => {
  const initialChannel = {
    id: '',
    name: '',
    description: ''
  }
  const [channel, setChannel] = useState<IChannel>(initialChannel)
  const { isModalVisible, showModal, createChannel } = useContext(ChannelStore);
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.value)
    setChannel({ ...channel, [event.target.name]: event.target.value })
  }

  const handleSubmit = () => {
    console.log("hola")
    let newChannel = {
      ...channel,
      id: uuid()
    }
    createChannel(newChannel)
    setChannel(initialChannel)
    showModal(false);
  }
  return (
    <Modal basic open={isModalVisible}>
    <Modal.Header>Add Channel</Modal.Header>
    <Modal.Content>
      <Form>
        <Form.Field>
          <Input fluid label="Channel Name" onChange={handleInputChange} name="name" />
        </Form.Field>
        <Form.Field>
          <Input fluid label="Description" onChange={handleInputChange} name="description" />
        </Form.Field>
      </Form>
    </Modal.Content>

    <ModalActions>
      <Button basic color='green' inverted onClick={() => handleSubmit()}>
        <Icon name='checkmark' /> Add
      </Button>
      <Button color='red' inverted onClick={() => showModal(false)}>
        <Icon name='remove' /> Cancel
      </Button>
    </ModalActions>
  </Modal>
  )
}

export default observer(ChannelForm)
