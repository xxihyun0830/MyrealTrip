const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;

var schema = new Schema({
    user_id : {type: Schema.Types.ObjectId, ref : 'User'},
    item : {type: Schema.Types.ObjectId, ref : 'Item' },

    content : {type : String, trim:true, required : true},
    // 별점 - starScore
    starScore : {type : Number, default : 0},
    // 인기순 - numLikes
    numLikes : {type:Number, default:0}, 
    createdAt: {type:Date, default:Date.now}

    // 후기 사진
},{
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
});

schema.plugin(mongoosePaginate);

var Comment = mongoose.model('Comment', schema);

module.exports = Comment;
