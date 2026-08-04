import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { deviceService, measurementService } from '../../services/api';
import { type Device, type Measurement } from '../../types';

const Dashboard: React.FC = () => {
    const { user, logout } = useAuth();
    const [devices, setDevices] = useState<Device[]>([]);
    const [latestMeasurements, setLatestMeasurements] = useState<Measurement[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const devicesRes = await deviceService.getAll();
            setDevices(devicesRes.data);

            // Cargar últimas mediciones para cada dispositivo
            const measurementsPromises = devicesRes.data
                .filter((d: Device) => d.device_type === 'sensor')
                .map((d: Device) => measurementService.getLatest(d.id, 1));
            
            const measurementsRes = await Promise.all(measurementsPromises);
            setLatestMeasurements(measurementsRes.map(r => r.data[0]).filter(Boolean));
        } catch (error) {
            console.error('Error cargando datos:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        window.location.href = '/login';
    };

    return (
        <div style={styles.container}>
            {/* Header */}
            <header style={styles.header}>
                <h1 style={styles.headerTitle}>📊 Dashboard IoT</h1>
                <div style={styles.headerRight}>
                    <span style={styles.userInfo}>👤 {user?.full_name || user?.username}</span>
                    <button onClick={handleLogout} style={styles.logoutButton}>
                        Cerrar sesión
                    </button>
                </div>
            </header>

            {/* Content */}
            <main style={styles.main}>
                {loading ? (
                    <p>Cargando datos...</p>
                ) : (
                    <>
                        {/* Devices Grid */}
                        <section style={styles.section}>
                            <h2 style={styles.sectionTitle}>📱 Dispositivos</h2>
                            <div style={styles.deviceGrid}>
                                {devices.map((device) => (
                                    <div key={device.id} style={styles.deviceCard}>
                                        <div style={styles.deviceIcon}>
                                            {device.device_type === 'sensor' ? '📡' : '⚙️'}
                                        </div>
                                        <h3 style={styles.deviceName}>{device.name}</h3>
                                        <p style={styles.deviceInfo}>
                                            {device.variable} {device.unit ? `(${device.unit})` : ''}
                                        </p>
                                        <p style={styles.deviceLocation}>📍 {device.location || 'Sin ubicación'}</p>
                                        <span style={{
                                            ...styles.deviceStatus,
                                            backgroundColor: device.is_active ? '#4CAF50' : '#f44336'
                                        }}>
                                            {device.is_active ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Latest Measurements */}
                        <section style={styles.section}>
                            <h2 style={styles.sectionTitle}>📊 Últimas Mediciones</h2>
                            {latestMeasurements.length > 0 ? (
                                <div style={styles.measurementGrid}>
                                    {latestMeasurements.map((m) => (
                                        <div key={m.id} style={styles.measurementCard}>
                                            <span style={styles.measurementValue}>{m.value}</span>
                                            <span style={styles.measurementUnit}>{m.unit}</span>
                                            <span style={styles.measurementDevice}>{m.device_name}</span>
                                            <span style={styles.measurementTime}>
                                                {new Date(m.timestamp).toLocaleTimeString()}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p style={styles.emptyMessage}>No hay mediciones disponibles</p>
                            )}
                        </section>
                    </>
                )}
            </main>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        minHeight: '100vh',
        backgroundColor: '#f0f2f5',
        fontFamily: 'Arial, sans-serif',
    },
    header: {
        backgroundColor: 'white',
        padding: '16px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    headerTitle: {
        margin: 0,
        fontSize: '24px',
        color: '#333',
    },
    headerRight: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
    },
    userInfo: {
        color: '#666',
        fontSize: '14px',
    },
    logoutButton: {
        padding: '8px 16px',
        backgroundColor: '#f44336',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '14px',
    },
    main: {
        padding: '24px',
        maxWidth: '1400px',
        margin: '0 auto',
    },
    section: {
        marginBottom: '32px',
    },
    sectionTitle: {
        fontSize: '20px',
        color: '#333',
        marginBottom: '16px',
    },
    deviceGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: '16px',
    },
    deviceCard: {
        backgroundColor: 'white',
        padding: '16px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        textAlign: 'center' as const,
    },
    deviceIcon: {
        fontSize: '32px',
        marginBottom: '8px',
    },
    deviceName: {
        margin: '8px 0',
        fontSize: '16px',
        color: '#333',
    },
    deviceInfo: {
        margin: '4px 0',
        fontSize: '14px',
        color: '#666',
    },
    deviceLocation: {
        margin: '4px 0',
        fontSize: '12px',
        color: '#999',
    },
    deviceStatus: {
        display: 'inline-block',
        padding: '4px 12px',
        borderRadius: '12px',
        color: 'white',
        fontSize: '12px',
        fontWeight: 'bold',
        marginTop: '8px',
    },
    measurementGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
        gap: '12px',
    },
    measurementCard: {
        backgroundColor: 'white',
        padding: '16px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        textAlign: 'center' as const,
    },
    measurementValue: {
        fontSize: '28px',
        fontWeight: 'bold',
        color: '#333',
        display: 'block',
    },
    measurementUnit: {
        fontSize: '14px',
        color: '#666',
        display: 'block',
    },
    measurementDevice: {
        fontSize: '12px',
        color: '#999',
        display: 'block',
        marginTop: '4px',
    },
    measurementTime: {
        fontSize: '11px',
        color: '#aaa',
        display: 'block',
        marginTop: '4px',
    },
    emptyMessage: {
        color: '#999',
        textAlign: 'center' as const,
        padding: '40px',
    },
};

export default Dashboard;