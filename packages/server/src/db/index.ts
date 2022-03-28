import Room from '../resolvers/Room'

const roomMap: Map<string, Room> = new Map()

const room1 = '1'
roomMap.set(room1, new Room(room1, 'Official 1'))
const room2 = '2'
roomMap.set(room2, new Room(room2, 'Official 2'))
const room3 = '3'
roomMap.set(room3, new Room(room3, 'Official 3'))

export default roomMap
