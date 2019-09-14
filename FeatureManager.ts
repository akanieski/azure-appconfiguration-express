import { Request, RequestHandler, Response } from 'express'
import { AppConfigurationClient } from "@azure/app-configuration";
import { NextFunction } from 'connect'

interface CachedEntry {
    fetched: Date
    value: any
    key: string
}
class FeatureManager {
    cacheRefreshRate: number = 30000
    cache: { [key: string]: CachedEntry } = {}
    connectionString: string
    client: AppConfigurationClient

    constructor(connectionString: string) {
        this.connectionString = connectionString
        this.client = new AppConfigurationClient(connectionString)
    }

    filterRoute(featureKey: string, filterPassed: RequestHandler, filterRejected: RequestHandler): (req: Request, res: Response, next: NextFunction) => any {
        return async (req: Request, res: Response, next: NextFunction) => {
            try {
                if (await this.feature(featureKey)) {
                    return filterPassed(req, res, next)
                } else {
                    return filterRejected(req, res, next)
                }
            } catch (err) {
                console.error(err)
                return filterRejected(req, res, next)
            }
        }
    }

    private getAgeInMilliseconds(d: Date): number {
        return (new Date().getTime() - d.getTime())
    }

    async feature(key: string): Promise<boolean> {
        var cachedEntry = this.cache[key]
        if (cachedEntry && this.getAgeInMilliseconds(cachedEntry.fetched) < this.cacheRefreshRate) {
            return cachedEntry.value
        }
        let configurationSetting = await this.client.getConfigurationSetting('.appconfig.featureflag/' + key);
        this.cache[key] = <CachedEntry>{
            fetched: new Date(),
            key: key,
            value: JSON.parse(configurationSetting.value).enabled
        }
        return this.cache[key].value
    }
}

export default FeatureManager
