import { LeafletMap, TileLayer } from 'ember-leaflet';

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
