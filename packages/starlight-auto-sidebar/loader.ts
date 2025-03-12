import { glob, type Loader } from 'astro/loaders'

import { getRelativeSrcDir } from './libs/astro'

export function autoSidebarLoader(): Loader {
  return {
    name: 'starlight-auto-sidebar-loader',
    load: (context) => {
      return glob({
        base: `${getRelativeSrcDir(context.config)}content/docs`,
        pattern: `**/_meta.y?(a)ml`,
      }).load(context)
    },
  }
}
