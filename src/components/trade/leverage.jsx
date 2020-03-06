import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import {
  Typography
} from '@material-ui/core';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';

import { withNamespaces } from 'react-i18next';

const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    marginBottom: '12px'
  },
  inputCardHeading: {
    width: '100%',
    padding: '12px 0px 12px 20px'
  },
});

class Leverage extends Component {
  constructor() {
    super()

  }

  render() {
    const { classes, t, leverage } = this.props;

    return (
      <div className={ classes.root }>
        <Typography variant='h3' className={ classes.inputCardHeading }>{ t("Trade.Leverage") }</Typography>
        <ToggleButtonGroup value={ leverage } onChange={this.handleTabChange} aria-label="version" exclusive size={ 'small' }>
          <ToggleButton value={75} aria-label="v3">
            <Typography variant={ 'h3' }>75X</Typography>
          </ToggleButton>
          <ToggleButton value={100} aria-label="v3">
            <Typography variant={ 'h3' }>100X</Typography>
          </ToggleButton>
          <ToggleButton value={1000} aria-label="v3">
            <Typography variant={ 'h3' }>1000X</Typography>
          </ToggleButton>
        </ToggleButtonGroup>
      </div>
    )
  };

  handleTabChange = (event, newValue) => {
    this.props.setLeverage( newValue )
  };
}

export default withNamespaces()(withRouter(withStyles(styles)(Leverage)));
