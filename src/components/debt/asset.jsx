import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import {
  Typography,
  TextField,
  Button
} from '@material-ui/core';
import { withNamespaces } from 'react-i18next';

import {
  ERROR,
  EXIT_POSITION,
  EXIT_POSITION_RETURNED,
  CLOSE_POSITION,
  CLOSE_POSITION_RETURNED,
  WITHDRAW_PRINCIPAL,
  WITHDRAW_PRINCIPAL_RETURNED,
  REPAY_DEBT,
  REPAY_DEBT_RETURNED,
} from '../../constants'

import Store from "../../stores";
const emitter = Store.emitter
const dispatcher = Store.dispatcher
const store = Store.store


const styles = theme => ({
  value: {
    cursor: 'pointer'
  },
  actionInput: {
    padding: '0px 0px 12px 0px',
    fontSize: '0.5rem'
  },
  balances: {
    marginBottom: '-25px',
    marginRight: '30px',
    zIndex: '900',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between'
  },
  actionsContainer: {
    paddingBottom: '12px',
    display: 'flex',
    justifyContent: 'space-between',
    maxWidth: '100%',
    flexWrap: 'wrap',
    flexDirection: 'column',
    [theme.breakpoints.up('sm')]: {
      padding: '12px',
      flexWrap: 'wrap',
      flexDirection: 'row',
    }
  },
  title: {
    paddingRight: '24px'
  },
  actionButton: {
    padding: '12px',
    backgroundColor: 'white',
    borderRadius: '1rem',
    border: '1px solid #E1E1E1',
    fontWeight: 500,
    [theme.breakpoints.up('sm')]: {
      padding: '15px',
    }
  },
  tradeSettleContainer: {
    width: '100%',
    padding: '0px 24px'
  },
  tradeContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    padding: '24px 12px 24px 12px',
    alignItems: 'center',
    [theme.breakpoints.up('sm')]: {
      padding: '0px 12px 24px 12px',
      flex: '1',
      justifyContent: 'flex-end'
    }
  },
  sepperator: {
    borderBottom: '1px solid #E1E1E1',
    [theme.breakpoints.up('sm')]: {
      display: 'none'
    }
  },
  scaleContainer: {
    width: '250px',
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0px 0px 12px 0px',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  scale: {
    minWidth: '10px'
  },
  buttonText: {
    fontWeight: '700',
  },
  headingContainer: {
    width: '100%',
    display: 'flex',
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    }
  },
  heading: {
    paddingBottom: '12px',
    flex: 1,
    flexShrink: 0,
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    }
  },
  right: {
    textAlign: 'right'
  }
});


class Asset extends Component {

  constructor() {
    super()

    this.state = {
      principalAmount: '',
      principalAmountError: false,
      debtAmount: '',
      debtAmountError: false,
      positionAmount: '',
      positionAmountError: false,
      account: store.getStore('account'),
    }
  }

  componentWillMount() {
    emitter.on(REPAY_DEBT_RETURNED, this.repayDebtReturned);
    emitter.on(CLOSE_POSITION_RETURNED, this.closePositionReturned);
    emitter.on(EXIT_POSITION_RETURNED, this.exitPositionReturned);
    emitter.on(WITHDRAW_PRINCIPAL_RETURNED, this.withdrawPrincipalReturned);
    emitter.on(ERROR, this.errorReturned);
  }

  componentWillUnmount() {
    emitter.removeListener(REPAY_DEBT_RETURNED, this.repayDebtReturned);
    emitter.removeListener(CLOSE_POSITION_RETURNED, this.closePositionReturned);
    emitter.removeListener(EXIT_POSITION_RETURNED, this.exitPositionReturned);
    emitter.removeListener(WITHDRAW_PRINCIPAL_RETURNED, this.withdrawPrincipalReturned);
    emitter.removeListener(ERROR, this.errorReturned);
  };

  repayDebtReturned = () => {
    this.setState({ loading: false, debtAmount: '' })
  };

  exitPositionReturned = (txHash) => {
    this.setState({ loading: false })
  };

  closePositionReturned = (txHash) => {
    this.setState({ loading: false, positionAmount: '' })
  };

  withdrawPrincipalReturned = (txHash) => {
    this.setState({ loading: false, principalAmount: '' })
  };

  errorReturned = (error) => {
    this.setState({ loading: false })
  };

