import { useState, useEffect, useRef } from 'react';
import { FaPaperclip, FaSmile, FaPaperPlane, FaImage, FaFile } from 'react-icons/fa';
import messageService from '../../services/messageService';

export default function ChatWindow({ conversationId, projectId, otherUser, currentUserId, onMessageSent }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const fileInputRef = useRef(null);
  const shouldAutoScroll = useRef(true);
  const isUserScrolling = useRef(false);

  useEffect(() => {
    if (projectId) {
    loadMessages();
    }
  }, [projectId]);

  // Only auto-scroll if user is at bottom or new message is sent
  useEffect(() => {
    if (shouldAutoScroll.current && messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

  // Check if user is near bottom
  const checkIfNearBottom = () => {
    if (!messagesContainerRef.current) return true;
    const container = messagesContainerRef.current;
    const threshold = 100; // pixels from bottom
    return container.scrollHeight - container.scrollTop - container.clientHeight < threshold;
  };

  // Handle scroll events
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      shouldAutoScroll.current = checkIfNearBottom();
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const loadMessages = async () => {
    try {
      setLoading(true);
      
      if (!projectId) {
        setLoading(false);
        return;
      }
      
      // Load messages from API
      const response = await messageService.getProjectMessages(projectId);
      const messagesData = response.data || [];
      
      // Map API messages to frontend format
      const mappedMessages = messagesData.map(msg => ({
        id: msg.id,
        senderId: msg.sender_id || msg.senderId,
        text: msg.content || msg.text || '',
        timestamp: new Date(msg.created_at || msg.timestamp),
        isRead: true, // TODO: Implement read status
          attachments: []
      }));

      setMessages(mappedMessages);
      
      // Auto-scroll to bottom on initial load
      setTimeout(() => {
        scrollToBottom();
        shouldAutoScroll.current = true;
      }, 100);
    } catch (error) {
      console.error('Error loading messages:', error);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() && !fileInputRef.current?.files.length) return;

    setSending(true);

    try {
      if (!projectId) {
        alert('خطأ: لا يمكن إرسال الرسالة بدون معرف المشروع');
        return;
      }

      // Send message via API
      const response = await messageService.sendMessage(projectId, {
        content: newMessage.trim()
      });
      
      const sentMessage = response.data?.data || response.data;
      
      // Add message to local state
      const newMsg = {
        id: sentMessage.id || messages.length + 1,
        senderId: currentUserId,
        text: sentMessage.content || newMessage.trim(),
        timestamp: new Date(sentMessage.created_at || new Date()),
        isRead: false,
        attachments: []
      };

      setMessages(prev => [...prev, newMsg]);
      setNewMessage('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // Always scroll to bottom when sending a message
      shouldAutoScroll.current = true;
      setTimeout(() => {
        scrollToBottom();
      }, 100);

      // Call callback if provided
      if (onMessageSent) {
        onMessageSent(newMsg);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        projectId: projectId
      });
      
      // Show more detailed error message
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'خطأ غير معروف';
      
      alert(`حدث خطأ أثناء إرسال الرسالة.\n\n${errorMessage}\n\nيرجى المحاولة مرة أخرى.`);
    } finally {
      setSending(false);
    }
  };

  const formatTime = (date) => {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return 'الآن';
    if (minutes < 60) return `منذ ${minutes} دقيقة`;
    
    return date.toLocaleTimeString('ar-SA', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'اليوم';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'أمس';
    } else {
      return date.toLocaleDateString('ar-SA', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    }
  };

  const groupMessagesByDate = (messages) => {
    const grouped = {};
    messages.forEach(msg => {
      const dateKey = msg.timestamp.toDateString();
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(msg);
    });
    return grouped;
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل الرسائل...</p>
        </div>
      </div>
    );
  }

  const groupedMessages = groupMessagesByDate(messages);
  const dates = Object.keys(groupedMessages);

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Messages Area */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-6 space-y-4 min-h-0"
        style={{ scrollBehavior: 'smooth' }}
      >
        {dates.map((dateKey) => {
          const dateMessages = groupedMessages[dateKey];
          const date = new Date(dateKey);
          
          return (
            <div key={dateKey}>
              {/* Date Separator */}
              <div className="flex items-center justify-center my-6">
                <div className="flex items-center gap-3">
                  <div className="h-px bg-gray-300 flex-1"></div>
                  <span className="text-xs text-gray-500 px-3 py-1 bg-gray-100 rounded-full">
                    {formatDate(date)}
                  </span>
                  <div className="h-px bg-gray-300 flex-1"></div>
                </div>
              </div>

              {/* Messages for this date */}
              {dateMessages.map((message) => {
                const isOwnMessage = message.senderId === currentUserId;
                
                return (
                  <div
                    key={message.id}
                    className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4`}
                  >
                    <div className={`flex gap-3 max-w-[70%] ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}>
                      {/* Avatar (only for received messages) */}
                      {!isOwnMessage && (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {otherUser.name.charAt(0)}
                        </div>
                      )}

                      {/* Message Bubble */}
                      <div className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'}`}>
                        <div
                          className={`rounded-2xl px-4 py-2 ${
                            isOwnMessage
                              ? 'bg-primary-500 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap break-words">{message.text}</p>
                          
                          {/* Attachments */}
                          {message.attachments && message.attachments.length > 0 && (
                            <div className="mt-2 space-y-2">
                              {message.attachments.map((attachment, idx) => (
                                <div key={idx} className="flex items-center gap-2 p-2 bg-white/20 rounded">
                                  <FaFile className="text-sm" />
                                  <a
                                    href={attachment.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm underline truncate"
                                  >
                                    {attachment.name}
                                  </a>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        <span className="text-xs text-gray-500 mt-1 px-2">
                          {formatTime(message.timestamp)}
                          {isOwnMessage && (
                            <span className="mr-1">
                              {message.isRead ? '✓✓' : '✓'}
                            </span>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="border-t border-gray-200 p-4 bg-white">
        <form onSubmit={handleSendMessage} className="flex items-end gap-3">
          {/* File Upload Button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-3 text-gray-500 hover:text-primary-500 hover:bg-gray-100 rounded-lg transition-colors"
            title="إرفاق ملف"
          >
            <FaPaperclip className="w-5 h-5" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.zip"
          />

          {/* Text Input */}
          <div className="flex-1 relative">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
              placeholder="اكتب رسالتك..."
              rows="1"
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none max-h-32"
            />
            <button
              type="button"
              className="absolute left-3 bottom-3 text-gray-500 hover:text-primary-500"
              title="إضافة إيموجي"
            >
              <FaSmile className="w-5 h-5" />
            </button>
          </div>

          {/* Send Button */}
          <button
            type="submit"
            disabled={sending || (!newMessage.trim() && !fileInputRef.current?.files.length)}
            className="p-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            title="إرسال"
          >
            <FaPaperPlane className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}

