import { Map } from 'constants/enum'

export const turnOptions: Utils.IOption[] = [
  {
    label: '100',
    value: '100',
  },
  {
    label: '150',
    value: '150',
  },
  {
    label: '200',
    value: '200',
  },
]

export const cooldownOptions: Utils.IOption[] = [
  {
    label: '20',
    value: '20',
  },
  {
    label: '25',
    value: '25',
  },
  {
    label: '30',
    value: '30',
  },
]

export const mapOptions = [
  {
    name: Map.RAINFOREST,
    src: '/images/rainforest.png',
  },
  {
    name: Map.DESERT,
    src: '/images/desert.png',
  },
  {
    name: Map.GRASSLAND,
    src: '/images/grassland.png',
  },
  {
    name: Map.TUNDRA,
    src: '/images/tundra.png',
  },
]
