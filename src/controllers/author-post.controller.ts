import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  Author,
  Post,
} from '../models';
import {AuthorRepository} from '../repositories';

export class AuthorPostController {
  constructor(
    @repository(AuthorRepository) protected authorRepository: AuthorRepository,
  ) { }

  @get('/authors/{id}/posts', {
    responses: {
      '200': {
        description: 'Array of Author has many Post',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Post)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Post>,
  ): Promise<Post[]> {
    return this.authorRepository.posts(id).find(filter);
  }

  @post('/authors/{id}/posts', {
    responses: {
      '200': {
        description: 'Author model instance',
        content: {'application/json': {schema: getModelSchemaRef(Post)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Author.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Post, {
            title: 'NewPostInAuthor',
            exclude: ['id'],
            optional: ['authorId']
          }),
        },
      },
    }) post: Omit<Post, 'id'>,
  ): Promise<Post> {
    return this.authorRepository.posts(id).create(post);
  }

  @patch('/authors/{id}/posts', {
    responses: {
      '200': {
        description: 'Author.Post PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Post, {partial: true}),
        },
      },
    })
    post: Partial<Post>,
    @param.query.object('where', getWhereSchemaFor(Post)) where?: Where<Post>,
  ): Promise<Count> {
    return this.authorRepository.posts(id).patch(post, where);
  }

  @del('/authors/{id}/posts', {
    responses: {
      '200': {
        description: 'Author.Post DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Post)) where?: Where<Post>,
  ): Promise<Count> {
    return this.authorRepository.posts(id).delete(where);
  }
}
