import { Request } from "src/request/entities/request.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Context {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Request, { onDelete: 'CASCADE' })
  @JoinColumn()
  request: Request

  @Column()
  value: string
}