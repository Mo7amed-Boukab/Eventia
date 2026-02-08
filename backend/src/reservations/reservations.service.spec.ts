import { Test, TestingModule } from '@nestjs/testing';
import { ReservationsService } from './reservations.service';
import { getModelToken } from '@nestjs/mongoose';
import { Reservation, ReservationStatus } from './schemas/reservation.schema';
import { Event } from '../events/schemas/event.schema';
import { User } from '../users/schemas/user.schema';
import { PdfService } from './pdf.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('ReservationsService', () => {
    let service: ReservationsService;
    let mockResModel: any;
    let mockEventModel: any;

    beforeEach(async () => {
        mockResModel = {
            findById: jest.fn(),
            findOne: jest.fn(),
        };
        mockEventModel = {
            findById: jest.fn(),
            findByIdAndUpdate: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ReservationsService,
                { provide: getModelToken(Reservation.name), useValue: mockResModel },
                { provide: getModelToken(Event.name), useValue: mockEventModel },
                { provide: getModelToken(User.name), useValue: {} },
                { provide: PdfService, useValue: { generateTicket: jest.fn().mockResolvedValue(Buffer.from('pdf')) } },
            ],
        }).compile();

        service = module.get<ReservationsService>(ReservationsService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('confirm', () => {
        it('should confirm a pending reservation and increment event participants', async () => {
            const saveMock = jest.fn().mockResolvedValue({ status: ReservationStatus.CONFIRMED });
            const mockRes = {
                status: ReservationStatus.PENDING,
                eventId: 'event123',
                save: saveMock
            };
            mockResModel.findById.mockResolvedValue(mockRes);
            mockEventModel.findByIdAndUpdate.mockResolvedValue({});

            const result = await service.confirm('res123');

            expect(result.status).toBe(ReservationStatus.CONFIRMED);
            expect(saveMock).toHaveBeenCalled();
            expect(mockEventModel.findByIdAndUpdate).toHaveBeenCalledWith(
                'event123',
                { $inc: { participants: 1 } }
            );
        });

        it('should throw NotFoundException if reservation not found', async () => {
            mockResModel.findById.mockResolvedValue(null);
            await expect(service.confirm('res123')).rejects.toThrow(NotFoundException);
        });

        it('should throw BadRequestException if reservation is not pending', async () => {
            const mockRes = {
                status: ReservationStatus.CONFIRMED,
                eventId: 'event123',
            };
            mockResModel.findById.mockResolvedValue(mockRes);
            await expect(service.confirm('res123')).rejects.toThrow(BadRequestException);
        });
    });
});
