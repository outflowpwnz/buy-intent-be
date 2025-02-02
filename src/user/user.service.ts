import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import * as argon2 from 'argon2';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { RegisterDto } from 'src/auth/dto/register.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  private async checkEmailExist(email: string) {
    const existUser = await this.userRepository.findOneBy({
      email,
    });

    if (existUser) {
      throw new BadRequestException(
        'Пользователь с таким email уже существует',
      );
    }
  }

  public async create(registerDto: RegisterDto) {
    await this.checkEmailExist(registerDto.email);

    const user = await this.userRepository.save({
      email: registerDto.email,
      password: await argon2.hash(registerDto.password),
    });

    return user;
  }

  public async update(id: number, updateUserDto: UpdateUserDto) {
    await this.checkEmailExist(updateUserDto.email);

    const updatedUser = await this.userRepository.update({ id }, updateUserDto);

    return updatedUser;
  }

  public async remove(id: number) {
    const deletedUser = await this.userRepository.delete({ id });

    if (!deletedUser.affected) {
      throw new BadRequestException('Не удалось удалить пользователя');
    }
  }

  public async findOne(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }
}
