import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import Select from './Select'

export default {
  title: 'Select',
  component: Select,
} as ComponentMeta<typeof Select>

const Template: ComponentStory<typeof Select> = (args) => (
  <div className="w-[300px]">
    <Select {...args} />
  </div>
)

export const Primary = Template.bind({})
Primary.args = {
  options: [{ label: 'Minecraft', value: 'minecraft' }],
  selected: 'minecraft',
}
