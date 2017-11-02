function runPlugin(keyword) {
  chrome.tabs.executeScript(null, {
    code: 'var param = ' + JSON.stringify(keyword)
  },function() {
    chrome.tabs.executeScript(null, {file: 'js/getPagesSource.js'});
  });
}

document.addEventListener('DOMContentLoaded', function(){
  document.getElementById("submit-btn").addEventListener("click", submit);
});

function submit(){
  var keyword = document.getElementById("keyword").value;
  window.onload = runPlugin(keyword);
}
