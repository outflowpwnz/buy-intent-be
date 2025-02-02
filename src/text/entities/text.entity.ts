import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Text {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  result: string;

  @Column()
  lang: string;

  @ManyToOne(() => User, (user) => user.id)
  user: User;
}
