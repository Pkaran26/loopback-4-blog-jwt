import { genSalt, hash, compare } from "bcryptjs";
import { inject } from "@loopback/core";

interface PasswordHasher<T = string> {
  hashPassword(password: T): Promise<T>;
  comparePassword(providedPass: T, storedass: T) : Promise<boolean>;
}

export class BcryptHasher implements PasswordHasher<string> {
  async comparePassword(providedPass: string, storedass: string): Promise<boolean>{
    const passwordMatched = await compare(providedPass, storedass)
    return passwordMatched
  }

  @inject('rounds')
  public readonly rounds: number;
  async hashPassword(password: string){
    const salt = await genSalt(this.rounds)
    return await hash(password, salt);
  }
}
