import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument, UserRole } from './schemas/user.schema';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }

    async findAll(): Promise<User[]> {
        return this.userModel.find({ role: UserRole.PARTICIPANT }).select('-password -refreshToken').sort({ createdAt: -1 }).exec();
    }

    async findOne(id: string): Promise<User> {
        const user = await this.userModel.findById(id).select('-password -refreshToken').exec();
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        return user;
    }

    async updateProfile(id: string, data: Partial<User>): Promise<User> {
        // Prevent role update from profile endpoint
        delete data.role;
        delete data.password;
        delete data.refreshToken;

        const user = await this.userModel.findByIdAndUpdate(
            id,
            { $set: data },
            { new: true }
        ).select('-password -refreshToken').exec();

        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        return user;
    }

    async updatePassword(id: string, oldPass: string, newPass: string): Promise<void> {
        const user = await this.userModel.findById(id).exec();
        if (!user) {
            throw new NotFoundException('Utilisateur non trouvé');
        }

        const isMatch = await bcrypt.compare(oldPass, user.password);
        if (!isMatch) {
            throw new BadRequestException('Ancien mot de passe incorrect');
        }

        const hashedPassword = await bcrypt.hash(newPass, 10);
        await this.userModel.findByIdAndUpdate(id, { password: hashedPassword }).exec();
    }

    async remove(id: string): Promise<void> {
        const result = await this.userModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
    }
}
