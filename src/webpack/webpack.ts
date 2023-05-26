/*
 * Vencord Webpack Patcher
 * Copyright (c) 2022 Vendicated and Vencord contributors
 * Copyright (c) 2023 mantikafasi & ReviewDB contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

import { proxyLazy } from "../utils/lazy";

export let _resolveReady: () => void;
/**
 * Fired once a gateway connection to Discord has been established.
 * This indicates that the core webpack modules have been initialised
 */
export const onceReady = new Promise<void>(r => _resolveReady = r);

export interface WebpackRequire {
  (id: number): any;
  c: WebpackRequireCache;
  m: WebpackRequireModules;
}
export type WebpackRequireCache = Record<number, {
  exports: any;
  id: number;
  loaded: boolean;
}>;
export type WebpackRequireModules = Record<number, (module: { exports: any; }, exports: any, require: WebpackRequire) => void>;

export type FilterFn = (mod: any) => boolean;
export type CallbackFn = (mod: any, id: number) => void;

export let wreq: WebpackRequire;
export let cache: WebpackRequireCache;

export const filters = {
  byProps: (...props: string[]): FilterFn =>
    props.length === 1
      ? m => m[props[0]] !== void 0
      : m => props.every(p => m[p] !== void 0),

  byCode: (...code: string[]): FilterFn => m => {
    if (typeof m !== "function") return false;
    const s = Function.prototype.toString.call(m);
    for (const c of code) {
      if (!s.includes(c)) return false;
    }
    return true;
  },
  byStoreName: (name: string): FilterFn => m =>
    m.constructor?.displayName === name
};

export const subscriptions = new Map<FilterFn, CallbackFn>();
export const listeners = new Set<CallbackFn>();


export function _initWebpack(instance: any) {
  if (cache !== void 0) throw "no.";

  wreq = instance.push([[Symbol("ReviewDB-Twitter")], {}, r => r]);
  cache = wreq.c;
  instance.pop();

}

const defaultKeys = ["default", "Z", "ZP"];

/**
 * Find the first module that matches the filter
 */
export function find(filter: FilterFn, getDefault = true, isWaitFor = false) {
  if (typeof filter !== "function")
    throw new Error("Invalid filter. Expected a function got " + typeof filter);

  for (const key in cache) {
    const mod = cache[key];
    if (!mod?.exports) continue;

    if (filter(mod.exports)) {
      return isWaitFor ? [mod.exports, Number(key)] : mod.exports;
    }

    if (typeof mod.exports !== "object") continue;

    if (mod.exports.default && filter(mod.exports.default)) {
      const found = getDefault ? mod.exports.default : mod.exports;
      return isWaitFor ? [found, Number(key)] : found;
    }

    // the length check makes search about 20% faster
    for (const nestedMod in mod.exports) if (nestedMod.length <= 3) {
      const nested = mod.exports[nestedMod];
      if (nested && filter(nested)) {
        return isWaitFor ? [nested, Number(key)] : nested;
      }
    }
  }

  if (!isWaitFor) {
    const err = new Error("Didn't find module matching this filter");
    console.warn(err, filter);
  }

  return isWaitFor ? [null, null] : null;
};

/**
 * find but lazy
 */
export function findLazy(filter: FilterFn, getDefault = true) {
  return proxyLazy(() => find(filter, getDefault));
}

export function findAll(filter: FilterFn, getDefault = true) {
  if (typeof filter !== "function")
    throw new Error("Invalid filter. Expected a function got " + typeof filter);

  const ret = [] as any[];
  for (const key in cache) {
    const mod = cache[key];
    if (!mod?.exports) continue;

    if (filter(mod.exports))
      ret.push(mod.exports);
    else if (typeof mod.exports !== "object")
      continue;

    for (const d of defaultKeys) {
      if (mod.exports[d] && filter(mod.exports[d]))
        ret.push(getDefault ? mod.exports[d] : mod.exports);
    }

    for (const nestedMod in mod.exports) if (nestedMod.length <= 3) {
      const nested = mod.exports[nestedMod];
      if (nested && filter(nested)) ret.push(nested);
    }
  }

  return ret;
}

/**
 * Same as {@link find} but in bulk
 * @param filterFns Array of filters. Please note that this array will be modified in place, so if you still
 *                need it afterwards, pass a copy.
 * @returns Array of results in the same order as the passed filters
 */
