
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const ship_historySchema = require('./ship_historySchema');
const ship_historyModel = mongoose.model('ship_history', ship_historySchema, 'ship_history');

const selectHistory = async (idOrder) => {
    try
    {
        return await ship_historyModel.find({}).exec();
    }
    catch(err)
    {
        return null;
    }
}

const insertHistory = async(history) => {
    try
    {
        return await ship_historyModel.create(history);
    }
    catch(err)
    {
        return null;
    }
}
module.exports = {
    selectHistory, insertHistory
}