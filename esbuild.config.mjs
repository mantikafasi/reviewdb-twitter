import * as esbuild from "esbuild";

const watch = process.argv.includes("--watch");

const ctx = await esbuild.context({
    entryPoints: ["./src/content.ts"],
    bundle: true,
    jsxFactory: "React.createElement",
    jsxFragment: "React.Fragment",
    logLevel: "info",
    outfile: "./build/contentScript.js",
});

if (watch) {
    ctx.watch();
} else {
    await ctx.rebuild();
    ctx.dispose();
}
