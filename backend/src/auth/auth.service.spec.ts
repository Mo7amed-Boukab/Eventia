import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getModelToken } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User, UserRole } from '../users/schemas/user.schema';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { MailService } from '../mail/mail.service';

jest.mock('bcrypt');

describe('AuthService', () => {
    let service: AuthService;
    let model: any;

    const mockUser = {
        _id: { toString: () => 'userId123' },
        email: 'test@example.com',
        password: 'hashedPassword',
        first_name: 'John',
        last_name: 'Doe',
        role: UserRole.PARTICIPANT,
        toObject: jest.fn().mockReturnValue({
            id: 'userId123',
            email: 'test@example.com',
            first_name: 'John',
            last_name: 'Doe',
            role: UserRole.PARTICIPANT,
        }),
    };

    const mockUserModel = {
        findOne: jest.fn(),
        findById: jest.fn(),
        findByIdAndUpdate: jest.fn(),
        create: jest.fn(),
        save: jest.fn(),
    };

    // Mock for the constructor
    function MockUserConstructor(dto: any) {
        return {
            ...dto,
            save: jest.fn().mockResolvedValue({
                ...dto,
                _id: { toString: () => 'userId123' },
                email: dto.email || 'test@example.com',
                role: dto.role || UserRole.PARTICIPANT,
            }),
        };
    }
    Object.assign(MockUserConstructor, mockUserModel);

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: getModelToken(User.name),
                    useValue: MockUserConstructor,
                },
                {
                    provide: JwtService,
                    useValue: {
                        signAsync: jest.fn().mockResolvedValue('mockToken'),
                    },
                },
                {
                    provide: ConfigService,
                    useValue: {
                        get: jest.fn().mockReturnValue('secret'),
                    },
                },
                {
                    provide: MailService,
                    useValue: {
                        sendWelcomeEmail: jest.fn().mockResolvedValue(undefined),
                    },
                },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
        model = module.get(getModelToken(User.name));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('register', () => {
        it('should throw ConflictException if email already exists', async () => {
            mockUserModel.findOne.mockResolvedValue(mockUser);
            await expect(service.register({ email: 'test@example.com' } as any)).rejects.toThrow(ConflictException);
        });

        it('should register a new user successfully', async () => {
            mockUserModel.findOne.mockResolvedValue(null);
            (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');

            const result = await service.register({
                email: 'new@example.com',
                password: 'password123',
                first_name: 'John',
                last_name: 'Doe',
            } as any);

            expect(result).toBeDefined();
            expect(result.access_token).toBe('mockToken');
        });
    });

    describe('login', () => {
        it('should throw UnauthorizedException for invalid email', async () => {
            mockUserModel.findOne.mockResolvedValue(null);
            await expect(service.login({ email: 'wrong@test.com', password: 'any' })).rejects.toThrow(UnauthorizedException);
        });

        it('should throw UnauthorizedException for invalid password', async () => {
            mockUserModel.findOne.mockResolvedValue(mockUser);
            (bcrypt.compare as jest.Mock).mockResolvedValue(false);

            await expect(service.login({ email: 'test@example.com', password: 'wrong' })).rejects.toThrow(UnauthorizedException);
        });

        it('should return tokens on valid login', async () => {
            mockUserModel.findOne.mockResolvedValue(mockUser);
            (bcrypt.compare as jest.Mock).mockResolvedValue(true);
            mockUserModel.findByIdAndUpdate.mockResolvedValue(null);

            const result = await service.login({ email: 'test@example.com', password: 'password123' });
            expect(result).toHaveProperty('access_token');
            expect(result.user.email).toBe(mockUser.email);
        });
    });
});
