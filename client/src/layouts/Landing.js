import React from "react";
// creates a beautiful scrollbar
import ProductHero from '../views/Landing/ProductHero';

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// import FixedPlugin from "components/FixedPlugin/FixedPlugin.js";

import styles from "assets/jss/material-dashboard-react/layouts/adminStyle.js";


const useStyles = makeStyles(styles);

export default function Landing({ ...rest }) {
  // styles
  const classes = useStyles();

  return (
    <div className={classes.wrapper}>
        <ProductHero />
    </div>
  );
}
