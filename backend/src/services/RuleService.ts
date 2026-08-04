import { RuleRepository } from '../repositories/RuleRepository';
import { Rule, RuleCreate, RuleUpdate } from '../models/Rule';
import { DeviceService } from './DeviceService';
import { MeasurementService } from './MeasurementService';

export class RuleService {
    private repository = new RuleRepository();

    async findAll(userId?: number) { return this.repository.findAll(userId); }
    async findById(id: number) { return this.repository.findById(id); }
    async create(data: any) { return this.repository.create(data); }
    async update(id: number, data: any) { return this.repository.update(id, data); }
    async delete(id: number) { return this.repository.delete(id); }
    async findActiveRules() { return this.repository.findActiveRules(); }
}