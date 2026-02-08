import { Test, TestingModule } from '@nestjs/testing';
import { EventsService } from './events.service';
import { getModelToken } from '@nestjs/mongoose';
import { Event } from './schemas/event.schema';
import { NotFoundException } from '@nestjs/common';

describe('EventsService', () => {
    let service: EventsService;
    let model: any;

    const mockEvent = {
        _id: 'eventId123',
        title: 'Gala Dinner',
        description: 'Luxury gala dinner',
        date: new Date('2025-12-31'),
        location: 'Paris',
        category: 'Gala',
        participants: 10,
        maxParticipants: 100,
    };

    const mockEventModel = {
        new: jest.fn().mockImplementation((dto) => ({
            ...dto,
            save: jest.fn().mockResolvedValue(mockEvent),
        })),
        constructor: jest.fn().mockImplementation((dto) => ({
            ...dto,
            save: jest.fn().mockResolvedValue(mockEvent),
        })),
        find: jest.fn(),
        findById: jest.fn(),
        findByIdAndUpdate: jest.fn(),
        findByIdAndDelete: jest.fn(),
        exec: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                EventsService,
                {
                    provide: getModelToken(Event.name),
                    useValue: mockEventModel,
                },
            ],
        }).compile();

        service = module.get<EventsService>(EventsService);
        model = module.get(getModelToken(Event.name));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('findAll', () => {
        it('should return an array of events', async () => {
            const events = [mockEvent];
            mockEventModel.find.mockReturnValue({
                sort: jest.fn().mockReturnValue({
                    exec: jest.fn().mockResolvedValue(events),
                }),
            });

            const result = await service.findAll();
            expect(result).toEqual(events);
        });
    });

    describe('findOne', () => {
        it('should return a single event', async () => {
            mockEventModel.findById.mockReturnValue({
                exec: jest.fn().mockResolvedValue(mockEvent),
            });

            const result = await service.findOne('eventId123');
            expect(result).toEqual(mockEvent);
        });

        it('should throw NotFoundException if event not found', async () => {
            mockEventModel.findById.mockReturnValue({
                exec: jest.fn().mockResolvedValue(null),
            });

            await expect(service.findOne('wrongId')).rejects.toThrow(NotFoundException);
        });
    });

    describe('remove', () => {
        it('should delete an event', async () => {
            mockEventModel.findByIdAndDelete.mockReturnValue({
                exec: jest.fn().mockResolvedValue(mockEvent),
            });

            await expect(service.remove('eventId123')).resolves.toBeUndefined();
        });

        it('should throw NotFoundException on delete if not found', async () => {
            mockEventModel.findByIdAndDelete.mockReturnValue({
                exec: jest.fn().mockResolvedValue(null),
            });

            await expect(service.remove('wrongId')).rejects.toThrow(NotFoundException);
        });
    });
});
