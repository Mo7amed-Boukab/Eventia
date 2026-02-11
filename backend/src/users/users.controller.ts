import { Controller, Get, Patch, Delete, Param, Body, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserRole } from './schemas/user.schema';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get('me')
    getMe(@Request() req) {
        return this.usersService.findOne(req.user.userId);
    }

    @Patch('me')
    updateMe(@Request() req, @Body() body) {
        return this.usersService.updateProfile(req.user.userId, body);
    }

    @Patch('me/password')
    updateMyPassword(@Request() req, @Body() body) {
        const { oldPassword, newPassword } = body;
        return this.usersService.updatePassword(req.user.userId, oldPassword, newPassword);
    }

    @Get()
    @UseGuards(RolesGuard)
    @Roles(UserRole.ADMIN)
    findAll() {
        return this.usersService.findAll();
    }

    @Delete(':id')
    @UseGuards(RolesGuard)
    @Roles(UserRole.ADMIN)
    remove(@Param('id') id: string) {
        return this.usersService.remove(id);
    }
}
