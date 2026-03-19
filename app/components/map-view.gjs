import { get } from '@ember/object';
import { modifier } from 'ember-modifier';
import L from 'leaflet';
import markerIconUrl from 'leaflet/dist/images/marker-icon.png';
import markerIcon2xUrl from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadowUrl from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2xUrl,
  iconUrl: markerIconUrl,
  shadowUrl: markerShadowUrl,
});

const leafletMap = modifier((element, [selectedLayer, gibsConfig, eonetEvents, showEonet]) => {
  const map = L.map(element).setView([0, 0], 2);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors',
  }).addTo(map);

  let gibsLayer = null;
  if (selectedLayer && gibsConfig?.baseUrl && gibsConfig?.layers) {
    gibsLayer = L.tileLayer.wms(gibsConfig.baseUrl, {
      layers: gibsConfig.layers,
      format: gibsConfig.format ?? 'image/jpeg',
      transparent: true,
      time: gibsConfig.time,
      opacity: 0.8,
      crossOrigin: true,
    });
    gibsLayer.on('tileerror', (e) => {
      // #region agent log
      fetch('http://127.0.0.1:7810/ingest/ccbf1bea-e97b-4d0b-8b88-bd0b1424931b', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': 'b5b3f8' },
        body: JSON.stringify({
          sessionId: 'b5b3f8',
          runId: 'pre-fix',
          hypothesisId: 'H7',
          location: 'app/components/map-view.gjs:39',
          message: 'GIBS WMS tileerror',
          data: { url: e?.tile?.src ?? null },
          timestamp: Date.now(),
        }),
      }).catch(() => {});
      // #endregion
    });
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

  // #region agent log
  fetch('http://127.0.0.1:7810/ingest/ccbf1bea-e97b-4d0b-8b88-bd0b1424931b', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': 'b5b3f8' },
    body: JSON.stringify({
      sessionId: 'b5b3f8',
      runId: 'pre-fix',
      hypothesisId: 'H7',
      location: 'app/components/map-view.gjs:52',
      message: 'leafletMap rendered',
      data: {
        showEonet,
        eonetEventsCount: Array.isArray(eonetEvents) ? eonetEvents.length : null,
        markersCreated: markers.length,
        hasGibsLayer: Boolean(gibsLayer),
        gibsMode: gibsConfig?.baseUrl ? 'wms' : 'none',
      },
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion

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
