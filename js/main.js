$(document).ready(function() {
  $.ajax({
    beforeSend: function(xhr) {
      xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
    },
    crossDomain: true,
    url: "http://rss.allrecipes.com/daily.aspx?hubID=80",
    dataType: "jsonp",
    success: function() {
      alert("success!");
    },
    error: function() {
    	alert("fail!"); 
    }
  });
});