import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from './auth';

/**
 * Middleware para verificar roles
 * @param roles - Lista de roles permitidos
 */
export const authorize = (...roles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            // Verificar que el usuario esté autenticado
            if (!req.user) {
                return res.status(401).json({ error: 'Usuario no autenticado' });
            }

            // Verificar rol
            if (!roles.includes(req.user.role)) {
                return res.status(403).json({ 
                    error: 'No tienes permisos para realizar esta acción',
                    required: roles,
                    current: req.user.role
                });
            }

            next();
        } catch (error: any) {
            console.error('Error en autorización:', error.message);
            return res.status(403).json({ error: 'Error de autorización' });
        }
    };
};

/**
 * Middleware para verificar que el usuario es propietario del recurso
 * @param getResourceId - Función para obtener el ID del recurso de la request
 */
export const verifyOwnership = (getResourceId: (req: Request) => number) => {
    return async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Usuario no autenticado' });
            }

            // Si es admin, tiene acceso a todo
            if (req.user.role === 'admin') {
                return next();
            }

            const resourceId = getResourceId(req);
            // Aquí se puede implementar la lógica de verificación de propiedad
            // Por ejemplo, verificar que el device_id pertenece al usuario
            // Esto se implementará en cada controlador específico

            next();
        } catch (error: any) {
            console.error('Error en verifyOwnership:', error.message);
            return res.status(403).json({ error: 'No tienes acceso a este recurso' });
        }
    };
};