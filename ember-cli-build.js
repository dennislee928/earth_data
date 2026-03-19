'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');
const { compatBuild } = require('@embroider/compat');

module.exports = async function (defaults) {
  const { setConfig } = await import('@warp-drive/core/build-config');
  const { buildOnce } = await import('@embroider/vite');

  // #region agent log
  try {
    const pkg = require('./package.json');
    fetch('http://127.0.0.1:7810/ingest/ccbf1bea-e97b-4d0b-8b88-bd0b1424931b', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': 'b5b3f8' },
      body: JSON.stringify({
        sessionId: 'b5b3f8',
        runId: 'pre-fix',
        hypothesisId: 'H2',
        location: 'ember-cli-build.js:14',
        message: 'build config sees deps/devDeps',
        data: {
          hasEmberStringDep: Boolean(pkg?.dependencies?.['@ember/string']),
          emberStringDepVersion: pkg?.dependencies?.['@ember/string'] || null,
          hasEmberStringDevDep: Boolean(pkg?.devDependencies?.['@ember/string']),
          emberStringDevDepVersion: pkg?.devDependencies?.['@ember/string'] || null,
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
  } catch (e) {
    fetch('http://127.0.0.1:7810/ingest/ccbf1bea-e97b-4d0b-8b88-bd0b1424931b', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': 'b5b3f8' },
      body: JSON.stringify({
        sessionId: 'b5b3f8',
        runId: 'pre-fix',
        hypothesisId: 'H2',
        location: 'ember-cli-build.js:38',
        message: 'failed to read package.json in build config',
        data: { name: e?.name || 'Error', message: String(e?.message || e) },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
  }
  // #endregion

  let app = new EmberApp(defaults, {
    // Add options here
  });

  // #region agent log
  fetch('http://127.0.0.1:7810/ingest/ccbf1bea-e97b-4d0b-8b88-bd0b1424931b', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': 'b5b3f8' },
    body: JSON.stringify({
      sessionId: 'b5b3f8',
      runId: 'pre-fix',
      hypothesisId: 'H4',
      location: 'ember-cli-build.js:55',
      message: 'app.import vendor css for leaflet/flatpickr',
      data: { leafletCss: true, flatpickrCss: true },
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion

  app.import('node_modules/leaflet/dist/leaflet.css');
  app.import('node_modules/flatpickr/dist/flatpickr.min.css');

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
