import { Request, Response } from 'express';
import { DeviceService } from '../services/DeviceService';
import { parseId } from '../utils/parseId';

const deviceService = new DeviceService();

export class DeviceController {
    static async getAll(req: Request, res: Response) {
        try {
            const userId = req.query.userId ? parseInt(req.query.userId as string) : undefined;
            const devices = await deviceService.findAll(userId);
            res.json(devices);
        } catch (error: any) {
            console.error('Error en DeviceController.getAll:', error);
            res.status(500).json({ error: 'Error obteniendo dispositivos', details: error.message });
        }
    }

    static async getById(req: Request, res: Response) {
        try {
            const id = parseId(req.params.id);
            if (id === null) {
                return res.status(400).json({ error: 'ID inválido' });
            }
            const device = await deviceService.findById(id);
            if (!device) {
                return res.status(404).json({ error: 'Dispositivo no encontrado' });
            }
            res.json(device);
        } catch (error: any) {
            console.error('Error en DeviceController.getById:', error);
            res.status(500).json({ error: 'Error obteniendo dispositivo', details: error.message });
        }
    }

    static async create(req: Request, res: Response) {
        try {
            const device = await deviceService.create(req.body);
            res.status(201).json(device);
        } catch (error: any) {
            console.error('Error en DeviceController.create:', error);
            res.status(400).json({ error: 'Error creando dispositivo', details: error.message });
        }
    }

    static async update(req: Request, res: Response) {
        try {
            const id = parseId(req.params.id);
            if (id === null) {
                return res.status(400).json({ error: 'ID inválido' });
            }
            const device = await deviceService.update(id, req.body);
            if (!device) {
                return res.status(404).json({ error: 'Dispositivo no encontrado' });
            }
            res.json(device);
        } catch (error: any) {
            console.error('Error en DeviceController.update:', error);
            res.status(500).json({ error: 'Error actualizando dispositivo', details: error.message });
        }
    }

    static async delete(req: Request, res: Response) {
        try {
            const id = parseId(req.params.id);
            if (id === null) {
                return res.status(400).json({ error: 'ID inválido' });
            }
            const deleted = await deviceService.delete(id);
            if (!deleted) {
                return res.status(404).json({ error: 'Dispositivo no encontrado' });
            }
            res.status(204).send();
        } catch (error: any) {
            console.error('Error en DeviceController.delete:', error);
            res.status(500).json({ error: 'Error eliminando dispositivo', details: error.message });
        }
    }
}