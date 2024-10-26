
mongoose = require("mongoose")
const schema=mongoose.Schema(
    {
        userId:{type:mongoose.Schema.Types.ObjectId,ref:"users"},
        message:{type:String},
        postdate:{type:Date,default:Date.now}
        
    }
)
var announcementModel=mongoose.model("announcements",schema)
module.exports=announcementModel