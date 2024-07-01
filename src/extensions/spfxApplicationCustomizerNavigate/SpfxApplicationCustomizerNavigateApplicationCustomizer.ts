import { Log } from '@microsoft/sp-core-library';
import {
  BaseApplicationCustomizer
} from '@microsoft/sp-application-base';

import * as strings from 'SpfxApplicationCustomizerNavigateApplicationCustomizerStrings';
import { override } from '@microsoft/decorators';

const LOG_SOURCE: string = 'SpfxApplicationCustomizerNavigateApplicationCustomizer';

export interface ISpfxApplicationCustomizerNavigateApplicationCustomizerProperties {
  testMessage: string;
}

/** A Custom Action which can be run during execution of a Client Side Application */
export default class SpfxApplicationCustomizerNavigateApplicationCustomizer
  extends BaseApplicationCustomizer<ISpfxApplicationCustomizerNavigateApplicationCustomizerProperties> {

  private currentPage : string = '';

  public onInit(): Promise<void> {
    this.log('onInit');
    Log.info(LOG_SOURCE, `Initialized ${strings.Title}`);

    this.context.application.navigatedEvent.add(this, () => {
      this.changeLocation(window.location.href, "navigatedEvent");
    });

    window.addEventListener("popstate", (event) => {
      this.changeLocation(window.location.href, "popstate");
    });

    return Promise.resolve();
  }

  @override
  protected onDispose(): void {
    this.currentPage = '';
  }

  private changeLocation(href: string, from: string) : void {
    if (this.currentPage.toLowerCase() !== href.toLocaleLowerCase()) {
      this.currentPage = href.toLowerCase();
      this.log(`${from} - ${this.currentPage}`);
    }
  }

  private log(message: string) : void {
    // provide a consistent message format to filter in browser console
    console.log(`${LOG_SOURCE} - ${(new Date()).toISOString()} - ${message}`)
  }

}
