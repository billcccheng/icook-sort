var jq = document.createElement('script');
jq.src = "https://cdn.rawgit.com/github/fetch/master/fetch.js"



// var pages = [window.location.href]
// var next_page = document.getElementsByClassName("next_page");
// var link = next_page[0].children[0].href;




// var next_page = document.getElementsByClassName("next_page");
// link = pages[0];

// var getLink = function(link){fetch(link).then(function (response){
//       return response.text();
//     }).then((body)=>{
//         document.body.innerHTML = body;
//         var next_page = document.getElementsByClassName("next_page");
//         var link = next_page[0].children[0].href;
//         return link;
//     }).then((link)=>{
//         if(link){
//             pages.push(link);
//             setTimeout(function(){getLink(link)},5000);
//             console.log(pages);
//         }
//     });
// }

// getLink(link)

// console.log(link);
var list_of_recipes = {}
link = "https://icook.tw/recipes/search?ingredients=&page=9&q=三杯雞";

fetch(link).then(function (response){
  return response.text();
}).then((body)=>{
    document.body.innerHTML = body;
    var bill_recipes = document.getElementsByClassName("media recipe-card list-card");
    for(var i = 1; i < bill_recipes.length; i++){
        var bill_menu = bill_recipes[i].getElementsByClassName("media-body card-info");
        var bill_link = bill_recipes[i].getElementsByClassName("visible-xs")[0].href;
        var meta = bill_menu[0].getElementsByClassName("meta clearfix");
        var span_fav_count = meta[0].getElementsByClassName("fav-count recipe-favorites")[0];
        var vote = span_fav_count.getElementsByTagName("span")[0].childNodes[0].data
        list_of_recipes[bill_link] = parseInt(vote);
    }
    console.log(bill_recipes);
    return list_of_recipes
}).then((list_of_recipes)=>{
    console.log(list_of_recipes)
});

console.log(Object.keys(list_of_recipes).length);    
console.log(list_of_recipes);