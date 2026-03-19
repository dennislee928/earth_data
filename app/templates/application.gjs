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
    />
    <MapView 
      @selectedLayer={{@controller.selectedLayer}} 
      @gibsUrl={{@controller.gibsUrl}}
    />
  </div>

  {{outlet}}
</template>
