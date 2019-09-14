import FeatureManager from '../FeatureManager'
import express from 'express'

const app = express()
const port = 3000
const connectionString = process.env['AZ_CONFIG_CONNECTION']!
const features = new FeatureManager(connectionString)


var homePage = (req: express.Request, res: express.Response) => res.send('<h1>Hello World from latest stable!</h1>');
var newHomePage = (req: express.Request, res: express.Response) => res.send('<h1>Hello World from the bleeding edge!</h1>');

app.get('/', features.filterRoute('new-homepage', newHomePage, homePage))


app.listen(port, () => console.log(`Example app listening on port ${port}!`))