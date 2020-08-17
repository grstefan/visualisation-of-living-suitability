function myFunction() {
    var final_score = [0, 0, 0, 0, 0, 0];
    var inputs = document.querySelectorAll("input[type='checkbox']");
    for (var i = 0; i < inputs.length; i++) {
        if (inputs[i].checked) {
            final_score[i] = 1
        }
    }
    var source = 'http://127.0.0.1:8000/subregions';
    source += '.population.' + final_score[0].toString();
    source += '.crime.' + final_score[1].toString();
    source += '.park.' + final_score[2].toString();
    source += '.school.' + final_score[3].toString();
    source += '.church.' + final_score[4].toString();
    source += '.restaurant.' + final_score[5].toString();


    map.getSource('subregions').setData(source);
}


var sources_ = ['restaurant', 'school', 'church'];
var safety = 1;

function onClickHandler() {

    if (safety) {
        safety = 0;
    } else {
        safety = 1;
    }

    for (var i = 0; i < sources_.length; i++) {
        map.getSource(sources_[i] + 's').setData('http://127.0.0.1:8000/' + sources_[i] + '\.' + safety.toString());
    }


}

