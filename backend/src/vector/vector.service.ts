import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface VectorResponse {
  text: string;
  metadata: Record<string, any>;
  similarity: number;
}

@Injectable()
export class VectorService {
  private readonly vectorDbUrl: string;
  private readonly logger = new Logger(VectorService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.vectorDbUrl = this.configService.get<string>('VECTOR_DB_URL') || 'http://localhost:5000';
  }

  async addText(text: string, metadata: Record<string, any> = {}): Promise<void> {
    try {
      await firstValueFrom(
        this.httpService.post(`${this.vectorDbUrl}/add`, {
          text,
          metadata,
        }).pipe(
          catchError((error) => {
            this.logger.error(`Error adding text to vector database: ${error.message}`, error.stack);
            throw new InternalServerErrorException('Failed to add text to vector database');
          })
        )
      );
    } catch (error) {
      this.logger.error(`Error adding text to vector database: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to add text to vector database');
    }
  }

  async searchSimilar(query: string, k: number = 5): Promise<VectorResponse[]> {
    try {
      const response = await firstValueFrom(
        this.httpService.post<VectorResponse[]>(`${this.vectorDbUrl}/search`, {
          query,
          k,
        }).pipe(
          map(response => response.data),
          catchError((error) => {
            this.logger.error(`Error searching vector database: ${error.message}`, error.stack);
            throw new InternalServerErrorException('Failed to search vector database');
          })
        )
      );
      return response;
    } catch (error) {
      this.logger.error(`Error searching vector database: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to search vector database');
    }
  }
} 