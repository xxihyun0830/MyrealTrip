const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;

var schema = new Schema({
    user_id : {type:Schema.Types.ObjectId, ref : 'User'},
    title : {type: String, trim:true, required:true},
    place : {type: String, trim:true, required:true},
    content :{type: String, trim:true, required:true},
    course :{type: String, trim:true },
        
    // option : 다양한 정렬 : 인기순, 후기순, 가격순, 신상품순, 투어의 종류별(종류를 키워드로 분류할 예정임) 
    numLikes: {type: Number, default:0},
    numItems : {type: Number, default : 0},
    price : {type : Number, default : 0, required:true},
    createdAt : {type : Date, default : Date.now}
},{
    toJSON: {virtuals:true},
    toObject : {virtuals : true}
});

schema.plugin(mongoosePaginate);

var Item = mongoose.model('Item', schema);

module.exports = Item;