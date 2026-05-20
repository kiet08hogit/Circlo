import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    // This function finds a user, or creates one if they don't exist yet!
    async syncUser(clerkUserId: string, email: string) {
        let user = await this.prisma.user.findUnique({
            where: { clerkUserId },
        });

        if (!user) {
            user = await this.prisma.user.create({
                data: { 
                    clerkUserId,
                    email,
                },
            });
        }

    return user;
    }

    async getUserById(id: string) {
        return this.prisma.user.findUnique({ where: { id } });
    }

    async updateUser(userId: string, updateData: any) {
        return this.prisma.user.update({
            where: { id: userId },
            data: updateData,
        });
    }

}
