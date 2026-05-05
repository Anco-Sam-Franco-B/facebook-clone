import { format } from 'date-fns';

const MessageItem = ({ message, isOwn, showAvatar, avatarUrl, name }) => {
  return (
    <div className={`flex w-full ${isOwn ? 'justify-end' : 'justify-start'} group mb-[2px]`}>
      {!isOwn && (
        <div className="w-7 h-7 rounded-full mr-2 flex-shrink-0 mt-auto">
          {showAvatar && (
            avatarUrl ? (
              <img src={avatarUrl} alt={name} className="w-full h-full rounded-full object-cover" />
            ) : (
              <div className="w-full h-full rounded-full bg-gradient-to-tr from-messenger-400 to-messenger-600 flex items-center justify-center text-white font-bold text-[11px]">
                {name?.charAt(0).toUpperCase()}
              </div>
            )
          )}
        </div>
      )}
      
      <div 
        className={`max-w-[65%] px-3.5 py-2 rounded-[18px] relative ${
          isOwn 
            ? 'bg-messenger-600 text-white' 
            : 'bg-[#E4E6EB] dark:bg-gray-700 text-gray-900 dark:text-gray-100'
        }`}
      >
        <p className="text-[15px] leading-[1.35] break-words">{message.messageText}</p>
        
        {/* Tooltip for timestamp on hover */}
        <div className={`absolute top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-[11px] text-gray-500 w-[60px] ${isOwn ? '-left-[70px] text-right' : '-right-[70px] text-left'} pointer-events-none`}>
          {format(new Date(message.createdAt), 'HH:mm')}
        </div>
      </div>

      {isOwn && (
        <div className="w-4 ml-1 flex flex-col justify-end pb-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {message.isRead ? (
            <svg className="w-3.5 h-3.5 text-messenger-600" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
          ) : (
            <svg className="w-3.5 h-3.5 text-gray-300" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
          )}
        </div>
      )}
    </div>
  );
};

export default MessageItem;
