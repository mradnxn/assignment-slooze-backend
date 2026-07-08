import { Controller, Get, Post, Body, UseGuards, Request, HttpCode, HttpStatus, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from './auth.guard';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(
    @Body() signInDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.signIn(signInDto.email, signInDto.password);
    
    res.cookie('access_token', result.access_token, {
      httpOnly: true,
      secure: false, // Set to true in production HTTPS
      sameSite: 'lax',
      path: '/',
      maxAge: 3600 * 1000, // 1 hour
    });

    return {
      user: result.user,
    };
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token', {
      path: '/',
      sameSite: 'lax',
      httpOnly: true,
    });
    return { message: 'Logged out successfully' };
  }

  @Post('register')
  signUp(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }

  @UseGuards(AuthGuard)
  @Get('me')
  getProfile(@Request() req: any) {
    return req.user;
  }
}
