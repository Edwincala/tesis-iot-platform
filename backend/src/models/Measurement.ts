export interface Measurement {
    id?: number;
    device_id: number;
    user_id: number;
    value: number;
    timestamp?: Date;
    quality?: number;
    metadata?: Record<string, any>;
    is_anomaly?: boolean;
    predicted_value?: number;
    error_margin?: number;
}

export interface MeasurementCreate extends Omit<Measurement, 'id' | 'timestamp'> {
    device_id: number;
    user_id: number;
    value: number;
    timestamp?: Date;
    quality?: number;
    metadata?: Record<string, any>;
}
export interface MeasurementQuery {
    device_id?: number;
    user_id?: number;
    start_date?: Date;
    end_date?: Date;
    limit?: number;
    offset?: number;
}