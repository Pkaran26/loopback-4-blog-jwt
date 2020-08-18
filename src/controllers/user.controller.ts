import {repository} from '@loopback/repository';
import {UserRepository} from '../repositories';
import {post, getModelSchemaRef, requestBody} from '@loopback/rest';
import {User} from '../models';
import { validateCredentials } from "../services/validator";
import * as _ from 'lodash';
import { inject } from "@loopback/core";
import { BcryptHasher } from "../services/hash.password.bcrypt";
import { Credentials } from "../repositories/user.repository";
import { CredentialsRequestBody } from "../spec/user.controller.spec";
// Uncomment these imports to begin using these cool features!

// import {inject} from '@loopback/core';

export class UserController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @inject('service.hasher')
    public hasher: BcryptHasher
  ) {}

  @post('/signup', {
    responses: {
      '200': {
        description: 'User',
        content: {
          content: {'application/json': {schema: getModelSchemaRef(User)}},
        },
      },
    },
  })
  async signup(@requestBody() userData: User){
    validateCredentials(_.pick(userData, ['email', 'password']))
    userData.password = await this.hasher.hashPassword(userData.password)

    const savedUser = await this.userRepository.create(userData)
    delete savedUser.password
    return savedUser
  }

  @post('login', {
    responses: {
      '200': {
        description: 'Token',
        content: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  token: {
                    type: 'string'
                  }
                }
              }
            }
          },
        },
      },
    },
  })
  async login(
    @requestBody(CredentialsRequestBody) credentials: Credentials,
  ):  Promise<{token: string}> {
    return Promise.resolve({ token: '456d465sd4g'})
  }
}
