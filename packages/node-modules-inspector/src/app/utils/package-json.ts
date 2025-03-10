import type { PackageNode } from 'node-modules-tools'
import { normalizePkgAuthor, normalizePkgFundings, normalizePkgRepository } from 'node-modules-tools/utils'

function weakCachedFunction<T extends WeakKey, R>(fn: (arg: T) => R): (arg: T) => R {
  const cache = new WeakMap<T, R>()

  return (arg: T) => {
    if (cache.has(arg))
      return cache.get(arg)!
    const result = fn(arg)
    cache.set(arg, result)
    return result
  }
}

export const getAuthor = weakCachedFunction((pkg: PackageNode) => normalizePkgAuthor(pkg.resolved.packageJson))
export const getRepository = weakCachedFunction((pkg: PackageNode) => normalizePkgRepository(pkg.resolved.packageJson))
export const getFundings = weakCachedFunction((pkg: PackageNode) => normalizePkgFundings(pkg.resolved.packageJson))

export const getPackageData = weakCachedFunction((pkg: PackageNode) => {
  return {
    license: pkg.resolved.packageJson.license,
    homepage: pkg.resolved.packageJson.homepage,
    engines: pkg.resolved.packageJson.engines,
    author: getAuthor(pkg),
    repository: getRepository(pkg)?.url,
    fundings: getFundings(pkg),
  }
})
