/* jshint es3: true */
/* globals App */
/* globals Handlebars */
/* globals App.BASEPATH */

(function(window, App, Handlebars){
    
    'use strict';
    
    var filters = {
        tags: function(items, search){
            return items.filter(function(item){
                    return item.hasTags(search);
            });
        },
        user: function(items, search){
            return items.filter(function(item){
                    return item.getUser().id === search;
            });
        }
    };

    var _cache = {};
    var View = {};
    
    ////
    // Helpers
    ////
       
    View.filterHandler = function(data, node){
        
        var items = data.items;
        
        var elements = node.querySelectorAll('[data-filter]');
        var photos = node.querySelector('.flickr-items');

        var registerFilter = function(element, filter){
            
            element.addEventListener('change', function(e) {
                e.preventDefault();
                var search = e.target.value;
                items = (search) ? filters[filter](data.items, search) : data.items;

                View.getTemplate(App.BASEPATH + 'templates/Photos.Items.html', {items: items}, function(html){                
                    photos.innerHTML = html;
                });
            });
        
        };
        
        for(var i = 0; i < elements.length; i++){
            registerFilter(elements[i], elements[i].dataset.filter);
        }
        
    };
    
    View.getTemplate = function(url, context, callback){
       
        context = context || {};
        if(_cache.hasOwnProperty(url)){
            callback(_cache[url](context));
            return;
        } 
        
        var xhr = new window.XMLHttpRequest();
        xhr.open('GET', url);
        
        xhr.onload = function() {
            if (xhr.status >= 200 && xhr.status < 400) {
                _cache[url] = Handlebars.compile(xhr.responseText); 
                callback(_cache[url](context));
            }
        };
        xhr.send();
    };
    
    ////
    // Menu
    ////
    
    View.Menu = {
        data: [],
        
        build: function(node){
           View.getTemplate(App.BASEPATH + 'templates/Menu.html', {data: this.data}, function(html){
                node.innerHTML = html;
            });
        },
        
        section: function(hash, title){
            var section = {
                hash: hash,
                title: title,
                items: [],
                index: this.data.length
            };
            this.data.push(section);
            return section;
        },
        
        item: function(section, hash, title){
            var item = {
                hash: hash,
                title: title
            };
            section.items.push(item);
            return item;
        },
        
        update: function(item){
            item = item || null;
            var items = this.node.querySelectorAll('.active');
            for(var i = 0; i < items.length; i++){
                items[i].className = '';
            }
            if(item){
                item.className = 'active';
            }
            return item;
        }
    };
    
    ////
    // View
    ////
    
    View.Photos = function(data, parent, options){
        var self = this;
        
        console.log(data);
    
        options = options || {};
        options.filters = options.filters || [];
        
        var context = options.context || null;
        var node = document.createElement('div');
        node.className = 'flickr-photo-grid';
        
        parent.innerHTML = '';
        parent.appendChild(node);
        
        var photosData = {
            data: data,
            tags: (options.filters.indexOf('tags') > -1) ? data.getTags() : false,
            users: (options.filters.indexOf('user') > -1) ? data.getUsers() : false,
            description: (options.filters.indexOf('description') > -1)
        };
        
        this.getTemplate(App.BASEPATH + 'templates/Photos.html', photosData, function(html){
            node.insertAdjacentHTML('beforeend', html);
            
            self.getTemplate(App.BASEPATH + 'templates/Photos.Items.html', {items: data.items}, function(html){
                var itemsNode = node.querySelector('.flickr-items');
                itemsNode.innerHTML = html;
                View.filterHandler(data, node);
            });
        });
 
    };
    
    View.Comments = function(data, parent, options){
        var self = this;

        console.log(data);
                
        options = options || {};
        options.filters = options.filters || [];
        
        var node = document.createElement('div');
        node.className = 'flickr-photo-comments';
        
        parent.innerHTML = '';
        parent.appendChild(node);
        
        var className;
        
        var commentsData = {
            data: data,
            users: (options.filters.indexOf('user') > -1) ? data.getUsers() : false
        };
        
        this.getTemplate(App.BASEPATH + 'templates/Comments.html', commentsData, function(html){
            node.insertAdjacentHTML('beforeend', html);
            
            self.getTemplate(App.BASEPATH + 'templates/Comments.Items.html', {items: data.items}, function(html){
                var itemsNode = node.querySelector('.flickr-items');
                itemsNode.innerHTML = html;
                View.filterHandler(data, node);
            });
        });
 
    };
 
    
    View.loading = function(parent){
        parent.innerHTML = '<em>loading...</em>';
    };
 
    App.View = View;

})(window, App, Handlebars);
