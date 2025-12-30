import { Controller, Get, Patch, Delete, Body, UseGuards, Request } from '@nestjs/common';
import { UsersService } from '../users.service';
import { JwtAuthGuard } from '../../common/jwt.guard';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { ChangePasswordDto } from '../dto/change-password.dto';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  async getProfile(@Request() req) {
    const user = await this.usersService.findById(req.user.id);
    if (!user) {
      return null;
    }
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  @Patch('me')
  async updateProfile(@Request() req, @Body() updateProfileDto: UpdateProfileDto) {
    const user = await this.usersService.updateProfile(req.user.id, updateProfileDto);
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  @Patch('me/password')
  async changePassword(@Request() req, @Body() changePasswordDto: ChangePasswordDto) {
    await this.usersService.changePassword(req.user.id, changePasswordDto);
    return { message: 'Contraseña actualizada exitosamente' };
  }

  @Delete('me')
  async deleteAccount(@Request() req, @Body() body: { password: string }) {
    await this.usersService.deleteAccount(req.user.id, body.password);
    return { message: 'Cuenta eliminada exitosamente' };
  }
}

