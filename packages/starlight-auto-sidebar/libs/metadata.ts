import type { z } from 'astro/zod'
import { getCollection, type CollectionEntry } from 'astro:content'
import context from 'virtual:starlight-auto-sidebar/context'

import type { MetadataSchema } from '../schema'

import { isSidebarAutogeneratedGroupConfig, isSidebarManualGroupConfig, type SidebarUserConfig } from './sidebar'
import { DefaultLocale, type Locale } from './starlight'

let projectMetadata: ProjectMetadata | undefined
let metadataEntries: MetadataEntry[] | undefined

export async function getProjectMetadata(sidebarConfig: SidebarUserConfig): Promise<ProjectMetadata> {
  if (projectMetadata) return projectMetadata

  let metadata = await getProjectMetadataByLocale(DefaultLocale, sidebarConfig)

  if (context.isMultilingual) {
    for (const locale in context.locales) {
      if (locale === 'root' || locale === DefaultLocale) continue
      metadata = { ...metadata, ...(await getProjectMetadataByLocale(locale, sidebarConfig)) }
    }
  }

  projectMetadata = metadata

  return metadata
}

async function getProjectMetadataByLocale(locale: Locale, sidebarConfig: SidebarUserConfig): Promise<ProjectMetadata> {
  let metadata: ProjectMetadata = {}

  for (const itemConfig of sidebarConfig) {
    if (isSidebarAutogeneratedGroupConfig(itemConfig)) {
      await collectDirectoryMetadata(metadata, locale, itemConfig.autogenerate.directory)
    } else if (isSidebarManualGroupConfig(itemConfig)) {
      metadata = { ...metadata, ...(await getProjectMetadataByLocale(locale, itemConfig.items)) }
    }
  }

  return metadata
}

async function collectDirectoryMetadata(metadata: ProjectMetadata, locale: Locale, dir: string) {
  const entries = await getMetadataEntries()

  for (const entry of entries) {
    const localizedDir = locale ? `${locale}/${dir}` : dir
    if (entry.id.startsWith(localizedDir)) {
      metadata[entry.id.replace('/_meta', '')] = entry.data
    }
  }
}

async function getMetadataEntries(): Promise<MetadataEntry[]> {
  metadataEntries ??= await getCollection('autoSidebar')
  return metadataEntries
}

export type Metadata = z.output<typeof MetadataSchema>
export type ProjectMetadata = Record<string, Metadata>

type MetadataEntry = CollectionEntry<'autoSidebar'>
