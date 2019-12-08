const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;

var schema = new Schema({
    user_id : {type: Schema.Types.ObjectId, ref : 'User'},
    item : {type: Schema.Types.ObjectId, ref : 'Item' },

    // option : 후기 : 예약 고객은 별점, 내용 등의 후기를 남길 수 있다.
    content : {type : String, trim:true, required : true},
    starScore : {type : Number, default : 0},
    createdAt: {type:Date, default:Date.now}

    // 후기 사진
},{
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
});

schema.plugin(mongoosePaginate);

var Comment = mongoose.model('Comment', schema);

module.exports = Comment;
