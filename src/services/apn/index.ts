import { injectable, inject } from "inversify";
import { Provider, Notification, Responses } from "apn";
import { ConstantNames, DEFAULT_ID } from "../../constants";
import { IConfig } from "../../config";

export interface IApn {
  sendTo(recipients: string | string[], note: Notification, provider?: string): Promise<Responses>;
}

/**
 * Apn service
 */
@injectable()
export class Apn implements IApn {
  private providers = new Map<string, Provider>();

  constructor(@inject(ConstantNames.Config) { apn }: IConfig) {
    if (!apn) {
      return;
    }

    if (apn.provider) {
      this.providers.set(DEFAULT_ID, new Provider(apn.provider));
    }

    if (apn.providers) {
      for (const { id, ...options } of apn.providers) {
        this.providers.set(id || DEFAULT_ID, new Provider(options));
      }
    }
  }

  public async sendTo(recipients: string | string[], note: Notification, provider?: string): Promise<Responses> {
    if (!provider) {
      provider = DEFAULT_ID;
    }

    if (!this.providers.has(provider)) {
      throw new Error(`Apn Provider ${provider} not found`);
    }

    return this.providers.get(provider).send(note, recipients);
  }
}
