# Messaging System Documentation

## Overview
A complete messaging system that allows customers and sellers to communicate about projects in real-time.

## Features

### ✅ Implemented Features

1. **Messages Inbox** (`/client/messages` & `/freelancer/messages`)
   - List all conversations
   - Search functionality
   - Unread message count badges
   - Online/offline status indicators
   - Last message preview
   - Timestamp formatting

2. **Individual Chat Page** (`/client/messages/[id]` & `/freelancer/messages/[id]`)
   - Full chat interface
   - Message history with date separators
   - File attachment support
   - Real-time message sending
   - Read receipts
   - Project information sidebar

3. **ChatWindow Component** (`components/messages/ChatWindow.js`)
   - Reusable chat interface
   - Message grouping by date
   - File upload support
   - Auto-scroll to latest message
   - Message status indicators

4. **Message Service** (`services/messageService.js`)
   - Get conversations
   - Get messages for project/conversation
   - Send messages
   - Mark as read
   - Unread count

5. **Sidebar Integration**
   - Messages link added to both client and freelancer menus

## File Structure

```
pages/
├── client/
│   └── messages/
│       ├── index.js          # Messages inbox
│       └── [id].js           # Individual chat page
└── freelancer/
    └── messages/
        ├── index.js          # Messages inbox
        └── [id].js          # Individual chat page

components/
└── messages/
    └── ChatWindow.js        # Reusable chat component

services/
└── messageService.js        # API service for messages
```

## API Integration

### Current Implementation
The system currently uses **mock data** for demonstration. To integrate with your backend:

### Required API Endpoints

1. **GET `/api/messages/conversations`**
   - Returns list of conversations for current user
   - Response format:
   ```json
   [
     {
       "id": 1,
       "projectId": 1,
       "projectTitle": "Project Title",
       "otherUser": {
         "id": 2,
         "name": "User Name",
         "avatar": "url",
         "isOnline": true
       },
       "lastMessage": {
         "text": "Last message text",
         "timestamp": "2024-01-15T10:30:00Z",
         "senderId": 2,
         "isRead": false
       },
       "unreadCount": 2,
       "updatedAt": "2024-01-15T10:30:00Z"
     }
   ]
   ```

2. **GET `/api/messages/conversations/:id`**
   - Returns messages for a specific conversation
   - Response format:
   ```json
   {
     "id": 1,
     "projectId": 1,
     "messages": [
       {
         "id": 1,
         "senderId": 1,
         "text": "Message text",
         "timestamp": "2024-01-15T10:30:00Z",
         "isRead": true,
         "attachments": []
       }
     ]
   }
   ```

3. **POST `/api/messages`**
   - Send a new message
   - Request body:
   ```json
   {
     "projectId": 1,
     "conversationId": 1,
     "receiverId": 2,
     "message": "Message text",
     "attachments": []
   }
   ```

4. **PUT `/api/messages/conversations/:id/read-all`**
   - Mark all messages in conversation as read

5. **GET `/api/messages/unread-count`**
   - Returns total unread messages count
   - Response: `{ "count": 5 }`

## Real-Time Messaging (Optional Enhancement)

### Socket.io Integration

To add real-time messaging, you'll need to:

1. **Install Socket.io Client**
   ```bash
   npm install socket.io-client
   ```

2. **Create Socket Service** (`services/socketService.js`)
   ```javascript
   import { io } from 'socket.io-client';

   const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
     auth: {
       token: localStorage.getItem('token')
     }
   });

   export default socket;
   ```

3. **Update ChatWindow Component**
   - Connect to socket on mount
   - Listen for `newMessage` events
   - Emit `sendMessage` events
   - Handle `messageRead` events

4. **Backend Socket Events**
   - `sendMessage` - Client sends message
   - `newMessage` - Server broadcasts new message
   - `messageRead` - Mark message as read
   - `userOnline` - User comes online
   - `userOffline` - User goes offline

## Usage Examples

### Starting a Conversation
When a client accepts a freelancer's offer, automatically create a conversation:

```javascript
await messageService.startConversation({
  projectId: projectId,
  otherUserId: freelancerId
});
```

### Sending a Message
```javascript
await messageService.sendMessage({
  projectId: 1,
  conversationId: 1,
  receiverId: 2,
  message: "Hello, I have a question about the project"
});
```

### Marking Messages as Read
```javascript
await messageService.markConversationAsRead(conversationId);
```

## UI Features

### Message Inbox
- ✅ Search conversations
- ✅ Unread count badges
- ✅ Online/offline indicators
- ✅ Last message preview
- ✅ Time formatting (الآن, منذ X دقيقة, etc.)

### Chat Interface
- ✅ Message bubbles (sent/received)
- ✅ Date separators
- ✅ File attachments
- ✅ Read receipts (✓, ✓✓)
- ✅ Auto-scroll to bottom
- ✅ Project info sidebar
- ✅ Online status indicator

## Styling
- Uses Tailwind CSS
- Responsive design
- RTL support for Arabic
- Modern chat UI with rounded bubbles
- Color-coded message status

## Future Enhancements

1. **Real-time updates** with Socket.io
2. **File upload** with progress indicators
3. **Image preview** in chat
4. **Voice messages**
5. **Message reactions** (emoji)
6. **Typing indicators**
7. **Message search** within conversation
8. **Message forwarding**
9. **Group conversations** for team projects
10. **Message notifications** (browser/push)

## Testing

To test the messaging system:

1. Navigate to `/client/messages` or `/freelancer/messages`
2. Click on a conversation to open chat
3. Send messages using the input field
4. Test file attachments
5. Verify unread counts update

## Notes

- All dates are formatted in Arabic
- Messages are grouped by date automatically
- The system supports both fixed and hourly projects
- File attachments are currently using temporary URLs (needs backend integration)

