const express = require('express');
const Item = require('../models/item');
const Comment = require('../models/comment');
const catchErrors = require('../lib/async-error');

const router = express.Router();

function needAuth(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        req.flash('danger', '로그인을 먼저 하세요. ');
        res.redirect('/signin');
    }
}

router.get('/', catchErrors(async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    var query = {};
    const term = req.query.term;
    if (term) {
        query = {$or: [
        {title: {'$regex': term, '$options': 'i'}},
        {numLikes: {'$regex': term, '$options': 'i'}}
        ]};
    }
    const items = await Item.paginate(query, {
        sort: {createdAt: -1}, 
        populate: 'user_id', 
        page: page, 
        limit: limit
    });
    res.render('items/index', {items: items, term: term, query: req.query});
}));

router.get('/new', needAuth, (req, res, next) => {
    res.render('items/new', {item: {}});
  });
  

router.get('/:id/edit', needAuth, catchErrors(async (req, res, next) => {
    const item = await Item.findById(req.params.id);
    res.render('items/edit', {item: item});
  }));
  
  router.get('/:id', catchErrors(async (req, res, next) => {
    const item = await Item.findById(req.params.id).populate('user_id');
    const comments = await Comment.find({item: item.id}).populate('user_id');
    
  
    await item.save();
    res.render('items/show', {item: item, comments: comments});
  }));
  
  //투어상품 등록
  router.put('/:id', catchErrors(async (req, res, next) => {
    const item = await Item.findById(req.params.id);
  
    if (!item) {
      req.flash('danger', 'Not exist item');
      return res.redirect('back');
    }
    item.title = req.body.title;
    item.content = req.body.content;
      
    await item.save();
    req.flash('success', 'Successfully updated');
    res.redirect('/items');
  }));
  
  //투어상품 삭제
  router.delete('/:id', needAuth, catchErrors(async (req, res, next) => {
    await Item.findOneAndRemove({_id: req.params.id});
    req.flash('success', 'Successfully deleted');
    res.redirect('/items');
  }));
  
  router.post('/', needAuth, catchErrors(async (req, res, next) => {
    const user = req.user;
    var item = new item({
      title: req.body.title,
      user_id: user._id,
      content: req.body.content,
      
    });
    await item.save();
    req.flash('success', 'Successfully posted');
    res.redirect('/items');
  }));
  
  router.post('/:id/comments', needAuth, catchErrors(async (req, res, next) => {
    const user = req.user;
    const item = await item.findById(req.params.id);
  
    if (!item) {
      req.flash('danger', 'Not exist item');
      return res.redirect('back');
    }
  
    var comment = new Comment({
      user_id: user._id,
      item: item._id,
      content: req.body.content
    });
    await comment.save();
    item.numComments++;
    await item.save();
  
    req.flash('success', 'Successfully commented');
    res.redirect(`/items/${req.params.id}`);
  }));
  
  
  
  module.exports = router;
  