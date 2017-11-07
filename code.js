var loadingAnswers = false;
var loadingScore = false;
var re = /^https:\/\/testourbond.com\/quiz\d\/[0-9]*/;


$('#answers-loading').hide();
$('#score-loading').hide();


function isLinkValid(link) {
    return (link.match(re));
}

function getInvaledLinkHtml() {
    return "<h2 class='zerobotton' style='color:#af4715;'>Link is invalid</h2><br/>" +
        "<h3 class='zerobotton'>Make sure that your link is valid</h3><br/>" +
        "<span>example: <a href='https://testourbond.com/quiz3/153058'>https://testourbond.com/quiz3/153058</a></span>";
}

$.ajaxPrefilter(function (options) {
    if (options.crossDomain && jQuery.support.cors) {
        var http = (window.location.protocol === 'http:' ? 'http:' : 'https:');
        options.url = http + '//cors-anywhere.herokuapp.com/' + options.url;
        // options.url = "http://cors.corsproxy.io/url=" + options.url;
    }
});

function getDOM(link, callback) {
    $.get(link, function (data) {
        let parser = new DOMParser();
        let doc = parser.parseFromString(data, 'text/html');
        callback(doc);
    });
}

$('#answers-btn').click(function () {
    if (loadingAnswers) return;
    $('#answers-div').empty();

    if (!isLinkValid($('#answers-link').val())) {
        gtag('event', 'invalid-link', {
            'link': $('#answers-link').val()
        });
        $('#answers-div').append(getInvaledLinkHtml());
        return;
    }

    gtag('event', 'answers-btn', {
        'link': $('#answers-link').val()
    });
    loadingAnswers = true;
    $('#answers-loading').show();
    getDOM($('#answers-link').val(), function (doc) {
        let QA = [];

        let questions = doc.getElementsByClassName('question hidden unanswered');

        for (var i = 0; i < questions.length; i++) {
            let question = questions[i].getElementsByTagName('h3')[0];
            var answer;
            let answers = questions[i].getElementsByTagName('td');
            for (let j = 0; j < answers.length; j++) {
                if (answers[j].className == 'answer correct') {
                    answer = answers[j];
                    break;
                }
            }
            if (!answer) {
                gtag('event', 'no-answer', {
                    'link': $('#answers-link').val()
                });
            }
            QA.push({
                Q: question.textContent,
                A: answer ? answer.textContent : 'Wow that is strange 😮, no correct answer found !'
            });
        }
        gtag('event', 'answer', {
            'link': $('#answers-link').val(),
            'QA': QA
        });
        console.log(QA);
        $('#answers-div').empty();
        for (var i = 0; i < QA.length; i++) {
            $('#answers-div').append('<br/><br/><h2>' + QA[i].Q + '<h2/><h3>' + QA[i].A + '<h3/>');
        }

        $('#answers-loading').hide();
        loadingAnswers = false;
    });
});

$('#score-btn').click(function () {
    if (loadingScore) return;
    $('#score-div').empty();
    var matches = isLinkValid($('#score-link').val());
    if (!matches) {
        gtag('event', 'invalid-link', {
            'link': $('#score-link').val()
        });
        $('#score-div').append(getInvaledLinkHtml());
        return;
    }
    
    loadingScore = true;
    $('#score-loading').show();
    var nums = matches[0].replace(/^\D+/g, '').replace("/", "");
    var des = nums.charAt(0);
    var quizId = nums.substring(1, nums.length);
    var name = $('#score-name').val();
    var score = $('#score-score').val();

    gtag('event', 'score-btn', {
        'link': $('#score-link').val(),
        'score':score,
        'name':name
    });
    

    getDOM(matches[0],function(doc){
        var name1,email;
        name1 = doc.getElementById('name1').getAttribute('value');
        email = doc.getElementById('email').getAttribute('value');
        
        var payload = {
            //selected won't have effect on score
            "selected":"",
            "name":name,
            "name1":name1,
            "email":email,
            "quizid":quizId,
            "score":score
        }

        $.post('https://testourbond.com/postanswer'+des,payload,function(data){
            $('#score-div').append(
                "<h2>Done</h2>"+
                "<span>Check it out: <a href='"+matches[0]+"'>"+matches[0]+"</a></span>"
            );
            loadingScore = false;
            $('#score-loading').hide();
        });
    });
});