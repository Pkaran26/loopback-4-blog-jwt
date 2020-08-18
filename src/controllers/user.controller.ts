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
import { MyUserService } from "../services/user-service";
import { JWTService } from "../services/jwt-service";

export class UserController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @inject('service.hasher')
    public hasher: BcryptHasher,
    @inject('services.user.service')
    public userService: MyUserService,
    @inject('services.jwt.service')
    public jwtService: JWTService,
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
    const user = await this.userService.verifyCredentials(credentials);
    const userProfile = this.userService.convertToUserProfile(user)
    const token = await this.jwtService.generateToken(userProfile)
    return Promise.resolve({ token: token})
  }
}
