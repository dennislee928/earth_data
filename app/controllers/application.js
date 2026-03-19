import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class ApplicationController extends Controller {
  @service earthdata;
  @tracked selectedLayer = null;
  @tracked date = new Date();
  @tracked eonetEvents = [];
  @tracked epicImages = [];
  @tracked showEonet = false;

  constructor() {
    super(...arguments);
    this.selectedLayer = this.earthdata.getGibsLayers()[0];
    this.fetchNasaApis();
  }

  @action
  selectLayer(layer) {
    this.selectedLayer = layer;
  }

  get gibsUrl() {
    if (!this.selectedLayer) return null;
    return this.earthdata.getGibsUrl(
      this.selectedLayer.id,
      this.date,
      this.selectedLayer.projection,
      this.selectedLayer.tileMatrixSet,
      this.selectedLayer.format
    );
  }

  @action
  updateDate(selectedDates) {
    if (selectedDates.length > 0) {
      this.date = selectedDates[0];
    }
  }

  @action
  toggleEonet() {
    this.showEonet = !this.showEonet;
    // #region agent log
    fetch('http://127.0.0.1:7810/ingest/ccbf1bea-e97b-4d0b-8b88-bd0b1424931b', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': 'b5b3f8' },
      body: JSON.stringify({
        sessionId: 'b5b3f8',
        runId: 'pre-fix',
        hypothesisId: 'H6',
        location: 'app/controllers/application.js:49',
        message: 'toggleEonet',
        data: { showEonet: this.showEonet, eonetEventsCount: this.eonetEvents?.length ?? null },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
  }

  async fetchNasaApis() {
    try {
      this.eonetEvents = await this.earthdata.getEonetEvents();
      this.epicImages = await this.earthdata.getEpicImages();
      // #region agent log
      fetch('http://127.0.0.1:7810/ingest/ccbf1bea-e97b-4d0b-8b88-bd0b1424931b', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': 'b5b3f8' },
        body: JSON.stringify({
          sessionId: 'b5b3f8',
          runId: 'pre-fix',
          hypothesisId: 'H6',
          location: 'app/controllers/application.js:61',
          message: 'fetched nasa apis',
          data: { eonetEventsCount: this.eonetEvents?.length ?? null, epicImagesCount: this.epicImages?.length ?? null },
          timestamp: Date.now(),
        }),
      }).catch(() => {});
      // #endregion
    } catch (e) {
      console.error('Error fetching NASA APIs:', e);
    }
  }
}
