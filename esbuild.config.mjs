import * as esbuild from 'esbuild'

let ctx = await esbuild.context({
  entryPoints: ['./src/content.ts'],
  bundle: true,
  jsxFactory: "React.createElement",
  jsxFragment: "React.Fragment",
  logLevel: 'info',
  outfile: './build/contentScript.js',
})


// this DOESNT EVEN PRINT OUTPUT
await ctx.watch().then((p) => {
  console.log('Build succeeded. Watching for changes...')
}).catch((err) => {
  console.error(err)
})


console.log('Watching for changes...')
