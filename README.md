# Flickr Feeds

Javascript sugar for [Flickr's Public Feeds](https://www.flickr.com/services/feeds/) (JsonP).

Work in progress - use at your own risk.

## Get it

Just grab the `flickr-feed.js` or `flickr-feed.min.js` from [the **dist** folder](dist/flickr.js).

## Why Feeds? Flickr has a great API!

Yeah, but you need either oAuth or an api key, which makes it neccessary to pipe your requests through a server-side proxy.
Via the public feeds you can access (limited) data without either of them.

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
