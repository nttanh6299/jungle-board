import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import Popover from './Popover'

export default {
  title: 'Popover',
  component: Popover,
} as ComponentMeta<typeof Popover>

const Template: ComponentStory<typeof Popover> = (args) => (
  <Popover {...args} className="p-4">
    <p className="text-lg">Unlock our awesome features now</p>
  </Popover>
)

export const Primary = Template.bind({})
Primary.args = {
  title: 'Login in here',
}
