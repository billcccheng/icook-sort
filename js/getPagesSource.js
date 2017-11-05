chrome.runtime.sendMessage({
  action: "SendSource",
  source: readDocument(document)
});

function readDocument(document) {
  let fetchScript = document.createElement('script');
  fetchScript.src = "https://cdn.rawgit.com/github/fetch/master/fetch.js"
  
  let pages = [];
  let parser = new DOMParser();
  let link = "https://icook.tw/recipes/search?ingredients=&page=1&q=" + param;
  getLink(link);
  
  function getLink(link){
    fetch(link, {credentials: "same-origin"}).then((response)=>{
      return response.text();
    }).then((body)=>{
      let pageNum = pages.length + 1;
      console.log("Geting " + pageNum + " page...");
      let doc = parser.parseFromString(body, 'text/html');
      let next_page = doc.getElementsByClassName("next_page");
      return next_page.length === 0 ? Promise.reject("No Next Page"): next_page[0].children[0].href;
    }).then((link)=>{
      setTimeout(()=>{
        getLink(link);
        pages.push(link);
      },30);
    }).catch((err)=>{
      console.log(err);
      getCount();
    });
  }
  
  function getCount(){
    let list_of_recipes = {};
    Promise.all(pages.map((link) => {
      return fetch(link, {credentials: "same-origin"}).then((res)=>{
        return res.text();
      }).then((body)=>{
      let doc = parser.parseFromString(body, 'text/html');
      let bill_recipes = doc.getElementsByClassName("media recipe-card list-card");
      for(let i = 1; i < bill_recipes.length; i++){
        let bill_menu = bill_recipes[i].getElementsByClassName("media-body card-info");
        let bill_link = bill_recipes[i].getElementsByClassName("visible-xs")[0].href;
        let meta = bill_menu[0].getElementsByClassName("meta clearfix");
        let span_fav_count = meta[0].getElementsByClassName("fav-count recipe-favorites")[0];
        let vote = span_fav_count.getElementsByTagName("span")[0].childNodes[0].data
        vote = vote.replace(",", "");
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
    let recipeSort = [];
    for(recipe in list_of_recipes)
      recipeSort.push([recipe, list_of_recipes[recipe]]);
    recipeSort.sort((a,b)=>{
       return b[1] - a[1]; 
    });
    loadTheResult(recipeSort);
  }
  
  function loadTheResult(recipeSort){
    let list = ""
    recipeSort.map((recipe)=>{
      let link = recipe[0];
      let count = recipe[1];
      list += '<li><a target="_blank" href=' + link + '>' + link + '</a>: ' + count + '</li>';
    });
    document.body.style.padding = "50px";
    document.body.innerHTML = '<ol>' + list + '</ol>';
  }
}
