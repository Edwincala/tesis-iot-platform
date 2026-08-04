export interface Device {
    id?: number;
    device_id: string;
    user_id: number;
    name: string;
    device_type: 'sensor' | 'actuator' | 'gateway';
    variable: string;
    unit?: string;
    location?: string;
    mqtt_topic: string;
    metadata?: Record<string, any>;
    is_active?: boolean;
    created_at?: Date;
    updated_at?: Date;
    last_reading?: Date;
    last_value?: number;
    min_value?: number;
    max_value?: number;
    avg_value?: number;
    reading_count?: number;
}

export interface DeviceCreate extends Omit<Device, 'id' | 'created_at' | 'updated_at'> {}
export interface DeviceUpdate extends Partial<Omit<Device, 'id' | 'created_at' | 'updated_at'>> {}