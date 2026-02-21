// backend/src/modules/admin/admin.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AuditLog } from './audit-log.entity';
import { AdminUser } from '../auth/admin-user.entity';
import { MenuItem } from '../menu/menu-item.entity';
import { ContactSubmission } from '../contact/contact-submission.entity';
import { AnalyticsEvent } from '../analytics/analytics-event.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AuditLog,
      AdminUser,
      MenuItem,
      ContactSubmission,
      AnalyticsEvent,
    ]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