  render() {
    const { classes, asset, t } = this.props;
    const {
      account,
      principalAmount,
      principalAmountError,
      debtAmount,
      debtAmountError,
      positionAmount,
      positionAmountError,
      loading
    } = this.state

    return (<div className={ classes.actionsContainer }>
      <div className={classes.tradeContainer}>
        <div className={ classes.balances }>
          <Typography variant='h3' className={ classes.title }></Typography><Typography variant='h4' onClick={ () => { this.setPrincipalAmount(100) } } className={ classes.value } noWrap>{ 'Principal: '+ (asset.principal ? asset.principal.toFixed(4) : '0.0000') } { asset.symbol }</Typography>
        </div>
        <div className={ classes.amountContainer }>
          <TextField
            fullWidth
            className={ classes.actionInput }
            id='principalAmount'
            value={ principalAmount }
            error={ principalAmountError }
            onChange={ this.onChange }
            disabled={ loading }
            placeholder="0.00"
            variant="outlined"
            onKeyDown={ this.inputPrincipalKeyDown }
          />
        </div>
        <div className={ classes.scaleContainer }>
          <Button
            className={ classes.scale }
            variant='text'
            disabled={ loading }
            color="primary"
            onClick={ () => { this.setPrincipalAmount(25) } }>
            <Typography variant={'h5'}>25%</Typography>
          </Button>
          <Button
            className={ classes.scale }
            variant='text'
            disabled={ loading }
            color="primary"
            onClick={ () => { this.setPrincipalAmount(50) } }>
            <Typography variant={'h5'}>50%</Typography>
          </Button>
          <Button
            className={ classes.scale }
            variant='text'
            disabled={ loading }
            color="primary"
            onClick={ () => { this.setPrincipalAmount(75) } }>
            <Typography variant={'h5'}>75%</Typography>
          </Button>
          <Button
            className={ classes.scale }
            variant='text'
            disabled={ loading }
            color="primary"
            onClick={ () => { this.setPrincipalAmount(100) } }>
            <Typography variant={'h5'}>100%</Typography>
          </Button>
        </div>
        <Button
          className={ classes.actionButton }
          variant="outlined"
          color="primary"
          disabled={ loading || !account.address }
          onClick={ this.onWithdrawPrincipal }
          >
          <Typography className={ classes.buttonText } variant={ 'h5'} color='secondary'>{ t('Asset.WithdrawPrincipal') }</Typography>
        </Button>
      </div>
      <div className={ classes.sepperator }></div>
      <div className={classes.tradeContainer}>
        <div className={ classes.balances }>
          <Typography variant='h3' className={ classes.title }></Typography><Typography variant='h4' onClick={ () => { this.setDebtAmount(100) } } className={ classes.value } noWrap>{ 'Balance: '+ (asset.balance ? asset.balance.toFixed(4) : '0.0000') } { asset.symbol }</Typography>
        </div>
        <div className={ classes.amountContainer }>
          <TextField
            fullWidth
            className={ classes.actionInput }
            id='debtAmount'
            value={ debtAmount }
            error={ debtAmountError }
            onChange={ this.onChange }
            disabled={ loading }
            placeholder="0.00"
            variant="outlined"
            onKeyDown={ this.inputDebtKeyDown }
          />
        </div>
        <div className={ classes.scaleContainer }>
          <Button
            className={ classes.scale }
            variant='text'
            disabled={ loading }
            color="primary"
            onClick={ () => { this.setDebtAmount(25) } }>
            <Typography variant={'h5'}>25%</Typography>
          </Button>
          <Button
            className={ classes.scale }
            variant='text'
            disabled={ loading }
            color="primary"
            onClick={ () => { this.setDebtAmount(50) } }>
            <Typography variant={'h5'}>50%</Typography>
          </Button>
          <Button
            className={ classes.scale }
            variant='text'
            disabled={ loading }
            color="primary"
            onClick={ () => { this.setDebtAmount(75) } }>
            <Typography variant={'h5'}>75%</Typography>
          </Button>
          <Button
            className={ classes.scale }
            variant='text'
            disabled={ loading }
            color="primary"
            onClick={ () => { this.setDebtAmount(100) } }>
            <Typography variant={'h5'}>100%</Typography>
          </Button>
        </div>
        <Button
          className={ classes.actionButton }
          variant="outlined"
          color="primary"
          disabled={ loading || !account.address }
          onClick={ this.onRepayDebt }
          >
          <Typography className={ classes.buttonText } variant={ 'h5'} color='secondary'>{ t('Asset.RepayDebt') }</Typography>
        </Button>
      </div>
      <div className={ classes.sepperator }></div>
      <div className={ classes.tradeContainer }>
        <div className={ classes.balances }>
          <Typography variant='h3' className={ classes.title }></Typography><Typography variant='h4' onClick={ () => { this.setPositionAmount(100) } } className={ classes.value } noWrap>{ 'Position: '+ (asset.position ? asset.position.toFixed(4) : '0.0000') } { asset.symbol }</Typography>
        </div>
        <div className={ classes.amountContainer }>
          <TextField
            fullWidth
            className={ classes.actionInput }
            id='positionAmount'
            value={ positionAmount }
            error={ positionAmountError }
            onChange={ this.onChange }
            disabled={ loading }
            placeholder="0.00"
            variant="outlined"
            onKeyDown={ this.inputDebtKeyDown }
          />
        </div>
        <div className={ classes.scaleContainer }>
          <Button
            className={ classes.scale }
            variant='text'
            disabled={ loading }
            color="primary"
            onClick={ () => { this.setPositionAmount(25) } }>
            <Typography variant={'h5'}>25%</Typography>
          </Button>
          <Button
            className={ classes.scale }
            variant='text'
            disabled={ loading }
            color="primary"
            onClick={ () => { this.setPositionAmount(50) } }>
            <Typography variant={'h5'}>50%</Typography>
          </Button>
          <Button
            className={ classes.scale }
            variant='text'
            disabled={ loading }
            color="primary"
            onClick={ () => { this.setPositionAmount(75) } }>
            <Typography variant={'h5'}>75%</Typography>
          </Button>
          <Button
            className={ classes.scale }
            variant='text'
            disabled={ loading }
            color="primary"
            onClick={ () => { this.setPositionAmount(100) } }>
            <Typography variant={'h5'}>100%</Typography>
          </Button>
        </div>
        <Button
          className={ classes.actionButton }
          variant="outlined"
          color="primary"
          disabled={ loading || !account.address || asset.disabled }
          onClick={ this.onClosePosition }
          >
          <Typography className={ classes.buttonText } variant={ 'h5'} color={asset.disabled?'':'secondary'}>{ t('Asset.ClosePosition') }</Typography>
        </Button>
      </div>
      <div className={ classes.tradeSettleContainer }>
        <Button
          className={ classes.actionButton }
          variant="outlined"
          color="primary"
          disabled={ loading || !account.address || asset.disabled }
          onClick={ this.onExitPosition }
          fullWidth
          >
          <Typography className={ classes.buttonText } variant={ 'h5'} color={asset.disabled?'':'secondary'}>{ t('Asset.ExitPosition') }</Typography>
        </Button>
      </div>
    </div>)
  };

