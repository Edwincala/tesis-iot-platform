import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { DeviceController } from '../controllers/DeviceController';
import { MeasurementController } from '../controllers/MeasurementController';
import { RuleController } from '../controllers/RuleController';
import { AuthController } from '../controllers/AuthController';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/rbac';

const router = Router();

// RUTAS PÚBLICAS (Sin autenticación)
router.post('/auth/register', AuthController.register);
router.post('/auth/login', AuthController.login);
router.post('/auth/verify', AuthController.verifyToken);

// RUTAS PROTEGIDAS (Requieren autenticación)
router.get('/auth/profile', authenticate, AuthController.getProfile);

// Usuarios
router.get('/users', authenticate, authorize('admin'), UserController.getAll);
router.get('/users/:id', authenticate, authorize('admin'), UserController.getById);
router.post('/users', authenticate, authorize('admin'), UserController.create);
router.put('/users/:id', authenticate, authorize('admin'), UserController.update);
router.delete('/users/:id', authenticate, authorize('admin'), UserController.delete);

// Dispositivos
router.get('/devices', authenticate, DeviceController.getAll);
router.get('/devices/:id', authenticate, DeviceController.getById);
router.post('/devices', authenticate, DeviceController.create);
router.put('/devices/:id', authenticate, DeviceController.update);
router.delete('/devices/:id', authenticate, authorize('admin'), DeviceController.delete);

// Mediciones
router.get('/measurements', authenticate, MeasurementController.getAll);
router.get('/measurements/latest/:deviceId', authenticate, MeasurementController.getLatestByDevice);
router.get('/measurements/statistics/:deviceId', authenticate, MeasurementController.getStatistics);
router.post('/measurements', authenticate, MeasurementController.create);

// Reglas
router.get('/rules', authenticate, RuleController.getAll);
router.get('/rules/active', authenticate, RuleController.getActive);
router.get('/rules/:id', authenticate, RuleController.getById);
router.post('/rules', authenticate, RuleController.create);
router.put('/rules/:id', authenticate, RuleController.update);
router.delete('/rules/:id', authenticate, RuleController.delete);

export default router;