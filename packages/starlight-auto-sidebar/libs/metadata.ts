import fs from 'node:fs/promises'

import watcher from '@parcel/watcher'
import { AstroError } from 'astro/errors'
import { z } from 'astro/zod'
import yaml from 'js-yaml'
import { glob } from 'tinyglobby'

import { getConfigPath, restartDevServer } from './astro'
import { stripLeadingAndTrailingSlash } from './path'
import { isSidebarAutogeneratedGroupConfig, isSidebarManualGroupConfig, type SidebarUserConfig } from './sidebarConfig'

const metadataFile = {
  glob: '_meta.y?(a)ml',
  regex: /_meta\.ya?ml$/,
}

const metadataSchema = z
  .object({
    // TODO(HiDeoo) comment
    label: z.string().optional(),
    // TODO(HiDeoo) comment
    order: z.number().optional(),
    // TODO(HiDeoo) comment
    sort: z.enum(['slug', 'reverse-slug']).default('slug'),
  })
  .strict()

export async function getProjectMetadata(contentDir: URL, sidebarConfig: SidebarUserConfig): Promise<ProjectMetadata> {
  let metadata: ProjectMetadata = {}

  for (const itemConfig of sidebarConfig) {
    if (isSidebarAutogeneratedGroupConfig(itemConfig)) {
      const dir = new URL(itemConfig.autogenerate.directory, contentDir)
      metadata[dir.pathname] = await getDirectoryMetadata(dir)
    } else if (isSidebarManualGroupConfig(itemConfig)) {
      metadata = { ...metadata, ...(await getProjectMetadata(contentDir, itemConfig.items)) }
    }
  }

  return metadata
}

export function setupMetadataWatcher(
  rootDir: URL,
  contentDir: URL,
  metadata: ProjectMetadata,
): Promise<MetadataWatcher> {
  const astroConfigPath = getConfigPath(rootDir)
  const autogeneratedGroupRoots = Object.keys(metadata)

  return watcher.subscribe(
    contentDir.pathname,
    (err, events) => {
      if (err) return

      const isAutoGeneratedGroupEvent = autogeneratedGroupRoots.some((root) =>
        events.some((event) => event.path.replaceAll('\\', '/').startsWith(root)),
      )
      if (!isAutoGeneratedGroupEvent) return

      restartDevServer(astroConfigPath)
    },
    { ignore: [`!**/${metadataFile.glob}`] },
  )
}

async function getDirectoryMetadata(dir: URL): Promise<DirectoryMetadata> {
  const metadata: DirectoryMetadata = {}

  const files = await glob([`**/${metadataFile.glob}`], { absolute: true, cwd: dir.pathname })

  for (const file of files) {
    const key = stripLeadingAndTrailingSlash(file.replace(dir.pathname, '').replace(metadataFile.regex, ''))
    metadata[key] = await loadMetadata(file)
  }

  return metadata
}

async function loadMetadata(path: string) {
  const content = await fs.readFile(path, 'utf8')
  const data = yaml.load(content, { filename: path })

  return validateMetadata(path, data)
}

function validateMetadata(path: string, userMetadata: unknown): Metadata {
  const metadata = metadataSchema.safeParse(userMetadata ?? {})

  if (!metadata.success) {
    const errors = metadata.error.flatten()

    // TODO(HiDeoo) test???
    throw new AstroError(
      `Invalid starlight-auto-sidebar metadata found in \`${path}\`:
${errors.formErrors.map((formError) => ` - ${formError}`).join('\n')}
${Object.entries(errors.fieldErrors)
  .map(([fieldName, fieldErrors]) => ` - ${fieldName}: ${fieldErrors.join(' - ')}`)
  .join('\n')}
  `,
      `See the error report above for more informations.\n\nIf you believe this is a bug, please file an issue at https://github.com/HiDeoo/starlight-auto-sidebar/issues/new/choose`,
    )
  }

  return metadata.data
}

export type Metadata = z.output<typeof metadataSchema>
export type DirectoryMetadata = Record<string, Metadata>
export type ProjectMetadata = Record<string, DirectoryMetadata>

export type MetadataWatcher = Awaited<ReturnType<typeof watcher.subscribe>>
