import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { DeviceController } from '../controllers/DeviceController';
import { MeasurementController } from '../controllers/MeasurementController';
import { RuleController } from '../controllers/RuleController';

const router = Router();

// Usuarios
router.get('/users', UserController.getAll);
router.get('/users/:id', UserController.getById);
router.post('/users', UserController.create);
router.put('/users/:id', UserController.update);
router.delete('/users/:id', UserController.delete);

// Dispositivos
router.get('/devices', DeviceController.getAll);
router.get('/devices/:id', DeviceController.getById);
router.post('/devices', DeviceController.create);
router.put('/devices/:id', DeviceController.update);
router.delete('/devices/:id', DeviceController.delete);

// Mediciones
router.get('/measurements', MeasurementController.getAll);
router.get('/measurements/latest/:deviceId', MeasurementController.getLatestByDevice);
router.get('/measurements/statistics/:deviceId', MeasurementController.getStatistics);
router.post('/measurements', MeasurementController.create);

// Reglas
router.get('/rules', RuleController.getAll);
router.get('/rules/active', RuleController.getActive);
router.get('/rules/:id', RuleController.getById);
router.post('/rules', RuleController.create);
router.put('/rules/:id', RuleController.update);
router.delete('/rules/:id', RuleController.delete);

export default router;