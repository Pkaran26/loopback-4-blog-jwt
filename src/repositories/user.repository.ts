import {DefaultCrudRepository} from '@loopback/repository';
import {User, UserRelations} from '../models';
import {Lb4BlogDataSource} from '../datasources';
import {inject} from '@loopback/core';

export type Credentials = {
  email: string,
  password: string
}

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id,
  UserRelations
> {
  constructor(
    @inject('datasources.lb4_blog') dataSource: Lb4BlogDataSource,
  ) {
    super(User, dataSource);
  }
}
