import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import Button from 'components/Button'
import Tooltip from './Tooltip'

export default {
  title: 'Tooltip',
  component: Tooltip,
} as ComponentMeta<typeof Tooltip>

const Template: ComponentStory<typeof Tooltip> = (args) => (
  <div className="mt-10">
    <Tooltip {...args}>
      <Button>Hover</Button>
    </Tooltip>
  </div>
)

export const Default = Template.bind({})
Default.args = {
  title: 'This is a tooltip',
}
