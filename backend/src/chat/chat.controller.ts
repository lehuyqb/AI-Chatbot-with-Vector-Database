import { Controller, Post, Get, Body, Param, UseGuards, ValidationPipe, UsePipes } from '@nestjs/common';
import { ChatService } from './chat.service';
import { Chat } from './schemas/chat.schema';
import { CreateChatDto } from './dto/create-chat.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post(':userId')
  @UsePipes(new ValidationPipe())
  async createChat(
    @Param('userId') userId: string,
    @Body('message') message: string,
  ): Promise<Chat> {
    const createChatDto: CreateChatDto = { userId, message };
    return this.chatService.createChat(createChatDto);
  }

  @Get(':userId/history')
  async getChatHistory(@Param('userId') userId: string): Promise<Chat[]> {
    return this.chatService.getChatHistory(userId);
  }
} 