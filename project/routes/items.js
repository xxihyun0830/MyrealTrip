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
    const comment = await Comment.paginate(query, {
        sort: {createdAt: -1}, 
        populate: 'user_id', 
        page: page, 
        limit: limit
    });
    res.render('questions/index', {questions: questions, term: term, query: req.query});
}));

router.get('/new', needAuth, (req, res, next) => {
    res.render('items/new', {question: {}});
  });
  