import {DefaultCrudRepository} from '@loopback/repository';
import {Post, PostRelations} from '../models';
import {Lb4BlogDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class PostRepository extends DefaultCrudRepository<
  Post,
  typeof Post.prototype.id,
  PostRelations
> {
  constructor(
    @inject('datasources.lb4_blog') dataSource: Lb4BlogDataSource,
  ) {
    super(Post, dataSource);
  }
}
