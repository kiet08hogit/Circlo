import { Controller, Post, Req, Headers, BadRequestException, RawBodyRequest } from '@nestjs/common';
import { Request } from 'express';
import { Webhook } from 'svix';
import { UsersService } from '../users/users.service';

@Controller('webhooks')
export class WebhooksController {
    constructor(private readonly usersService: UsersService) {}

    @Post('clerk')
    async handleClerkWebhook(@Req() req: RawBodyRequest<Request>, @Headers() headers: any) {
        const payload = req.rawBody?.toString('utf8');
        if (!payload) {
            throw new BadRequestException('Missing raw body');
        }

        const svixHeaders = {
            'svix-id': headers['svix-id'],
            'svix-timestamp': headers['svix-timestamp'],
            'svix-signature': headers['svix-signature'],
        };

        const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET || '');
        let evt: any;

        try {
            evt = wh.verify(payload, svixHeaders);
        } catch (err) {
            console.error('[Webhook Error] Invalid signature', err);
            throw new BadRequestException('Invalid webhook signature');
        }

        const eventType = evt.type;

        // Sync Clerk deletion to Postgres
        if (eventType === 'user.deleted') {
            const { id } = evt.data;
            try {
                await this.usersService.deleteUserByClerkId(id);
                console.log(`[Webhook] User deleted: ${id}`);
            } catch (err: any) {
                // If user doesn't exist in our db yet, that's totally fine. Ignore P2025.
                if (err.code !== 'P2025') {
                    throw err;
                }
            }
        }

        return { success: true };
    }
}
