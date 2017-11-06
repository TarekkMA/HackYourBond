
function getDataFromUrl(url){
    return {
        num:1,
        id:2
    };
}


$("#answers-btn").click(function () {

    $.ajax({
        type: 'GET',
        url: $("answers-link").val,
        data: null,
        dataType: 'jsonp',
        success: function(response) {
    
        console.log(response);
    
      },
      xhrFields: {
        withCredentials: true
      },
      error: function(error) {
    
        console.log('ERROR:', error);
    
      }
    });
});

$("#score-btn").click(function () {

});