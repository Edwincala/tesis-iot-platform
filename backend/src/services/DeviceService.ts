import { DeviceRepository } from '../repositories/DeviceRepository';
import { Device, DeviceCreate, DeviceUpdate } from '../models/Device';

export class DeviceService {
    private repository = new DeviceRepository();

    async findAll(userId?: number) { return this.repository.findAll(userId); }
    async findById(id: number) { return this.repository.findById(id); }
    async create(data: any) { return this.repository.create(data); }
    async update(id: number, data: any) { return this.repository.update(id, data); }
    async delete(id: number) { return this.repository.delete(id); }
}