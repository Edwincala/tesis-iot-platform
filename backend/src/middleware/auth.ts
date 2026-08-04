import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth/AuthService';

const authService = new AuthService();

export interface AuthRequest extends Request {
    user?: any;
}

/**
 * Middleware para autenticar token JWT
 */
export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        // Obtener token del header Authorization
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ error: 'No se proporcionó token de autenticación' });
        }

        // Verificar formato: Bearer <token>
        const parts = authHeader.split(' ');
        if (parts.length !== 2 || parts[0] !== 'Bearer') {
            return res.status(401).json({ error: 'Formato de token inválido. Use: Bearer <token>' });
        }

        const token = parts[1];

        // Validar token y obtener usuario
        const user = await authService.validateToken(token);
        if (!user) {
            return res.status(401).json({ error: 'Token inválido o expirado' });
        }

        // Adjuntar usuario a la request
        req.user = user;
        next();
    } catch (error: any) {
        console.error('Error en autenticación:', error.message);
        return res.status(401).json({ error: error.message || 'Error de autenticación' });
    }
};