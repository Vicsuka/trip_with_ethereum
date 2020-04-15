import React from "react";
// creates a beautiful scrollbar
import ProductHero from '../views/Landing/ProductHero';

import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// import FixedPlugin from "components/FixedPlugin/FixedPlugin.js";

import styles from "assets/jss/material-dashboard-react/layouts/adminStyle.js";


let ps;


const useStyles = makeStyles(styles);

export default function Landing({ ...rest }) {
  // styles
  const classes = useStyles();
  // ref to help us initialize PerfectScrollbar on windows devices
  const mainPanel = React.createRef();

  // initialize and destroy the PerfectScrollbar plugin
  React.useEffect(() => {
    if (navigator.platform.indexOf("Win") > -1) {
      ps = new PerfectScrollbar(mainPanel.current, {
        suppressScrollX: true,
        suppressScrollY: false
      });
      document.body.style.overflow = "hidden";
    }
    // Specify how to clean up after this effect:
    return function cleanup() {
      if (navigator.platform.indexOf("Win") > -1) {
        ps.destroy();
      }
    };
  }, [mainPanel]);

  return (
    <div className={classes.wrapper}>
        <ProductHero />
    </div>
  );
}
