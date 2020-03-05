import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import {
  Card,
  Typography,
  Button
} from '@material-ui/core';

import Table from './table'
import Loader from '../loader'
import UnlockModal from '../unlock/unlockModal.jsx'
import Snackbar from '../snackbar'

import {
  ERROR,
  CONNECTION_CONNECTED,
  CONNECTION_DISCONNECTED,
  GET_TRADES,
  TRADES_RETURNED
} from '../../constants'

import { withNamespaces } from 'react-i18next';
import Store from "../../stores";
const emitter = Store.emitter
const dispatcher = Store.dispatcher
const store = Store.store

const styles = theme => ({
  root: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '1200px',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  tradeContainer: {
    flex: 1,
    display: 'flex',
    flexWrap: 'wrap',
    padding: '12px',
    borderRadius: '1.25em',
    maxWidth: '800px',
    width: '100%',
    justifyContent: 'center',
    marginTop: '20px',
    [theme.breakpoints.up('md')]: {
      padding: '24px',
    }
  },
  card: {
    width: '100%',
    display: 'flex',
    flexWrap: 'wrap',
    maxWidth: '800px',
    justifyContent: 'center',
    padding: '12px',
    minWidth: '100%',
    flexDirection: 'column',
    alignItems: 'center',
  },
  intro: {
    width: '100%',
    position: 'relative',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '800px'
  },
  introCenter: {
    minWidth: '100%',
    textAlign: 'center',
    padding: '48px 0px'
  },
  connectContainer: {
    padding: '12px',
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    maxWidth: '450px',
    [theme.breakpoints.up('md')]: {
      width: '450',
    }
  },
  actionButton: {
    '&:hover': {
      backgroundColor: "#2F80ED",
    },
    padding: '12px',
    backgroundColor: "#2F80ED",
    borderRadius: '1rem',
    border: '1px solid #E1E1E1',
    fontWeight: 500,
    [theme.breakpoints.up('md')]: {
      padding: '15px',
    }
  },
  buttonText: {
    fontWeight: '700',
    color: 'white',
  },
  sepperator: {
    borderBottom: '1px solid #E1E1E1',
    minWidth: '100%',
    marginBottom: '24px',
    marginTop: '24px'
  },
  addressContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    maxWidth: '100px',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    fontSize: '0.83rem',
    textOverflow:'ellipsis',
    cursor: 'pointer',
    padding: '10px',
    borderRadius: '0.75rem',
    height: 'max-content',
    [theme.breakpoints.up('md')]: {
      maxWidth: '130px',
      width: '100%'
    }
  },
  disaclaimer: {
    padding: '12px',
    border: '1px solid rgb(174, 174, 174)',
    borderRadius: '0.75rem',
    marginBottom: '24px',
  },
  notConnectedContainer: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '12px',
    minWidth: '100%',
    [theme.breakpoints.up('md')]: {
      minWidth: '800px',
    }
  },
});

class Positions extends Component {

  constructor() {
    super()

    const account = store.getStore('account')

    this.state = {
      account: account,
      trades: store.getStore('trades')
    }
  }

  componentWillMount() {
    emitter.on(ERROR, this.errorReturned);
    emitter.on(CONNECTION_CONNECTED, this.connectionConnected);
    emitter.on(CONNECTION_DISCONNECTED, this.connectionDisconnected);
    emitter.on(TRADES_RETURNED, this.tradesReturned);
  }

  componentWillUnmount() {
    emitter.removeListener(ERROR, this.errorReturned);
    emitter.removeListener(CONNECTION_CONNECTED, this.connectionConnected);
    emitter.removeListener(CONNECTION_DISCONNECTED, this.connectionDisconnected);
    emitter.removeListener(TRADES_RETURNED, this.tradesReturned);
  };

  tradesReturned = () => {
    this.setState({ trades: store.getStore('trades') })
  };

  connectionConnected = () => {
    this.setState({ account: store.getStore('account') })
  };

  connectionDisconnected = () => {
    this.setState({ account: store.getStore('account') })
  };

  errorReturned = (error) => {
    const snackbarObj = { snackbarMessage: null, snackbarType: null }
    this.setState(snackbarObj)
    this.setState({ loading: false })
    const that = this
    setTimeout(() => {
      const snackbarObj = { snackbarMessage: error.toString(), snackbarType: 'Error' }
      that.setState(snackbarObj)
    })
  };

  render() {
    const { classes, t } = this.props;
    const {
      account,
      loading,
      modalOpen,
      snackbarMessage,
    } = this.state

    var address = null;
    if (account.address) {
      address = account.address.substring(0,6)+'...'+account.address.substring(account.address.length-4,account.address.length)
    }

    return (
      <div className={ classes.root }>
        { !account.address &&
          <div className={ classes.notConnectedContainer }>
            <Typography variant={'h5'} className={ classes.disaclaimer }>This project is in beta. Use at your own risk.</Typography>
            <div className={ classes.introCenter }>
              <Typography variant='h2'>{ t('Trade.Intro') }</Typography>
            </div>
            <div className={ classes.connectContainer }>
              <Button
                className={ classes.actionButton }
                variant="outlined"
                color="primary"
                disabled={ loading }
                onClick={ this.overlayClicked }
                >
                <Typography className={ classes.buttonText } variant={ 'h5'}>{ t('Trade.Connect') }</Typography>
              </Button>
            </div>
          </div>
        }
        { account.address &&
          <div className={ classes.card }>
            <Typography variant={'h5'} className={ classes.disaclaimer }>This project is in beta. Use at your own risk.</Typography>
            <div className={ classes.intro }>
              <Typography variant='h2' className={ classes.introText }>{ t('Trade.Intro') }</Typography>
              <Card className={ classes.addressContainer } onClick={this.overlayClicked}>
                <Typography variant={ 'h5'} noWrap>{ address }</Typography>
                <div style={{ background: '#DC6BE5', opacity: '1', borderRadius: '10px', width: '10px', height: '10px', marginRight: '3px', marginTop:'3px', marginLeft:'6px' }}></div>
              </Card>
            </div>
            <Table />
          </div>
        }
        { modalOpen && this.renderModal() }
        { snackbarMessage && this.renderSnackbar() }
        { loading && <Loader /> }
      </div>
    )
  };

  renderModal = () => {
    return (
      <UnlockModal closeModal={ this.closeModal } modalOpen={ this.state.modalOpen } />
    )
  }

  renderSnackbar = () => {
    var {
      snackbarType,
      snackbarMessage
    } = this.state
    return <Snackbar type={ snackbarType } message={ snackbarMessage } open={true}/>
  };

  overlayClicked = () => {
    this.setState({ modalOpen: true })
  }

  closeModal = () => {
    this.setState({ modalOpen: false })
  }
}

export default withNamespaces()(withRouter(withStyles(styles)(Positions)));
