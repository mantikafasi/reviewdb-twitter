import * as esbuild from "esbuild";
import copyStaticFiles from "esbuild-copy-static-files";

const watch = process.argv.includes("--watch");

const ctx = await esbuild.context({
    entryPoints: ["./src/index.ts"],
    outfile: "./build/bundle.js",

    format: "iife",
    globalName: "ReviewDB",
    bundle: true,
    jsxFactory: "React.createElement",
    jsxFragment: "React.Fragment",

    logLevel: "info",

    plugins: [
        copyStaticFiles({
            src: "./public",
            dest: "./build",
        }),
    ],
});

if (watch) {
    ctx.watch();
} else {
    await ctx.rebuild();
    ctx.dispose();
}
