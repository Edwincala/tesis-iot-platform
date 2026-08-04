import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../../repositories/UserRepository';
import { User, UserLogin, UserRegister } from '../../models/User';

export class AuthService {
    private userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository();
    }

    /**
     * Registro de nuevo usuario
     */
    async register(userData: UserRegister): Promise<{ user: any; token: string }> {
        try {
            // Verificar si el usuario ya existe
            const existingUser = await this.userRepository.findByUsername(userData.username);
            if (existingUser) {
                throw new Error('El nombre de usuario ya está en uso');
            }

            const existingEmail = await this.userRepository.findByEmail(userData.email);
            if (existingEmail) {
                throw new Error('El email ya está registrado');
            }

            // Hash de la contraseña
            const saltRounds = 10;
            const passwordHash = await bcrypt.hash(userData.password, saltRounds);

            // Crear usuario
            const user = await this.userRepository.create({
                ...userData,
                password_hash: passwordHash,
                role: userData.role || 'user'
            });

            // Generar token JWT
            const token = this.generateToken(user);

            return { user, token };
        } catch (error) {
            throw error;
        }
    }

    /**
     * Login de usuario
     */
    async login(credentials: UserLogin): Promise<{ user: any; token: string }> {
        try {
            // Buscar usuario por username
            const user = await this.userRepository.findByUsername(credentials.username);
            if (!user) {
                throw new Error('Usuario o contraseña incorrectos');
            }

            // Verificar contraseña
            const isValidPassword = await bcrypt.compare(credentials.password, user.password_hash);
            if (!isValidPassword) {
                throw new Error('Usuario o contraseña incorrectos');
            }

            // Actualizar último login
            await this.userRepository.updateLastLogin(user.id!);

            // Generar token JWT
            const token = this.generateToken(user);

            // Remover password_hash del objeto user
            const { password_hash, ...userWithoutPassword } = user;

            return { user: userWithoutPassword, token };
        } catch (error) {
            throw error;
        }
    }

    /**
     * Generar token JWT
     */
    private generateToken(user: any): string {
        const payload = {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role
        };

        return jwt.sign(
            payload,
            process.env.JWT_SECRET || 'supersecretkeyjwt123456789',
            {
                expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as any
            }
        );
    }

    /**
     * Verificar token JWT
     */
    verifyToken(token: string): any {
        try {
            return jwt.verify(token, process.env.JWT_SECRET || 'supersecretkeyjwt123456789');
        } catch (error) {
            throw new Error('Token inválido o expirado');
        }
    }

    /**
     * Validar token y devolver usuario
     */
    async validateToken(token: string): Promise<any> {
        try {
            const decoded = this.verifyToken(token);
            const user = await this.userRepository.findById(decoded.id);
            if (!user) {
                throw new Error('Usuario no encontrado');
            }
            const { password_hash, ...userWithoutPassword } = user;
            return userWithoutPassword;
        } catch (error) {
            throw error;
        }
    }
}