function ExportToTable() {  
    var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.csv)$/;  
    //Checks whether the file is a valid csv file    
    if (regex.test($("#csvfile").val().toLowerCase())) {  
        //Checks whether the browser supports HTML5    
        if (typeof(FileReader) != "undefined") {  
        var reader = new FileReader();  
        reader.onload = function(e) {  
        var table = $("#csvtable > tbody");  
        //Splitting of Rows in the csv file    
        var csvrows = e.target.result.split("\n");
        
        var csv = reader.result;
        var lines = csv.split("\n");
        var result = [];
        var headers=["Sentence_1","Sentence_2"];
        for(var i=1;i<lines.length;i++){
            var obj = {};
            var currentline=lines[i].split(",");
            for(var j=0;j<headers.length;j++){
                obj[headers[j]] = currentline[j];
              }
            result.push(obj);
        }  
              //return result; //JavaScript object
        result= JSON.stringify(result); //JSON
        console.log(result);
        localStorage.setItem("rank", result); 
        
        for (var i = 0; i < csvrows.length; i++) {  
        if (csvrows[i] != "") {  
            var row = "<tr>";  
            var csvcols = csvrows[i].split(",");  
            //Looping through each cell in a csv row    
            for (var j = 0; j < csvcols.length; j++) {  
            var cols = "<td>" + csvcols[j] + "</td>";  
            row += cols;  
            }  
            row += "</tr>";  
            table.append(row);  
        }
        }  
        $('#csvtable').show();  
        }  
        reader.readAsText($("#csvfile")[0].files[0]);  
        } else {  
        alert("Sorry! Your browser does not support HTML5!");  
        }  
    } else {  
        alert("Please upload a valid CSV file!");  
    }  
    }


    


