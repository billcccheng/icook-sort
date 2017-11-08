function runPlugin(keyword) {
  chrome.tabs.executeScript(null, {
    code: 'var param = ' + JSON.stringify(keyword)
  },function() {
    chrome.tabs.executeScript(null, {file: 'js/getPagesSource.js'});
  });
}
chrome.runtime.onMessage.addListener(function(req, sender) {
  if (req.action == "getRecipeList") {
    console.log(req.source);
  }
});

document.addEventListener('DOMContentLoaded', function(){
  document.getElementById("submit-btn").addEventListener("click", submit);
});

function submit(){
  let keyword = document.getElementById("keyword").value;
  window.onload = runPlugin(keyword);
}
