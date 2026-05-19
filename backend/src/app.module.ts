import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './database/prisma.module';
import { HealthModule } from './modules/health/health.module';
// You'll import your other modules (Health, Users, etc.) here later

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true, // This allows you to use ConfigService anywhere without importing the module
        }),
        PrismaModule,
        HealthModule

    ],
    controllers: [],
    providers: [],
})
export class AppModule { }
