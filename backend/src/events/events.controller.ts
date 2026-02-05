import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Query,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('events')
export class EventsController {
    constructor(private readonly eventsService: EventsService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() createEventDto: CreateEventDto) {
        const event = await this.eventsService.create(createEventDto);
        return {
            message: 'Événement créé avec succès',
            event,
        };
    }

    @Get()
    async findAll(@Query('category') category?: string, @Query('status') status?: string) {
        if (category) {
            return this.eventsService.findByCategory(category);
        }
        if (status) {
            return this.eventsService.findByStatus(status);
        }
        return this.eventsService.findAll();
    }

    @Get('upcoming')
    async findUpcoming() {
        return this.eventsService.findUpcoming();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.eventsService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    async update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
        const event = await this.eventsService.update(id, updateEventDto);
        return {
            message: 'Événement mis à jour avec succès',
            event,
        };
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.NO_CONTENT)
    async remove(@Param('id') id: string) {
        await this.eventsService.remove(id);
    }
}
