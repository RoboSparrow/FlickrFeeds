/* jshint es3: true */
/* globals  Flickr */

(function(window, Flickr){
    
    'use strict';
    
    var feed;
    var timer = null;
    var count = 0;
    var WAIT = 10;
    
    var View = {
        nodes: {
            parent: null,
            container: null,
            counter: null
        },
        init: function(contentNode, controlsNode){
            this.nodes.parent = document.createElement('section');
            this.nodes.parent.className = 'flickr-items';
            
            this.nodes.counter = document.createElement('span');
            this.nodes.counter.textContent = 'Fetching feed...';
            
            this.nodes.container = document.createElement('div');   
            
            this.nodes.parent.appendChild(this.nodes.container);
            contentNode.appendChild(this.nodes.parent);
            controlsNode.appendChild(this.nodes.counter);
        },
        addItem: function (item){
            //console.log(item);
            var node = document.createElement('figure');
            var link = document.createElement('a');
            link.href= item.link;
            node.appendChild(link);
            this.nodes.container.appendChild(node);
            
            var img = new window.Image();
            img.src = item.getImage();
            link.appendChild(img);
            img.onload = function(){
                node.className = 'hello';
            };
        },
        build: function(data){
            while (this.nodes.container.firstChild) {
                this.nodes.container.removeChild(this.nodes.container.firstChild);
            }
            for(var i = 0; i< data.items.length; i++){
                this.addItem(data.items[i]);
            }
        },
        unbuild: function(){
            var items = this.nodes.container.childNodes;
            for(var i = 0; i < items.length; i++){
                items[i].className = 'bye';
            }
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

        if(count === (WAIT-1)){
            View.unbuild();
        }
        
        if(count >= WAIT){
            clearInterval();
            feed.ready(ready);
            return;
        }
        
        count++;           
        View.nodes.counter.textContent = 'Next update: ' + (WAIT - count) +'s';
        console.log(timer);
    };
    
    
    document.addEventListener('DOMContentLoaded', function() {
        View.init(document.getElementById('Content'), document.getElementById('Controls'));
        feed = Flickr.Feed().Photos();
        feed.ready(ready);
    });


})(window, Flickr);
