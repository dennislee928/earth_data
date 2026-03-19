import Service from '@ember/service';

export default class EarthdataService extends Service {
  cmrEndpoint = 'https://cmr.earthdata.nasa.gov/search/collections.json';
  nasaApiKey = 'F77hkODx7AIsKkGVDSTCbkdctPSYZHZCvDYbXVyW';

  async searchCollections(params = {}) {
    const query = new URLSearchParams(params).toString();
    const response = await fetch(`${this.cmrEndpoint}?${query}`);
    if (!response.ok) {
      throw new Error('Failed to fetch collections from CMR');
    }
    const data = await response.json();
    return data.feed.entry;
  }

  async getEonetEvents() {
    const response = await fetch('https://eonet.gsfc.nasa.gov/api/v3/events');
    if (!response.ok) {
      throw new Error('Failed to fetch EONET events');
    }
    const data = await response.json();
    return data.events;
  }

  async getEpicImages() {
    const url = `https://api.nasa.gov/EPIC/api/natural?api_key=${this.nasaApiKey}`;
    // #region agent log
    fetch('http://127.0.0.1:7810/ingest/ccbf1bea-e97b-4d0b-8b88-bd0b1424931b', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': 'b5b3f8' },
      body: JSON.stringify({
        sessionId: 'b5b3f8',
        runId: 'pre-fix',
        hypothesisId: 'H5',
        location: 'app/services/earthdata.js:28',
        message: 'EPIC request start',
        data: { endpoint: 'https://api.nasa.gov/EPIC/api/natural', hasApiKey: Boolean(this.nasaApiKey) },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion

    const response = await fetch(url);
    if (!response.ok) {
      let errorSnippet = null;
      try {
        errorSnippet = (await response.text())?.slice(0, 200) ?? null;
      } catch {
        // ignore
      }

      // #region agent log
      fetch('http://127.0.0.1:7810/ingest/ccbf1bea-e97b-4d0b-8b88-bd0b1424931b', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': 'b5b3f8' },
        body: JSON.stringify({
          sessionId: 'b5b3f8',
          runId: 'pre-fix',
          hypothesisId: 'H5',
          location: 'app/services/earthdata.js:51',
          message: 'EPIC request failed',
          data: { status: response.status, statusText: response.statusText, errorSnippet },
          timestamp: Date.now(),
        }),
      }).catch(() => {});
      // #endregion

      if (response.status === 503) {
        return [];
      }
      throw new Error(`Failed to fetch EPIC images (${response.status})`);
    }

    // #region agent log
    fetch('http://127.0.0.1:7810/ingest/ccbf1bea-e97b-4d0b-8b88-bd0b1424931b', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': 'b5b3f8' },
      body: JSON.stringify({
        sessionId: 'b5b3f8',
        runId: 'pre-fix',
        hypothesisId: 'H5',
        location: 'app/services/earthdata.js:69',
        message: 'EPIC request ok',
        data: { status: response.status },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion

    const data = await response.json();
    return data.map((item) => {
      const date = item.date.split(' ')[0];
      const [year, month, day] = date.split('-');
      return {
        ...item,
        url: `https://epic.gsfc.nasa.gov/archive/natural/${year}/${month}/${day}/png/${item.image}.png`,
      };
    });
  }

  getGibsLayers() {
    return [
      {
        id: 'MODIS_Terra_CorrectedReflectance_TrueColor',
        title: 'MODIS Terra Corrected Reflectance (True Color)',
        format: 'image/jpeg',
      },
      {
        id: 'VIIRS_SNPP_CorrectedReflectance_TrueColor',
        title: 'VIIRS SNPP Corrected Reflectance (True Color)',
        format: 'image/jpeg',
      },
      {
        id: 'Coastlines_15m',
        title: 'Coastlines',
        format: 'image/png',
      },
    ];
  }

  getGibsUrl(layerId, date, _projection = 'geographic', _tileMatrixSet = '250m', format = 'image/jpeg') {
    const time = date.toISOString().split('T')[0];
    return {
      baseUrl: 'https://gibs.earthdata.nasa.gov/wms/epsg3857/best/wms.cgi',
      layers: layerId,
      format,
      time,
    };
  }
}

