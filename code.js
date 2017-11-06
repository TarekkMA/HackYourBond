var loadingAnswers = false; 

$("#answers-loading").hide();


$.ajaxPrefilter( function (options) {
    if (options.crossDomain && jQuery.support.cors) {
      var http = (window.location.protocol === 'http:' ? 'http:' : 'https:');
      options.url = http + '//cors-anywhere.herokuapp.com/' + options.url;
      //options.url = "http://cors.corsproxy.io/url=" + options.url;
    }
  });


$("#answers-btn").click(function () {
    if(loadingAnswers)return;
    $("#answers-div").empty();
    loadingAnswers = true;
    $("#answers-loading").show();    
    $.get($("#answers-link").val(),function(data){
        var QA = [];

        var parser = new DOMParser();
        var doc = parser.parseFromString(data, "text/html");
        var questions =  doc.getElementsByClassName("question hidden unanswered");
        for(var i = 0;i<questions.length;i++){
            var question  = questions[i].getElementsByTagName("h3")[0];
            var answer;
            var answers = questions[i].getElementsByTagName("td");
            for(var j = 0;j<answers.length;j++){
                if(answers[j].className == "answer correct"){
                    answer = answers[j];
                    break;
                }
            }
            QA.push({Q:question.textContent,A:answer.textContent});
        }
        console.log(QA);
        $("#answers-div").empty();
        for(var i = 0;i<QA.length;i++){
            $("#answers-div").append("<br/><br/><h2>"+QA[i].Q+"<h2/><h3>"+QA[i].A+"<h3/>");
        }
        
        $("#answers-loading").hide();        
        loadingAnswers = false;
    });
});

$("#score-btn").click(function () {

});