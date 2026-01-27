import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Category } from './category.entity';
import { Restaurant } from '../../restaurants/entities/restaurant.entity';
import { ItemAddon } from './item-addon.entity';
import { ItemSize } from './item-size.entity';

export enum MenuItemStatus {
  ACTIVE = 'ACTIVE',
  DRAFT = 'DRAFT',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
}

export enum SpiceLevel {
  MILD = 'MILD',
  MEDIUM = 'MEDIUM',
  HOT = 'HOT',
  EXTRA_HOT = 'EXTRA_HOT',
}

@Entity('menu_items')
export class MenuItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  restaurantId: string;

  @Column('uuid')
  categoryId: string;

  @Column({ length: 200 })
  @Index()
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column('text')
  description: string;

  @Column({ length: 255, nullable: true })
  shortDescription: string;

  @Column('decimal', { precision: 10, scale: 2 })
  basePrice: number;

  @Column({ nullable: true })
  imageUrl: string;

  @Column('jsonb', { default: [] })
  images: string[];

  @Column({
    type: 'enum',
    enum: MenuItemStatus,
    default: MenuItemStatus.DRAFT,
  })
  status: MenuItemStatus;

  @Column('int', { nullable: true })
  preparationTime: number;

  @Column('jsonb', { default: [] })
  dietaryTags: string[];

  @Column('jsonb', { default: [] })
  allergens: string[];

  @Column({
    type: 'enum',
    enum: SpiceLevel,
    nullable: true,
  })
  spiceLevel: SpiceLevel;

  @Column('jsonb', { default: [] })
  moodTags: string[];

  @Column('jsonb', { nullable: true })
  nutritionalInfo: object;

  @Column('text', { array: true, default: [] })
  ingredients: string[];

  @Column('int', { default: 0 })
  recommendationPriority: number;

  @Column('int', { default: 0 })
  orderCount: number;

  @Column('decimal', { precision: 3, scale: 2, default: 0 })
  rating: number;

  @Column('int', { default: 0 })
  reviewCount: number;

  @Column('timestamp', { nullable: true })
  availableFrom: Date;

  @Column('timestamp', { nullable: true })
  availableUntil: Date;

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.menuItems, {
    onDelete: 'CASCADE',
  })
  restaurant: Restaurant;

  @ManyToOne(() => Category, (category) => category.menuItems, {
    onDelete: 'CASCADE',
  })
  category: Category;

  @OneToMany(() => ItemSize, (size) => size.menuItem, { cascade: true })
  sizes: ItemSize[];

  @OneToMany(() => ItemAddon, (addon) => addon.menuItem, { cascade: true })
  addons: ItemAddon[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
