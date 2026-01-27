import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/menu/entities/category.entity';
import { Restaurant } from 'src/restaurants/entities/restaurant.entity';
import { Repository, In } from 'typeorm';
import { BulkOperationDto } from './dto/bulk-operation.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { ReorderCategoriesDto } from './dto/reorder-categories.dto';
import { ItemAddon } from './entities/item-addon.entity';
import { ItemSize } from './entities/item-size.entity';
import { MenuItem, MenuItemStatus } from './entities/menu-item.entity';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(MenuItem)
    private itemRepo: Repository<MenuItem>,
    @InjectRepository(Category)
    private categoryRepo: Repository<Category>,
    @InjectRepository(ItemSize)
    private sizeRepo: Repository<ItemSize>,
    @InjectRepository(ItemAddon)
    private addonRepo: Repository<ItemAddon>,
    @InjectRepository(Restaurant)
    private restaurantRepo: Repository<Restaurant>,
  ) {}

  // Category methods
  async createCategory(
    restaurantId: string,
    dto: CreateCategoryDto,
    userId: string,
  ): Promise<Category> {
    await this.validateOwnership(restaurantId, userId);

    const category = this.categoryRepo.create({
      ...dto,
      restaurantId,
    });

    return this.categoryRepo.save(category);
  }

  async getCategories(restaurantId: string): Promise<Category[]> {
    return this.categoryRepo.find({
      where: { restaurantId, isVisible: true },
      order: { displayOrder: 'ASC' },
    });
  }

  async updateCategory(
    id: string,
    dto: Partial<CreateCategoryDto>,
    userId: string,
  ): Promise<Category> {
    const category = await this.categoryRepo.findOne({
      where: { id },
      relations: ['restaurant'],
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    await this.validateOwnership(category.restaurantId, userId);

    Object.assign(category, dto);
    return this.categoryRepo.save(category);
  }

  async deleteCategory(id: string, userId: string): Promise<void> {
    const category = await this.categoryRepo.findOne({ where: { id } });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    await this.validateOwnership(category.restaurantId, userId);
    await this.categoryRepo.remove(category);
  }

  async reorderCategories(
    dto: ReorderCategoriesDto,
    userId: string,
  ): Promise<Category[]> {
    const firstCategory = await this.categoryRepo.findOne({
      where: { id: dto.categories[0].categoryId },
    });

    if (!firstCategory) {
      throw new NotFoundException('Category not found');
    }

    await this.validateOwnership(firstCategory.restaurantId, userId);

    await this.categoryRepo.manager.transaction(async (manager) => {
      for (const cat of dto.categories) {
        await manager.update(Category, cat.categoryId, {
          displayOrder: cat.displayOrder,
        });
      }
    });

    return this.getCategories(firstCategory.restaurantId);
  }

  // Menu Item methods
  async createMenuItem(
    restaurantId: string,
    dto: CreateMenuItemDto,
    userId: string,
  ): Promise<MenuItem> {
    await this.validateOwnership(restaurantId, userId);

    const category = await this.categoryRepo.findOne({
      where: { id: dto.categoryId, restaurantId },
    });

    if (!category) {
      throw new BadRequestException(
        'Category not found or does not belong to this restaurant',
      );
    }

    const slug = this.generateSlug(dto.name);

    const item = this.itemRepo.create({
      ...dto,
      restaurantId,
      slug,
    });

    return this.itemRepo.save(item);
  }

  async getMenuItems(restaurantId: string, filters: any, page = 1, limit = 20) {
    const query = this.itemRepo
      .createQueryBuilder('item')
      .leftJoinAndSelect('item.category', 'category')
      .leftJoinAndSelect('item.sizes', 'sizes')
      .leftJoinAndSelect('item.addons', 'addons')
      .where('item.restaurantId = :restaurantId', { restaurantId });

    if (filters.category) {
      query.andWhere('item.categoryId = :categoryId', {
        categoryId: filters.category,
      });
    }

    if (filters.status) {
      query.andWhere('item.status = :status', { status: filters.status });
    }

    if (filters.search) {
      query.andWhere(
        '(item.name ILIKE :search OR item.description ILIKE :search)',
        { search: `%${filters.search}%` },
      );
    }

    if (filters.dietary && filters.dietary.length > 0) {
      query.andWhere('item.dietaryTags && :tags', { tags: filters.dietary });
    }

    if (filters.priceMin) {
      query.andWhere('item.basePrice >= :priceMin', {
        priceMin: filters.priceMin,
      });
    }

    if (filters.priceMax) {
      query.andWhere('item.basePrice <= :priceMax', {
        priceMax: filters.priceMax,
      });
    }

    if (filters.mood && filters.mood.length > 0) {
      query.andWhere('item.moodTags && :moodTags', { moodTags: filters.mood });
    }

    const sortField = filters.sort || 'createdAt';
    const sortOrder = filters.order || 'DESC';
    query.orderBy(`item.${sortField}`, sortOrder);

    query.skip((page - 1) * limit).take(limit);

    const [items, total] = await query.getManyAndCount();

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getMenuItem(id: string): Promise<MenuItem> {
    const item = await this.itemRepo.findOne({
      where: { id },
      relations: ['category', 'restaurant', 'sizes', 'addons'],
    });

    if (!item) {
      throw new NotFoundException('Menu item not found');
    }

    return item;
  }

  async updateMenuItem(
    id: string,
    dto: Partial<CreateMenuItemDto>,
    userId: string,
  ): Promise<MenuItem> {
    const item = await this.getMenuItem(id);
    await this.validateOwnership(item.restaurantId, userId);

    if (dto.categoryId) {
      const category = await this.categoryRepo.findOne({
        where: { id: dto.categoryId, restaurantId: item.restaurantId },
      });

      if (!category) {
        throw new BadRequestException('Category not found');
      }
    }

    Object.assign(item, dto);
    return this.itemRepo.save(item);
  }

  async deleteMenuItem(id: string, userId: string): Promise<void> {
    const item = await this.getMenuItem(id);
    await this.validateOwnership(item.restaurantId, userId);
    await this.itemRepo.remove(item);
  }

  async updateItemStatus(
    id: string,
    status: MenuItemStatus,
    userId: string,
  ): Promise<MenuItem> {
    const item = await this.getMenuItem(id);
    await this.validateOwnership(item.restaurantId, userId);

    item.status = status;
    return this.itemRepo.save(item);
  }

  async bulkOperation(
    dto: BulkOperationDto,
    userId: string,
  ): Promise<{ success: number; failed: number }> {
    const items = await this.itemRepo.find({
      where: { id: In(dto.itemIds) },
    });

    if (items.length === 0) {
      throw new BadRequestException('No items found');
    }

    const restaurantId = items[0].restaurantId;
    if (!items.every((item) => item.restaurantId === restaurantId)) {
      throw new BadRequestException(
        'All items must belong to the same restaurant',
      );
    }

    await this.validateOwnership(restaurantId, userId);

    let success = 0;
    let failed = 0;

    await this.itemRepo.manager.transaction(async (manager) => {
      for (const item of items) {
        try {
          switch (dto.operation) {
            case 'UPDATE_STATUS':
              item.status = dto.operationData.status;
              break;
            case 'UPDATE_PRICE':
              if (dto.operationData.type === 'percentage') {
                item.basePrice = Number(
                  (
                    item.basePrice *
                    (1 + dto.operationData.value / 100)
                  ).toFixed(2),
                );
              } else {
                item.basePrice = Number(
                  (item.basePrice + dto.operationData.value).toFixed(2),
                );
              }
              break;
            case 'UPDATE_CATEGORY':
              item.categoryId = dto.operationData.categoryId;
              break;
            case 'DELETE':
              await manager.remove(item);
              success++;
              continue;
          }
          await manager.save(item);
          success++;
        } catch (error) {
          console.error(error);
          failed++;
        }
      }
    });

    return { success, failed };
  }

  // Size and Addon methods
  async addSize(itemId: string, dto: any, userId: string): Promise<ItemSize[]> {
    const item = await this.getMenuItem(itemId);
    await this.validateOwnership(item.restaurantId, userId);

    const size = this.sizeRepo.create({ ...dto, menuItemId: itemId });
    return await this.sizeRepo.save(size);
  }

  async updateSize(id: string, dto: any, userId: string): Promise<ItemSize> {
    const size = await this.sizeRepo.findOne({
      where: { id },
      relations: ['menuItem'],
    });

    if (!size) {
      throw new NotFoundException('Size not found');
    }

    await this.validateOwnership(size.menuItem.restaurantId, userId);

    Object.assign(size, dto);
    return this.sizeRepo.save(size);
  }

  async deleteSize(id: string, userId: string): Promise<void> {
    const size = await this.sizeRepo.findOne({
      where: { id },
      relations: ['menuItem'],
    });

    if (!size) {
      throw new NotFoundException('Size not found');
    }

    await this.validateOwnership(size.menuItem.restaurantId, userId);
    await this.sizeRepo.remove(size);
  }

  async addAddon(
    itemId: string,
    dto: any,
    userId: string,
  ): Promise<ItemAddon[]> {
    const item = await this.getMenuItem(itemId);
    await this.validateOwnership(item.restaurantId, userId);

    const addon = this.addonRepo.create({ ...dto, menuItemId: itemId });
    return this.addonRepo.save(addon);
  }

  async updateAddon(id: string, dto: any, userId: string): Promise<ItemAddon> {
    const addon = await this.addonRepo.findOne({
      where: { id },
      relations: ['menuItem'],
    });

    if (!addon) {
      throw new NotFoundException('Addon not found');
    }

    await this.validateOwnership(addon.menuItem.restaurantId, userId);

    Object.assign(addon, dto);
    return this.addonRepo.save(addon);
  }

  async deleteAddon(id: string, userId: string): Promise<void> {
    const addon = await this.addonRepo.findOne({
      where: { id },
      relations: ['menuItem'],
    });

    if (!addon) {
      throw new NotFoundException('Addon not found');
    }

    await this.validateOwnership(addon.menuItem.restaurantId, userId);
    await this.addonRepo.remove(addon);
  }

  private async validateOwnership(
    restaurantId: string,
    userId: string,
  ): Promise<void> {
    const restaurant = await this.restaurantRepo.findOne({
      where: { id: restaurantId },
    });

    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }

    if (restaurant.ownerId !== userId) {
      throw new ForbiddenException('You are not the owner of this restaurant');
    }
  }

  private generateSlug(name: string): string {
    return (
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '') +
      '-' +
      Date.now().toString(36)
    );
  }
}
