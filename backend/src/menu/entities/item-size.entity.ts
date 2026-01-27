import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { MenuItem } from './menu-item.entity';

@Entity('item_sizes')
export class ItemSize {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  menuItemId: string;

  @Column({ length: 50 })
  name: string;

  @Column('decimal', { precision: 10, scale: 2 })
  priceModifier: number;

  @Column({ default: false })
  isDefault: boolean;

  @Column('int', { default: 0 })
  displayOrder: number;

  @ManyToOne(() => MenuItem, (item) => item.sizes, { onDelete: 'CASCADE' })
  menuItem: MenuItem;
}
