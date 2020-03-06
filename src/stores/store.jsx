import config from "../config";
import async from 'async';
// import * as moment from 'moment';
import {
  ERROR,
  GET_BALANCES,
  BALANCES_RETURNED,
  TRADE,
  TRADE_RETURNED,
  GET_TRADES,
  TRADES_RETURNED,
} from '../constants';
import Web3 from 'web3';

import {
  injected,
  walletconnect,
  walletlink,
  ledger,
  trezor,
  frame,
  fortmatic,
  portis,
  squarelink,
  torus,
  authereum
} from "./connectors";

// const rp = require('request-promise');
// const ethers = require('ethers');

const Dispatcher = require('flux').Dispatcher;
const Emitter = require('events').EventEmitter;

const dispatcher = new Dispatcher();
const emitter = new Emitter();


class Store {
  constructor() {

    this.store = {
      collateralOptions: [
        {
          id: 'dai',
          symbol: 'DAI',
          name: 'DAI',
          description: 'DAI Stablecoin',
          erc20address: '0x6b175474e89094c44da98b954eedeac495271d0f',
          decimals: 18,
          balance: 0,
        },
        {
          id: 'usdt',
          symbol: 'USDT',
          name: 'USDT',
          description: 'Tether USD',
          erc20address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
          decimals: 6,
          balance: 0,
        },
        {
          id: 'usdc',
          symbol: 'USDC',
          name: 'USD Coin',
          description: 'USD//C',
          erc20address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
          decimals: 6,
          balance: 0,
        },
        {
          id: 'busd',
          symbol: 'BUSD',
          name: 'BUSD',
          description: 'Binance USD',
          erc20address: '0x4fabb145d64652a948d72533023f6e7a623c7c53',
          decimals: 18,
          balance: 0,
        }
      ],
      trades: [],
      account: {},
      web3: null,
      connectorsByName: {
        MetaMask: injected,
        TrustWallet: injected,
        WalletConnect: walletconnect,
        WalletLink: walletlink,
        Ledger: ledger,
        Trezor: trezor,
        Frame: frame,
        Fortmatic: fortmatic,
        Portis: portis,
        Squarelink: squarelink,
        Torus: torus,
        Authereum: authereum
      },
      web3context: null,
      languages: [
        {
          language: 'English',
          code: 'en'
        },
        {
          language: 'Japanese',
          code: 'ja'
        },
        {
          language: 'Chinese',
          code: 'zh'
        }
      ],
    }

    dispatcher.register(
      function (payload) {
        switch (payload.type) {
          case GET_BALANCES:
            this.getBalances(payload)
            break;
          case TRADE:
            this.trade(payload)
            break;
          case GET_TRADES:
            this.getTrades(payload)
            break;
          default: {
          }
        }
      }.bind(this)
    );
  }

  getStore(index) {
    return(this.store[index]);
  };

  setStore(obj) {
    this.store = {...this.store, ...obj}
    // console.log(this.store)
    return emitter.emit('StoreUpdated');
  };

  _checkApproval = async (asset, account, amount, contract, callback) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);
    let erc20Contract = new web3.eth.Contract(config.erc20ABI, asset.erc20address)
    try {
      const allowance = await erc20Contract.methods.allowance(account.address, contract).call({ from: account.address })

      const ethAllowance = web3.utils.fromWei(allowance, "ether")

      if(parseFloat(ethAllowance) < parseFloat(amount)) {
        /*
          code to accomodate for "assert _value == 0 or self.allowances[msg.sender][_spender] == 0" in contract
          We check to see if the allowance is > 0. If > 0 set to 0 before we set it to the correct amount.
        */
        if(['crvV1', 'crvV2', 'crvV3', 'crvV4', 'USDTv1', 'USDTv2', 'USDTv3'].includes(asset.id) && ethAllowance > 0) {
          await erc20Contract.methods.approve(contract, web3.utils.toWei('0', "ether")).send({ from: account.address, gasPrice: web3.utils.toWei('6', 'gwei') })
        }

        await erc20Contract.methods.approve(contract, web3.utils.toWei(amount, "ether")).send({ from: account.address, gasPrice: web3.utils.toWei('6', 'gwei') })
        callback()
      } else {
        callback()
      }
    } catch(error) {
      if(error.message) {
        return callback(error.message)
      }
      callback(error)
    }
  }

  getBalances = async () => {
    const account = store.getStore('account')
    const assets = store.getStore('collateralOptions')

    const web3 = new Web3(store.getStore('web3context').library.provider);

    async.map(assets, (asset, callback) => {
      async.parallel([
        (callbackInner) => { this._getERC20Balance(web3, asset, account, callbackInner) },
      ], (err, data) => {
        asset.balance = data[0]

        callback(null, asset)
      })
    }, (err, assets) => {
      if(err) {
        return emitter.emit(ERROR, err)
      }

      store.setStore({ assets: assets })
      return emitter.emit(BALANCES_RETURNED, assets)
    })
  }

  _getERC20Balance = async (web3, asset, account, callback) => {
    let erc20Contract = new web3.eth.Contract(config.erc20ABI, asset.erc20address)

    try {
      var balance = await erc20Contract.methods.balanceOf(account.address).call({ from: account.address });
      balance = parseFloat(balance)/10**asset.decimals
      callback(null, parseFloat(balance))
    } catch(ex) {
      console.log(ex)
      return callback(ex)
    }
  }

  trade = (payload) => {
    const account = store.getStore('account')
    const { collateralAsset, receiveAsset, collateralAmount, leverage } = payload.content

    this._checkApproval(collateralAsset, account, collateralAmount, config.traderContractAddress, (err) => {
      if(err) {
        return emitter.emit(ERROR, err);
      }
      this._callITrade(collateralAsset, receiveAsset, account, collateralAmount, leverage, (err, tradeResult) => {
        if(err) {
          return emitter.emit(ERROR, err);
        }

        return emitter.emit(TRADE_RETURNED, tradeResult)
      })
    })
  }

  _callITrade = async (collateralAsset, receiveAsset, account, amount, leverage, callback) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);

    const collateralContract = new web3.eth.Contract(config.traderContractABI, config.traderContractAddress)

    var amountToSend = (amount*10**collateralAsset.decimals) + ''
    var amountToReceive = (amount*leverage*10**receiveAsset.decimals) + ''

    console.log(account.address)
    console.log(collateralAsset.erc20address)
    console.log(receiveAsset.erc20address)
    console.log(amountToSend)
    console.log(amountToReceive)
    console.log(leverage)

    collateralContract.methods.addCollateral(collateralAsset.erc20address, receiveAsset.erc20address, amountToSend, amountToReceive, leverage).send({ from: account.address, gasPrice: web3.utils.toWei('6', 'gwei') })
      .on('transactionHash', function(hash){
        console.log(hash)
        callback(null, hash)
      })
      .on('confirmation', function(confirmationNumber, receipt){
        console.log(confirmationNumber, receipt);
      })
      .on('receipt', function(receipt){
        console.log(receipt);
      })
      .on('error', function(error) {
        if (!error.toString().includes("-32601")) {
          if(error.message) {
            return callback(error.message)
          }
          callback(error)
        }
      })
      .catch((error) => {
        if (!error.toString().includes("-32601")) {
          if(error.message) {
            return callback(error.message)
          }
          callback(error)
        }
      })
  }

  getTrades = (payload) => {

  }
}

var store = new Store();

export default {
  store: store,
  dispatcher: dispatcher,
  emitter: emitter
};
