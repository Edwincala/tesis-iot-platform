import mqtt from 'mqtt';

const MQTT_BROKER = process.env.MQTT_BROKER || 'mqtt://mosquitto:1883';

const client = mqtt.connect(MQTT_BROKER, {
    clientId: `backend_${Math.random().toString(16).slice(2, 10)}`,
    reconnectPeriod: 5000,
    connectTimeout: 30000,
});

client.on('connect', () => {
    console.log('✅ Conectado al broker MQTT');
});

client.on('error', (error) => {
    console.error('❌ Error MQTT:', error);
});

client.on('offline', () => {
    console.warn('⚠️ MQTT offline');
});

client.on('reconnect', () => {
    console.log('🔄 Intentando reconectar MQTT...');
});

export { client };