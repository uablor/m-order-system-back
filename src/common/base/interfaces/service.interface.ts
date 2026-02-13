import type { CurrentUserPayload } from 'src/common/decorators/current-user.decorator';

export interface IBaseCommandService<TCreate, TUpdate> {
  create(dto: TCreate): Promise<{ id: number }>;
  update(id: number, dto: TUpdate): Promise<void>;
  delete(id: number, currentUser: CurrentUserPayload | undefined): Promise<void>;
}
  