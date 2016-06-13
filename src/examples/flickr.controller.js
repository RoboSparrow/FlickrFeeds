/* jshint es3: true */
/* globals  Flickr */
/* globals  App */

(function(window, Flickr, App){

    'use strict';
    
    var section;
    var content;
    
    section = App.View.Menu.section(null                     , 'Public Uploads');
    App.View.Menu.item(section, '#Public.Photos'             , 'Latest Photos');
    App.View.Menu.item(section, '#Public.Photos.Tags.Comma'  , 'Latest Photos by Tags');
    App.View.Menu.item(section, '#LiveFeed'                  , 'Livefeed');
    
    section = App.View.Menu.section(null                     , 'User Photos');
    App.View.Menu.item(section, '#User.Photos'               , 'Latest User Uploads');
    App.View.Menu.item(section, '#User.Photos.Tags'          , 'Latest User Uploads by Tags');
    App.View.Menu.item(section, '#User.Photos.Friends'       , 'Latest Uploads of Friends');
    App.View.Menu.item(section, '#User.Photos.Favourites'    , 'Latest User Favourites');
    App.View.Menu.item(section, '#User.Photos.Comments'      , 'Latest Comments');

    section = App.View.Menu.section(null                     , 'Groups');
    App.View.Menu.item(section, '#Group.Discussion'          , 'Group Discussion');
    App.View.Menu.item(section, '#Group.Pool'                , 'Latest Group Uploads');
    
    section = App.View.Menu.section(null                     , 'Forums');
    App.View.Menu.item(section, '#Forums'                    , 'Forum Discussion');
    
    var route = function(){
        var m = window.location.hash.split('.');

		switch(window.location.hash){
           
            case '#LiveFeed':
                App.LiveFeed.run(content);
            break;
            
            // Public.Photos
            case '#Public.Photos':
                App.View.loading(content);
                Flickr.Feed().Photos().ready(function(data){
                    App.View.Photos(data, content, {filters:['user', 'tags', 'description']});
                });
            break;
            
            // Public.Photos.Comma 'dogs, cats'
            case '#Public.Photos.Tags.Comma':
                App.View.loading(content);
                Flickr.Feed().Photos().Tags('dogs, cats').ready(function(data){
                    App.View.Photos(data, content, {filters:['users', 'tags', 'description']});
                });
            break;
            
            // Public.Photos.Tags.Whitespace 'dogs cats'
            case '#Public.Photos.Tags.Whitespace':
                App.View.loading(content);
                Flickr.Feed().Photos().Tags('dogs cats', true).ready(function(data){
                    App.View.Photos(data, content, {filters:['users', 'tags', 'description']});
                });
            break;
            
            // Public.Photos.Tags.Array ['dogs', 'cats']
            case '#Public.Photos.Tags.Array':
                App.View.loading(content);
                Flickr.Feed().Photos().Tags(['dogs', 'cats'], true).ready(function(data){
                    App.View.Photos(data, content, {filters:['users', 'tags', 'description']});
                });
            break;
            
            // User.Photos
            case '#User.Photos':
                App.View.loading(content);
                Flickr.Feed().User('26912394@N00').Photos().ready(function(data){
                    App.View.Photos(data, content, {filters:['users', 'tags', 'description']});
                });
            break;
            
            // User.Photos.Tags
            case '#User.Photos.Tags':
                App.View.loading(content);
                Flickr.Feed().User('26912394@N00').Photos().Tags('adelaide, australia').ready(function(data){
                    App.View.Photos(data, content, {filters:['users', 'tags', 'description']});
                });
            break;
            
            // User.Photos.Friends
            case '#User.Photos.Friends':
                App.View.loading(content);
                Flickr.Feed().User('26912394@N00').Friends(true).ready(function(data){
                    App.View.Photos(data, content, {filters:['users', 'tags', 'description']});
                });
            break;
            
            // User.Photos.Favourites
            case '#User.Photos.Favourites':
                App.View.loading(content);
                Flickr.Feed().User('26912394@N00').Favourites().ready(function(data){
                    App.View.Photos(data, content, {filters:['users', 'tags', 'description']});
                });
            break;
            
            // User.Photos.Activity
            case '#User.Photos.Activity':
                App.View.loading(content);
                // ! this Feed is closed by Flickr
                Flickr.Feed().User('26912394@N00').Activity().ready(function(data){
                    App.View.Comments(data, content);
                });
            break;
            
            // User.Photos.Comments
            case '#User.Photos.Comments':
                App.View.loading(content);
                Flickr.Feed().User('26912394@N00').Comments().ready(function(data){
                    App.View.Comments(data, content);
                });
            break;
            
            // Group
            case '#Group.Discussion':
                App.View.loading(content);
                Flickr.Feed().Group('34427469792@N01').Discussion().ready(function(data){
                    App.View.Comments(data, content);
                });
            break;
            
            // Group.Pool
            case '#Group.Pool':
                App.View.loading(content);
                Flickr.Feed().Group('2389839@N23').Pool().ready(function(data){
                    App.View.Photos(data, content);
                });
            break;
            
            // Forums
            case '#Forums':
                App.View.loading(content);
                Flickr.Feed().Forums().ready(function(data){
                    App.View.Comments(data, content);
                });
            break;
            
            // Forums
            default:
                App.LiveFeed.run(content);
            
        }
        
    };
    
    var events = function(){
        
        var toggle = function(link){
            link.addEventListener('click', function(e) {
                e.preventDefault();
                var target = document.getElementById('FeedMenu');
                if(!target){
                    return;
                }
                target.style.display = (target.style.display === 'block') ? 'none' : 'block';
            });
        };
        
        var links = document.querySelectorAll('.toggle-feed-menu'); 

        for(var i= 0; i < links.length; i++){
            toggle(links[i]); 
        }
        
    };
    
    document.addEventListener("DOMContentLoaded", function(event) {
        
        App.View.Menu.build(document.getElementById('FeedMenu'));
        content = document.getElementById('Content');
    
        if(!window.location.hash){
            window.location.hash = '#LiveFeed';
        }
        route();
        events();
    });
  
	window.addEventListener("hashchange", function(event){
        route();
	});

})(window, Flickr, App);
