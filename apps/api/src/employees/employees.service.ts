import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from './employee.entity';

export type CreateEmployeeDto = Partial<Employee>;
export type UpdateEmployeeDto = Partial<Employee>;

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private readonly repo: Repository<Employee>
  ) {}

  findAll(): Promise<Employee[]> {
    return this.repo.find();
  }

  async findOne(id: number): Promise<Employee> {
    const found = await this.repo.findOneBy({ EmployeeId: id } as any);
    if (!found) throw new NotFoundException(`Employee ${id} not found`);
    return found;
  }

  async create(dto: CreateEmployeeDto): Promise<Employee> {
    // The Chinook Employee table in this workspace doesn't auto-generate IDs.
    // For demo purposes generate a simple unique EmployeeId by taking
    // the current max EmployeeId and adding 1.
    const raw = await this.repo
      .createQueryBuilder('e')
      .select('MAX(e.EmployeeId)', 'max')
      .getRawOne();
    const max = raw && raw.max ? Number(raw.max) : 0;
    const newId = max + 1;

    const ent = this.repo.create({ ...(dto as any), EmployeeId: newId } as any) as unknown as Employee;
    const saved = await this.repo.save(ent);
    return saved as Employee;
  }

  async update(id: number, dto: UpdateEmployeeDto): Promise<Employee> {
    const existing = await this.findOne(id);
    const merged = this.repo.merge(existing, dto as any);
    return this.repo.save(merged);
  }

  async remove(id: number): Promise<void> {
    const res = await this.repo.delete({ EmployeeId: id } as any);
    if (res.affected === 0) throw new NotFoundException(`Employee ${id} not found`);
  }
}
