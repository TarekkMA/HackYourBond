
function getDataFromUrl(url){
    return {
        num:1,
        id:2
    };
}


$("#answers-btn").click(function () {
    $.get($("#answers-link").val(),function(data){
        console.log(data);
        //
    });
});

$("#score-btn").click(function () {

});