import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import RangeSlider from './RangeSlider'

export default {
  title: 'RangeSlider',
  component: RangeSlider,
} as ComponentMeta<typeof RangeSlider>

const Template: ComponentStory<typeof RangeSlider> = (args) => <RangeSlider {...args} />

export const Primary = Template.bind({})
Primary.args = {}
