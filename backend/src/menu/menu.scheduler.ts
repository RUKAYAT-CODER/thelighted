import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, MoreThan } from 'typeorm';
import { MenuItem, MenuItemStatus } from './entities/menu-item.entity';

@Injectable()
export class MenuScheduler {
  constructor(
    @InjectRepository(MenuItem)
    private itemRepo: Repository<MenuItem>,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handleScheduledItems() {
    const now = new Date();

    // Activate items that should now be available
    await this.itemRepo.update(
      {
        status: MenuItemStatus.DRAFT,
        availableFrom: LessThan(now),
        availableUntil: MoreThan(now),
      },
      { status: MenuItemStatus.ACTIVE },
    );

    // Deactivate items that are no longer available
    await this.itemRepo.update(
      {
        status: MenuItemStatus.ACTIVE,
        availableUntil: LessThan(now),
      },
      { status: MenuItemStatus.OUT_OF_STOCK },
    );
  }
}
