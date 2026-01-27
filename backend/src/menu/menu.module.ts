import { Module } from '@nestjs/common';
import { MenuService } from './menu.service';
import { MenuController } from './menu.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Restaurant } from 'src/restaurants/entities/restaurant.entity';
import { Category } from './entities/category.entity';
import { ItemAddon } from './entities/item-addon.entity';
import { ItemSize } from './entities/item-size.entity';
import { MenuItem } from './entities/menu-item.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MenuItem,
      Category,
      ItemSize,
      ItemAddon,
      Restaurant,
    ]),
  ],
  controllers: [MenuController],
  providers: [MenuService],
})
export class MenuModule {}
