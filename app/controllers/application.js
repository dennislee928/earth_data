import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

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
  }

  async fetchNasaApis() {
    try {
      this.eonetEvents = await this.earthdata.getEonetEvents();
      this.epicImages = await this.earthdata.getEpicImages();
    } catch (e) {
      console.error('Error fetching NASA APIs:', e);
    }
  }
}
