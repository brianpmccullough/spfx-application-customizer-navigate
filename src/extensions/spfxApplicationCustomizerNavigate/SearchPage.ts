export enum SearchScope {
    Unknown = 'Unknown',
    List = 'List',
    Site = 'Site',
    Hub = 'Hub',
    Organization = 'Organization'
}

export class SearchPage {
    private url: URL;

    constructor(href: string) {
        this.url = new URL(href.toLowerCase());
    }

    public get isSearchPage(): boolean {
        return this.searchScope !== SearchScope.Unknown;
    }

    public get searchScope(): SearchScope {
        let scope = SearchScope.Unknown;
        const url = this.url.href.toLowerCase();
        const queryString = this.url.searchParams;

        const searchPath = '/_layouts/15/search.aspx';

        if (url.indexOf(searchPath) > 0) {
            scope = SearchScope.Organization;

            if (url.indexOf(`${searchPath}/site`) > 0 || queryString.get('scope') === 'site') {
                scope = SearchScope.Site;

                if (queryString.get('scope') === 'hub') {
                    scope = SearchScope.Hub;
                }
            }
        }

        return scope;
    }

    public get searchQuery(): string | undefined {
        if (this.searchScope === SearchScope.Unknown) {
            return undefined;
        }

        return this.url.searchParams.get('q') || '';
    }
}