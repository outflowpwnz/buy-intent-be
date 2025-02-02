import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './guards/local.auth.guard';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('register')
  getProfile(@Body() register: RegisterDto) {
    return this.authService.register(register);
  }
}
