import raw from '../../public/assets/manifest.json'

const base = '/assets'

function toList(key, folder) {
  return (raw[key] || []).map((item) => ({
    src: `${base}/${folder}/${item.file}`,
    alt: item.alt,
  }))
}

export const gallery = {
  dnv: toList('dnv', 'gallery/dnv'),
  conversion: toList('conversion', 'gallery/conversion'),
  trading: toList('trading', 'gallery/trading'),
  retail: toList('retail', 'gallery/retail'),
  depot: toList('depot', 'gallery/depot'),
  team: toList('team', 'gallery/team'),
  modular: toList('modular', 'gallery/modular'),
}

export const blogImages = toList('blog', 'blog')
export const clientLogos = toList('clients', 'clients')
export const heroContainers = toList('containers', 'hero')

export const logoMain = `${base}/logo/ironbox-wordmark-light.png`
export const logoMobile = `${base}/logo/ironbox-wordmark-dark.png`
export const logoFooter = `${base}/logo/ironbox-logo-light.png`

export function allGalleryImages() {
  return Object.entries(gallery).flatMap(([category, items]) =>
    items.map((item) => ({ ...item, category }))
  )
}
