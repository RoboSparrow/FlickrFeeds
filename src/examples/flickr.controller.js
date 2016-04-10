/* jshint es3: true */
/* globals  Flickr */

(function(window, Flickr){
    
    'use strict';

    Flickr.Feed().Photos().ready(function(data){
        Flickr.View.Photos(data, document.body, {filters:['user', 'tags']});
    });
    
    // 'dogs cats'
    // 'dogs, cats'
    // ['dogs', 'cats']
    
    Flickr.Feed().Photos().Tags('dogs, cats').ready(function(data){
        Flickr.View.Photos(data, document.body, {filters:['users', 'tags']});
    });
    
    Flickr.Feed().Photos().Tags('dogs cats', true).ready(function(data){
        Flickr.View.Photos(data, document.body, {filters:['users', 'tags']});
    });

    Flickr.Feed().User('26912394@N00').Photos().ready(function(data){
        Flickr.View.Photos(data, document.body, {filters:['users', 'tags']});
    });
    
    Flickr.Feed().User('26912394@N00').Photos().Tags('adelaide, australia').ready(function(data){
        Flickr.View.Photos(data, document.body, {filters:['users', 'tags']});
    });
     
    Flickr.Feed().User('26912394@N00').Friends(true).ready(function(data){
        Flickr.View.Photos(data, document.body);
    });
 
    Flickr.Feed().User('26912394@N00').Favourites().ready(function(data){
        Flickr.View.Photos(data, document.body);
    });

    // feed closed by flickr
    Flickr.Feed().User('26912394@N00').Activity().ready(function(data){
        Flickr.View.Comments(data, document.body);
    });

    Flickr.Feed().User('26912394@N00').Comments().ready(function(data){
        Flickr.View.Comments(data, document.body);
    });
   
    Flickr.Feed().Group('34427469792@N01').Discussion().ready(function(data){
        Flickr.View.Comments(data, document.body);
    });

    Flickr.Feed().Group('2389839@N23').Pool().ready(function(data){
        Flickr.View.Photos(data, document.body);
    });
 
    Flickr.Feed().Forums().ready(function(data){
        Flickr.View.Comments(data, document.body);
    });

})(window, Flickr);
