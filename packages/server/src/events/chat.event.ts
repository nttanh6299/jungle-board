import eventHandler from '../utils/eventHandler'

const chat = eventHandler((io, socket) => {
  socket.on('message', async (message) => {
    const { roomId } = socket.data

    if (!roomId) return

    socket.to(roomId).emit('message', message)
  })
})

export default chat
