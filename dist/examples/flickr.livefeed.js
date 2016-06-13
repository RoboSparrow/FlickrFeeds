/* jshint es3: true */
/* globals  Flickr */
/* globals  App */

//@TODO quick migrate from old version. needs cleanup

(function(window, Flickr, App){
    
    'use strict';
    
    var feed;
    var timer = null;
    var count = 0;
    var WAIT = 10;
    
    var View = {
        nodes: {
            parent: null,
            items: null,
            counter: null
        },
        init: function(node){
            var self = this;
            App.View.getTemplate(App.BASEPATH + 'templates/LiveFeed.html', {title: "Live Feed"}, function(html){
                node.insertAdjacentHTML('beforeend', html);
                self.nodes.parent = node;
                self.nodes.counter = node.querySelector('.counter');
                self.nodes.items = node.querySelector('.flickr-items');
            });

        },
        build: function(data){
            var self = this;
            this.nodes.items.innerHTML = '';
            App.View.getTemplate(App.BASEPATH + 'templates/LiveFeed.Items.html', {title: data.title, items: data.items}, function(html){
                self.nodes.items.innerHTML = html;
            });
        }
    };
    
    var ready = function(data){
        View.build(data);
        setInterval();
    };
    
    var clearInterval = function(){ 
        count = 0;
        View.nodes.counter.textContent = 'Fetching feed...';
        if(timer){
            window.clearInterval(timer);
        }
    };
    
    var setInterval = function(){ 
        timer = window.setInterval(doInterval, 1000);
    };
    
    var doInterval = function(){ 
        
        // stop when not present in document
        if(!document.getElementById('FlickrLiveFeedContent')){
            clearInterval();
        }
        
        if(count === (WAIT-1)){
            // nothing
        }
        
        if(count >= WAIT){
            clearInterval();
            feed.ready(ready);
            return;
        }

        count++;           
        View.nodes.counter.textContent = 'Next update: ' + (WAIT - count) +'s';
    };
    
    App.LiveFeed = {
        run: function(content) {
            View.init(content);
            feed = Flickr.Feed().Photos();
            feed.ready(ready);
        }
    };

})(window, Flickr, App);
