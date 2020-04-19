import fs from 'fs'
import yaml from 'js-yaml'
import { Provider, Credentials, DATAPATH } from './types'

export const checkCache = (): Credentials | null => {
    const credentials: Credentials = yaml.safeLoad(
        fs.readFileSync(DATAPATH, 'utf8')
    )
    console.log(credentials)
    return credentials
}

export const writeToCache = (credentials: Credentials): void => {
    const yamlString = yaml.safeDump(credentials)
    fs.writeFileSync(DATAPATH, yamlString)
}
