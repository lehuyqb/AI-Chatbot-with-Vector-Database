import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ChatDocument = Chat & Document;

@Schema({ timestamps: true })
export class Chat {
  @Prop({ required: true, index: true })
  userId: string;

  @Prop({ required: true })
  message: string;

  @Prop({ required: true })
  response: string;

  @Prop({ type: [String], default: [] })
  context: string[];

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;
}

export const ChatSchema = SchemaFactory.createForClass(Chat); 