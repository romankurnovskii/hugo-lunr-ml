import fs from 'fs'
import path from 'path'

import { DEFAULT_LANGUAGE } from './index.js'


const getSystemLang = () => {
    let locale = Intl.DateTimeFormat().resolvedOptions().locale;
    try {
        locale = locale.slice(0, 2)
    } catch {
        console.info(`Couldn't get system language. Setting default: ${DEFAULT_LANGUAGE}`)
        locale = DEFAULT_LANGUAGE
    }
    return locale
}

const createFolders = (fullPath) => {
    const dir = path.dirname(fullPath)
    if (!fs.existsSync(dir)) {
        const res = fs.mkdirSync(dir, { recursive: true })
        console.log('Created output path:', res)
    }
}

export { getSystemLang, createFolders }