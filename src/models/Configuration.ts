export interface Configuration {
  setting_key: string;
  value: string | null;
  description: string | null;
  updated_at: Date;
}

export interface UpdateConfigurationDto {
  value: string;
}
