async function drawScatterplotGraph(){
    //1)Acess Data 

    //Fetching data

    const dataset = await d3.json("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json");

    //Setting Accesors functions


    const formatYear = d3.timeFormat("%Y");
    const formatTime = d3.timeFormat("");
    const xAccessor = d => formatYear(d.Year)
    const yAccessor = d => formatTime(d.Time)
    console.log(dataset[0])
    console.log(yAccessor(dataset[0]))

    //2) Create Chart Dimensions

    let dimensions = {
        width: window.innerWidth * 0.9 <= 600 ? window.innerWidth * 0.9 : 800,
        height: 400,
        margin: {
            top: 30,
            right: 30,
            bottom: 30,
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
    

    const xScale = d3.scaleTime()
                        .domain(d3.extent(dataset,xAccessor)) 
                        .range([0,dimensions.boundedWidth])
                        .nice();

    //5) Draw Data

    //drawing circles 
    const dots = bounds.selectAll("circle")
                        .data(dataset)
                        .enter()
                        .append("circle")
                        .attr('cx',(d)=>xScale(xAccessor(d)))
                        .attr('cy',(d)=>yScale(yAccessor(d)))
                        .attr('r',5)
                        //.attr("fill", d => colorScale(colorAccessor(d)))
}
drawScatterplotGraph()