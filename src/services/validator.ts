import * as isEmail from 'isemail'
import { Credentials } from "../repositories/user.repository";
import { HttpErrors } from "@loopback/rest";

export function validateCredentials(credentials: Credentials){
  if(!isEmail.validate(credentials.email)){
    throw new HttpErrors.UnprocessableEntity('invlid email')
  }

  if(credentials.password.length<8){
    throw new HttpErrors.UnprocessableEntity('pass length should be 8')
  }
}
