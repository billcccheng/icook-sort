function runPlugin(keyword) {
  //document.getElementById("loader").style.display = "block";
  chrome.tabs.executeScript(null, {
    code: 'var param = ' + JSON.stringify(keyword)
  },function() {
    chrome.tabs.executeScript(null, {file: 'js/getPagesSource.js'});
  });
}
chrome.runtime.onMessage.addListener(function(req, sender) {
  if (req.action === "getRecipeList") {
    //document.getElementById("loader").style.display = "none";
    document.getElementById("percentage-tracker").innerHTML = "";
    let mainContent = document.getElementById("mainContent");
    mainContent.innerHTML = '<ol>' + req.source + '</ol>';
  } else if(req.action === "currPageNum" && req.totalPages !== 0) {
    let percentage = req.currPageNum*100/req.totalPages;
    let tracking = percentage.toFixed(0);
    document.getElementById("percentage-tracker").innerHTML = tracking + " %";
  }
});

document.addEventListener('DOMContentLoaded', function(){
  document.getElementById("submit-btn").addEventListener("click", submit);
});

function submit(){
  let keyword = document.getElementById("keyword").value;
  window.onload = runPlugin(keyword);
}
