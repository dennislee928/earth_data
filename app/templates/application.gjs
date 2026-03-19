import { pageTitle } from 'ember-page-title';
import MapView from '../components/map-view';
import SearchPanel from '../components/search-panel';

<template>
  {{pageTitle "NASA EarthData"}}
  <h2 id="title">NASA EarthData Explorer</h2>

  <div class="main-container">
    <SearchPanel
      @selectedLayer={{@controller.selectedLayer}}
      @onSelectLayer={{@controller.selectLayer}}
      @date={{@controller.date}}
      @onDateChange={{@controller.updateDate}}
      @eonetEvents={{@controller.eonetEvents}}
      @epicImages={{@controller.epicImages}}
      @showEonet={{@controller.showEonet}}
      @onToggleEonet={{@controller.toggleEonet}}
    />
    <MapView
      @selectedLayer={{@controller.selectedLayer}}
      @gibsUrl={{@controller.gibsUrl}}
      @eonetEvents={{@controller.eonetEvents}}
      @showEonet={{@controller.showEonet}}
    />
  </div>

  {{outlet}}
</template>
