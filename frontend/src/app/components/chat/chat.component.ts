import { Component, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { ChatService } from '../../services/chat.service';

interface Message {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

@Component({
  selector: 'app-chat',
  template: `
    <div class="chat-container">
      <div class="messages" #scrollMe>
        <div *ngFor="let message of messages" 
             [ngClass]="{'message': true, 'user-message': message.isUser, 'bot-message': !message.isUser}">
          <div class="message-content">{{ message.text }}</div>
          <div class="message-timestamp">{{ message.timestamp | date:'short' }}</div>
        </div>
      </div>
      <div class="input-container">
        <input type="text" 
               [(ngModel)]="currentMessage" 
               (keyup.enter)="sendMessage()"
               placeholder="Type your message..."
               [disabled]="isLoading">
        <button (click)="sendMessage()" [disabled]="isLoading || !currentMessage">Send</button>
      </div>
    </div>
  `,
  styles: [`
    .chat-container {
      height: 100vh;
      display: flex;
      flex-direction: column;
      padding: 20px;
      background-color: #f5f5f5;
    }
    
    .messages {
      flex: 1;
      overflow-y: auto;
      margin-bottom: 20px;
      padding: 10px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .message {
      margin: 10px 0;
      padding: 10px 15px;
      border-radius: 10px;
      max-width: 70%;
      word-wrap: break-word;
    }
    
    .user-message {
      background-color: #007bff;
      color: white;
      margin-left: auto;
    }
    
    .bot-message {
      background-color: #e9ecef;
      color: black;
      margin-right: auto;
    }
    
    .message-timestamp {
      font-size: 0.8em;
      margin-top: 5px;
      opacity: 0.7;
    }
    
    .input-container {
      display: flex;
      gap: 10px;
      padding: 10px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    input {
      flex: 1;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 16px;
    }
    
    button {
      padding: 10px 20px;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 16px;
    }
    
    button:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }
  `]
})
export class ChatComponent implements AfterViewChecked {
  @ViewChild('scrollMe') private scrollContainer!: ElementRef;
  
  messages: Message[] = [];
  currentMessage = '';
  isLoading = false;

  constructor(private chatService: ChatService) {}

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    try {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    } catch(err) {}
  }

  async sendMessage() {
    if (!this.currentMessage.trim() || this.isLoading) return;

    const userMessage: Message = {
      text: this.currentMessage,
      isUser: true,
      timestamp: new Date()
    };

    this.messages.push(userMessage);
    const messageToSend = this.currentMessage;
    this.currentMessage = '';
    this.isLoading = true;

    try {
      const response = await this.chatService.sendMessage(messageToSend).toPromise();
      if (response) {
        this.messages.push({
          text: response.message,
          isUser: false,
          timestamp: new Date()
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      this.messages.push({
        text: 'Sorry, there was an error processing your message.',
        isUser: false,
        timestamp: new Date()
      });
    } finally {
      this.isLoading = false;
    }
  }
} 