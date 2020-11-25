import React from 'react';
import { Map as LeafletMap, TileLayer } from "react-leaflet";
import "./Map.css";
import { showDataOnMap } from "./util";

export const Map = ({ countries, casesType, center, zoom }) => {
  return (
    <div className="map">
      {/*<MapContainer center={center} zoom={zoom}>*/}
      <LeafletMap center={center} zoom={zoom}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        {showDataOnMap(countries, casesType)}
        {/*</MapContainer>*/}
      </LeafletMap>
    </div>
  )
}
