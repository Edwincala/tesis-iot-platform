import { UserRepository } from '../repositories/UserRepository';

export class UserService {
    private repository = new UserRepository();

    async findAll() { return this.repository.findAll(); }
    async findById(id: number) { return this.repository.findById(id); }
    async create(data: any) { return this.repository.create(data); }
    async update(id: number, data: any) { return this.repository.update(id, data); }
    async delete(id: number) { return this.repository.delete(id); }
}