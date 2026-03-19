import Component from '@glimmer/component';
import { on } from '@ember/modifier';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { fn } from '@ember/helper';
import { eq } from 'ember-truth-helpers';
import EmberFlatpickr from 'ember-flatpickr/components/ember-flatpickr';

export default class SearchPanel extends Component {
  @service earthdata;
  @tracked query = '';
  @tracked datasets = [];
  @tracked loading = false;

  get gibsLayers() {
    return this.earthdata.getGibsLayers();
  }

  @action
  handleInput(e) {
    this.query = e.target.value;
  }

  @action
  async handleSearch(e) {
    e.preventDefault();
    this.loading = true;
    try {
      this.datasets = await this.earthdata.searchCollections({ keyword: this.query });
    } catch (err) {
      console.error(err);
    } finally {
      this.loading = false;
    }
  }

  <template>
    <div class="sidebar">
      <h3>NASA Events (EONET)</h3>
      <button 
        type="button" 
        class="layer-item {{if @showEonet 'active'}}"
        {{on "click" @onToggleEonet}}
      >
        {{if @showEonet "Hide Natural Events" "Show Natural Events"}}
      </button>

      <hr />

      <h3>GIBS Layers</h3>
      <div class="layer-list">
        {{#each this.gibsLayers as |layer|}}
          <button 
            type="button" 
            class="layer-item {{if (eq @selectedLayer.id layer.id) 'active'}}"
            {{on "click" (fn @onSelectLayer layer)}}
          >
            {{layer.title}}
          </button>
        {{/each}}
      </div>

      <hr />

      <h3>EPIC Full Disk</h3>
      <div class="epic-gallery">
        {{#each @epicImages as |img|}}
          <img src={{img.url}} title={{img.caption}} class="epic-thumb" alt="Earth Full Disk" />
        {{/each}}
      </div>

      <hr />

      <h3>Date Selection</h3>
      <EmberFlatpickr 
        @date={{@date}} 
        @onChange={{@onDateChange}} 
        @maxDate="today"
      />

      <hr />

      <h3>CMR Dataset Search</h3>
      <form {{on "submit" this.handleSearch}}>
        <input 
          type="text" 
          placeholder="Search datasets..." 
          value={{this.query}}
          {{on "input" this.handleInput}}
        />
        <button type="submit" disabled={{this.loading}}>
          {{if this.loading "Searching..." "Search"}}
        </button>
      </form>

      <div class="dataset-list">
        {{#if this.loading}}
          <p>Loading...</p>
        {{else}}
          {{#each this.datasets as |dataset|}}
            <div class="dataset-item">
              <strong>{{dataset.title}}</strong>
              <p>{{dataset.short_name}}</p>
            </div>
          {{/each}}
        {{/if}}
      </div>
    </div>
  </template>
}
