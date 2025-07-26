function Message({ message }) {
  return (
    <div className="mb-2">
      {message.type === 'file' ? (
        <div>
          <strong>{message.sender}</strong>:
          <a href={message.content} download={message.filename} className="text-blue-500 underline">
            {message.filename}
          </a>
          <span className="text-xs text-gray-500 ml-2">
            {new Date(message.timestamp).toLocaleTimeString()}
          </span>
        </div>
      ) : (
        <div>
          <strong>{message.sender}</strong>: {message.content}
          <span className="text-xs text-gray-500 ml-2">
            {new Date(message.timestamp).toLocaleTimeString()}
          </span>
        </div>
      )}
    </div>
  );
}

export default Message;