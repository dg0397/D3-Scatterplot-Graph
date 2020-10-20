async function drawScatterplotGraph(){
    //1)Acess Data 

    //Fetching data

    const dataset = await d3.json("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json");

    //Setting Accesors functions


    //const formatYear = d3.timeFormat("%Y");
    const xAccessor = d => d.Year
    const yAccessor = d => new Date(d.Seconds * 1000)
    const colorAccessor = d => d.Doping ? 1 : 0
    console.log(dataset)
    console.log(dataset[0].Time)
    console.log(yAccessor(dataset[0]))

    //2) Create Chart Dimensions

    let dimensions = {
        width: window.innerWidth * 0.9 <= 600 ? window.innerWidth * 0.9 : 800,
        height: 400,
        margin: {
            top: 30,
            right: 30,
            bottom: 60,
            left: 60,
        },
    }

    dimensions.boundedWidth = dimensions.width - dimensions.margin.left  - dimensions.margin.right ;
    dimensions.boundedHeight = dimensions.height - dimensions.margin.top - dimensions.margin.bottom ;

    //3) Draw Canvas 

    //adding main svg 

    const wrapper = d3.select("#wrapper")
                        .append('svg')
                        .attr('width',dimensions.width)
                        .attr('height',dimensions.height)

    //adding bound(framework or whiteboard)

    const bounds = wrapper.append('g')
                            .style('transform', `translate(${
                                dimensions.margin.left
                            }px, ${
                                dimensions.margin.top
                            }px)`);

    //4) Create Scales

    //Setting scales

    const yScale = d3.scaleTime()
                        .domain(d3.extent(dataset,yAccessor))
                        .range([dimensions.boundedHeight,0])
                        .nice();
    

    const xScale = d3.scaleLinear()
                        .domain(d3.extent(dataset,xAccessor)) 
                        .range([0,dimensions.boundedWidth])
                        .nice();

    const colorScale = d3.scaleLinear()
                            .domain(d3.extent(dataset,colorAccessor))
                            .range(["#f45d51", "#942246"])

    //5) Draw Data

    //selecting tooltip 

    const tooltip = d3.select('#tooltip');

    //setting transition 

    const updateTransition = d3.transition().duration(1000);


    //drawing circles 
    const dots  =  bounds.selectAll('circle')
                            .data(dataset)
                            .enter()
                            .append("circle")
                            .attr('cx',(d)=>xScale(xAccessor(d)))
                            .attr('cy',dimensions.boundedHeight)
                            .attr('r',1)
                            .attr('class','dot')
                            .attr("data-xvalue",d => xAccessor(d) )
                            .attr("data-yvalue",d => yAccessor(d) )
                            .attr("fill", "#3c1d3a")
    //adding transition to dots

    dots.transition(updateTransition)
        .attr('cy',(d)=>yScale(yAccessor(d)))
        .attr('r',5)
        .attr("fill", d => colorScale(colorAccessor(d)))

     //6)Draw Peripherals
    //Setting axis 
    
    const xAxisGenerator = d3.axisBottom()
                                .scale(xScale)
                                .tickFormat(d3.format("d"))

    const yAxisGenerator = d3.axisLeft()
                                .scale(yScale)
                                .tickFormat(d3.timeFormat("%M:%S"))
    //Adding X axis 
    const xAxis = bounds.append("g")
                        .attr("id","x-axis")
                        .style("transform", `translateY(${dimensions.boundedHeight}px)`)
                        .call(xAxisGenerator)

    const xAxisLabel = xAxis.append("text")
                            .attr("x", dimensions.boundedWidth)
                            .attr("y", dimensions.margin.bottom - 10)
                            .attr("fill", "black")
                            .style("font-size", "1.4em")
                            .style("font-style", "italic")
                            .html("Year");

    //Adding Y axis 
    const yAxis = bounds.append("g")
                        .attr("id","y-axis")
                        .call(yAxisGenerator)

    const yAxisLabel = yAxis.append("text")
                            .attr("x", -dimensions.boundedHeight / 2)
                            .attr("y", -dimensions.margin.left + 20)
                            .attr("fill", "black")
                            .style("font-size", "1.4em")
                            .text("Time in minutes")
                            .style("font-style", "italic")
                            .style("transform", "rotate(-90deg)")
                            .style("text-anchor", "middle");
    
    //adding legend 

    const legend = d3.select('#legend')
                            .style('transform',`translate( calc(-50% + ${dimensions.boundedWidth}px),${dimensions.boundedHeight - dimensions.margin.bottom}px)`)
                            .style("opacity",1)
    //7) Set up Interactions

    dots.on("mouseenter", onMouseEnter)
        .on("mouseleave", onMouseLeave)

    function onMouseEnter(datum,index){
        const x = xScale(xAccessor(index)) + dimensions.margin.left;
        const y = yScale(yAccessor(index)) + dimensions.margin.top;

        tooltip.attr("data-year",index.Year)
                .style('opacity',1)
                .style("transform",`translate(calc(-50% + ${x}px) , calc(-118% + ${y}px) )`)


        tooltip.select("#name")
                .text(`${index.Name}: ${index.Nationality}`);

        tooltip.select("#time").text(`Time: ${index.Time}`);
        tooltip.select("#year").text(`Year: ${index.Year}`)
    }

    function onMouseLeave(datum,index){
        tooltip.style('opacity',0)
    }
}
drawScatterplotGraph()