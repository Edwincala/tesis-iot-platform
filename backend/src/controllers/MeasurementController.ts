import { Request, Response } from 'express';
import { MeasurementService } from '../services/MeasurementService';
import { parseId } from '../utils/parseId';

const measurementService = new MeasurementService();

export class MeasurementController {
    static async getAll(req: Request, res: Response) {
        try {
            const query = {
                device_id: req.query.deviceId ? parseInt(req.query.deviceId as string) : undefined,
                user_id: req.query.userId ? parseInt(req.query.userId as string) : undefined,
                limit: req.query.limit ? parseInt(req.query.limit as string) : 100,
                start_date: req.query.startDate ? new Date(req.query.startDate as string) : undefined,
                end_date: req.query.endDate ? new Date(req.query.endDate as string) : undefined,
            };
            const measurements = await measurementService.findAll(query);
            res.json(measurements);
        } catch (error: any) {
            console.error('Error en MeasurementController.getAll:', error);
            res.status(500).json({ error: 'Error obteniendo mediciones', details: error.message });
        }
    }

    static async getLatestByDevice(req: Request, res: Response) {
        try {
            const deviceId = parseId(req.params.deviceId);
            if (deviceId === null) {
                return res.status(400).json({ error: 'ID de dispositivo inválido' });
            }
            const limit = req.query.limit ? parseInt(req.query.limit as string) : 1;
            const measurements = await measurementService.findLatestByDevice(deviceId, limit);
            res.json(measurements);
        } catch (error: any) {
            console.error('Error en MeasurementController.getLatestByDevice:', error);
            res.status(500).json({ error: 'Error obteniendo últimas mediciones', details: error.message });
        }
    }

    static async getStatistics(req: Request, res: Response) {
        try {
            const deviceId = parseId(req.params.deviceId);
            if (deviceId === null) {
                return res.status(400).json({ error: 'ID de dispositivo inválido' });
            }
            const hours = req.query.hours ? parseInt(req.query.hours as string) : 24;
            const stats = await measurementService.getStatistics(deviceId, hours);
            res.json(stats);
        } catch (error: any) {
            console.error('Error en MeasurementController.getStatistics:', error);
            res.status(500).json({ error: 'Error obteniendo estadísticas', details: error.message });
        }
    }

    static async create(req: Request, res: Response) {
        try {
            const measurement = await measurementService.create(req.body);
            res.status(201).json(measurement);
        } catch (error: any) {
            console.error('Error en MeasurementController.create:', error);
            res.status(400).json({ error: 'Error creando medición', details: error.message });
        }
    }
}