export interface User {
    id: number;
    username: string;
    email: string;
    role: 'admin' | 'user' | 'viewer';
    full_name?: string;
    company?: string;
    created_at: string;
    last_login?: string;
    is_active: boolean;
}

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface RegisterData {
    username: string;
    email: string;
    password: string;
    full_name?: string;
    company?: string;
}

export interface AuthResponse {
    message: string;
    user: User;
    token: string;
}

export interface Device {
    id: number;
    device_id: string;
    user_id: number;
    name: string;
    device_type: 'sensor' | 'actuator' | 'gateway';
    variable: string;
    unit?: string;
    location?: string;
    mqtt_topic: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    last_reading?: string;
    last_value?: number;
    owner_username?: string;
}

export interface DeviceCreate {
    device_id: string;
    name: string;
    device_type: 'sensor' | 'actuator' | 'gateway';
    variable: string;
    unit?: string;
    location?: string;
    user_id?: number;
}

export interface Measurement {
    id: number;
    device_id: number;
    user_id: number;
    value: number;
    timestamp: string;
    quality: number;
    device_name?: string;
    variable?: string;
    unit?: string;
}

export interface MeasurementStats {
    total_readings: number;
    avg_value: number | null;
    min_value: number | null;
    max_value: number | null;
}

export interface Rule {
    id: number;
    user_id: number;
    device_id: number;
    name: string;
    description?: string;
    condition_type: 'gt' | 'lt' | 'between' | 'changed';
    value_min?: number;
    value_max?: number;
    action_type: 'email' | 'actuator' | 'notification';
    action_target?: string;
    is_active: boolean;
    created_at: string;
    device_name?: string;
    variable?: string;
    unit?: string;
}

export interface RuleCreate {
    name: string;
    device_id: number;
    condition_type: 'gt' | 'lt' | 'between' | 'changed';
    value_min?: number;
    value_max?: number;
    action_type: 'email' | 'actuator' | 'notification';
    action_target?: string;
    description?: string;
}