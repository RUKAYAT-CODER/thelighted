import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { OperatingHours } from './entities/operating-hours.entity';
import { Restaurant } from './entities/restaurant.entity';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectRepository(Restaurant)
    private restaurantRepo: Repository<Restaurant>,
    @InjectRepository(OperatingHours)
    private hoursRepo: Repository<OperatingHours>,
  ) {}

  async create(
    createDto: CreateRestaurantDto,
    ownerId: string,
  ): Promise<Restaurant> {
    const slug = this.generateSlug(createDto.name);

    // Check slug uniqueness
    const existing = await this.restaurantRepo.findOne({ where: { slug } });
    if (existing) {
      throw new BadRequestException(
        'Restaurant with similar name already exists',
      );
    }

    const restaurant = this.restaurantRepo.create({
      ...createDto,
      slug,
      ownerId,
    });

    const saved = await this.restaurantRepo.save(restaurant);

    // Create default operating hours
    await this.createDefaultHours(saved.id);

    return this.findOne(saved.id);
  }

  async findAll(page = 1, limit = 20) {
    const [items, total] = await this.restaurantRepo.findAndCount({
      where: { isActive: true },
      relations: ['operatingHours'],
      skip: (page - 1) * limit,
      take: limit,
      order: { rating: 'DESC' },
    });

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Restaurant> {
    const restaurant = await this.restaurantRepo.findOne({
      where: { id },
      relations: ['operatingHours', 'categories'],
    });

    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }

    return restaurant;
  }

  async update(
    id: string,
    updateDto: UpdateRestaurantDto,
    userId: string,
  ): Promise<Restaurant> {
    const restaurant = await this.findOne(id);

    if (restaurant.ownerId !== userId) {
      throw new ForbiddenException('You are not the owner of this restaurant');
    }

    if (updateDto.name && updateDto.name !== restaurant.name) {
      const slug = this.generateSlug(updateDto.name);
      Object.assign(restaurant, { ...updateDto, slug });
    } else {
      Object.assign(restaurant, updateDto);
    }

    return this.restaurantRepo.save(restaurant);
  }

  async remove(id: string, userId: string): Promise<void> {
    const restaurant = await this.findOne(id);

    if (restaurant.ownerId !== userId) {
      throw new ForbiddenException('You are not the owner of this restaurant');
    }

    await this.restaurantRepo.remove(restaurant);
  }

  async updateStatus(
    id: string,
    isActive: boolean,
    userId: string,
  ): Promise<Restaurant> {
    const restaurant = await this.findOne(id);

    if (restaurant.ownerId !== userId) {
      throw new ForbiddenException('You are not the owner of this restaurant');
    }

    restaurant.isActive = isActive;
    return this.restaurantRepo.save(restaurant);
  }

  async getHours(id: string): Promise<OperatingHours[]> {
    return this.hoursRepo.find({
      where: { restaurantId: id },
      order: { dayOfWeek: 'ASC' },
    });
  }

  async updateHours(
    id: string,
    hours: Partial<OperatingHours>[],
    userId: string,
  ): Promise<OperatingHours[]> {
    const restaurant = await this.findOne(id);

    if (restaurant.ownerId !== userId) {
      throw new ForbiddenException('You are not the owner of this restaurant');
    }

    await this.hoursRepo.delete({ restaurantId: id });

    const newHours = hours.map((h) =>
      this.hoursRepo.create({ ...h, restaurantId: id }),
    );
    return this.hoursRepo.save(newHours);
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

  private async createDefaultHours(restaurantId: string): Promise<void> {
    const days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
    const hours = days.map((day) =>
      this.hoursRepo.create({
        restaurantId,
        dayOfWeek: day,
        openTime: day === 'SAT' || day === 'SUN' ? '10:00' : '09:00',
        closeTime: '21:00',
        isClosed: false,
      }),
    );

    await this.hoursRepo.save(hours);
  }
}
