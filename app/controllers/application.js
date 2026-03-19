import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class ApplicationController extends Controller {
  @service earthdata;
  @tracked selectedLayer = null;
  @tracked date = new Date();

  constructor() {
    super(...arguments);
    // Set default layer
    this.selectedLayer = this.earthdata.getGibsLayers()[0];
  }

  get gibsUrl() {
    if (!this.selectedLayer) return null;
    return this.earthdata.getGibsUrl(this.selectedLayer.id, this.date, this.selectedLayer.projection, this.selectedLayer.tileMatrixSet, this.selectedLayer.format);
  }

  @action
  selectLayer(layer) {
    this.selectedLayer = layer;
  }

  @action
  updateDate(selectedDates) {
    if (selectedDates.length > 0) {
      this.date = selectedDates[0];
    }
  }
}
