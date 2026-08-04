import { Request, Response } from 'express';
import { AuthService } from '../services/auth/AuthService';

const authService = new AuthService();

export class AuthController {
    /**
     * Registro de usuario
     */
    static async register(req: Request, res: Response) {
        try {
            const { username, email, password, full_name, company } = req.body;

            // Validaciones básicas
            if (!username || !email || !password) {
                return res.status(400).json({ 
                    error: 'Faltan campos obligatorios: username, email, password' 
                });
            }

            if (password.length < 6) {
                return res.status(400).json({ 
                    error: 'La contraseña debe tener al menos 6 caracteres' 
                });
            }

            const result = await authService.register({
                username,
                email,
                password,
                full_name,
                company,
                role: 'user',
                password_hash: '' // Se llena en el servicio
            });

            res.status(201).json({
                message: 'Usuario registrado exitosamente',
                user: result.user,
                token: result.token
            });
        } catch (error: any) {
            console.error('Error en registro:', error.message);
            res.status(400).json({ error: error.message });
        }
    }

    /**
     * Login de usuario
     */
    static async login(req: Request, res: Response) {
        try {
            const { username, password } = req.body;

            if (!username || !password) {
                return res.status(400).json({ 
                    error: 'Faltan campos obligatorios: username, password' 
                });
            }

            const result = await authService.login({ username, password });

            res.json({
                message: 'Login exitoso',
                user: result.user,
                token: result.token
            });
        } catch (error: any) {
            console.error('Error en login:', error.message);
            res.status(401).json({ error: error.message });
        }
    }

    /**
     * Obtener perfil del usuario autenticado
     */
    static async getProfile(req: Request, res: Response) {
        try {
            // El usuario ya está en req.user gracias al middleware
            const user = (req as any).user;
            res.json({
                user: user,
                message: 'Perfil obtenido exitosamente'
            });
        } catch (error: any) {
            console.error('Error en getProfile:', error.message);
            res.status(500).json({ error: 'Error obteniendo perfil' });
        }
    }

    /**
     * Verificar token (para validar en frontend)
     */
    static async verifyToken(req: Request, res: Response) {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader) {
                return res.status(401).json({ error: 'No se proporcionó token' });
            }

            const parts = authHeader.split(' ');
            if (parts.length !== 2 || parts[0] !== 'Bearer') {
                return res.status(401).json({ error: 'Formato de token inválido' });
            }

            const token = parts[1];
            const user = await authService.validateToken(token);

            res.json({
                valid: true,
                user: user,
                message: 'Token válido'
            });
        } catch (error: any) {
            res.status(401).json({ 
                valid: false, 
                error: error.message 
            });
        }
    }
}