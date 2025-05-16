import React from 'react'
import { FieldRenderProps } from 'react-final-form'
import { FormFieldProps, Form, Label } from 'semantic-ui-react'



interface IProps extends FieldRenderProps<string, HTMLElement>, FormFieldProps {

}

const TextInput: React.FC<IProps> = ({ placeholder, type, icon, input, meta: {touched, error}, IconLabel, onChange}) => {
  return (
    <Form.Input fluid iconPosition='left' type={type} placeholder={placeholder}>
      {IconLabel && (
        <button className='ui icon button label button__icon'>
          <i aria-hidden="true" className='add icon'></i>
        </button>
      )}
      <i aria-hidden="true" className={icon}></i>
      <input {...input} className={IconLabel ? 'input__icon':''} onChange={(e) => {input.onChange(e)
        if (onChange) onChange(e)
      }}/>
      {touched && error && (
        <Label basic color='red'>
          {error}
        </Label>
      )}
    </Form.Input>
  )
}

export default TextInput
