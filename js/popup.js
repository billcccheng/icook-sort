function runPlugin(keyword) {
  chrome.tabs.executeScript(null, {
    code: 'let param = ' + JSON.stringify(keyword)
  },function() {
    chrome.tabs.executeScript(null, {file: 'js/getPagesSource.js'});
  });
}

document.addEventListener('DOMContentLoaded', function(){
  document.getElementById("submit-btn").addEventListener("click", submit);
});

function submit(){
  let keyword = document.getElementById("keyword").value;
  window.onload = runPlugin(keyword);
}
