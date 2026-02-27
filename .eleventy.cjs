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

  config.addGlobalData('isDev', process.env.ELEVENTY_ENV !== 'production');

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
