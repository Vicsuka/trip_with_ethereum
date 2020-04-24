import React, { useEffect } from 'react'
import { Map, Marker, Popup, TileLayer } from 'react-leaflet'
import { makeStyles } from '@material-ui/core';

// core components
import styles from "assets/jss/material-dashboard-react/components/customMapStyle.js";

const useStyles = makeStyles(styles);

export default function CustomMap(props) {
  const classes = useStyles();
  
  const {position, zoom} = props;

  console.log("Positions",position);
  console.log(zoom);

  useEffect(() => {
    
  }, [])

  return (
    <Map center={position} zoom={zoom} className={classes.mapHeight}> 
      <TileLayer 
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position}>
        <Popup>A pretty CSS3 popup.<br />Easily customizable.</Popup>
      </Marker>
    </Map>
  );
}
