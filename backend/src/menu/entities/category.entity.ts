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
import { Restaurant } from '../../restaurants/entities/restaurant.entity';
import { MenuItem } from 'src/menu/entities/menu-item.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  restaurantId: string;

  @Column({ length: 100 })
  name: string;

  @Column('text', { nullable: true })
  description: string;

  @Column('int', { default: 0 })
  @Index()
  displayOrder: number;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ default: true })
  isVisible: boolean;

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.categories, {
    onDelete: 'CASCADE',
  })
  restaurant: Restaurant;

  @OneToMany(() => MenuItem, (item) => item.category)
  menuItems: MenuItem[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
