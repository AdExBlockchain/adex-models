const Item = require('./Item')
const ItemsTypes = require('adex-constants').items.ItemsTypes

class AdSlot extends Item {
    constructor({
        _meta = {},
        fullName,
        owner,
        img,
        size,
        adType,
        _id,
        _ipfs,
        _description,
        _items,
        _bids,
        _syncedIpfs,
        _deleted,
        _archived
    } = {}) {
        super({
            fullName: fullName,
            owner: owner,
            type: ItemsTypes.AdSlot.id,
            img: img,
            size: size,
            adType: adType,
            _id: _id,
            _ipfs: _ipfs,
            _description: _description,
            _items: _items,
            _meta: _meta,
            _syncedIpfs: _syncedIpfs
        })

        this.bids = _meta.bids || []
    }

    get bids() { return this._bids }
    set bids(value) { this._bids = value }
}

module.exports = AdSlot
