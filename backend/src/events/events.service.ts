import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event, EventDocument } from './schemas/event.schema';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventsService {
    constructor(
        @InjectModel(Event.name) private eventModel: Model<EventDocument>,
    ) { }

    async create(createEventDto: CreateEventDto): Promise<Event> {
        try {
            const createdEvent = new this.eventModel(createEventDto);
            return await createdEvent.save();
        } catch (error) {
            throw new BadRequestException('Erreur lors de la création de l\'événement');
        }
    }

    async findAll(): Promise<Event[]> {
        return await this.eventModel.find().sort({ date: 1 }).exec();
    }

    async findOne(id: string): Promise<Event> {
        const event = await this.eventModel.findById(id).exec();
        if (!event) {
            throw new NotFoundException(`Événement avec l'ID ${id} non trouvé`);
        }
        return event;
    }

    async update(id: string, updateEventDto: UpdateEventDto): Promise<Event> {
        const updatedEvent = await this.eventModel
            .findByIdAndUpdate(id, updateEventDto, { new: true })
            .exec();

        if (!updatedEvent) {
            throw new NotFoundException(`Événement avec l'ID ${id} non trouvé`);
        }

        return updatedEvent;
    }

    async remove(id: string): Promise<void> {
        const result = await this.eventModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new NotFoundException(`Événement avec l'ID ${id} non trouvé`);
        }
    }

    async findByCategory(category: string): Promise<Event[]> {
        return await this.eventModel.find({ category }).sort({ date: 1 }).exec();
    }

    async findByStatus(status: string): Promise<Event[]> {
        return await this.eventModel.find({ status }).sort({ date: 1 }).exec();
    }

    async findUpcoming(): Promise<Event[]> {
        const now = new Date();
        return await this.eventModel
            .find({ date: { $gte: now } })
            .sort({ date: 1 })
            .exec();
    }
}
