import { Injectable } from '@nestjs/common';

export interface IBaseCommandService<TCreate, TUpdate> {
  create(dto: TCreate): Promise<{ id: number }>;
  update(id: number, dto: TUpdate): Promise<void>;
  delete(id: number): Promise<void>;
}

@Injectable()
export abstract class BaseCommandService<TCreate, TUpdate> implements IBaseCommandService<TCreate, TUpdate> {
  abstract create(dto: TCreate): Promise<{ id: number }>;
  abstract update(id: number, dto: TUpdate): Promise<void>;
  abstract delete(id: number): Promise<void>;
}
