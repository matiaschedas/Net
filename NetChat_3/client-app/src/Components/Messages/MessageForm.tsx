import React, { useContext, useEffect, useRef } from 'react'
import { Button, Form, Input, Segment } from 'semantic-ui-react'
import { Form as FinalForm, Field } from 'react-final-form'
import { IMediaFormValues, IMessageFormValues, ITypingNotification } from '../../Models/messages'
import TextInput from '../Common/Form/TextInput'
import { RootStoreContext } from '../../Stores/rootStore'
import { FORM_ERROR } from 'final-form'
import FileModal from './FileModal'
import { useDebounce } from './useDebounce'

const MessageForm = () => {
  const rootStore = useContext(RootStoreContext)
  const { getCurrentChannel } = rootStore.channelStore
  const { sendMessage, showModal, uploadImage, loadMessages, messages} = rootStore.messageStore
  const { user } = rootStore.userStore
  const typingTimeout = useRef<NodeJS.Timeout | null>(null)
  const isTyping = useRef(false)

  const handleSubmitForm = async (values: IMessageFormValues) => {
    const valuesWithChannel = {
      content: values.content,
      channelId: getCurrentChannel().id,
    }
    var typing: ITypingNotification = {
        sender: user!,
        channelId: getCurrentChannel().id!
      }
    rootStore.messageStore.stopTyping(typing)
    await sendMessage(valuesWithChannel).catch((error: unknown) => ({[FORM_ERROR]: error}))
  }

  const uploadFile = async (image: Blob|null) => {
    console.log("se subio la imagen")
    const media: IMediaFormValues = {
      file: image!,
      channelId: getCurrentChannel()?.id
    }
    await uploadImage(media).catch((error) => ({[FORM_ERROR]: error}))
  }


  const startTyping = () => {
    if (!isTyping.current) {
      isTyping.current = true
      var typing: ITypingNotification = {
        sender: user!,
        channelId: getCurrentChannel().id!
      }
      rootStore.messageStore.startTyping(typing)
    }

    if (typingTimeout.current) {
      clearTimeout(typingTimeout.current)
    }

    typingTimeout.current = setTimeout(() => {
      isTyping.current = false
      var typing: ITypingNotification = {
        sender: user!,
        channelId: getCurrentChannel().id!
      }
      rootStore.messageStore.stopTyping(typing)
    }, 3000) // 3 segundos sin escribir = dejó de tipear
  }

  return (
    <FinalForm onSubmit={handleSubmitForm} render={({ handleSubmit, form, invalid, dirtySinceLastSubmit, pristine, values }) =>{

      return (
      <Form onSubmit={(event) => {
        event.preventDefault()
        const trimmed = values.content?.trim()
        if (!trimmed) return // bloquea si está vacío
        handleSubmit(event)?.then(() => form.reset())
      }}>
        <Segment>
          <Field onChange={() => startTyping()} component={TextInput} IconLabel fluid name="content" style={{ marginBottom: '0.7em' }} label={<Button icon={'add'}/>}
          labelPosition="left" placeholder="Write your messages">
          </Field>
          <Button.Group icon widths="2">
            <Button color="orange" content="Add Reply" labelPosition="left" icon="edit" type="submit" disabled={(invalid && !dirtySinceLastSubmit) || pristine}/>
            <Button color="teal" content="Upload Media" labelPosition="right" icon="cloud upload" type='button' onClick={() => showModal(true)}/>
            
          </Button.Group>
          <FileModal uploadFile={uploadFile}/>
        </Segment>

      </Form>
      )}}/>
  )
}

export default MessageForm
