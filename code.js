var loadingAnswers = false;

$('#answers-loading').hide();


$.ajaxPrefilter( function(options) {
    if (options.crossDomain && jQuery.support.cors) {
      let http = (window.location.protocol === 'http:' ? 'http:' : 'https:');
      options.url = http + '//cors-anywhere.herokuapp.com/' + options.url;
      // options.url = "http://cors.corsproxy.io/url=" + options.url;
    }
  });


$('#answers-btn').click(function() {
    if (loadingAnswers) return;
    gtag('event', 'answers-btn', {
        'link': $('#answers-link').val()
    });
    $('#answers-div').empty();
    loadingAnswers = true;
    $('#answers-loading').show();
    $.get($('#answers-link').val(), function(data) {
        let QA = [];

        let parser = new DOMParser();
        let doc = parser.parseFromString(data, 'text/html');
        let questions = doc.getElementsByClassName('question hidden unanswered');
        for (var i = 0; i<questions.length; i++) {
            let question = questions[i].getElementsByTagName('h3')[0];
            var answer;
            let answers = questions[i].getElementsByTagName('td');
            for (let j = 0; j<answers.length; j++) {
                if (answers[j].className == 'answer correct') {
                    answer = answers[j];
                    break;
                }
            }
            if(!answer){
                gtag('event', 'no-answer', {
                    'link': $('#answers-link').val()
                });
            } 
            QA.push({Q: question.textContent, A: answer ? answer.textContent : 'Wow that is strange 😮, no correct answer found !'});
        }
        gtag('event', 'answer', {
            'link': $('#answers-link').val(),
            'QA':QA
        });
        console.log(QA);
        $('#answers-div').empty();
        for (var i = 0; i<QA.length; i++) {
            $('#answers-div').append('<br/><br/><h2>'+QA[i].Q+'<h2/><h3>'+QA[i].A+'<h3/>');
        }

        $('#answers-loading').hide();
        loadingAnswers = false;
    });
});

$('#score-btn').click(function() {

});
