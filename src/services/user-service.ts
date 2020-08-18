import { UserService } from "@loopback/authentication";
import { UserProfile } from "@loopback/security";
import { Credentials } from "../repositories/user.repository";
import { User } from "../models";
import {repository} from '@loopback/repository';
import {UserRepository} from '../repositories';
import { HttpErrors } from "@loopback/rest";
import { inject } from "@loopback/core";
import { BcryptHasher } from "../services/hash.password.bcrypt";

export class MyUserService implements UserService<User, Credentials>{
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @inject('service.hasher')
    public hasher: BcryptHasher,
  ){}

  async verifyCredentials(credentials: Credentials): Promise<User>{
    const foundUser = await this.userRepository.findOne({
      where: {
        email: credentials.email
      }
    });
    if(!foundUser){
      throw new HttpErrors.NotFound('user does not found')
    }
    const passwordMatched = await this.hasher.comparePassword(
      credentials.password,
      foundUser.password
    )

    if(!passwordMatched){
      throw new HttpErrors.Unauthorized('password in not valid')
    }
    return foundUser
  }

  convertToUserProfile(
    user: User
  ): any /*UserProfile*/{

    let userName = ''
    if(user.fname){
      userName = user.fname
    }
    if(user.lname){
      userName = user.fname?
      `${ user.fname } ${ user.lname }` :
      user.lname
    }
    return { id: user.id, name: userName }
  }
}
