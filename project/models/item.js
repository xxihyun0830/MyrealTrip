const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;

var schema = new Schema({
    user_id : {type: Schema.Types.ObjectId, ref : 'User'},
    title : {type: String, trim:true, required:true},
    place : {type: String, trim:true, required:true},
    content :{type: String, trim:true, required:true},
    course :{type: String, trim:true },
    numComments: {type:Number, default:0},
    numLikes: {type: Number, default:0},
    
    price : {type : Number, default : 0, required:true},
    createdAt : {type : Date, default : Date.now}
},{
    toJSON: {virtuals:true},
    toObject : {virtuals : true}
});

schema.plugin(mongoosePaginate);

var Item = mongoose.model('Item', schema);

module.exports = Item;