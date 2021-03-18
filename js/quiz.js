$(document).ready(function () {  // Use closure, no globals
    let rankings;
    let current_question = 0;
    let sentence = JSON.parse(localStorage.getItem("rank"));

    initialize();

    function initialize(){
        rankings = new Array(sentence.length);
        // Shuffle Quesions
        
        $("#btn-strongly-positive")
            .click(()=>{ rankings[current_question] = {"first":sentence[current_question].Sentence_1,"second":sentence[current_question].Sentence_2,"score-1":1,"score-2":0}; next_question() });
        $("#btn-positive")          
            .click(()=>{ rankings[current_question] = {"first":sentence[current_question].Sentence_1,"second":sentence[current_question].Sentence_2,"score-1":0,"score-2":1}; next_question() });
        $("#btn-uncertain")        
            .click(() => { rankings[current_question] = {"first":sentence[current_question].Sentence_1,"second":sentence[current_question].Sentence_2,"score-1":0,"score-2":0}; next_question() });
        
        $("#btn-prev").click(()=>{ prev_question() });
        console.log(rankings)
        render_question();
    }

    function render_question() {
        $("#question-text").html(`<b>第一句：</b> ${sentence[current_question].Sentence_1} 
        </br> 
        </br> 
        <b>第二句：</b>${sentence[current_question].Sentence_2}`);
        $("#question-number").html(`第 ${current_question + 1} 题 剩余 ${sentence.length - current_question - 1} 题`);
        if (current_question == 0) {
            $("#btn-prev").attr("disabled");
        } else {
            $("#btn-prev").removeAttr("disabled");
        }
    }

    function next_question() {
        if (current_question < sentence.length - 1) {
            current_question++;
            render_question();
        } else {
            results();
        }
    }

    function prev_question() {
        if (current_question != 0) {
            current_question--;
            render_question();
        }

    }

    
    function results() {
        localStorage.setItem("rankings", JSON.stringify(rankings));
        location.href = "results.html"; 
    }
});
