import { UserProfile } from "@loopback/security";
import { inject } from "@loopback/core";
import { promisify } from "util";
import { HttpErrors } from "@loopback/rest";
const jwt = require('jsonwebtoken');

const signAsync = promisify(jwt.sign)

export class JWTService {
  constructor(
    @inject('authentication.jwt.secret')
    public readonly jwtSecret: string,
    @inject('authentication.jwt.expiresIn')
    public readonly expiresIn: string,
  ){}
  async generateToken(userProfile: any /*UserProfile*/) : Promise<string>{
    if(!userProfile){
      throw new HttpErrors.Unauthorized('Error while generating token')
    }
    let token = '';
    try {
      token = await signAsync(userProfile, jwtSecret, {
        expiresIn: expiresIn
      })
    } catch (error) {
      throw new HttpErrors.Unauthorized('error generating token' + error);
    }
    return token;
  }
}
