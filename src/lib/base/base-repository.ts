import { CreateOptions, DestroyOptions, FindOptions, UpdateOptions } from 'sequelize';
import { BaseModel } from './base-model';

export type RepositoryPaginationOptionsType = {
  page?: number;
  perPage?: number;
};
export type RepositoryFindOptionsType = FindOptions;
export type RepositoryCreateOptionsType = CreateOptions;
export type RepositoryUpdateOptionsType = UpdateOptions;
export type RepositoryDestroyOptionsType = DestroyOptions;

export abstract class BaseRepository<M extends BaseModel> {
  public abstract paginate(
    paginationOptions: RepositoryPaginationOptionsType,
    filters?: Partial<M>,
    options?: RepositoryFindOptionsType,
  ): Promise<{
    rows: M[];
    currentPage: number;
    perPage: number;
    total: number;
  }>;

  public abstract findAll(filters?: Partial<M>, options?: RepositoryFindOptionsType): Promise<M[]>;

  public abstract findOne(filters?: Partial<M>, options?: RepositoryFindOptionsType): Promise<M | null>;

  public abstract findOneOrFail(filters?: Partial<M>, options?: RepositoryFindOptionsType): Promise<M>;

  public abstract findByPk(id: number, options?: RepositoryFindOptionsType): Promise<M | null>;

  public abstract findByPkOrFail(id: number, options?: RepositoryFindOptionsType): Promise<M>;

  public abstract create(data: Partial<M>, options?: RepositoryCreateOptionsType): Promise<M>;

  public abstract update(id: number, data: Partial<M>, options?: RepositoryUpdateOptionsType): Promise<M>;

  public abstract delete(id: number, options?: RepositoryDestroyOptionsType): Promise<M>;
}
