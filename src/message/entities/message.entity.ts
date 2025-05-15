import { Link } from 'src/link/entities/link.entity';
import { Request } from 'src/request/entities/request.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'boolean' })
  isWorkedOut: boolean

  @ManyToOne(() => Request, { onDelete: 'CASCADE' })
  @JoinColumn()
  request: Request

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User

  @ManyToOne(() => Link, { onDelete: 'CASCADE' })
  @JoinColumn()
  link: Link

  @Column()
  userName: string;

  @Column()
  userMessage: string;

  @Column()
  userMessageId: number;
}
