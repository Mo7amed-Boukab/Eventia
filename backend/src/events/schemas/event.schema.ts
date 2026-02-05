import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EventDocument = Event & Document;

export enum EventCategory {
    FORMATION = 'Formation',
    WORKSHOP = 'Workshop',
    CONFERENCE = 'Conférence',
    NETWORKING = 'Networking',
}

export enum EventStatus {
    DRAFT = 'DRAFT',
    PUBLISHED = 'PUBLISHED',
    CANCELED = 'CANCELED',
}

@Schema({ timestamps: true })
export class Event {
    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    description: string;

    @Prop({
        type: String,
        enum: EventCategory,
        required: true,
    })
    category: EventCategory;

    @Prop({ required: true })
    date: Date;

    @Prop({ required: true })
    time: string;

    @Prop({ required: true })
    location: string;

    @Prop({ required: true, min: 0 })
    price: number;

    @Prop({
        type: String,
        enum: EventStatus,
        default: EventStatus.DRAFT,
    })
    status: EventStatus;

    @Prop({ required: false })
    image?: string;

    @Prop({ default: 0 })
    participants: number;

    @Prop({ default: 0 })
    maxParticipants: number;
}

export const EventSchema = SchemaFactory.createForClass(Event);
