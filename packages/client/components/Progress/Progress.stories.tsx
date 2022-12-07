import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import Progress from './Progress'

export default {
  title: 'Progress',
  component: Progress,
} as ComponentMeta<typeof Progress>

const Template: ComponentStory<typeof Progress> = (args) => (
  <div className="w-[300px]">
    <Progress {...args} />
  </div>
)

export const Primary = Template.bind({})
Primary.args = {
  percent: 50,
  color: 'primary',
}
