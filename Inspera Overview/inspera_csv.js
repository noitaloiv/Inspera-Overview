var vg_count = 0;
var g_count = 0;
var u_count = 0;
var avg = 0;
var qavg = null;
var table_count = 0;

var g = null;
var vg = null;
var max_score = null;

$(document).ready(function () {
    $('#load_data').change(function () {
        $('#load_data_label').text($("#load_data")[0].files[0].name);
    });
    $('#read_csv').click(function () {
        var csv = $('#load_data')[0].files[0];
        // if ($("#inspera_dl").val() != "") {
        //     $.ajax({
        //         type: 'GET',
        //         url: 'https://exam.uu.se/api/v1/test/54156208/submissions',
        //         dataType: "text",
        //         success: function (response) {
        //             csv = response;
        //         }
        //     });
        // }
        vg_count = 0;
        g_count = 0;
        u_count = 0;
        avg = 0;
        table_count = 0;
        var reader = new FileReader();
        reader.readAsText(csv);
        reader.onloadend = function () {
            var json = csvJSON(reader.result);
            var j = JSON.parse(json);
            g = $('#g').val();
            vg = $('#vg').val();

            var insp = InsperaJSON(j, g, vg);

            qavg = new Array(insp.inspera[0].questions.length).fill(0);


            max_score = $('#max_score').val();

            var table_data = "";
            insp.inspera.forEach(element => {
                var table_row = "";
                if ($('#borderline').is(':checked') && element.border_case == true && g != 0 && vg != 0) {
                    table_row = createRow(element);
                }
                else if ($('#borderline').is(':checked') == false) {
                    table_row = createRow(element);
                }
                if (table_row != "")
                    table_count++;
                table_data += table_row;
            });

            table_data += '</table>';

            $('#inspera_table').html(createHead(insp) + table_data);

            var imported = document.createElement('script');
            imported.src = 'sorttable.js';
            document.head.appendChild(imported);
        }
    });
});
function createHead(insp) {
    var table_head = '<table class="table table-bordered table-striped sortable" style="margin-bottom: 0;">';
    table_head += '<tr>';
    table_head += '<th class="thead">' + "StudentID: " + "<br>" + "&#8470 of students: " + table_count + '</th>';
    table_head += '<th class="thead">' + "Grade: " + "<br>" + "VG: " + vg_count + "<br>G: " + g_count + "<br>U: " + u_count + '</th>';
    var percentage = "";
    if (max_score != 0)
        percentage = "<br>(Avg. percentage: " + (Math.round(((avg / table_count) / max_score) * 100) / 1).toFixed(1) + "%)";
    table_head += '<th class="thead">' + "Score: " + "<br>" + "(Avg. Score: " + Math.round((avg / table_count) / 1).toFixed(1) + ')' + percentage + '</th>';
    for (var i = 0; i < qavg.length; i++) {
        table_head += '<th class="thead">' + "Q" + (i + 1) + ": " + "<br>" + "(Avg: " + Math.round((qavg[i] / table_count) / 1).toFixed(1) + ')</th>';
    }
    table_head += '</tr>';
    return table_head;
}

function createRow(element) {
    var table_row = "";
    table_row += '<tr>';
    table_row += '<td style="white-space: nowrap;">' + element.student + '</td>';
    var border_case = "";
    var back = ' style="background: limegreen;';
    // var back = '';
    if (element.grade == "U") {
        back = ' style="background: orangered;';
        if (g != 0 && g - Number(element.total) <= 3 && g != Number(element.total)) {
            border_case = " (+" + (g - Number(element.total)) + "p -> G)";
            back = ' style="background: deepskyblue;';
        }
        table_row += '<td' + back + ' white-space: nowrap;"><span style= "display: none; ">0</span>' + element.grade + border_case + '</td>';
    }
    else if (element.grade == "G") {
        if (vg != 0 && vg - Number(element.total) <= 3 && vg != Number(element.total)) {
            border_case = " (+" + (vg - Number(element.total)) + "p -> VG)";
            back = ' style="background: deepskyblue;';
        }
        table_row += '<td' + back + ' white-space: nowrap;"><span style= "display: none;">1</span>' + element.grade + border_case + '</td>';
    }
    else
        table_row += '<td' + back + ' white-space: nowrap;"><span style= "display: none;">2</span>' + element.grade + '</td>';
    var stud_avg = "";
    if (max_score != 0)
        stud_avg = " (" + (Math.round((element.total / max_score) * 100) / 1).toFixed(1) + "%)";
    table_row += '<td>' + element.total + stud_avg + '</td>';
    for (var i = 0; i < element.questions.length; i++) {
        table_row += '<td>' + element.questions[i].score + '</td>';
        qavg[i] += element.questions[i].score;
    }
    avg += element.total;

    if (element.grade == "VG")
        vg_count++;
    else if (element.grade == "G")
        g_count++;
    else
        u_count++;

    table_row += '</tr>';
    return table_row;
}

function csvJSON(csv) {
    var lines = csv.split("\n");
    var result = [];
    var headers = lines[0].split(",");
    for (var i = 1; i < lines.length; i++) {
        var obj = {};
        var currentline = lines[i].split(",");
        for (var j = 0; j < headers.length; j++) {
            obj[headers[j]] = currentline[j];
        }
        result.push(obj);
    }
    return JSON.stringify(result);
}

function InsperaJSON(json, g, vg) {
    var students = $.unique(json.map(function (id) { return id.CandidateExternalId; }));
    students.sort();
    var inspera = { "inspera": [] };
    students.forEach(element => {
        if (element != "") {
            inspera['inspera'].push({ 'student': element, 'questions': [], 'grade': 0, 'total': 0, 'border_case': false })
        }
    });
    for (var i = 0; i < inspera['inspera'].length; i++) {
        for (var e = 0; e < json.length; e++) {
            if (json[e]['CandidateExternalId'] == inspera.inspera[i]['student']) {
                var score = Number(json[e]['ManuallyGradedScore']) + Number(json[e]['AutoGradedScore']);
                inspera.inspera[i]['questions'].push({ "question": json[e]['QuestionNo'], "score": score });
                inspera.inspera[i].total += score;
            }
        }
        //console.log(g);
        inspera.inspera[i].grade = CalcGrade(inspera.inspera[i], g, vg);

        if (g != 0 && inspera.inspera[i].grade == "U" && g - Number(inspera.inspera[i].total) <= 3)
            inspera.inspera[i].border_case = true;
        else if (vg != 0 && inspera.inspera[i].grade == "G" && vg - Number(inspera.inspera[i].total) <= 3){
            inspera.inspera[i].border_case = true;
        }
    }
    return inspera;
}

function CalcGrade(student, g, vg){
    var grade = "";

    if(student.total < g)
        grade = "U";
    else if(student.total < vg)
        grade = "G";
    else
        grade = "VG";

    return grade;
}