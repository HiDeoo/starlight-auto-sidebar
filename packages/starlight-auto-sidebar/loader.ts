import { glob, type Loader } from 'astro/loaders'

import { getRelativeSrcDir } from './libs/astro'
import { MetadataFileGlob } from './libs/metadata'

export function autoSidebarLoader(): Loader {
  return {
    name: 'starlight-auto-sidebar-loader',
    load: (context) => {
      return glob({
        base: `${getRelativeSrcDir(context.config)}content/docs`,
        pattern: `**/${MetadataFileGlob}`,
      }).load(context)
    },
  }
}
