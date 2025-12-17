import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	ParseIntPipe,
	Post,
	Put
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Employee } from './employee.entity';
import { CreateEmployeeDto, EmployeesService, UpdateEmployeeDto } from './employees.service';

@ApiTags('employees')
@Controller('employees')
export class EmployeesController {
  constructor(private readonly svc: EmployeesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all employees' })
  getAll(): Promise<Employee[]> {
    return this.svc.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get employee by id' })
  getOne(@Param('id', ParseIntPipe) id: number): Promise<Employee> {
    return this.svc.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new employee' })
  create(@Body() dto: CreateEmployeeDto): Promise<Employee> {
    return this.svc.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an employee' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateEmployeeDto
  ): Promise<Employee> {
    return this.svc.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an employee' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<{ deleted: boolean }> {
    await this.svc.remove(id);
    return { deleted: true };
  }
}
