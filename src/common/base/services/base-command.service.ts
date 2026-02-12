import { Injectable } from '@nestjs/common';
import { IBaseCommandService } from '../interfaces/service.interface';


@Injectable()
export abstract class BaseCommandService<TCreate, TUpdate> implements IBaseCommandService<TCreate, TUpdate> {
  abstract create(dto: TCreate): Promise<{ id: number }>;
  abstract update(id: number, dto: TUpdate): Promise<void>;
  abstract delete(id: number): Promise<void>;
}
