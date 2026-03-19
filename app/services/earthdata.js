import Service from '@ember/service';
import fetch from 'fetch';

export default class EarthdataService extends Service {
  cmrEndpoint = 'https://cmr.earthdata.nasa.gov/search/collections.json';

  async searchCollections(params = {}) {
    const query = new URLSearchParams(params).toString();
    const response = await fetch(`${this.cmrEndpoint}?${query}`);
    if (!response.ok) {
      throw new Error('Failed to fetch collections from CMR');
    }
    const data = await response.json();
    return data.feed.entry;
  }

  getGibsLayers() {
    return [
      {
        id: 'MODIS_Terra_CorrectedReflectance_TrueColor',
        title: 'MODIS Terra Corrected Reflectance (True Color)',
        format: 'jpg',
        projection: 'geographic',
        tileMatrixSet: '250m',
      },
      {
        id: 'VIIRS_SNPP_CorrectedReflectance_TrueColor',
        title: 'VIIRS SNPP Corrected Reflectance (True Color)',
        format: 'jpg',
        projection: 'geographic',
        tileMatrixSet: '250m',
      },
      {
        id: 'Coastlines_15m',
        title: 'Coastlines',
        format: 'png',
        projection: 'geographic',
        tileMatrixSet: '250m',
      }
    ];
  }

  getGibsUrl(layerId, date, projection = 'geographic', tileMatrixSet = '250m', format = 'jpg') {
    const time = date.toISOString().split('T')[0];
    return `https://gibs.earthdata.nasa.gov/wmts/${projection}/best/${layerId}/default/${time}/${tileMatrixSet}/{z}/{y}/{x}.${format}`;
  }
}
