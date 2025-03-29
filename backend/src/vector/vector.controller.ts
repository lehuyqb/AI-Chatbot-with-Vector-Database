import { Controller, Post, Body } from '@nestjs/common';
import { VectorService } from './vector.service';

@Controller('vector')
export class VectorController {
  constructor(private readonly vectorService: VectorService) {}

  @Post('add')
  async addText(@Body() body: { text: string; metadata?: any }) {
    return this.vectorService.addText(body.text, body.metadata);
  }

  @Post('search')
  async searchSimilar(@Body() body: { query: string; k?: number }) {
    return this.vectorService.searchSimilar(body.query, body.k);
  }
} 