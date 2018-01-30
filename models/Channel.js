const Item = require('./Item')
const ItemsTypes = require('adex-constants').items.ItemsTypes

/**
 * TODO: Make Collection model for Channel andCampaign
 * They will not have ipfs meta, they will be used only for owners ease of use
 * TEMP: They will extend Item because teh UI works with that model structure
 */

class Channel extends Item {
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
        _deleted,
        _archived,
    } = {}) {
        super({
            fullName: fullName,
            owner: owner,
            type: ItemsTypes.Channel.id,
            img: img,
            size: size,
            adType: adType,
            _id: _id,
            _ipfs: _ipfs,
            _description: _description,
            _items: _items,
            _meta: _meta
        })
    }
}

module.exports = Channel
