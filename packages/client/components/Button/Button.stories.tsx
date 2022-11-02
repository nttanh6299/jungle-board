import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import Button from './Button'
import GameControllerIcon from 'icons/GameController'

export default {
  title: 'Button',
  component: Button,
} as ComponentMeta<typeof Button>

const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />

export const Primary = Template.bind({})
Primary.args = {
  children: 'Join',
  type: 'filled',
  disabled: false,
  rounded: false,
  uppercase: false,
}

export const Secondary = Template.bind({})
Secondary.args = {
  ...Primary.args,
  variant: 'secondary',
}

export const WithIcon = Template.bind({})
WithIcon.args = {
  ...Primary.args,
  variant: 'secondary',
  uppercase: true,
  iconLeft: <GameControllerIcon />,
}
