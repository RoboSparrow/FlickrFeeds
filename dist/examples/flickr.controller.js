/* jshint es3: true */
/* globals  Flickr */

(function(window, Flickr){

    'use strict';
    
    var section;
    var content;
    
    section = Flickr.View.Menu.section('Public Uploads');
    Flickr.View.Menu.item(section, 'Public.Photos'             , 'Latest Photos');
    Flickr.View.Menu.item(section, 'Public.Photos.Tags.Comma'  , 'Latest Photos by Tags');
    
    section = Flickr.View.Menu.section('User Photos');
    Flickr.View.Menu.item(section, 'User.Photos'               , 'Latest User Uploads');
    Flickr.View.Menu.item(section, 'User.Photos.Tags'          , 'Latest User Uploads by Tags');
    Flickr.View.Menu.item(section, 'User.Photos.Friends'       , 'Latest Uploads of Friends');
    Flickr.View.Menu.item(section, 'User.Photos.Favourites'    , 'Latest User Favourites');
    Flickr.View.Menu.item(section, 'User.Photos.Comments'      , 'Latest Comments');

    section = Flickr.View.Menu.section('Groups');
    Flickr.View.Menu.item(section, 'Group.Discussion'          , 'Group Discussion');
    Flickr.View.Menu.item(section, 'Group.Pool'                , 'Latest Group Uploads');
    
    section = Flickr.View.Menu.section('Forums');
    Flickr.View.Menu.item(section, 'Forums'                    , 'Forum Discussion');
    
    document.addEventListener("DOMContentLoaded", function(event) {
        Flickr.View.Menu.build(document.getElementById('FeedMenu'));
        content = document.getElementById('Content');
        if(!window.location.hash){
            window.location.hash = '#Public.Photos';
        }
    });
  
	window.addEventListener("hashchange", function(event){

		switch(window.location.hash){
            
            // Public.Photos
            case '#Public.Photos':
                Flickr.View.loading(content);
                Flickr.Feed().Photos().ready(function(data){
                    Flickr.View.Photos(data, content, {filters:['user', 'tags']});
                });
            break;
            
            // Public.Photos.Comma 'dogs, cats'
            case '#Public.Photos.Tags.Comma':
                Flickr.View.loading(content);
                Flickr.Feed().Photos().Tags('dogs, cats').ready(function(data){
                    Flickr.View.Photos(data, content, {filters:['users', 'tags']});
                });
            break;
            
            // Public.Photos.Tags.Whitespace 'dogs cats'
            case '#Public.Photos.Tags.Whitespace':
                Flickr.View.loading(content);
                Flickr.Feed().Photos().Tags('dogs cats', true).ready(function(data){
                    Flickr.View.Photos(data, content, {filters:['users', 'tags']});
                });
            break;
            
            // Public.Photos.Tags.Array ['dogs', 'cats']
            case '#Public.Photos.Tags.Array':
                Flickr.View.loading(content);
                Flickr.Feed().Photos().Tags(['dogs', 'cats'], true).ready(function(data){
                    Flickr.View.Photos(data, content, {filters:['users', 'tags']});
                });
            break;
            
            // User.Photos
            case '#User.Photos':
                Flickr.View.loading(content);
                Flickr.Feed().User('26912394@N00').Photos().ready(function(data){
                    Flickr.View.Photos(data, content, {filters:['users', 'tags']});
                });
            break;
            
            // User.Photos.Tags
            case '#User.Photos.Tags':
                Flickr.View.loading(content);
                Flickr.Feed().User('26912394@N00').Photos().Tags('adelaide, australia').ready(function(data){
                    Flickr.View.Photos(data, content, {filters:['users', 'tags']});
                });
            break;
            
            // User.Photos.Friends
            case '#User.Photos.Friends':
                Flickr.View.loading(content);
                Flickr.Feed().User('26912394@N00').Friends(true).ready(function(data){
                    Flickr.View.Photos(data, content);
                });
            break;
            
            // User.Photos.Favourites
            case '#User.Photos.Favourites':
                Flickr.View.loading(content);
                Flickr.Feed().User('26912394@N00').Favourites().ready(function(data){
                    Flickr.View.Photos(data, content);
                });
            break;
            
            // User.Photos.Activity
            case '#User.Photos.Activity':
                Flickr.View.loading(content);
                // ! this Feed is closed by Flickr
                Flickr.Feed().User('26912394@N00').Activity().ready(function(data){
                    Flickr.View.Comments(data, content);
                });
            break;
            
            // User.Photos.Comments
            case '#User.Photos.Comments':
                Flickr.View.loading(content);
                Flickr.Feed().User('26912394@N00').Comments().ready(function(data){
                    Flickr.View.Comments(data, content);
                });
            break;
            
            // Group
            case '#Group.Discussion':
                Flickr.View.loading(content);
                Flickr.Feed().Group('34427469792@N01').Discussion().ready(function(data){
                    Flickr.View.Comments(data, content);
                });
            break;
            
            // Group.Pool
            case '#Group.Pool':
                Flickr.View.loading(content);
                Flickr.Feed().Group('2389839@N23').Pool().ready(function(data){
                    Flickr.View.Photos(data, content);
                });
            break;
            
            // Forums
            case '#Forums':
                Flickr.View.loading(content);
                Flickr.Feed().Forums().ready(function(data){
                    Flickr.View.Comments(data, content);
                });
            break;
            
        }
        
	});

})(window, Flickr);
