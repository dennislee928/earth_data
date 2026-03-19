import Service from '@ember/service';

export default class NasaApiService extends Service {
  apiKey = 'F77hkODx7AIsKkGVDSTCbkdctPSYZHZCvDYbXVyW';
  baseUrl = 'https://api.nasa.gov';

  // APOD
  async getApod(date) {
    const d = date ? date.toISOString().split('T')[0] : '';
    const response = await fetch(`${this.baseUrl}/planetary/apod?api_key=${this.apiKey}&date=${d}`);
    return response.json();
  }

  // Mars Rover Photos
  async getMarsRoverPhotos(rover = 'curiosity', sol = 1000, camera = null) {
    let url = `${this.baseUrl}/mars-photos/api/v1/rovers/${rover}/photos?sol=${sol}&api_key=${this.apiKey}`;
    if (camera) url += `&camera=${camera}`;
    const response = await fetch(url);
    const data = await response.json();
    return data.photos;
  }

  // NeoWs (Asteroids)
  async getAsteroids(startDate, endDate) {
    const s = startDate.toISOString().split('T')[0];
    const e = endDate.toISOString().split('T')[0];
    const response = await fetch(`${this.baseUrl}/neo/rest/v1/feed?start_date=${s}&end_date=${e}&api_key=${this.apiKey}`);
    return response.json();
  }

  // DONKI (Space Weather)
  async getDonki(type = 'CME') {
    const response = await fetch(`${this.baseUrl}/DONKI/${type}?api_key=${this.apiKey}`);
    return response.json();
  }

  // NASA Image Library
  async searchLibrary(query) {
    const response = await fetch(`https://images-api.nasa.gov/search?q=${query}`);
    const data = await response.json();
    return data.collection.items;
  }

  // TechPort
  async getTechPort(id = '') {
    const response = await fetch(`${this.baseUrl}/techport/api/projects/${id}?api_key=${this.apiKey}`);
    return response.json();
  }

  // EONET
  async getEonet() {
    const response = await fetch('https://eonet.gsfc.nasa.gov/api/v3/events');
    const data = await response.json();
    return data.events;
  }

  // EPIC
  async getEpic() {
    const response = await fetch(`${this.baseUrl}/EPIC/api/natural?api_key=${this.apiKey}`);
    return response.json();
  }

  // Trek WMTS Logic
  getTrekUrl(body, mosaic, z, y, x) {
    const endpoints = {
      moon: 'https://moontrek.jpl.nasa.gov/trektiles/Moon/EQ',
      mars: 'https://marstrek.jpl.nasa.gov/trektiles/Mars/EQ',
      vesta: 'https://vestatrek.jpl.nasa.gov/trektiles/Vesta/EQ'
    };
    const base = endpoints[body.toLowerCase()];
    // Simplified WMTS template for the common mosaic
    return `${base}/${mosaic}/1.0.0/default/default028mm/${z}/${y}/${x}.jpg`;
  }

  // GIBS (Earth)
  getGibsUrl(layer, date) {
    const time = date.toISOString().split('T')[0];
    return `https://gibs.earthdata.nasa.gov/wmts/geographic/best/${layer}/default/${time}/250m/{z}/{y}/{x}.jpg`;
  }

  // CMR (Metadata)
  async searchCmr(keyword) {
    const response = await fetch(`https://cmr.earthdata.nasa.gov/search/collections.json?keyword=${keyword}`);
    const data = await response.json();
    return data.feed.entry;
  }
}
