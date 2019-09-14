# Azure App Configuration + Express 

Azure App Configuration is a managed service that helps developers centralize their application configurations simply and securely.

Modern programs, especially programs running in a cloud, generally have many components that are distributed in nature. Spreading configuration settings across these components can lead to hard-to-troubleshoot errors during an application deployment. Use App Configuration to securely store all the settings for your application in one place.

Use the client library for App Configuration to:
* Apply filters to routes that allow you to route requests based on feature toggle found in the Azure App Configuration portal


[NPM](https://www.npmjs.com/package/akanieski/azure-appconfiguration-express) | [Product documentation](https://github.com/akanieski/azure-appconfiguration-express)

## Getting started

### Currently supported environments

- Node.js version 8.x.x or higher

### How to Install

```bash
npm install akanieski/azure-appconfiguration-express
```

### Sample Usage

```
import FeatureManager from '../FeatureManager'
const features = new FeatureManager(connectionString)

var homePage = (req: express.Request, res: express.Response) => res.send('<h1>Hello World from latest stable!</h1>');
var newHomePage = (req: express.Request, res: express.Response) => res.send('<h1>Hello World from the bleeding edge!</h1>');

app.get('/', features.filterRoute('new-homepage', newHomePage, homePage))
```
