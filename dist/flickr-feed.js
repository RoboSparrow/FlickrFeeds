/**
 * FlickrFeeds - v0.0.1 - 2016-06-14
 * Copyright (c) 2016 
 * Licensed MIT <https://opensource.org/licenses/MIT>
 */

/* jshint es3: true */

(function(window){

    'use strict';

    var document = window.document;

    var callbacks = [];

    var url = function(endpoint, args) {
        var query = [];
        for(var key in args){
            query.push(encodeURIComponent(key) + "=" + encodeURIComponent(args[key]));
        }
        return (query.length) ? endpoint + '?' + query.join("&") : url;
    };

    var jsonp = function(endpoint, query, fn, state){
        query = query || {};
        var callback;
        var script= document.createElement('script');

        callback = function(data){
            if(state.inject){
                    data.injected = state.inject;
            }
            fn((state.raw) ? data : new Data(data));  
            document.head.removeChild(script);
        };
        callbacks.push(callback);

        // default options
        query.format = 'json';
        query.jsoncallback = 'Flickr.callbacks[' + (callbacks.length -1) +']';

        script.src = url(endpoint, query);
        document.head.appendChild(script);

        return script;
    };

    var arrayUnique = function(a) {
        return a.reduce(function(p, c) {
            if (p.indexOf(c) < 0) {
                p.push(c.trim());
            }
            return p;
        }, []);
    };

    var arrayIntersect = function (a, b){
        return a.filter(function(n) {
            return b.indexOf(n) != -1;
        });
    };

    var toArray = function(tags){
        tags = tags || [];
        if(typeof tags === 'string'){
            if(tags.indexOf(',') > -1){
                tags = tags.split(',');
            }else{
                tags = tags.split(' ');
            }
        }
        return tags;
    };

    ////
    // Feed Data
    ////

    var Data = function(data){
        this.error = false;

        if(typeof data === 'string'){
            var title = /<title>(.*?)<\/title>/.exec(data);
            this.error = (title) ? title : data;
        }

        if(!this.error){
            for(var key in data){
                if(data.hasOwnProperty(key)){
                    if(key === 'items'){
                        this.items = [];
                        for(var i = 0; i < data.items.length; i++){
                            this.items.push(new DataItem(data.items[i]));
                        }
                        continue;
                    }
                    this[key] = data[key];
                }
            }
        }

    };

    Data.prototype.getUsers = function(){

        var sort = function(a, b){
            if (a.name < b.name){
                return -1;
            }
            if (a.name > b.name){
                return 1;
            }
            return 0;
        };

        var users = [];
        for(var i = 0; i < this.items.length; i++){
            users.push(this.items[i].getUser());
        }

        return users.sort(sort);
    };

    Data.prototype.getTags = function(data){
        var tags = [];
        for(var i = 0; i < this.items.length; i++){
            tags = tags.concat(this.items[i].getTags());
        }
        return arrayUnique(tags).sort();
    };

    Data.prototype.getItemsByTags = function(tags){
        var items = [];
        for(var i = 0; i < this.items.length; i++){
            //@Todo sort by occurence (hasTags returns length)
            if(this.items[i].hasTags(tags)){
                items.push(this.items[i]);
            }
        }
        return items;
    };

    ////
    // Feed Data Item
    ////

    var DataItem = function(item){
        for(var key in item){
            if(item.hasOwnProperty(key)){
                this[key] = item[key];
            }
        }
    };

    DataItem.prototype.getUser = function(){

        var regExp = /\(([^)]+)\)/;
        var matches = regExp.exec(this.author);

        return {
            id: this.author_id,
            name: (matches && matches.length > 0) ? matches[1] : this.author
        };
    };

    DataItem.prototype.getImage = function(){
        return (this.hasOwnProperty('media') && this.media.hasOwnProperty('m')) ? this.media.m : null;
    };

    DataItem.prototype.getTags = function(){
        return toArray(this.tags);
    };

    DataItem.prototype.hasTags = function(tags){
        tags = toArray(tags);
        var itemTags = this.getTags(tags);
        return arrayIntersect(tags, itemTags).length;
    };

    DataItem.prototype.getDatePublished = function(){
        return (this.hasOwnProperty('published')) ? new Date(this.published) : null;
    };

    DataItem.prototype.getDateTaken = function(){
        return (this.hasOwnProperty('date_taken')) ? new Date(this.date_taken) : null;
    };

    ////
    // Feed
    ////

    var Feed = function(id){
        this.state = {
            raw: false,
            inject: false
        };
        this.query = {};
        this.id = id;
        this.feed = null;
        this.endpoint = null;
        this.callback = function(data){};//?
        return this;
    };

    Feed.prototype.options = function(options){
        options = options || {};
        for (var key in options) {
            if(options.hasOwnProperty(key)){
                if(this.query.hasOwnProperty(key)){
                    continue;
                }
                this.query[key] = options[key];
            }
        }
    };

    Feed.prototype.register = function(feed){
        this.feed = feed;
        this.id = feed.substr(feed.lastIndexOf('/') + 1);
    };

    Feed.prototype.prepareQuery = function(){

        // copy
        var query = JSON.parse(JSON.stringify(this.query));

        // user_id
        switch(this.id){
            case 'activity.gne':
            case 'photos_friends.gne':
            case 'photos_comments.gne':
                query.user_id = query.id;
                delete(query.id);
            break;
        }

        // user ids
        if(typeof query.ids !== 'undefined'){
            query.ids = arrayUnique(query.ids).join(',');
        }

        // tags
        if(typeof query.tags !== 'undefined'){
            var tags = arrayUnique(query.tags);
            query.tags = tags.join(',');
        }

        return query;
    };

    Feed.prototype.raw = function(){
        this.state.raw = true;
        return this;
    };

    Feed.prototype.inject = function(obj){
        this.state.inject = obj;
        return this;
    };

    ///<title>(.*?)<\/title>/.exec(str)
    Feed.prototype.ready = function(fn){
        var query = this.prepareQuery();
        jsonp(this.feed, query, fn, this.state);
        return this;
    };

    // photos

    Feed.prototype.Photos = function(options){
        options = options || false;
        // public
        if(!this.id){
            this.register('http://api.flickr.com/services/feeds/photos_public.gne');
        }
        this.options(options);
        return this;
    };

    // user

    Feed.prototype.User = function(id){
        this.options({id: id});
        return this;
    };

    /**
     * User Friends feed
     * @param{bool} multiple Show multiple items for each contact
     * @param{bool} friends Show content from only friends and family, excluding contacts
     */

    Feed.prototype.Friends = function(displayMultiple, friends){
        this.options({
            display_all: displayMultiple || false,
            friends: (friends) ? 1 : 0
        });

        this.register('https://api.flickr.com/services/feeds/photos_friends.gne');
        return this;
    };

    Feed.prototype.Favourites = function(){
        this.register('https://api.flickr.com/services/feeds/photos_faves.gne');
        return this;
    };

    Feed.prototype.Activity = function(){
        this.register('https://api.flickr.com/services/feeds/activity.gne');
        return this;
    };

    Feed.prototype.Comments = function(){
        this.register('https://api.flickr.com/services/feeds/photos_comments.gne');
        return this;
    };

    // users

    Feed.prototype.Users = function(ids){
        ids = toArray(ids);
        this.options({ids: ids});
        return this;
    };

    // Group

    Feed.prototype.Group = function(id){
        id = id || [];
        this.options({id: id});
        return this;
    };

    Feed.prototype.Discussion = function(){
        this.register('https://api.flickr.com/services/feeds/groups_discuss.gne');
        return this;
    };

    Feed.prototype.Pool = function(){
        this.register('https://api.flickr.com/services/feeds/groups_pool.gne');
        return this;
    };

    // Forums

    Feed.prototype.Forums = function(){
        this.register('https://api.flickr.com/services/feeds/forums.gne');
        return this;
    };

    /**
     * Accepts a list of tags as either
     * - an array,
     * - a comma-separated string
     * - a white-pace spearated string (being item.tag feed response format)
     * @param {array|string} tags
     * @param {boolean} any sets 'tagmode' feed param ('ANY'| 'ALL'), see Flickr feedc docs
     * @returns {object} this
     */

    Feed.prototype.Tags = function(tags, all){
        tags = toArray(tags);
        all = all || false;

        this.options({
            tags: tags,
            tagmode: (all) ? 'ALL' : 'ANY'
        });
        return this;
    };

    var Flickr = {
        callbacks: callbacks,
        Feed: function(options){
            return new Feed(options);
        }
    };

    window.Flickr = Flickr;

}(window));
