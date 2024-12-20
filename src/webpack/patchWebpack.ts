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

import { Logger } from "../utils/Logger";
import { WEBPACK_CHUNK } from "../utils/constants";

import { WebpackRequireModules, _initWebpack, listeners, subscriptions, wreq } from "./webpack";

let webpackChunk: any[];

const lagger = new Logger("Webpak");

if (window[WEBPACK_CHUNK]) {
    lagger.info(`Patching ${WEBPACK_CHUNK}.push (already existant, likely due to cache)`);
    _initWebpack(window[WEBPACK_CHUNK]);
    patchPush();

    for (const id in wreq.m) {
        patchModule(wreq.m, id);
    }
} else {
    Object.defineProperty(window, WEBPACK_CHUNK, {
        get: () => webpackChunk,
        set: v => {
            if (v?.push !== Array.prototype.push) {
                lagger.info(`Patching ${WEBPACK_CHUNK}.push`);
                _initWebpack(v);
                patchPush();
                // @ts-ignore
                delete window[WEBPACK_CHUNK];
                window[WEBPACK_CHUNK] = v;
            }
            webpackChunk = v;
        },
        configurable: true,
    });
}

function patchModule(modules: WebpackRequireModules, id: string) {
    const mod = modules[id];

    const factory = (modules[id] = function (module, exports, require) {
        mod(module, exports, require);

        // There are (at the time of writing) 2 modules exporting the window
        // Make these non enumerable to improve webpack search performance
        if (module.exports === window) {
            Object.defineProperty(require.c, id, {
                value: require.c[id],
                enumerable: false,
                configurable: true,
                writable: true,
            });
            return;
        }

        const numberId = Number(id);
        for (const callback of listeners) {
            try {
                callback(exports, numberId);
            } catch (err) {
                lagger.error("Error in webpack listener", err);
            }
        }

        for (const [filter, callback] of subscriptions) {
            try {
                if (filter(exports)) {
                    subscriptions.delete(filter);
                    callback(exports, numberId);
                } else if (typeof exports === "object") {
                    if (exports.default && filter(exports.default)) {
                        subscriptions.delete(filter);
                        callback(exports.default, numberId);
                    }

                    for (const nested in exports)
                        if (nested.length <= 3) {
                            if (exports[nested] && filter(exports[nested])) {
                                subscriptions.delete(filter);
                                callback(exports[nested], numberId);
                            }
                        }
                }
            } catch (err) {
                lagger.error("Error while firing callback for webpack chunk", err);
            }
        }
    } as any as { toString: () => string; original: any; (...args: any[]): void });

    // for some reason throws some error on which calling .toString() leads to infinite recursion
    // when you force load all chunks???
    try {
        factory.toString = () => mod.toString();
        factory.original = mod;
    } catch {}
}

function patchPush() {
    function handlePush(chunk: any) {
        try {
            const modules = chunk[1] as WebpackRequireModules;
            for (const id in modules) {
                patchModule(modules, id);
            }
        } catch (err) {
            lagger.error("Error in handlePush", err);
        }

        return handlePush.original.call(window[WEBPACK_CHUNK], chunk);
    }

    handlePush.original = window[WEBPACK_CHUNK].push;
    Object.defineProperty(window[WEBPACK_CHUNK], "push", {
        get: () => handlePush,
        set: v => (handlePush.original = v),
        configurable: true,
    });
}
