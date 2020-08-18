import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {Author, AuthorRelations, Post} from '../models';
import {Lb4BlogDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {PostRepository} from './post.repository';

export class AuthorRepository extends DefaultCrudRepository<
  Author,
  typeof Author.prototype.id,
  AuthorRelations
> {

  public readonly posts: HasManyRepositoryFactory<Post, typeof Author.prototype.id>;

  constructor(
    @inject('datasources.lb4_blog') dataSource: Lb4BlogDataSource, @repository.getter('PostRepository') protected postRepositoryGetter: Getter<PostRepository>,
  ) {
    super(Author, dataSource);
    this.posts = this.createHasManyRepositoryFactoryFor('posts', postRepositoryGetter,);
    this.registerInclusionResolver('posts', this.posts.inclusionResolver);
  }
}
