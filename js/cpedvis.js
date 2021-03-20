 // Use closure, no global
 var width = 800,
 height = 550;

 function geopathplot(){

        var title='CPED Visualization Project';
        var desc='Based on Jiang‘s CPED';
        var credits='by SKHZ Group';
    
    //}
    // LOAD DATA

    // DRAW 
    // create SVG map
    var projection = d3.geoMercator()
        .center([116,39])
        .scale(600);

    var svg = d3.select("#map").append("svg")
        .attr("id","mapsvg")
        .attr("width", width)
        .attr("height", height)
        .attr("preserveAspectRatio", "xMidYMid")
        .attr("viewBox", "0 0 " + width + " " + height);

    var path = d3.geoPath()
        .projection(projection);

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

    // svg.select(".caption")
    //     .append("g")
    //     .attr("transform", "translate(" + (width-25) + "," + (height-25-5*49) + ")")
    //     .call(d3.axisRight()
    //         .scale(d3.scaleLinear().domain(d3.extent(v)).range([5*50,0])))
    //     .attr("font-family", "sans-serif")
    //     .attr("fill", "#4B4B4B")
    //     .attr("font-size", 10)

    // svg.select('.caption')
    //     .append("g")
    //     .attr("class","units")
    //     .attr("transform", "translate("+(width-35)+","+(height/2-20)+")")
    //     .append("text")
    //     .attr("dx", function(d){return 0})          
    //     .attr("dy", 9 )
    //     .attr("text-anchor", "middle")  
    //     .attr("font-family", "sans-serif")
    //     .attr("fill", "#4b4b4b")
    //     .attr("font-size", 10)
    //     .call(wrap, 50);

    var file = "../data/maps/zh-mainland-provinces.topo.json";
    
    d3.json(file)
        .then(drawProvinces);

    function drawProvinces(cn) {
        //console.log(cn);
        svg.append("g")
        .attr("class", "map")
            .append("g")
            .attr("class", "mainland")
            .selectAll("path")
            .data(topojson.feature(cn, cn.objects.provinces).features)
            .enter()
            .append("path")
            .attr("d", path)
            .attr("id", function(d) { return d.id; })
            .attr("class", "province")
            .attr("fill", "transparent")
  //          .attr("fill", function(d) { return color(umap[d.properties.name]); })
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
};


function drawplot(){

    var map_city = d3.json("../data/maps/citiestopo.json");
    var city_dta = d3.csv("../data/Yearbook.csv");
    var official_data = d3.csv("../data/final_data_BNW_no_pro_info.csv");
    var basetype = $("#lx :selected").attr("id");
    var official = $("#gov").val();
    var year_selected = $("#year").val();
    var svg = d3.select("svg#mapsvg");
    var radius = 6,
        fill = "rgba(255, 49, 255, 0.388)",
        stroke = "rgba(0, 0, 0, 0.5)",
        strokeWidth = 0.1;

    //console.log(basetype)

    const promises = [map_city,city_dta,official_data]
    function pluck(dta) {
        data = d3.group(dta, d => d.year).get(year_selected)
        var umap = []
        for(var i =0; i < data.length; i++){
            umap[i] = {"city":data[i].city,basetype:Number(data[i][basetype])}
        }
        return umap;
      };

    Promise.all(promises).then(citybase)

// Color bar adapted from http://tributary.io/tributary/3650755/
        // svg.append("g")
        //     .attr("class","caption")
        //     .append("g")
        //     .attr("class","color-bar")
        //     .selectAll("rect")
        //     .data(d3.range(d3.min(v), d3.max(v), (d3.max(v)-d3.min(v))/50.0))
        //     .enter()
        //     .append("rect")
        //     .attr({width: 25,
        //         height: 5,
        //         y: function(d,i) { return height-25-i*5 },
        //         x: width-50,
        //         fill: function(d,i) { return color(d); } });
//plots
        //console.log(cn.objects)
    function citybase(cn) { 
        //get geo and official data
            data = d3.group(cn[1], d => d.year).get(year_selected);
            offficial_data = d3.group(cn[2], d => d["姓名"]).get(official);
            official_city_link = [];
            official_city = [];

            for(var i =0; i < offficial_data.length; i++){
                if(offficial_data[i]["调出城市"] && offficial_data[i]["地方二级关键词"] && offficial_data[i]["调出城市"]!= offficial_data[i]["地方二级关键词"]){
                    official_city_link.push({"source":offficial_data[i]["调出城市"],"target":offficial_data[i]["地方二级关键词"]})
                };
            };
            console.log(official_city_link)

            for(var i =0; i < offficial_data.length; i++){
                if(offficial_data[i]["地方二级关键词"]){
                    official_city.push(offficial_data[i]["地方二级关键词"])
                };
            };
            official_city_unique = official_city.filter((item, i, ar) => ar.indexOf(item) === i);

            console.log(official_city_unique)

        //map city and color and saved to later use
            var umap = [];
            for(var i =0; i < data.length; i++){
                umap[i] = {"city":data[i].city,basetype:Number(data[i][basetype])}
            };


        // COLORS
        // define color scale

            v = umap.map(function(d) { return d.basetype}); 
            var colorScale = d3.scaleLinear()
            .domain(d3.extent(v))
            .interpolate(d3.interpolateHcl)
            .range(["white", "grey"]);

            // add grey color if no values
            var color = function(i){ 
            if (i==undefined) {return "#cccccc"}
            else return colorScale(i)
            };

        // projection
            var projection = d3.geoMercator()
            .center([116,39])
            .scale(600);
            

            var path = d3.geoPath()
            .projection(projection);
        //geo info, centroids
            geoinfo = topojson.feature(cn[0], cn[0].objects.cities).features;
            geoinfo.forEach(function(d) {
                d.centroid = projection(d3.geoCentroid(d));
                d.area = d3.geoPath().projection(projection).area(d);
            });


            // var centroids = geoinfo.map(function(feature){
            //     if (feature.properties.NAME){
            //         return path.centroid(feature);
            //     }       
            //   });

            var centroids = []
            for(i=0;i<geoinfo.length;i++){
                if (official_city_unique.includes(geoinfo[i].properties.NAME)){
                    centroids.push(path.centroid(geoinfo[i]));
                }       
            };

            var links = []
            for(i=0;i<official_city_link.length;i++){
                var s = d3.group(geoinfo, d => d.properties.NAME).get(official_city_link[i].source)[0];
                var t = d3.group(geoinfo, d => d.properties.NAME).get(official_city_link[i].target)[0];
                links.push([path.centroid(s),path.centroid(t)]);
            };
            console.log(links)



            //console.log(centroids)

            
            svg.append("g")
                .attr("class", "map")
                .append("g")
                .attr("class", "mainland")
                .selectAll("path")
                .data(geoinfo)
                .enter()
                .append("path")
                .attr("d", path)
                .attr("id", function(d) { return d.id; })
                .attr("class", "city")
                .attr("fill", "#cccccc")
                .attr("fill", function(d) { return color(umap[d.properties.NAME]); })
                .attr("stroke", "white")
                .attr("stroke-width", "0.35");
            
            svg.append("g")
                .selectAll(".centroid")
                .data(centroids)
                .enter()
                .append("circle")
                .attr("class", "centroid")
                .attr("fill", fill)
                .attr("stroke", stroke)
                .attr("stroke-width", strokeWidth)
                .attr("r", radius)
                .attr("cx", function (d){ return d[0];})
                .attr("cy", function (d){ return d[1];});
            
            svg.attr("class", "line")
                .selectAll("line").data(links)
                .enter().append("line")
                .style("stroke", "gray") // <<<<< Add a color
                .attr("x1", function(d) { return d[0][0];})
                .attr("y1", function(d) { return d[0][1];})
                .attr("x2", function(d) { return d[1][0];})
                .attr("y2", function(d) { return d[1][1];})
            
            };};
