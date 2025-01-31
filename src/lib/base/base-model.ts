import { DataFactory } from 'nestjs-seeder';
import { Attributes, FindAndCountOptions, FindOptions, Identifier, ModelStatic } from 'sequelize';
import { Model } from 'sequelize-typescript';
import { ModelNotFoundException } from '../exceptions/model-not-found.exception';

export abstract class BaseModel<
  TModelAttributes extends object = any,
  TCreationAttributes extends object = TModelAttributes,
> extends Model<TModelAttributes, TCreationAttributes> {
  public static async findOneOrFail<M extends Model>(this: ModelStatic<M>, options: FindOptions): Promise<M> {
    const model = await this.findOne(options);

    if (!model) {
      throw new ModelNotFoundException();
    }

    return model;
  }

  public static async findByPkOrFail<M extends Model>(
    this: ModelStatic<M>,
    identifier?: Identifier,
    options?: Omit<FindOptions<Attributes<M>>, 'where'>,
  ): Promise<M> {
    const model = await this.findByPk(identifier, options);

    if (!model) {
      throw new ModelNotFoundException();
    }

    return model;
  }

  public static async paginate<M extends Model>(
    this: ModelStatic<M>,
    options?: Omit<FindAndCountOptions<Attributes<M>>, 'limit' | 'offset'> & {
      page?: number;
      perPage?: number;
    },
  ): Promise<{ rows: M[]; currentPage: number; perPage: number; total: number }> {
    const page = options?.page ?? 1;
    const perPage = options?.perPage ?? 10;

    const { rows, count } = await this.findAndCountAll({
      ...options,
      offset: (page - 1) * perPage,
      limit: perPage,
    });

    return {
      rows,
      total: count,
      currentPage: page,
      perPage,
    };
  }

  public static factory(count: number, values?: Record<string, any>) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return DataFactory.createForClass(this as any).generate(count, values);
  }
}
