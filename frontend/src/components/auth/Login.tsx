import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await login(username, password);
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.message || 'Error al iniciar sesión');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h1 style={styles.title}>🌐 Plataforma IoT</h1>
                <p style={styles.subtitle}>Iniciar sesión</p>

                {error && <div style={styles.error}>{error}</div>}

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.field}>
                        <label style={styles.label}>Usuario</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            style={styles.input}
                            placeholder="admin o demo"
                            required
                        />
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>Contraseña</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={styles.input}
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        style={styles.button}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Cargando...' : 'Iniciar sesión'}
                    </button>
                </form>

                <div style={styles.demoInfo}>
                    <p>👤 demo / demo123</p>
                    <p>👤 admin / admin123</p>
                </div>
            </div>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f0f2f5',
        fontFamily: 'Arial, sans-serif',
    },
    card: {
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '10px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '400px',
    },
    title: {
        textAlign: 'center' as const,
        margin: '0 0 8px 0',
        fontSize: '24px',
        color: '#333',
    },
    subtitle: {
        textAlign: 'center' as const,
        margin: '0 0 24px 0',
        color: '#666',
        fontSize: '16px',
    },
    error: {
        backgroundColor: '#fee',
        color: '#c00',
        padding: '10px',
        borderRadius: '5px',
        marginBottom: '16px',
        fontSize: '14px',
        textAlign: 'center' as const,
    },
    form: {
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '16px',
    },
    field: {
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '4px',
    },
    label: {
        fontSize: '14px',
        fontWeight: 'bold',
        color: '#555',
    },
    input: {
        padding: '10px 12px',
        border: '1px solid #ddd',
        borderRadius: '5px',
        fontSize: '16px',
        outline: 'none',
        transition: 'border-color 0.2s',
    },
    button: {
        padding: '12px',
        backgroundColor: '#4CAF50',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        fontSize: '16px',
        fontWeight: 'bold',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
    },
    demoInfo: {
        marginTop: '20px',
        paddingTop: '16px',
        borderTop: '1px solid #eee',
        fontSize: '14px',
        color: '#888',
        textAlign: 'center' as const,
    },
};

export default Login;