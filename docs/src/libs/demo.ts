export function isDemoPage(id: string) {
  return id.startsWith('demo/') && id !== 'demo/overview'
}
