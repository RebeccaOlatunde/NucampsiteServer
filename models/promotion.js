const mongoose = require('mongoose')
const Schema = mongoose.Schema

require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

const promotionSchema = new Schema ({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    elevation: {
        type: Number,
        required: true
    },
    cost: {
        type: Currency,
        required: true,
        min: 0
    },
    comments: [commentSchema]
}, {
    timestamps: true
});
const Promotion = mongoose.model('Promotion', promotionSchema);

module.exports = Promotion;
