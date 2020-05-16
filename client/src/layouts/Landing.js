import React from "react";
// Landingpage component
import ProductHero from '../views/Landing/ProductHero';

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

import styles from "assets/jss/material-dashboard-react/layouts/adminStyle.js";


const useStyles = makeStyles(styles);

export default function Landing() {
  const classes = useStyles();

  return (
    <div className={classes.wrapper}>
        <ProductHero />
    </div>
  );
}
