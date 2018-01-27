const Item = require('./Item')
const ItemsTypes = require('adex-constants').items.ItemsTypes

class Campaign extends Item {
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
        _bids,
        _syncedIpfs,
        _deleted,
        _items,
        _archived,
        _from,
        _to,
    } = {}) {
        super({
            fullName: fullName,
            owner: owner,
            type: ItemsTypes.Campaign.id,
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

        this.from = _from
        this.to = _to
    }

    get from() { return this._meta.from }
    set from(value) { this._meta.from = value }

    get to() { return this._meta.to }
    set to(value) { this._meta.to = value }
}

module.exports = Campaign

