// @author Rob W <http://stackoverflow.com/users/938089/rob-w>
chrome.runtime.sendMessage({
  action: "SendSource",
  source: readDocument(document)
});


function readDocument(document) {
  var jq = document.createElement('script');
  jq.src = "https://cdn.rawgit.com/github/fetch/master/fetch.js"
  
  var pages = [];
  var link = "https://icook.tw/recipes/search?ingredients=&page=1&q=" + param;
  getLink(link)
  
  function getLink(link){
    var pageNum = pages.length + 1;
    console.log("Getting " + pageNum + " page");
    fetch(link, {credentials: "same-origin"}).then((response)=>{
      return response.text();
    }).then((body)=>{
      document.body.innerHTML = body;
      var next_page = document.getElementsByClassName("next_page");
      var link = next_page.length === 0 ? Promise.reject(pages): next_page[0].children[0].href;
      return link;
    }).then((link)=>{
      setTimeout(function(){
        getLink(link);
        pages.push(link);
      },10);
      return pages;
    }).catch((pages)=>{
      getCount();
    });
  }
  
  function getCount(){
    var list_of_recipes = {};
    Promise.all(pages.map((link) => {
      return fetch(link, {credentials: "same-origin"}).then((res)=>{
        return res.text();
      }).then((body)=>{
      document.body.innerHTML = body;
      var bill_recipes = document.getElementsByClassName("media recipe-card list-card");
      for(var i = 1; i < bill_recipes.length; i++){
        var bill_menu = bill_recipes[i].getElementsByClassName("media-body card-info");
        var bill_link = bill_recipes[i].getElementsByClassName("visible-xs")[0].href;
        var meta = bill_menu[0].getElementsByClassName("meta clearfix");
        var span_fav_count = meta[0].getElementsByClassName("fav-count recipe-favorites")[0];
        var vote = span_fav_count.getElementsByTagName("span")[0].childNodes[0].data
        if(parseInt(vote) !== 1)
          list_of_recipes[bill_link] = parseInt(vote);
      }
      return list_of_recipes;
      });
    })).then(()=>{
      sortTheRecipes(list_of_recipes);
    });
  }
  
  function sortTheRecipes(list_of_recipes){
    var recipeSort = [];
    for(recipe in list_of_recipes)
      recipeSort.push([recipe, list_of_recipes[recipe]]);
    recipeSort.sort((a,b)=>{
       return b[1] - a[1]; 
    });
    loadTheResult(recipeSort);
  }
  
  function loadTheResult(recipeSort){
    document.body.style.padding = "50px";
    document.body.innerHTML = '<ol>';

    recipeSort.map((recipe)=>{
      document.body.innerHTML += '<li><a href=' + recipe[0] + '>' + recipe[0] + '</a>: ' + recipe[1] + '</li>';
    });

    document.body.innerHTML += '</ol>';
  }
}
