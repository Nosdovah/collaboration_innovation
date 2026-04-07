import { ref } from 'vue'
import metadata from './assets/metadata.json'

export const candidates = ref(metadata)
export const activeCandidate = ref(metadata.length > 0 ? metadata[0] : null)

export function selectCandidate(c) {
  activeCandidate.value = c
}

export function purgeCandidate(id) {
  const c = candidates.value.find(x => x.id === id)
  if (c) c.vibe_score = 0
}
