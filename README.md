# Flickr Feeds

Javascript sugar for [Flickr's Public Feeds](https://www.flickr.com/services/feeds/) (JsonP).

Work in progress - use at your own risk.

Just grab the `flickr-feed.js` or `flickr-feed.min.js` from [the **dist** folder](dist/flickr.js).

@TODO: document .raw() and Data/DataItem methods

# Feed API

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

### Photos

* user ids: http://idgettr.com/
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

```
Flickr.Feed().User('26912394@N00').Favourites().ready(function(data){
    console.log(data);
});
```

### Friends photos

```
// .Friends(multiple, friends) 
//      @param{bool} multiple Show multiple items for each contact
//      @param{bool} friends Show content from only friends and family, excluding contacts

Flickr.Feed().User('26912394@N00').Friends(true).ready(function(data){
    console.log(data);
});
 
```

### Users'comments

* text content

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

### Photos

* latest 20 uploads for a group of users

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

### Photos (Pool)

```
// "In Explore" group
Flickr.Feed().Group('2389839@N23').Pool().ready(function(data){
    console.log(data);
});
```

### Discussions

* latest discussion posts 

```
// "Flickr Central" group
Flickr.Feed().Group('34427469792@N01').Discussion().ready(function(data){
    console.log(data);
}); 
```

---

## Forum

### Posts

```
Flickr.Feed().Forums().ready(function(data){
    console.log(data);
});
```
