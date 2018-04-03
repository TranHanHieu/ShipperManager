const mongoose = require('mongoose');
const historyLocationSchema = require('../history_locations/historyLocationSchema');
let historyLocationModel = mongoose.model('history_location', historyLocationSchema);
const config = require('../../../configString.json');
const moment = require('moment-timezone');

const createOrUpdateLocation = async (location) => {
    try {
        //kiểm tra nếu tồn tại lịch sử cửa user, nếu tồn tại rồi thì update, chưa thì tạo mới
        // let resulft = await historyLocationModel.findOne({iduser: idUser}).exec()

        // if (resulft == null) {
            return await historyLocationModel.create(location);
            // if (historyLocation != null) {
            //     let temp = historyLocation.data
            //     temp.push(location)
            //     historyLocation.data.set(temp)
            //     return await historyLocation.save()
            // } else {
            //     return null
            // }

        // } else {
        //     let temp = resulft.data
        //     temp.push(location)
        //     resulft.data.set(temp)
        //     return await resulft.save()
        // }
    }
    catch (err) {
        return null;
    }
}
const getHistoryLocationByUser = async (iduser, date)=>{
    return await historyLocationModel.aggregate(
        [
            {
                $group: {
                    _id: {
                        iduser:"$iduser",
                        latitude:"$latitude",
                        longtitude:"$longtitude",
                        acc:"$acc",
                        date:"$date"
                    },
                }
            },
            {
                $match : {
                    "_id.date" : date,
                    "_id.user" :iduser
                }
            }
        ]
    ).exec();

}
module.exports = {
    createOrUpdateLocation,getHistoryLocationByUser
}