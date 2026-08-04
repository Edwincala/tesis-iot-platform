import { Request, Response } from 'express';
import { UserService } from '../services/UserService';
import { parseId } from '../utils/parseId';

const userService = new UserService();

export class UserController {
    static async getAll(req: Request, res: Response) {
        try {
            const users = await userService.findAll();
            res.json(users);
        } catch (error: any) {
            console.error('Error en UserController.getAll:', error);
            res.status(500).json({ error: 'Error obteniendo usuarios', details: error.message });
        }
    }

    static async getById(req: Request, res: Response) {
        try {
            const id = parseId(req.params.id);
            if (id === null) {
                return res.status(400).json({ error: 'ID inválido' });
            }
            const user = await userService.findById(id);
            if (!user) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }
            res.json(user);
        } catch (error: any) {
            console.error('Error en UserController.getById:', error);
            res.status(500).json({ error: 'Error obteniendo usuario', details: error.message });
        }
    }

    static async create(req: Request, res: Response) {
        try {
            const user = await userService.create(req.body);
            res.status(201).json(user);
        } catch (error: any) {
            console.error('Error en UserController.create:', error);
            res.status(400).json({ error: 'Error creando usuario', details: error.message });
        }
    }

    static async update(req: Request, res: Response) {
        try {
            const id = parseId(req.params.id);
            if (id === null) {
                return res.status(400).json({ error: 'ID inválido' });
            }
            const user = await userService.update(id, req.body);
            if (!user) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }
            res.json(user);
        } catch (error: any) {
            console.error('Error en UserController.update:', error);
            res.status(500).json({ error: 'Error actualizando usuario', details: error.message });
        }
    }

    static async delete(req: Request, res: Response) {
        try {
            const id = parseId(req.params.id);
            if (id === null) {
                return res.status(400).json({ error: 'ID inválido' });
            }
            const deleted = await userService.delete(id);
            if (!deleted) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }
            res.status(204).send();
        } catch (error: any) {
            console.error('Error en UserController.delete:', error);
            res.status(500).json({ error: 'Error eliminando usuario', details: error.message });
        }
    }
}