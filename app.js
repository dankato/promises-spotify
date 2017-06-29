$(function() {
    fetch('url')
    .then(function(data) {
        console.log(1, data);
        return data.json();
    })
    .then(data => (
        console.log(data);
    ))
})