  onChange = (event) => {
    let val = []
    val[event.target.id] = event.target.value
    this.setState(val)
  }

  inputDebtKeyDown = (event) => {
    if (event.which === 13) {
      this.onRepayDebt();
    }
  }

  inputPrincipalKeyDown = (event) => {
    if (event.which === 13) {
      this.onWithdrawPrincipal();
    }
  }

  inputPositionKeyDown = (event) => {
    if (event.which === 13) {
      this.onClosePosition();
    }
  }

  onRepayDebt = () => {
    this.setState({ debtAmountError: false })

    const { debtAmount } = this.state
    const { asset, startLoading } = this.props

    if(!debtAmount || isNaN(debtAmount) || debtAmount <= 0 || debtAmount > asset.balance) {
      this.setState({ debtAmountError: true })
      return false
    }

    this.setState({ loading: true })
    startLoading()
    dispatcher.dispatch({ type: REPAY_DEBT, content: { amount: debtAmount, asset: asset } })
  }

  onWithdrawPrincipal = () => {
    this.setState({ principalAmountError: false })

    const { principalAmount } = this.state
    const { asset, startLoading  } = this.props

    if(!principalAmount || isNaN(principalAmount) || principalAmount <= 0 || principalAmount > asset.principal) {
      this.setState({ principalAmountError: true })
      return false
    }

    this.setState({ loading: true })
    startLoading()
    dispatcher.dispatch({ type: WITHDRAW_PRINCIPAL, content: { amount: principalAmount, asset: asset } })
  }

  onClosePosition = () => {
    this.setState({ positionAmountError: false })

    const { positionAmount } = this.state
    const { asset, startLoading  } = this.props

    if(!positionAmount || isNaN(positionAmount) || positionAmount <= 0 || positionAmount > asset.position) {
      this.setState({ positionAmountError: true })
      return false
    }

    this.setState({ loading: true })
    startLoading()
    dispatcher.dispatch({ type: CLOSE_POSITION, content: { asset: asset, amount: positionAmount } })
  }

  onExitPosition = () => {
    const { asset, startLoading  } = this.props

    this.setState({ loading: true })
    startLoading()
    dispatcher.dispatch({ type: EXIT_POSITION, content: { asset: asset } })
  }

  setPrincipalAmount = (percent) => {
    if(this.state.loading) {
      return
    }

    const { asset } = this.props

    const balance = asset.principal
    let amount = balance*percent/100

    amount = Math.floor(amount*10000)/10000;
    this.setState({ principalAmount: amount.toFixed(4) })
  }

  setPositionAmount = (percent) => {
    if(this.state.loading) {
      return
    }

    const { asset } = this.props

    const balance = asset.position
    let amount = balance*percent/100

    amount = Math.floor(amount*10000)/10000;
    this.setState({ positionAmount: amount.toFixed(4) })
  }

  setDebtAmount = (percent) => {
    if(this.state.loading) {
      return
    }

    const { asset } = this.props

    const balance = asset.balance
    let amount = balance*percent/100

    amount = Math.floor(amount*10000)/10000;
    this.setState({ debtAmount: amount.toFixed(4) })
  }
}

export default withNamespaces()(withRouter(withStyles(styles, { withTheme: true })(Asset)));
