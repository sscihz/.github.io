 // Use closure, no global
 function geopathplot(){
        // DATA 
    // MAP setup
    var width = 800,
    height = 550;

// data goes here

//I have to get the base here, currently, I plan include population and GDP
    //function basedata(){
        //var basetype = d3.select('#basetype option:checked').attr('id')
        //var year = d3.select('#year').text()
        var umap = []
        var data=[["Gansu",48],["Qinghai",47],["Guangxi",45],["Guizhou",35],["Chongqing",34],["Beijing",12],["Fujian",35],["Anhui",6],["Guangdong",40],["Xizang",3],["Xinjiang",12],["Hainan",21],["Ningxia",8],["Shaanxi",40],["Shanxi",11],["Hubei",1],["Hunan",23],["Sichuan",19],["Yunnan",19],["Hebei",34],["Henan",20],["Liaoning",14],["Shandong",0],["Tianjin",12],["Jiangxi",20],["Jiangsu",37],["Shanghai",34],["Zhejiang",46],["Jilin",38],["Inner Mongol",10],["Heilongjiang",20],["Taiwan",45],["Xianggang",35],["Macau",10]];
        var title='';
        var desc='Based on Jiang‘s CPED';
        var credits='by SKHZ Group';
        

        data.map(function(d) {umap[d[0]]=Number(d[1])});
        var v = Object.keys(umap).map(function(k){return umap[k]})

    //}
    

    // LOAD DATA

    // DRAW 
    // create SVG map
    var projection = d3.geoMercator()
        .center([116,39])
        .scale(600);

    var svg = d3.select("#map").append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("preserveAspectRatio", "xMidYMid")
        .attr("viewBox", "0 0 " + width + " " + height);

    var path = d3.geoPath()
        .projection(projection);

    // COLORS
    // define color scale
    var colorScale = d3.scaleLinear()
            .domain(d3.extent(v))
            .interpolate(d3.interpolateHcl)
            .range(["white", "lightgrey"]);

    // add grey color if no values
    var color = function(i){ 
        if (i==undefined) {return "#cccccc"}
        else return colorScale(i)
    }

    // BACKGROUND
    svg.append("g")
        .attr("class", "background")
        .append("rect")
        .attr("class", "background")
        .attr("width", width)
        .attr("height", height)
        .attr("fill", "#eeeeee")
        .attr("stroke", "black")
        .attr("stroke-width", "0.35");

    // TITLE AND INFOS
    svg.append('g')
        .attr("class","info")
        .attr("transform", "translate("+(width-140)+","+(height-180)+")")
        .append("rect")
        .attr({fill : "transparent", height: 160,width:160})

    svg.select('.info')
        .append("g")
        .attr("class", "title")
        .append("text")
        // .attr("dx", function(d){return 35})          
        .attr("transform", "translate(0,-70)")
        .attr("dy", function(d){return 16})
        .attr("text-anchor", "middle")  
        .attr("font-family", "sans-serif")
        .attr("fill", "#4B4B4B")
        .style("text-decoration", "bold")  
        .text(title)
        .attr("font-size", 16)
        .call(wrap, 150);

    svg.select('.info')
        .append("g")
        .attr("class","legend")
        .append("text")
        .attr("dx", function(d){return 0})          
        .attr("dy", 12 )
        .attr("text-anchor", "middle")  
        .attr("font-family", "sans-serif")
        .attr("fill", "#aaaaaa")
        .attr("font-size", 12)
        .text(desc)
        .call(wrap, 150);

    svg.select('.info')
        .append("g")
        .attr("class","credits")
        .attr("transform", "translate(0,140)")
        .append("text")
        .attr("dx", function(d){return 0})          
        .attr("dy", 9 )
        .attr("text-anchor", "middle")  
        .attr("font-family", "sans-serif")
        .attr("fill", "#aaaaaa")
        .attr("font-size", 11)
        .text(credits)
        .call(wrap, 150);

    // CAPTION
    // Color bar adapted from http://tributary.io/tributary/3650755/
    svg.append("g")
        .attr("class","caption")
        .append("g")
        .attr("class","color-bar")
        .selectAll("rect")
        .data(d3.range(d3.min(v), d3.max(v), (d3.max(v)-d3.min(v))/50.0))
        .enter()
        .append("rect")
        .attr({width: 25,
            height: 5,
            y: function(d,i) { return height-25-i*5 },
            x: width-50,
            fill: function(d,i) { return color(d); } })

    svg.select(".caption")
        .append("g")
        .attr("transform", "translate(" + (width-25) + "," + (height-25-5*49) + ")")
        .call(d3.axisRight()
            .scale(d3.scaleLinear().domain(d3.extent(v)).range([5*50,0])))
        .attr("font-family", "sans-serif")
        .attr("fill", "#4B4B4B")
        .attr("font-size", 10)

    svg.select('.caption')
        .append("g")
        .attr("class","units")
        .attr("transform", "translate("+(width-35)+","+(height/2-20)+")")
        .append("text")
        .attr("dx", function(d){return 0})          
        .attr("dy", 9 )
        .attr("text-anchor", "middle")  
        .attr("font-family", "sans-serif")
        .attr("fill", "#4b4b4b")
        .attr("font-size", 10)
        .call(wrap, 50);

    var file = "../data/maps/zh-mainland-provinces.topo.json";
    var file_city = "../data/maps/citiestopo.json";
    var city_dta = d3.csv("../data/Yearbook.csv");


    d3.json(file).then(function(values) {
        console.log(values)});
    d3.json(file).then(drawProvinces);

    d3.json(file_city).then(function(values) {
        console.log(values)});
    d3.json(file_city).then(drawcities);



    // Mainland provinces
    function drawProvinces(cn) {
        console.log(cn[0])
        svg.append("g")
        .attr("class", "map")
            .append("g")
            .attr("class", "mainland")
            .selectAll("path")
            .data(topojson.feature(cn[0], cn[0].objects.provinces).features)
            .enter()
            .append("path")
            .attr("d", path)
            .attr("id", function(d) { return d.id; })
            .attr("class", "province")
            .attr("fill", "#cccccc")
            .attr("fill", function(d) { return color(umap[d.properties.name]); })
            .attr("stroke", "black")
            .attr("stroke-width", "0.35");
    }

    function drawcities(cn) {
        console.log(cn[0])

        svg.append("g")
        .attr("class", "map")
            .append("g")
            .attr("class", "mainland")
            .selectAll("path")
            .data(topojson.feature(cn[0], cn[0].objects.cities).features)
            .enter()
            .append("path")
            .attr("d", path)
            .attr("id", function(d) { return d.id; })
            .attr("class", "city")
            .attr("fill", "#cccccc")
            .attr("fill", function(d) { return color(umap[d.properties.NAME]); })
            .attr("stroke", "black")
            .attr("stroke-width", "0.35");
    }


    function wrap(text, width) {
    text.each(function() {
        var text = d3.select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 0.7, // ems
            y = text.attr("y"),
            dy = parseFloat(text.attr("dy")),
            tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy );
        while (word = words.pop()) {
        line.push(word);
        tspan.text(line.join(" "));
        if (tspan.node().getComputedTextLength() > width) {
            line.pop();
            tspan.text(line.join(" "));
            line = [word];
            tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy ).text(word);
        }
        }
    });
    }


    function govpath(){

    }
    
}
