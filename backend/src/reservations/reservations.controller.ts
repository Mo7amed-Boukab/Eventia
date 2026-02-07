import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  Patch,
  Param,
} from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/schemas/user.schema';

@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Roles(UserRole.PARTICIPANT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  create(@Request() req, @Body() createReservationDto: CreateReservationDto) {
    return this.reservationsService.create(
      req.user.userId,
      createReservationDto,
    );
  }

  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  findAll() {
    return this.reservationsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  findMyReservations(@Request() req) {
    return this.reservationsService.findByUser(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('status/:eventId')
  async getStatus(@Request() req, @Param('eventId') eventId: string) {
    const reservation = await this.reservationsService.findOneByUserAndEvent(
      req.user.userId,
      eventId,
    );
    return { isReserved: !!reservation, reservation };
  }

  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id/confirm')
  confirm(@Param('id') id: string) {
    return this.reservationsService.confirm(id);
  }

  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id/reject')
  reject(@Param('id') id: string) {
    return this.reservationsService.reject(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/cancel')
  async cancel(@Request() req, @Param('id') id: string) {
    // If admin, they can cancel any reservation
    if (req.user.role === UserRole.ADMIN) {
      return this.reservationsService.cancel(id);
    }
    // If user, they can only cancel their own
    return this.reservationsService.cancelByUser(id, req.user.userId);
  }
}
