import fs from 'node:fs/promises'

import { AstroError } from 'astro/errors'
import { z } from 'astro/zod'
import yaml from 'js-yaml'
import { glob } from 'tinyglobby'

import { stripLeadingSlash, stripTrailingSlash } from './path'

// TODO(HiDeoo) rename
const definitionFile = {
  glob: '_config.y?(a)ml',
  regex: /_config\.ya?ml$/,
}

const definitionSchema = z.object({
  label: z.string().optional(),
})

// TODO(HiDeoo) how would this work with HMR?
const definitions = new Map<string, DefinitionMap>()

export async function getDefinitionsForDirectory(dir: URL): Promise<DefinitionMap> {
  let dirDefinitions = definitions.get(dir.pathname)
  if (dirDefinitions) return dirDefinitions
  dirDefinitions = {}

  const files = await glob([`**/${definitionFile.glob}`], { absolute: true, cwd: dir.pathname })

  for (const file of files) {
    const definition = await loadDefinition(file)
    const definitionKey = stripLeadingSlash(
      stripTrailingSlash(file.replace(dir.pathname, '').replace(definitionFile.regex, '')),
    )

    dirDefinitions[definitionKey] = definition
  }

  definitions.set(dir.pathname, dirDefinitions)

  return dirDefinitions
}

async function loadDefinition(pathname: string) {
  const content = await fs.readFile(pathname, 'utf8')
  const data = yaml.load(content, { filename: pathname })

  return validateDefinition(pathname, data)
}

function validateDefinition(pathname: string, userDefinition: unknown): Definition {
  const definition = definitionSchema.safeParse(userDefinition ?? {})

  if (!definition.success) {
    const errors = definition.error.flatten()

    throw new AstroError(
      `Invalid starlight-auto-sidebar definition found in \`${pathname}\`:
${errors.formErrors.map((formError) => ` - ${formError}`).join('\n')}
${Object.entries(errors.fieldErrors)
  .map(([fieldName, fieldErrors]) => ` - ${fieldName}: ${fieldErrors.join(' - ')}`)
  .join('\n')}
  `,
      `See the error report above for more informations.\n\nIf you believe this is a bug, please file an issue at https://github.com/HiDeoo/starlight-auto-sidebar/issues/new/choose`,
    )
  }

  return definition.data
}

type Definition = z.output<typeof definitionSchema>
type DefinitionMap = Record<string, Definition>
