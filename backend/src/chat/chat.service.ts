import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chat, ChatDocument } from './schemas/chat.schema';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { VectorService } from '../vector/vector.service';
import { CreateChatDto } from './dto/create-chat.dto';

@Injectable()
export class ChatService {
  private readonly openai: OpenAI;
  private readonly logger = new Logger(ChatService.name);

  constructor(
    @InjectModel(Chat.name) private chatModel: Model<ChatDocument>,
    private configService: ConfigService,
    private vectorService: VectorService,
  ) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });
  }

  async createChat(createChatDto: CreateChatDto): Promise<Chat> {
    try {
      const { userId, message } = createChatDto;

      // Get relevant context from vector database
      const context = await this.vectorService.searchSimilar(message);
      const contextText = context.map(c => c.text).join('\n');

      // Prepare the prompt with context
      const prompt = contextText
        ? `Context:\n${contextText}\n\nUser: ${message}\nAssistant:`
        : `User: ${message}\nAssistant:`;

      // Generate response using OpenAI
      const completion = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a helpful AI assistant with access to previous conversation context. Use this context to provide more relevant and consistent responses."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 500,
      });

      const response = completion.choices[0].message.content;

      // Create new chat entry
      const chat = new this.chatModel({
        userId,
        message,
        response,
        context: context.map(c => c.text),
      });

      // Save to MongoDB
      await chat.save();

      // Add to vector database for future context
      await Promise.all([
        this.vectorService.addText(message, { userId, timestamp: new Date() }),
        this.vectorService.addText(response, { userId, timestamp: new Date(), isResponse: true })
      ]);

      return chat;
    } catch (error) {
      this.logger.error(`Error creating chat: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to process chat message');
    }
  }

  async getChatHistory(userId: string): Promise<Chat[]> {
    try {
      return await this.chatModel
        .find({ userId })
        .sort({ createdAt: -1 })
        .exec();
    } catch (error) {
      this.logger.error(`Error fetching chat history: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to fetch chat history');
    }
  }
} 