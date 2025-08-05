export default function renderNotificationMessage(notification: any) {
  const { type, data } = notification;
  switch (type) {
    case "FOLLOW":
      return `${data.userName} started following you.`;
    case "REACTED":
      const formattedType = String(data.type).toLowerCase();
      return `${data.userName} reacted with ${formattedType} to your quote from ${data.bookName}.`;
    default:
      return "You got a notification.";
  }
}
