import { ServiceKey, ServiceScope } from '@microsoft/sp-core-library';
import { AadApiClient, AadApiServiceBase, AadApiServiceBaseConfiguration } from './AadApiServiceBase';

export interface ITelemetryService {
  trackPageView(url: string): Promise<void>;
}


export class TelemetryService extends AadApiServiceBase implements ITelemetryService {

  public static readonly serviceKey: ServiceKey<ITelemetryService> = ServiceKey.create<ITelemetryService>('spfx-app:ITelemetryService', TelemetryService);

  constructor(init: ServiceScope | AadApiServiceBaseConfiguration) {
    super(init);
    this.client = AadApiClient.MyCoApiService;
    console.log('TelemetryService constructor');
  }


  public async trackPageView(url: string): Promise<void> {
    // Example of logging the page view to the console
    // console.log(`Page View: ${url}`);
    try {
      this.logger.info(`Page View (Logger): ${url}`);
    } catch(error) {
      console.error('trackPageView: error ' + error);
    }
    
    // Replace the above line with actual telemetry tracking logic.
    // For example, if using Application Insights:
    // appInsights.trackPageView({ name: pageName, uri: url, properties: properties });
    // await this.postJson("https://foo.bar/api/v1/telemetry", { page: url });
    return;
  }
}

