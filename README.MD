# Azure App Configuration + Express 
[![Build status](https://dev.azure.com/akanieski/azure-appconfiguration-express/_apis/build/status/azure-appconfiguration-express-CI)](https://dev.azure.com/akanieski/azure-appconfiguration-express/_build/latest?definitionId=3)

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

MIT License

Copyright (c) 2019 Andrew Kanieski

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
