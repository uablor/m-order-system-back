export interface IBaseCommandService<TCreate, TUpdate> {
    create(dto: TCreate): Promise<{ id: number }>;
    update(id: number, dto: TUpdate): Promise<void>;
    delete(id: number): Promise<void>;
  }
  