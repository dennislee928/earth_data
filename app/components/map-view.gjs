import { LeafletMap, TileLayer, Marker, Popup } from 'ember-leaflet';

<template>
  <div class="map-container">
    <LeafletMap @lat={{0}} @lng={{0}} @zoom={{2}}>
      <TileLayer @url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      
      {{#if @selectedLayer}}
        <TileLayer @url={{@gibsUrl}} @opacity={{0.8}} />
      {{/if}}

      {{#if @showEonet}}
        {{#each @eonetEvents as |event|}}
          {{#each event.geometry as |geo|}}
            <Marker @lat={{get geo.coordinates 1}} @lng={{get geo.coordinates 0}}>
              <Popup>
                <strong>{{event.title}}</strong><br />
                Category: {{get (get event.categories 0) 'title'}}<br />
                Date: {{geo.date}}
              </Popup>
            </Marker>
          {{/each}}
        {{/each}}
      {{/if}}
    </LeafletMap>
  </div>
</template>
