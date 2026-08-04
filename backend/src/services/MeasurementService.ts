import { MeasurementRepository } from '../repositories/MeasurementRepository';

export class MeasurementService {
    private repository = new MeasurementRepository();

    async findAll(query: any) { return this.repository.findAll(query); }
    async create(data: any) { return this.repository.create(data); }
    async findLatestByDevice(deviceId: number, limit: number) { 
        return this.repository.findLatestByDevice(deviceId, limit); 
    }
    async getStatistics(deviceId: number, hours: number) { 
        return this.repository.getStatistics(deviceId, hours); 
    }
}