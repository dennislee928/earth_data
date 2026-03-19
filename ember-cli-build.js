'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');
const { compatBuild } = require('@embroider/compat');

module.exports = async function (defaults) {
  const { setConfig } = await import('@warp-drive/core/build-config');
  const { buildOnce } = await import('@embroider/vite');

  let app = new EmberApp(defaults, {
    // Add options here
  });

  setConfig(app, __dirname, {
    compatWith: '5.8',
    deprecations: {
    },
  });

  return compatBuild(app, buildOnce, {
    staticHelpers: false,
    staticModifiers: false,
    staticComponents: false,
  });
};
