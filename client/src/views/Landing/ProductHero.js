import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '../../components/Landing/Button';
import Typography from '../../components/Landing/Typography';
import ProductHeroLayout from './ProductHeroLayout';

import logo from "assets/img/logo_transparent.png";
import backgroundImage from "assets/img/landing.jpg";

const styles = (theme) => ({
  background: {
    backgroundImage: `url(${backgroundImage})`,
    backgroundColor: '#7fc7d9',
    backgroundPosition: 'center',
  },
  button: {
    minWidth: 200,
  },
  h5: {
    marginBottom: theme.spacing(4),
    marginTop: theme.spacing(4),
    [theme.breakpoints.up('sm')]: {
      marginTop: theme.spacing(10),
    },
  },
  more: {
    marginTop: theme.spacing(2),
  },
});

function ProductHero(props) {
  const { classes } = props;

  return (
    <ProductHeroLayout backgroundClassName={classes.background}>
      {/* Increase the network loading priority of the background image. */}
      <img style={{ display: 'none' }} src={logo} alt="increase priority" />
      <Typography color="inherit" align="center" variant="h2" marked="center">
        Trip with Ethereum
      </Typography>
      <Typography color="inherit" align="center" variant="h5" className={classes.h5}>
        Smart Contract protected travelling, powered by Ethereum
      </Typography>
      <Button
        color="secondary"
        variant="contained"
        size="large"
        className={classes.button}
        component="a"
        href="/login"
      >
        Get started
      </Button>
      <Typography variant="body2" color="inherit" className={classes.more}>
        Discover the experience
      </Typography>
    </ProductHeroLayout>
  );
}

ProductHero.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ProductHero);