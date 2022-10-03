export enum ERoomStatus {
  WAITING = 'waiting',
  PLAYING = 'playing',
  END = 'end',
  TIE = 'tie',
}

export enum EDisconnectReason {
  TRANSPORT_CLOSE = 'transport close',
  TRANSPORT_ERROR = 'transport error',
  PING_TIMEOUT = 'ping timeout',
}
