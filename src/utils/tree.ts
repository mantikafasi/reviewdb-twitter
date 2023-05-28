/**
 * SPDX-License-Identifier: MIT
 * Copyright 2018 Zachary Rauen
 * Copyright 2023 ReviewDB contributors
 */

export type SearchFilter = string | ((node: any) => boolean);
export type WalkOptions = Partial<Record<"walkable" | "ignore", string[]>>;

/**
 * Finds a value, subobject, or array from a tree that matches a specific filter. Great for patching render functions.
 * @param {object} tree React tree to look through. Can be a rendered object or an internal instance.
 * @param {callable} searchFilter Filter function to check subobjects against.
 */
export function findInReactTree(tree: any, searchFilter: SearchFilter) {
    return findInTree(tree, searchFilter, { walkable: ["props", "children", "child", "sibling"] });
}

/**
 * Finds a value, subobject, or array from a tree that matches a specific filter.
 * @param {object} tree Tree that should be walked
 * @param {callable} searchFilter Filter to check against each object and subobject
 * @param {object} options Additional options to customize the search
 * @param {Array<string>|null} [options.walkable=null] Array of strings to use as keys that are allowed to be walked on. Null value indicates all keys are walkable
 * @param {Array<string>} [options.ignore=[]] Array of strings to use as keys to exclude from the search, most helpful when `walkable = null`.
 */
export function findInTree(
    tree: any,
    searchFilter: SearchFilter,
    { walkable, ignore = [] }: WalkOptions = {}
) {
    if (typeof searchFilter === "string") {
        if (Object.hasOwn(tree, searchFilter)) return tree[searchFilter];
    } else if (searchFilter(tree)) {
        return tree;
    }

    if (typeof tree !== "object" || tree == null) return undefined;

    if (Array.isArray(tree)) {
        for (const element of tree) {
            const res = findInTree(element, searchFilter, { walkable, ignore });
            if (res) return res;
        }
    } else {
        const toWalk = walkable == null ? Object.keys(tree) : walkable;
        for (const key of toWalk) {
            if (!Object.hasOwn(tree, key) || ignore.includes(key)) continue;

            const res = findInTree(tree[key], searchFilter, { walkable, ignore });
            if (res) return res;
        }
    }

    return null;
}
