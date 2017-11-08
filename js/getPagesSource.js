//function readDocument(document) {
  var fetchScript = document.createElement('script');
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
      console.log("Geting page " + pageNum + "...");
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
        let _recipes = doc.getElementsByClassName("media recipe-card list-card");
        for(let i = 1; i < _recipes.length; i++){
          let recipe_link = _recipes[i].getElementsByClassName("visible-xs")[0].href;
          let pull_left_class = _recipes[i].getElementsByClassName("pull-left");
          let data_recipe = JSON.parse(pull_left_class[0].childNodes[1].getAttribute("data-recipe")); 
          if(!data_recipe) continue;
          let name = data_recipe["name"] ? data_recipe["name"] : "no name";
          let image = data_recipe["cover"];
          let _menu = _recipes[i].getElementsByClassName("media-body card-info");
          let meta = _menu[0].getElementsByClassName("meta clearfix");
          let span_fav_count = meta[0].getElementsByClassName("fav-count recipe-favorites")[0];
          let vote = span_fav_count.getElementsByTagName("span")[0].childNodes[0].data.replace(",", "");
          let basicInfo = {};
          basicInfo["vote"] = parseInt(vote);
          basicInfo["link"] = recipe_link;
          basicInfo["image"] = image;
          if(basicInfo["vote"] !== 1)
            list_of_recipes[name] = basicInfo;
        }
        return list_of_recipes;
      });
    })).then(()=>{
      sortTheRecipes(list_of_recipes);
    });
  }
  
  function sortTheRecipes(list_of_recipes){
    let recipeSort = [];
    for(name in list_of_recipes)
      recipeSort.push([name, list_of_recipes[name]["vote"]]);
    recipeSort.sort((a,b)=>{
       return b[1] - a[1]; 
    });
    loadTheResult(recipeSort, list_of_recipes);
  }
  
  function loadTheResult(recipeSort, list_of_recipes){
    let list = ""
    recipeSort.map((recipe)=>{
      let name = recipe[0];
      let selectedRecipe = list_of_recipes[name];
      //console.log(selectedRecipe["image"]);
      list += '<li><a target="_blank" href=' + selectedRecipe["link"] + '>'+ name + '</a>: ' + selectedRecipe["vote"] +'<img src='+selectedRecipe["image"] + ' />'+ '</li>';
    });

    chrome.runtime.sendMessage({
      action: "getRecipeList",
      source: list 
    });
  }
