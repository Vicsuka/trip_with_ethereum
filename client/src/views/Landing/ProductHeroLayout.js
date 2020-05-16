import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

import logo from "assets/img/logo_transparent.png";

const styles = (theme) => ({
  root: {
    color: theme.palette.common.white,
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.up('sm')]: {
      height: '80vh',
      minHeight: 500,
      maxHeight: 1300,
    },
  },
  container: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(14),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  backdrop: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: theme.palette.common.black,
    opacity: 0.5,
    zIndex: -1,
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    zIndex: -2,
  },
  logo: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(5),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    transition: 'width 2s, height 2s, transform 2s;',
    '&:hover': {
      transform: "rotate(360deg);",
    },
  },
  
});

function ProductHeroLayout(props) {
  const { backgroundClassName, children, classes } = props;

    return (
        <section className={classes.root}>        
            <Container className={classes.container}>
                <img
                    className={classes.logo}
                    src={logo}
                    alt="logo"
                    width="200"
                    height="200"

                />
                {children}
                <div className={classes.backdrop} />
                <div className={clsx(classes.background, backgroundClassName)} />
            </Container>
        </section>
    );
}

ProductHeroLayout.propTypes = {
  backgroundClassName: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ProductHeroLayout);