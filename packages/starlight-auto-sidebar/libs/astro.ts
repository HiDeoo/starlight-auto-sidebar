import fs from 'node:fs'
import path from 'node:path'

// https://github.com/withastro/astro/blob/afc59bbfc4d08076066f32c97a916fd357a857cb/packages/astro/src/core/config/config.ts#L29-L36
const configFiles = [
  'astro.config.mjs',
  'astro.config.js',
  'astro.config.ts',
  'astro.config.mts',
  'astro.config.cjs',
  'astro.config.cts',
]

export function getConfigPath(rootDir: URL) {
  for (const configFile of configFiles) {
    const configPath = path.join(rootDir.pathname, configFile)
    if (fs.existsSync(configPath)) return configPath
  }
  throw new Error(`Failed to find Astro config file in '${rootDir.pathname}'.`)
}

export function restartDevServer(configPath: string) {
  const now = new Date()
  fs.utimesSync(configPath, now, now)
}
