# Flickr Feeds

Javascript sugar for [Flickr's Public Feeds](https://www.flickr.com/services/feeds/) (JsonP).

Work in progress - use at your own risk.

## Demo

 * http://robosparrow.github.io/FlickrFeeds/


## Get it

Just grab the `flickr-feed.js` or `flickr-feed.min.js` from [the **dist** folder](dist/flickr.js).

## Why Feeds? 

Flickr has an extensive [REST API](https://www.flickr.com/services/api/DZ) but for this you need either oAuth or an api key, which makes it neccessary to pipe your requests through a server-side proxy.
Via the public feeds you can access (limited) data without either of them.

@TODO: document .raw() and Data/DataItem methods

# Feed API

The Feed API builds your requests

## Public: Photos

Returns a list of public content matching some criteria.

* latest 20 uploads

```
Flickr.Feed().Photos().ready(function(data){
    console.log(data);
});
```

* tagged with either `dogs` or `cats`

```
// allowed tag formats:
// 'dogs cats'
// 'dogs, cats'
// ['dogs', 'cats']

Flickr.Feed().Photos().Tags('dogs, cats').ready(function(data){
    console.log(data);
});
```

* tagged with both `dogs` and `cats`

```
Flickr.Feed().Photos().Tags('dogs cats', true).ready(function(data){
    console.log(data);
});
```

## User 

* Helper for getting Flickr user ids: http://idgettr.com/

### Photos

* latest 20 uploads for a user

```
Flickr.Feed().User('26912394@N00').Photos().ready(function(data){
    console.log(data);
}); 
```

* with tags, as above

```
Flickr.Feed().User('26912394@N00').Photos().Tags('adelaide, australia').ready(function(data){
    console.log(data);
});
```

### Favourite photos

* latest 20 photos faved by a user

```
Flickr.Feed().User('26912394@N00').Favourites().ready(function(data){
    console.log(data);
});
```

### Friends photos

* latest 20 photos uploaded by friends of a user

```
// .Friends(multiple, friends) 
//      @param{bool} multiple Show multiple items for each contact
//      @param{bool} friends Show content from only friends and family, excluding contacts

Flickr.Feed().User('26912394@N00').Friends(true).ready(function(data){
    console.log(data);
});
 
```

### Users'comments

* latest 20 comments made by a user on photos (html content with thumbnail)

```
Flickr.Feed().User('26912394@N00').Comments().ready(function(data){
    console.log(data);
});
 
```

## Activity

 * **!!**This feed is deprecated and was closed by Flickr
 
```
Flickr.Feed().User('26912394@N00').Activity().ready(function(data){
    Flickr.View.Comments(data, document.body);
});
```

---

## Users

* Multiple users
* Helper for getting Flickr user ids: http://idgettr.com/

### Photos

* latest 20 uploads

```
// allowed tag formats:
// 'uid1 uid2'
// 'uid1, uid2'
// ['uid1', 'uid2']

// latest uploads for The British Library and Nasa (Commons)
Flickr.Feed().Users('26912394@N00, 44494372@N05').Photos().ready(function(data){
    console.log(data);
}); 
```

* allows tags, as above

---

## Groups

* Flickr Groups
* Helper for getting Flickr group ids: http://idgettr.com/

### Photos (Pool)

* latest 20 uploads

```
// "In Explore" group
Flickr.Feed().Group('2389839@N23').Pool().ready(function(data){
    console.log(data);
});
```

### Discussions

* latest 20 discussion posts (html content)

```
// "Flickr Central" group
Flickr.Feed().Group('34427469792@N01').Discussion().ready(function(data){
    console.log(data);
}); 
```

---

## Forum

* Flickr Forum

### Posts

* latest 20 discussion posts (html content)

```
Flickr.Feed().Forums().ready(function(data){
    console.log(data);
});
```

## Response data modifiers


### Raw responses

By default the Flickr response objects are decorated with some helper methods before returning it to your callback. (see *Data and DataItem API*)
If you don't care about these helpers then you can disable this by attaching the `.raw()` modifier to your request.

```
// disable Data and DataItem API
Flickr.Feed().Photos().raw().ready(function(data){
    console.log(data); // pure Flickr response
});
```

### Injectors

You can inject data (i.e state values) as objects into the response to have them available on callback.

This is done by attaching the `.raw(myObject)` modifier which then creates the `injected` holding your stateData inside the response.

```
// inject state data
Flickr.Feed().Photos().inject({ start: performance.now() }).ready(function(data){
    var end = performance.now();
    console.log('This request took' + (end - data.injected.start) + 'ms');  // pure Flickr response
});
```

Injection also works with the `.raw()` modifier set (for debugging).


# Data and DataItem API

The Data and DataItem API provides some convenience methods for handling the Flickr response object.

The data properties returned from Flickr remain untouched but you can use these methods to filter and parse result properties. 

* Note: if you don't care about these helpers then you can disable this by attaching the `.raw()` modifier to your request.

## Example 

Structure of photo stream response with decorators

```
{
    /**
     * Data API: Filters for Flickr items
     * this.getItemsByTags()
     * this.getTags()
     * this.getUsers()
     */
     
    "title": "<title>",
    "link": "<url>",
    "description": "<text>",
    "modified": "<iso-date>",
    "generator": "http://www.flickr.com/",
    "items": [
        {
            
            /**
             * DataItem API: Helpers for item values
             *
             * this.getDatePublished()
             * this.getDateTaken()
             * this.getImage()
             * this.hasTags()
             * this.getTags()
             * this.getUser()
             */
             
			"title": "<title>",
			"link": "<url>",
			"media": {"m":"<url>"},
			"date_taken":  "<iso-date>",
            "published": "<iso-date>"
			"description": "<description-html>",
			"author": "nobody@flickr.com (<user-name>)",
			"author_id": "<user-id>",
			"tags": "<whitespace separated tagnames>"
        },
        // ...more items...
    ]
    
}
```

### Handling Filters

```
Flickr.Feed().Photos().ready(function(data){
   
    // get normalised array with all tags in items
    var allTags = data.getTags();
    
    // get filtered array of items for specific tags
    // we assume that allTags contained the tags 'dog' and 'cat'
    var dogs = data.getItemsByTag('dog');
    var dogsCats =  data.getItemsByTag(['dog', 'cat']);
    var dogsCats =  data.getItemsByTag('dog cat');
    var dogsCats =  data.getItemsByTag('dog, cat');
    
    // get normalised array with all users in items
    var users = data.getUsers();

});
```

### Handling Items

```
Flickr.Feed().Photos().ready(function(data){
   
    var item = data.items[0];
    
    // return item.published as JS Date object
    var date = item.getDatePublished();
    
    // return item.date_taken as JS Date object
    var date = item.getDateTaken();
    
    // return item image url
    var imageUrl = item.getImage();
        
    // return tags length
    var numberOfTags = item.hasTags();
    // or:
    if(item.hasTags()){
        //do something...
    }
    
    // return tags as array
    var tags = item.getTags();
    
});
```


