import {DefaultCrudRepository, repository, HasOneRepositoryFactory} from '@loopback/repository';
import {Category, CategoryRelations, Post} from '../models';
import {Lb4BlogDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {PostRepository} from './post.repository';

export class CategoryRepository extends DefaultCrudRepository<
  Category,
  typeof Category.prototype.id,
  CategoryRelations
> {

  public readonly post: HasOneRepositoryFactory<Post, typeof Category.prototype.id>;

  constructor(
    @inject('datasources.lb4_blog') dataSource: Lb4BlogDataSource, @repository.getter('PostRepository') protected postRepositoryGetter: Getter<PostRepository>,
  ) {
    super(Category, dataSource);
    this.post = this.createHasOneRepositoryFactoryFor('post', postRepositoryGetter);
    this.registerInclusionResolver('post', this.post.inclusionResolver);
  }
}
