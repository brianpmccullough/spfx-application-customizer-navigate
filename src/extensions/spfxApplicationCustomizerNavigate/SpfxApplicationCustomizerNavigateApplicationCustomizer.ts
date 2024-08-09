import { Log } from '@microsoft/sp-core-library';
import {
  BaseApplicationCustomizer
} from '@microsoft/sp-application-base';

import { override } from '@microsoft/decorators';
import { SearchPage } from './SearchPage';

export interface ISpfxApplicationCustomizerNavigateApplicationCustomizerProperties {
  testMessage: string;
}

/** A Custom Action which can be run during execution of a Client Side Application */
export default class SpfxApplicationCustomizerNavigateApplicationCustomizer
  extends BaseApplicationCustomizer<ISpfxApplicationCustomizerNavigateApplicationCustomizerProperties> {

  private LOG_SOURCE: string = SpfxApplicationCustomizerNavigateApplicationCustomizer.name;

  private currentPage : string = '';

  public onInit(): Promise<void> {
    this.log('onInit');
    Log.info(this.LOG_SOURCE, `Initialized ${SpfxApplicationCustomizerNavigateApplicationCustomizer.name}`);

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

      const searchPage = new SearchPage(this.currentPage);
      if (searchPage.isSearchPage) {
        console.log(searchPage);
      }
    }
  }

  private log(message: string) : void {
    // provide a consistent message format to filter in browser console
    console.log(`${this.LOG_SOURCE} - ${(new Date()).toISOString()} - ${message}`)
  }

}
