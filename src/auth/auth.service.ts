import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { IUser } from './auth.types';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  public async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findOne(email);

    if (user) {
      const isPwdEqual = await argon2.verify(user.password, password);
      if (isPwdEqual) {
        return user;
      }
    }
    throw new UnauthorizedException('Неверныая почта или пароль');
  }

  public async login(user: IUser) {
    const { id, email } = user;
    const token = this.sign(+id, email);
    return {
      id,
      email,
      token,
    };
  }

  public async register(register: RegisterDto) {
    if (register.password !== register.repeatPassword) {
      throw new BadRequestException('Введенные пароли не совпадают');
    }
    const user = await this.usersService.create(register);
    const token = this.sign(user.id, user.email);
    return {
      id: user.id,
      email: user.email,
      token,
    };
  }

  private sign(id: number, email: string) {
    return this.jwtService.sign({ id, email });
  }
}
