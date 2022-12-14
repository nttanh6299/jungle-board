import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import Input from './Input'

export default {
  title: 'Input',
  component: Input,
} as ComponentMeta<typeof Input>

const Template: ComponentStory<typeof Input> = (args) => (
  <div className="w-[300px]">
    <Input {...args} />
  </div>
)

export const Primary = Template.bind({})
Primary.args = {
  placeholder: 'Enter your name',
  disabled: false,
  readOnly: false,
}
