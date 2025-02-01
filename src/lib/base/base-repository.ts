import { CreateOptions, DestroyOptions, FindOptions, ModelStatic, UpdateOptions } from 'sequelize';
import { BaseModel } from './base-model';

export type RepositoryPaginationOptionsType = {
  page?: number;
  perPage?: number;
};
export type RepositoryFindOptionsType = FindOptions;
export type RepositoryCreateOptionsType = CreateOptions;
export type RepositoryUpdateOptionsType = Omit<UpdateOptions, 'where'>;
export type RepositoryDestroyOptionsType = DestroyOptions;

export abstract class BaseRepository<M extends BaseModel> {
  protected constructor(protected entityModel: ModelStatic<M> & typeof BaseModel) {}

  public paginate(
    paginationOptions: RepositoryPaginationOptionsType,
    filters?: Partial<M>,
    options?: RepositoryFindOptionsType,
  ): Promise<{ rows: M[]; currentPage: number; perPage: number; total: number }> {
    return this.entityModel.paginate({
      page: paginationOptions.page,
      perPage: paginationOptions.perPage,
      where: filters,
      include: options?.include,
      order: options?.order,
      transaction: options?.transaction,
    }) as Promise<{ rows: M[]; currentPage: number; perPage: number; total: number }>;
  }

  public findAll(filters?: Partial<M>, options?: RepositoryFindOptionsType): Promise<M[]> {
    return this.entityModel.findAll({
      where: filters,
      transaction: options?.transaction,
    }) as Promise<M[]>;
  }

  public findOne(filters?: Partial<M>, options?: RepositoryFindOptionsType): Promise<M | null> {
    return this.entityModel.findOne({
      where: filters,
      transaction: options?.transaction,
    }) as Promise<M | null>;
  }

  public findOneOrFail(filters?: Partial<M>, options?: RepositoryFindOptionsType): Promise<M> {
    return this.entityModel.findOneOrFail({
      where: filters,
      transaction: options?.transaction,
    }) as Promise<M>;
  }

  public findByPk(id: number, options?: RepositoryFindOptionsType): Promise<M | null> {
    return this.entityModel.findByPk(id, {
      transaction: options?.transaction,
    }) as Promise<M | null>;
  }

  public findByPkOrFail(id: number, options?: RepositoryFindOptionsType): Promise<M> {
    return this.entityModel.findByPkOrFail(id, {
      transaction: options?.transaction,
    }) as Promise<M>;
  }

  public create(data: Partial<M>, options?: RepositoryCreateOptionsType): Promise<M> {
    return this.entityModel.create(data, {
      transaction: options?.transaction,
    }) as Promise<M>;
  }

  public async update(id: number, data: Partial<M>, options?: RepositoryUpdateOptionsType): Promise<M> {
    const fetchedModel = await this.findByPkOrFail(id, options);

    await fetchedModel.update(data, { transaction: options?.transaction });

    return fetchedModel;
  }

  public async delete(id: number, options?: RepositoryDestroyOptionsType): Promise<M> {
    const fetchedModel = await this.findByPkOrFail(id, options);

    await fetchedModel.destroy({ transaction: options?.transaction });

    return fetchedModel;
  }
}
