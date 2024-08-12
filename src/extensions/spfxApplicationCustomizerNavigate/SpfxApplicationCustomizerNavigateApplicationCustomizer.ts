import { Log } from '@microsoft/sp-core-library';
import {
  BaseApplicationCustomizer
} from '@microsoft/sp-application-base';

import { override } from '@microsoft/decorators';
//import { SearchPage } from './SearchPage';
import { ILoggingService, SPFxLoggingService } from '../../services/LoggingService';
import { ITelemetryService, TelemetryService } from '../../services/TelemetryService';
import { AadApiServiceBaseConfiguration } from '../../services/AadApiServiceBase';

export interface ISpfxApplicationCustomizerNavigateApplicationCustomizerProperties {
  testMessage: string;
}

/** A Custom Action which can be run during execution of a Client Side Application */
export default class SpfxApplicationCustomizerNavigateApplicationCustomizer
  extends BaseApplicationCustomizer<ISpfxApplicationCustomizerNavigateApplicationCustomizerProperties> {

  private LOG_SOURCE: string = SpfxApplicationCustomizerNavigateApplicationCustomizer.name;

  private currentPage : string = '';

  private loggingService: ILoggingService;
  
  private telemetryService: ITelemetryService;

  private telemetryService2: ITelemetryService;

  public async onInit(): Promise<void> {
    Log.info(this.LOG_SOURCE, `Initializing ${SpfxApplicationCustomizerNavigateApplicationCustomizer.name}`);

    this.log('onInit - 1');
    // todo: at some point determine if appropriate to call super.onInit() and whether to call it first or last
    // await super.onInit();
    
    this.log('onInit - 2');
    await new Promise<void>((resolve) => {
      this.context.serviceScope.whenFinished(() => {
        this.loggingService = this.context.serviceScope.consume(SPFxLoggingService.serviceKey).withSource(this.LOG_SOURCE);
        this.telemetryService = this.context.serviceScope.consume(TelemetryService.serviceKey);
        resolve();
      });
    });

    this.log('onInit - 3');
    // this shows an example of instantiating services without using the serviceScope.whenFinished()
    const loggingService2 = new SPFxLoggingService(this.context.serviceScope, "SPFx Telemetry Customizer Telemetry Service");
    this.telemetryService2 = new TelemetryService(new AadApiServiceBaseConfiguration(this.context.aadHttpClientFactory, loggingService2));
    this.trackPageView2("https://foo.bar");

    this.context.application.navigatedEvent.add(this, () => {
      this.changeLocation(window.location.href, "navigatedEvent");
    });

    window.addEventListener("popstate", (event) => {
      this.changeLocation(window.location.href, "popstate");
    });

    this.log('onInit - 4');
    return Promise.resolve();
  }

  @override
  protected onDispose(): void {
    this.currentPage = '';
  }

  private changeLocation(href: string, from: string) : void {
    if (this.currentPage.toLowerCase() !== href.toLocaleLowerCase()) {
      this.currentPage = href.toLowerCase();
      //this.log(`${from} - ${this.currentPage}`);

      //const searchPage = new SearchPage(this.currentPage);
      //if (searchPage.isSearchPage) {
        this.trackPageView(this.currentPage);
      //}
    }
  }

  private trackPageView(href: string): void {
    this.telemetryService.trackPageView(href)
    .then(() => { this.log('PageView:Success'); })
    .catch(() => { this.log('PageView:Failure') });
  }

  private trackPageView2(href: string): void {
    this.telemetryService2.trackPageView(href)
    .then(() => { this.log('PageView2:Success'); })
    .catch(() => { this.log('PageView2:Failure') });
  }

  private log(message: string) : void {
    // provide a consistent message format to filter in browser console
    console.log(`${this.LOG_SOURCE} - ${(new Date()).toISOString()} - ${message}`);
    if (this.loggingService) {
      this.loggingService.info(message);
    }
    
  }

}
