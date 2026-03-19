import { LeafletMap, TileLayer, Marker, Popup } from 'ember-leaflet';
import { get } from 'ember-truth-helpers';

// #region agent log
fetch('http://127.0.0.1:7810/ingest/ccbf1bea-e97b-4d0b-8b88-bd0b1424931b',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'b5b3f8'},body:JSON.stringify({sessionId:'b5b3f8',runId:'pre-fix',hypothesisId:'H1',location:'app/components/map-view.gjs:4',message:'map-view module loaded; get helper import type',data:{getType:typeof get},timestamp:Date.now()})}).catch(()=>{});
// #endregion

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
