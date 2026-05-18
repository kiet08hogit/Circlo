Allow UIC students to message one another instantly about:  
  
- Listings  
- Services  
- Tickets  
- Gigs  
- General coordination  
  
---  
  
## Core Chat Features  
  
- Create conversations  
- Add users to conversations  
- Send messages in real time  
- Persist all messages in PostgreSQL  
- Load previous message history  
- Show conversation list  
  
---  
  
## Chat Architecture  
  
### Frontend  
- Chat UI in Next.js  
- Opens a WebSocket connection to the backend  
- Sends and receives real-time message events  
  
### Backend  
- WebSocket gateway inside the TypeScript backend  
- Verifies authentication  
- Checks conversation membership  
- Saves messages to the database  
- Broadcasts messages to active recipients  
  
### Database  
- `Conversations`  
- `ConversationMembers`  
- `Messages`  
  
---  
  
## Message Send Flow  
  
1. User types a message  
2. Frontend emits a WebSocket event  
3. Backend verifies the user  
4. Backend checks whether the user is part of the conversation  
5. Backend stores the new message in PostgreSQL  
6. Backend broadcasts the message to other connected members  
7. Recipient sees the message immediately  
  
---  
  
## Example WebSocket Event  
  
### Client to Server  
  

{  
"event": "send_message",  
"data": {  
"conversationId": "conversation_123",  
"content": "Is this still available?"  
}  


### Server to Client

```
{  "event": "new_message",  "data": {    "id": "message_456",    "conversationId": "conversation_123",    "senderId": "user_001",    "content": "Is this still available?",    "createdAt": "2026-05-17T18:00:00Z"  }}
```