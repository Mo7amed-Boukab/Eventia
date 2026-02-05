import { IsString, IsNotEmpty, IsEnum, IsDateString, IsNumber, Min, IsOptional } from 'class-validator';
import { EventCategory, EventStatus } from '../schemas/event.schema';

export class CreateEventDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsEnum(EventCategory)
    @IsNotEmpty()
    category: EventCategory;

    @IsDateString()
    @IsNotEmpty()
    date: string;

    @IsString()
    @IsNotEmpty()
    time: string;

    @IsString()
    @IsNotEmpty()
    location: string;

    @IsNumber()
    @Min(0)
    @IsNotEmpty()
    price: number;

    @IsEnum(EventStatus)
    @IsOptional()
    status?: EventStatus;

    @IsString()
    @IsOptional()
    image?: string;

    @IsNumber()
    @IsOptional()
    @Min(0)
    maxParticipants?: number;
}
