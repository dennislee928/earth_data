import Service from '@ember/service';
import fetch from 'fetch';

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
    const response = await fetch(`https://api.nasa.gov/EPIC/api/natural?api_key=${this.nasaApiKey}`);
    if (!response.ok) {
      throw new Error('Failed to fetch EPIC images');
    }
    const data = await response.json();
    return data.map(item => {
      const date = item.date.split(' ')[0];
      const [year, month, day] = date.split('-');
      return {
        ...item,
        url: `https://epic.gsfc.nasa.gov/archive/natural/${year}/${month}/${day}/png/${item.image}.png`
      };
    });
  }

  getLandsatUrl(lat, lon, date) {
    const dateStr = date.toISOString().split('T')[0];
    return `https://api.nasa.gov/planetary/earth/imagery?lat=${lat}&lon=${lon}&date=${dateStr}&api_key=${this.nasaApiKey}`;
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
