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

    this.state = {
      value: 1
    }
  }

  render() {
    const { classes, t } = this.props;
    const {
      value,
    } = this.state

    return (
      <div className={ classes.root }>
        <Typography variant='h3' className={ classes.inputCardHeading }>{ t("Trade.Leverage") }</Typography>
        <ToggleButtonGroup value={value} onChange={this.handleTabChange} aria-label="version" exclusive size={ 'small' }>
          <ToggleButton value={0} aria-label="v1">
            <Typography variant={ 'h3' }>2X</Typography>
          </ToggleButton>
          <ToggleButton value={1} aria-label="v2">
            <Typography variant={ 'h3' }>5X</Typography>
          </ToggleButton>
          <ToggleButton value={2} aria-label="v3">
            <Typography variant={ 'h3' }>10X</Typography>
          </ToggleButton>
        </ToggleButtonGroup>
      </div>
    )
  };

  handleTabChange = (event, newValue) => {
    this.setState({value:newValue})
  };
}

export default withNamespaces()(withRouter(withStyles(styles)(Leverage)));
