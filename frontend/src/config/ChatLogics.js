export const getSender = (user, users) =>
  users[0]._id === user._id ? users[1].name : users[0].name;

export const getSenderFull = (user, users) =>
  users[0]._id === user._id ? users[1] : users[0];

export const isSameSender = (messages, m, i, userId) =>
  i < messages.length - 1 &&
  (messages[i + 1].sender._id !== m.sender._id ||
    messages[i + 1].sender._id === undefined) &&
  messages[i].sender._id !== userId;

export const isLastMessage = (messages, i, userId) =>
  i === messages.length - 1 &&
  messages[messages.length - 1].sender._id !== userId &&
  messages[messages.length - 1].sender._id;

export const isSameSenderMargin = (messages, m, i, userId) =>
  i < messages.length - 1 &&
  messages[i + 1].sender._id === m.sender._id &&
  messages[i].sender._id !== userId
    ? 33
    : (i < messages.length - 1 &&
        messages[i + 1].sender._id !== m.sender._id &&
        messages[i].sender._id !== userId) ||
      (i === messages.length - 1 && messages[i].sender._id !== userId)
    ? 0
    : "auto";

export const isSameUser = (messages, m, i) =>
  i > 0 && messages[i - 1].sender._id === m.sender._id;
