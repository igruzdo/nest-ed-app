import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from './report.entity';
import { Repository } from 'typeorm';
import { CreateReportDto } from './dtos/create-report.dto';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report) private repo: Repository<Report>
  ) {}

  public create(reportDto: CreateReportDto): Promise<Report> {
    const report = this.repo.create(reportDto);
    return this.repo.save(report);
  }
}
