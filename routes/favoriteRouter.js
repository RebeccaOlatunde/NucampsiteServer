const express = require('express');
const Favorite = require('../models/favorite');
const authenticate = require('../authenticate');
const cors = require('./cors');

const favoriteRouter = express.Router();

favoriteRouter.route('/')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors,authenticate.verifyUser,(req, res, next) => {
    Favorite.find({ user: req.user._id })
    .populate('user')
    .populate('campsites')
    .then(favorites => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorites);
    })
    .catch(err => next(err));
})
    
.post(cors.corsWithOptions,authenticate.verifyUser,(req, res, next) => {
    Favorite.findOne({ user: req.user._id })
    .then(favorites => {
        if (favorites) {
            req.body.forEach(campsite => {
                if (!favorites.campsites.includes(campsite._id))
                    favorites.campsites.push(campsite._id);
            })
            favorites.save()
            .then(favorite => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
            })
            .catch(err => next(err));
        } else {
            Favorite.create({ user: req.user._id })
            .then(favorites => {
                req.body.forEach(campsite => {
                if (!favorites.campsites.includes(campsite._id))
                    favorites.campsites.push(campsite._id);
                })
                favorites.save()
                .then(favorite => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite);
                })
                .catch(err => next(err));
            })
            .catch(err => next(err));
        }    
    })
    .catch(err => next(err));
})
    
.put(cors.corsWithOptions,authenticate.verifyUser,(req, res, next) => {
    res.statusCode = 403;
    res.end(`PUT operation not supported on /favorites`);
})
    
.delete(cors.corsWithOptions,authenticate.verifyUser,(req, res, next) => {
    Favorite.findOneAndDelete({ user: req.user._id })
        .then(favorites => {
            if (favorites) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorites);
            } else {
                res.statusCode = 404;
                res.setHeader('Content-Type', 'text/plain');
                res.end('You do not have any favorites to delete.');
            }
    })
    .catch(err => next(err));
})

favoriteRouter.route('/:campsiteId')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors,(req, res, next) => {
    res.statusCode = 403;
    res.end(`GET operation not supported on /favorites/${req.params.campsiteId}`);
})
    
.post(cors.corsWithOptions,authenticate.verifyUser,(req, res, next) => {
    Favorite.findOne({ user: req.user._id })
        .then(favorites => {
            if (favorites) {
                if (favorites.campsites.includes(req.params.campsiteId)) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'text/plain');
                    res.end(`${req.params.campsiteId} is already in the list of favorites!!!`);
                } else {
                    favorites.campsites.push(req.params.campsiteId);
                    favorites.save()
                    .then(favorite => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(favorite);
                    })
                    .catch(err => next(err));
                }
            } else {
                Favorite.create({ user: req.user._id,campsites:[req.params.campsiteId] })
                .then(favorite => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite);
                })
                .catch(err => next(err));
            }
        })
    .catch(err => next(err));
})
    
.put(cors.corsWithOptions,authenticate.verifyUser,(req, res, next) => {
    res.statusCode = 403;
    res.end(`PUT operation not supported on /favorites/${req.params.campsiteId}`);
})
    
.delete(cors.corsWithOptions,authenticate.verifyUser,(req, res, next) => {
    Favorite.findOne({ user: req.user._id })
        .then(favorites => {
            if (favorites) {
                if (favorites.campsites.includes(req.params.campsiteId)) {
                    const fav_index = favorites.campsites.indexOf(req.params.campsiteId);
                    favorites.campsites.splice(fav_index,1);
                    favorites.save()
                    .then(favorite => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(favorite);
                    })
                    .catch(err => next(err));
                } else {
                    res.statusCode = 404;
                    res.setHeader('Content-Type', 'text/plain');
                    res.end(`You do not have ${req.params.campsiteId} to delete.`);
                }
            } else {
                res.statusCode = 404;
                res.setHeader('Content-Type', 'text/plain');
                res.end('You do not have any favorites to delete.');
            }
        })
    .catch(err => next(err));
})

module.exports = favoriteRouter;