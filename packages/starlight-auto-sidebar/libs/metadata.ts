import type { z } from 'astro/zod'
import { getCollection, type CollectionEntry } from 'astro:content'

import type { MetadataSchema } from '../schema'

const metadataEntryIdSuffixRegex = /\/?_meta$/

let projectMetadata: ProjectMetadata | undefined
let metadataEntries: MetadataEntry[] | undefined

export async function getProjectMetadata(): Promise<ProjectMetadata> {
  if (projectMetadata) return projectMetadata

  projectMetadata = {}

  for (const entry of await getMetadataEntries()) {
    projectMetadata[getMetadataEntryDirectory(entry.id)] = entry.data
  }

  return projectMetadata
}

async function getMetadataEntries(): Promise<MetadataEntry[]> {
  metadataEntries ??= await getCollection('autoSidebar')
  return metadataEntries
}

function getMetadataEntryDirectory(entryId: string) {
  return entryId.replace(metadataEntryIdSuffixRegex, '')
}

export type Metadata = z.output<typeof MetadataSchema>
export type ProjectMetadata = Record<string, Metadata>

type MetadataEntry = CollectionEntry<'autoSidebar'>
