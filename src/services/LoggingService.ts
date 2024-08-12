import { Log, ServiceKey, ServiceScope } from "@microsoft/sp-core-library";

export interface ILoggingService {
    error(error: Error, message: string): void;
    warning(message: string): void;
    info(message: string): void;
    verbose(message: string): void;
}

export class SPFxLoggingService implements ILoggingService {

    public static readonly serviceKey: ServiceKey<SPFxLoggingService> = ServiceKey.create<SPFxLoggingService>('spfx-app:SPFxLoggingService', SPFxLoggingService);

    private _source: string;

    constructor(private serviceScope: ServiceScope, source = 'SPFxLoggingService') {
        console.log('SPFxLoggingService constructor');
        this._source = source;
    }

    // this is used to support the "Builder" pattern to make it easier to configure with serviceScope.consume()
    // for example: serviceScope.consume(SPFxLoggingService.serviceKey).withSource(MyClassOrServiceOrWebPart.name);
    public withSource(source: string): SPFxLoggingService {
        this.source = source;
        return this;
    }

    public get source(): string {
        return this._source;
    }

    public set source(value: string) {
        this._source = value;
    }

    public error(error: Error, message: string | undefined): void {
        this.serviceScope.whenFinished(() => {
            Log.error(this.source, error, this.serviceScope);
        });
    }

    public warning(message: string): void {
        this.serviceScope.whenFinished(() => {
            Log.warn(this.source, message, this.serviceScope);
        });
    }

    public info(message: string): void {
        this.serviceScope.whenFinished(() => {
            Log.info(this.source, message, this.serviceScope);
        });
    }

    public verbose(message: string): void {
        this.serviceScope.whenFinished(() => {
            Log.verbose(this.source, message, this.serviceScope);
        });
    }

}