import Component from '@glimmer/component';
import { LeafletMap, TileLayer } from 'ember-leaflet';
import { inject as service } from '@ember/service';

<template>
  <div class="map-container">
    <LeafletMap @lat={{0}} @lng={{0}} @zoom={{2}}>
      <TileLayer @url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      
      {{#if @selectedLayer}}
        <TileLayer @url={{@gibsUrl}} @opacity={{0.8}} />
      {{/if}}
    </LeafletMap>
  </div>
</template>

export default class MapViewComponent extends Component {}
