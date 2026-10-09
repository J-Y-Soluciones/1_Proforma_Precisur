export function quotationHead(title: string, description: string, path: string) {
 return { meta: [{ title: `${title} | JY Operax B2B` }, { name: 'description', content: description }, { property: 'og:title', content: `${title} | JY Operax B2B` }, { property: 'og:description', content: description }, { property: 'og:type', content: 'website' }, { property: 'og:url', content: path }, { name: 'twitter:card', content: 'summary_large_image' }], links: [{ rel: 'canonical', href: path }] };
}
