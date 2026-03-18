const fs = require('fs');
const path = require('path');

function readViteManifest() {
  try {
    const raw = fs.readFileSync(path.resolve(__dirname, '_site/.vite/manifest.json'), 'utf-8');
    const manifest = JSON.parse(raw);
    const entry = manifest['assets/main.js'];
    const cssEntry = manifest['style.css'];
    return {
      assetJs: entry?.file ?? 'assets/main.js',
      assetCss: cssEntry?.file ?? entry?.css?.[0] ?? 'assets/main.css',
    };
  } catch {
    return { assetJs: 'assets/main.js', assetCss: 'assets/main.css' };
  }
}

module.exports = function (config) {
  // Only treat files ending with .11tydata as data files so metadata.json can be served statically
  config.setDataFileSuffixes(['11tydata']);

  // passthrough release artifacts
  config.addPassthroughCopy({ 'src/releases': 'releases' });
  config.addPassthroughCopy({ 'src/assets/svg': 'assets/svg' });
  config.addPassthroughCopy({ 'src/catalog.csv': 'catalog.csv' });
  config.addPassthroughCopy({ 'src/favicon.svg': 'favicon.svg' });

  // Watch assets so 11ty dev server reloads when Vite writes or sources change
  config.addWatchTarget('src/assets/main.js');
  config.addWatchTarget('src/assets/main.css');
  config.addWatchTarget('src/catalog');

  const isDev = process.env.ELEVENTY_ENV !== 'production';
  config.addGlobalData('isDev', isDev);

  const { assetJs, assetCss } = isDev
    ? { assetJs: 'assets/main.js', assetCss: 'assets/main.css' }
    : readViteManifest();
  config.addGlobalData('assetJs', assetJs);
  config.addGlobalData('assetCss', assetCss);

  return {
    dir: {
      input: 'src',
      includes: '_includes',
      layouts: '_includes',
      data: '_data',
      output: '_site'
    },
    passthroughFileCopy: true,
    templateFormats: ['njk', 'html']
  };
};
