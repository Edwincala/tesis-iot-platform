import { Request, Response } from 'express';
import { RuleService } from '../services/RuleService';
import { parseId } from '../utils/parseId';

const ruleService = new RuleService();

export class RuleController {
    static async getAll(req: Request, res: Response) {
        try {
            const userId = req.query.userId ? parseInt(req.query.userId as string) : undefined;
            const rules = await ruleService.findAll(userId);
            res.json(rules);
        } catch (error: any) {
            console.error('Error en RuleController.getAll:', error);
            res.status(500).json({ error: 'Error obteniendo reglas', details: error.message });
        }
    }

    static async getActive(req: Request, res: Response) {
        try {
            const rules = await ruleService.findActiveRules();
            res.json(rules);
        } catch (error: any) {
            console.error('Error en RuleController.getActive:', error);
            res.status(500).json({ error: 'Error obteniendo reglas activas', details: error.message });
        }
    }

    static async getById(req: Request, res: Response) {
        try {
            const id = parseId(req.params.id);
            if (id === null) {
                return res.status(400).json({ error: 'ID inválido' });
            }
            const rule = await ruleService.findById(id);
            if (!rule) {
                return res.status(404).json({ error: 'Regla no encontrada' });
            }
            res.json(rule);
        } catch (error: any) {
            console.error('Error en RuleController.getById:', error);
            res.status(500).json({ error: 'Error obteniendo regla', details: error.message });
        }
    }

    static async create(req: Request, res: Response) {
        try {
            const rule = await ruleService.create(req.body);
            res.status(201).json(rule);
        } catch (error: any) {
            console.error('Error en RuleController.create:', error);
            res.status(400).json({ error: 'Error creando regla', details: error.message });
        }
    }

    static async update(req: Request, res: Response) {
        try {
            const id = parseId(req.params.id);
            if (id === null) {
                return res.status(400).json({ error: 'ID inválido' });
            }
            const rule = await ruleService.update(id, req.body);
            if (!rule) {
                return res.status(404).json({ error: 'Regla no encontrada' });
            }
            res.json(rule);
        } catch (error: any) {
            console.error('Error en RuleController.update:', error);
            res.status(500).json({ error: 'Error actualizando regla', details: error.message });
        }
    }

    static async delete(req: Request, res: Response) {
        try {
            const id = parseId(req.params.id);
            if (id === null) {
                return res.status(400).json({ error: 'ID inválido' });
            }
            const deleted = await ruleService.delete(id);
            if (!deleted) {
                return res.status(404).json({ error: 'Regla no encontrada' });
            }
            res.status(204).send();
        } catch (error: any) {
            console.error('Error en RuleController.delete:', error);
            res.status(500).json({ error: 'Error eliminando regla', details: error.message });
        }
    }
}