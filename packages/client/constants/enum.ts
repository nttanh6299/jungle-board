export enum ERoomStatus {
  WAITING = 'waiting',
  READY = 'ready',
  PLAYING = 'playing',
  END = 'end',
  TIE = 'tie',
}

export enum EDisconnectReason {
  TRANSPORT_CLOSE = 'transport close',
  TRANSPORT_ERROR = 'transport error',
  PING_TIMEOUT = 'ping timeout',
}

export enum NotifyEvent {
  AddLog = 'AddLog',
  ClearLog = 'ClearLog',
  AutoJoinRoom = 'AutoJoinRoom',
  RefetchUser = 'RefetchUser',
  ShowConnectionAlert = 'ShowConnectionAlert',
}