export function findBulk(...filterFns: FilterFn[]) {
  if (!Array.isArray(filterFns))
    throw new Error("Invalid filters. Expected function[] got " + typeof filterFns);

  const { length } = filterFns;

  switch (length) {
    case 0: throw new Error("Expected at least two filters.");
    case 1: return find(filterFns[0]);
  }

  const filters = filterFns as Array<FilterFn | undefined>;

  let found = 0;
  const results = Array(length);

  outer:
  for (const key in cache) {
    const mod = cache[key];
    if (!mod?.exports) continue;

    for (let j = 0; j < length; j++) {
      const filter = filters[j];
      // Already done
      if (filter === undefined) continue;

      if (filter(mod.exports)) {
        results[j] = mod.exports;
        filters[j] = undefined;
        if (++found === length) break outer;
        break;
      }

      if (typeof mod.exports !== "object")
        continue;

      if (mod.exports.default && filter(mod.exports.default)) {
        results[j] = mod.exports.default;
        filters[j] = undefined;
        if (++found === length) break outer;
        break;
      }

      for (const nestedMod in mod.exports)
        if (nestedMod.length <= 3) {
          const nested = mod.exports[nestedMod];
          if (nested && filter(nested)) {
            results[j] = nested;
            filters[j] = undefined;
            if (++found === length) break outer;
            continue outer;
          }
        }
    }
  }

  if (found !== length) {
    const err = new Error(`Got ${length} filters, but only found ${found} modules!`);
    console.warn(err, filters);
  }

  return results;
};

/**
 * Find the id of a module by its code
 * @param code Code
 * @returns number or null
 */
export function findModuleId(code: string) {
  for (const id in wreq.m) {
    if (wreq.m[id].toString().includes(code)) {
      return Number(id);
    }
  }

  const err = new Error("Didn't find module with code:\n" + code);
  console.warn(err);

  return null;
};

/**
 * Finds a mangled module by the provided code "code" (must be unique and can be anywhere in the module)
 * then maps it into an easily usable module via the specified mappers
 * @param code Code snippet
 * @param mappers Mappers to create the non mangled exports
 * @returns Unmangled exports as specified in mappers
 *
 * @example mapMangledModule("headerIdIsManaged:", {
 *             openModal: filters.byCode("headerIdIsManaged:"),
 *             closeModal: filters.byCode("key==")
 *          })
 */
export function mapMangledModule<S extends string>(code: string, mappers: Record<S, FilterFn>): Record<S, any> {
  const exports = {} as Record<S, any>;

  const id = findModuleId(code);
  if (id === null)
    return exports;

  const mod = wreq(id);
  outer:
  for (const key in mod) {
    const member = mod[key];
    for (const newName in mappers) {
      // if the current mapper matches this module
      if (mappers[newName](member)) {
        exports[newName] = member;
        continue outer;
      }
    }
  }
  return exports;
};

/**
 * Same as {@link mapMangledModule} but lazy
 */
export function mapMangledModuleLazy<S extends string>(code: string, mappers: Record<S, FilterFn>): Record<S, any> {
  return proxyLazy(() => mapMangledModule(code, mappers));
}

/**
 * Find the first module that has the specified properties
 */
export function findByProps(...props: string[]) {
  return find(filters.byProps(...props));
}

/**
 * findByProps but lazy
 */
export function findByPropsLazy(...props: string[]) {
  return findLazy(filters.byProps(...props));
}

/**
 * Find a function by its code
 */
export function findByCode(...code: string[]) {
  return find(filters.byCode(...code));
}

/**
 * findByCode but lazy
 */
export function findByCodeLazy(...code: string[]) {
  return findLazy(filters.byCode(...code));
}

/**
 * Wait for a module that matches the provided filter to be registered,
 * then call the callback with the module as the first argument
 */
export function waitFor(filter: string | string[] | FilterFn, callback: CallbackFn) {
  if (typeof filter === "string")
    filter = filters.byProps(filter);
  else if (Array.isArray(filter))
    filter = filters.byProps(...filter);
  else if (typeof filter !== "function")
    throw new Error("filter must be a string, string[] or function, got " + typeof filter);

  const [existing, id] = find(filter!, true, true);
  if (existing) return void callback(existing, id);

  subscriptions.set(filter, callback);
}

export function addListener(callback: CallbackFn) {
  listeners.add(callback);
}

export function removeListener(callback: CallbackFn) {
  listeners.delete(callback);
}
