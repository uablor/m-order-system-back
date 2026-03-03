export enum NotificationStatus {
    PENDING = 'PENDING',
  SENT = 'SENT',
  FAILED = 'FAILED',
    CANCELLED = 'CANCELLED',
}

export enum NotificationType {
  ARRIVAL = 'ARRIVAL',
  PAYMENT = 'PAYMENT',
  REMINDER = 'REMINDER',
}

export enum NotificationChannel {
  FB = 'FB',
  LINE = 'LINE',
  WHATSAPP = 'WHATSAPP',
}
