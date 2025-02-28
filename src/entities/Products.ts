import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from "typeorm";
import { Branch } from "./Branches";

@Entity("products")
export class Product {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 200, nullable: false })
  name: string;

  @Column({ type: "int", nullable: false })
  amount: number;

  @Column({ type: "varchar", length: 200, nullable: false })
  description: string;

  @Column({ type: "varchar", length: 200, nullable: true })
  url_cover: string;

  @ManyToOne(() => Branch)
  @JoinColumn({ name: "branch_id" })
  branch: Branch;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
