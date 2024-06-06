// helper function to get types from `Object.keys()`
export const objectKeys = <T extends Record<string, any>>(
  obj: T
): (keyof T)[] => {
  return Object.keys(obj) as (keyof T)[]
}

/**
 * Adds search parameters to a given URL.
 *
 * @param {URL} url - The URL to add the search parameters to.
 * @param {Object.<string, string>} [params={}] - An object containing the search parameters to add.
 * @returns {URL} - The URL with the added search parameters.
 */
export function addSearchParams(
  url: URL,
  params: Record<string, string> = {}
): URL {
  let searchParams = url.searchParams

  for (const [key, value] of Object.entries(params)) {
    searchParams.set(key, value)
  }

  let newUrl = new URL(`${url.origin}${url.pathname}`)
  newUrl.search = searchParams.toString()
  return newUrl
}

/**
 * Gets the parameters from a given URL.
 *
 * @param {URL} url - The URL to get the parameters from.
 * @param {string[]} keys - The keys of the parameters to get.
 *
 * @returns {Record<K, string | null>} A record of the parameters with the given keys.
 */
export function getParams<K extends string>(
  url: URL,
  ...keys: K[]
): Record<K, string | null> {
  return keys.reduce((params, key) => {
    params[key] = url.searchParams.get(key)
    return params
  }, {} as Record<K, string | null>)
}

export const stripLangFromSlug = (slug: string) =>
  slug.split('/').slice(1).join('/')

export const getLangFromSlug = (slug: string) => slug.split('/')[0]
