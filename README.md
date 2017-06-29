Promises

Most programming tasks involve some form of IO (Input/Output). Whether it's waiting for a user to click a button, or writing information to a database, you need to be able to wait for an IO operation to complete, then perform some more tasks. You also need to be able to continue to perform other tasks while you are waiting for your IO to complete. For example, if you were writing Pac-Man you want to continue to update the positions of the ghosts even while you are waiting for the user to move Pac-Man. This is asynchronous programming; you allow other parts of your program to run while you are waiting for some IO, or other long-running task to complete.

You already know JavaScript's main tool for asynchronous programming: callbacks. For example if you wanted to make an AJAX request using jQuery you might write the following code:

$.getJSON('https://api.github.com/users/Thinkful/repos', data => {
    // Waits until you have the response from GitHub then this code is run
});

// GitHub doesn't need to respond before your code advances to here; it's asynchronous
Callbacks work well for simple situations like this, but when you want more complex behavior they can become difficult to deal with. Promises provide one solution to managing asynchronous code. For example, the fetch API (which is designed to perform the same job as jQuery's AJAX methods) works with promises. The equivalent code using the fetch API would look like this:

fetch('https://api.github.com/users/Thinkful/repos').then(response => {
    // Waits until you have the response from GitHub then this code is run
});
It looks pretty similar. Rather than the fetch function taking a callback directly, it returns a Promise object. The promise has a then method. When the asynchronous task completes ('resolves'), the callback passed in the then method is called.

Exercise

Create a new directory called spotify-recommend.
Add this index.html file to spotify-recommend.
Add this spotify.js file to spotify-recommend.
In the spotify.js file there are two functions. The getFromApi function uses the fetch API to make requests to the Spotify API. It returns a promise, which you can add a .then call to.

You will be responsible for filling in the getArtist function. Update this function to:

Make a call to the search endpoint using the getFromApi function.
The query parameter should contain the following information:

{
    q: name,
    limit: 1,
    type: 'artist'
}
Use .then to add a callback which will run when getFromApi resolves.

Inside the callback you should:

Set the artist global to be equal to item.artists.items[0], where item is the information obtained from the API (which will be passed as the first argument to your callback).
Return the artist object.
Return the promise which you created by calling getFromApi.

Open up index.html and try running a search. You should see that an artist who matches your search term is added below the search bar.

Error handling

You can handle errors from promises by adding a .catch block at the end of your promise. For example:

fetch('http://example.com').then(response => {
    // Do something on success
}).catch(function(err) {
    // Do something on failure
});
Exercise

Add a catch block to your promise in the getArtist method. Inside the function you should log out any errors thrown from your promise. Try changing the endpoint name to gibberish and performing a search to make sure that any errors are being caught and logged out. Don't forget to change it back when you've confirmed that your catch block is working.

Promises in series

Given how similar the fetch method looks to the callback approach, what advantages do you get from promises over callbacks? The primary advantage is how simple it is to perform asynchronous tasks one after another. For example, imagine that you wanted to make a second AJAX request after the first one had finished. Using callbacks your code would look like this:

$.getJSON('http://example.com/first-endpoint', () => {
    console.log('First request has completed');
    $.getJSON('http://example.com/second-endpoint', () => {
        console.log('Second request has completed');
    });
});
Notice how the second callback is nested inside the first callback. You can imagine how adding error handling and business logic could quickly turn these nested callbacks into a mess, otherwise knows as "Callback Hell" or "The Pyramid of Doom".

The equivalent code using promises looks like this:

fetch('http://example.com/first-endpoint').then(() => {
    console.log('First request has completed');
    return fetch('http://example.com/second-endpoint');
})
.then(() => {
    console.log('Second request has completed');
});
Instead of nesting the second callback, you return another promise. When you return a promise its state is adopted by the promise from the first fetch call. This means that you can chain another then call for handling the second response. This process can continue indefinitely, returning a new promise for an async task, and chaining another then call.

Exercise

Update your getArtists method to also fetch a list of artists related to the one you are searching for.

Instead of returning the artist object from your getFromApi callback, return a request to the get related artists endpoint.
It should use the artist ID from the artist object.
Chain another then call to handle the response from your second request.
Inside the callback you should:
Set artist.related to item.artists, where item is the object returned by the get related artists endpoint.
Return the artist object.
Try searching for an artist again. You should now see a list of related artists also being displayed.

Promises in parallel

As well as doing things in series (one after another), you can use promises to do things in parallel. For example, imagine that you wanted to fetch the content from five different unrelated API endpoints. You could make the first request and wait for the response, then make the second request and wait for the response, and so on. But it would be quicker to make all five requests simultaneously, then move on when they have all responded.

The Promise.all method allows you to do this. You pass in an array of promises, and are returned a new promise which will resolve only when all of the input promises have resolved. For example:

var firstPromise = fetch('http://example.com/first-endpoint');
var secondPromise = fetch('http://example.com/second-endpoint');
var thirdPromise = fetch('http://example.com/third-endpoint');

var allPromise = Promise.all([firstPromise, secondPromise, thirdPromise]);
allPromise.then(responses => {
    // We have responses from all three requests
});
Here you make three request using the fetch API. They will take different amounts of time to resolve depending on how quickly the server responds to each request. So in order to wait for all of them to resolve before moving on, you use Promise.all to create another promise, called allPromise. This resolves when all of the three fetch promises have resolved. The results of the promises are collected together and passed into the allPromise callback as the responses array.

Exercise

In the previous exercise you fetched a list of artists who are similar to the artist you search for. Now you are going to take that list and, in parallel, make a request for each artist to the top tracks endpoint. This will return a list of the most popular tracks by the artist.

Inside the callback from your get related artists request, loop through each artist and make a request to the top tracks endpoint.
It should use the artist IDs from the artist.related object.
Use Promise.all to create a new promise which will resolve when you have responses to all of the requests to the top tracks endpoint.
Return the promise from the callback instead of the artist object.
Chain another then call to handle the responses from the parallel requests.
Inside the callback you should:
Loop through the responses, setting the tracks attribute of the related artist to item.tracks, where item is the object returned by the top tracks endpoint.
Return the artist object from the callback.
Creating promises

You now know pretty much everything there is to know about using promises, but what about if you need to create promises of your own to wrap asynchronous tasks which only support callbacks? Let's see how this works by making a promisified version of the setTimeout method, which waits for a number of milliseconds before running a callback:

var wait = function(ms) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, ms);
    });
};

wait(1000).then(() => {
    console.log('Hello world');
});
To create a promise you call new Promise, passing in a function which will be run by the promise straight away. The function is called with two arguments, resolve, which is a function which you call to indicate that the asynchronous task has completed successfully, and reject, which you call to indicate that the task has failed. In this example you call the setTimeout function. When the timeout completes, your asynchronous task is done, so you call the resolve function. This will trigger the .then callback. If there was a problem completing the task for whatever reason then calling reject would trigger the .catch callback.