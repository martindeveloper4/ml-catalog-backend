import { ConfigurationRepository } from '../repositories/ConfigurationRepository';
import { Configuration, UpdateConfigurationDto } from '../models/Configuration';

const repo = new ConfigurationRepository();

export class ConfigurationService {
  async getAll(): Promise<Configuration[]> {
    return repo.findAll();
  }

  async update(key: string, dto: UpdateConfigurationDto): Promise<Configuration> {
    const existing = await repo.findByKey(key);
    if (!existing) throw { status: 404, message: `Setting "${key}" not found` };
    return (await repo.update(key, dto))!;
  }
}
