import { ref } from 'vue'
import metadata from './assets/metadata.json'

export const candidates = ref(metadata)
export const activeCandidate = ref(metadata.length > 0 ? metadata[0] : null)

export function selectCandidate(c) {
  activeCandidate.value = c
}

export function purgeCandidate(kandidat_id) {
  const c = candidates.value.find(x => x.kandidat_id === kandidat_id)
  if (c) c.indeks_performa_kandidat.skor_keseluruhan = 0
}
