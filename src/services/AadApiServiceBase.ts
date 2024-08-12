import { AadHttpClient, AadHttpClientFactory, HttpClientResponse, IHttpClientOptions } from '@microsoft/sp-http'
import { ServiceScope } from "@microsoft/sp-core-library";
import { ILoggingService, SPFxLoggingService } from "./LoggingService";

export enum AadApiClient {
    Graph = "https://graph.microsoft.com/",
    MyCoApiService = "4a2f652c-99ff-4e87-b10e-f6b2bd304a1d"
}

export class AadApiServiceBaseConfiguration {
    
    constructor(
        public readonly aadHttpClientFactory: AadHttpClientFactory, 
        public readonly logger: ILoggingService,
    ) {}
}

export abstract class AadApiServiceBase {

    protected aadHttpClientFactory: AadHttpClientFactory;

    protected logger: ILoggingService;

    protected client: AadApiClient = AadApiClient.Graph;

    constructor(init: ServiceScope | AadApiServiceBaseConfiguration) {
        if (init instanceof ServiceScope) {
            init.whenFinished(async() => {
                this.logger = init.consume(SPFxLoggingService.serviceKey);
                this.aadHttpClientFactory = init.consume(AadHttpClientFactory.serviceKey);
            })
        } else if (init instanceof AadApiServiceBaseConfiguration) {
            this.logger = init.logger;
            this.aadHttpClientFactory = init.aadHttpClientFactory;
        } else {
            throw new Error('Invalid instantiation parameter provided.');
        }
    }

    protected async get(url: string): Promise<HttpClientResponse> {
        const client = await this.aadHttpClientFactory.getClient(this.client);
        const response = await client.get(url, AadHttpClient.configurations.v1);
        if (!response.ok) {
            throw new Error(`Invalid response status returned from service. ${response.status} ${response.statusText}.`);
        }
        return response;
    }

    protected async getJson<T>(url: string) : Promise<T> {
        const response = await this.get(url);
        const data = await response.json();
        return data as T;
    }

    protected async post(url: string, options: IHttpClientOptions) : Promise<HttpClientResponse> {
        const client = await this.aadHttpClientFactory.getClient(this.client);
        const response = await client.post(url, AadHttpClient.configurations.v1, options);
        return response;
    }

    protected async postJson<B, T>(url: string, body: B) : Promise<T> {
        const options: IHttpClientOptions = {
            body: JSON.stringify(body),
            headers: {
              'Content-Type': 'application/json'
            }
        };
        //this.config.logger.info(`postJson`);
        const response = await this.post(url, options);
        const data = await response.json();
        return data as T;
    }
}