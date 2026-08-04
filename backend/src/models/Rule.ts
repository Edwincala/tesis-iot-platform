export interface Rule {
    id?: number;
    user_id: number;
    device_id: number;
    name: string;
    description?: string;
    condition_type: 'gt' | 'lt' | 'between' | 'changed';
    value_min?: number;
    value_max?: number;
    delta?: number;
    time_window?: number;
    action_type: 'email' | 'actuator' | 'notification' | 'webhook';
    action_target?: string;
    action_payload?: Record<string, any>;
    cooldown_seconds?: number;
    is_active?: boolean;
    created_at?: Date;
    updated_at?: Date;
    last_triggered?: Date;
    trigger_count?: number;
}

export interface RuleCreate extends Omit<Rule, 'id' | 'created_at' | 'updated_at'> {}
export interface RuleUpdate extends Partial<Omit<Rule, 'id' | 'created_at' | 'updated_at'>> {}