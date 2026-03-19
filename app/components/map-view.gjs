import { get } from '@ember/object';
import { modifier } from 'ember-modifier';
import L from 'leaflet';

const leafletMap = modifier((element, [selectedLayer, gibsUrl, eonetEvents, showEonet]) => {
  const map = L.map(element).setView([0, 0], 2);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors',
  }).addTo(map);

  let gibsLayer = null;
  if (selectedLayer && gibsUrl) {
    gibsLayer = L.tileLayer(gibsUrl, { opacity: 0.8 });
    gibsLayer.addTo(map);
  }

  const markers = [];
  if (showEonet && Array.isArray(eonetEvents)) {
    for (const event of eonetEvents) {
      for (const geo of event?.geometry ?? []) {
        const lat = geo?.coordinates?.[1];
        const lng = geo?.coordinates?.[0];
        if (typeof lat === 'number' && typeof lng === 'number') {
          const marker = L.marker([lat, lng]).addTo(map);
          marker.bindPopup(
            `<strong>${event?.title ?? ''}</strong><br/>Category: ${
              get(event, 'categories.0.title') ?? ''
            }<br/>Date: ${geo?.date ?? ''}`
          );
          markers.push(marker);
        }
      }
    }
  }

  return () => {
    for (const marker of markers) marker.remove();
    if (gibsLayer) gibsLayer.remove();
    map.remove();
  };
});

// #region agent log
fetch('http://127.0.0.1:7810/ingest/ccbf1bea-e97b-4d0b-8b88-bd0b1424931b',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'b5b3f8'},body:JSON.stringify({sessionId:'b5b3f8',runId:'pre-fix',hypothesisId:'H1',location:'app/components/map-view.gjs:4',message:'map-view module loaded; get helper import type',data:{getType:typeof get},timestamp:Date.now()})}).catch(()=>{});
// #endregion

<template>
  <div class="map-container">
    <div
      class="leaflet-map"
      {{leafletMap @selectedLayer @gibsUrl @eonetEvents @showEonet}}
    ></div>
  </div>
</template>
