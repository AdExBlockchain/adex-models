const Base = require('./Base')
const  ItemsTypes = require('adex-constants').items.ItemsTypes

class Account extends Base {
    /**
    * NOTE:
    *   - _temp prop will be used for easy development at the moment to keep account data
    *   - _stats will be used only at the client model for easier access to account data from 
    *   smart contracts (balance of rth/adx, register status, approved adx for transfer etc...)        
    */
    constructor({ _name, _addr, _wallet, _ipfs, _meta, _temp, _stats = { balanceEth: 0, balanceAdx: 0, allowance: 0, isRegistered: false }, _settings = {} }) {
        super({ _name, _meta, _ipfs })
        this._addr = _addr
        this._wallet = _wallet || _addr
        this._stats = _stats
        this.settings = _settings

        this._items = {}

        for (var key in ItemsTypes) {
            if (ItemsTypes.hasOwnProperty(key)) {
                this._items[ItemsTypes[key].id] = []
            }
        }

        // Temp we will keep here some addr data 
        this._temp = _temp

        // console.log('accoount', this)
    }

    get addr() { return this._addr }
    set addr(value) { this._addr = value }

    get items() { return this._items }
    set items(value) { this._items = value }

    get campaigns() { return this._items[ItemsTypes.Campaign.id] }
    get adUnits() { return this._items[ItemsTypes.AdUnit.id] }
    get channels() { return this._items[ItemsTypes.Channel.id] }
    get adSlots() { return this._items[ItemsTypes.AdSlot.id] }

    get stats() { return this._stats }
    set stats(value) { this._stats = value }

    // Local settings (dapp)
    get settings() { return this._settings }
    set settings(value) { this._settings = value }

    get temp() { return this._temp }
    set temp(value) { this._temp = value }

    // TODO: fix it and validate
    addItem(item) {
        this._items[item._type].push(item._id)
    }
}

module.exports = Account
