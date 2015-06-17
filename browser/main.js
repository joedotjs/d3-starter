const d3 = require('d3');

const width = 800;
const height = 400;

let svg = d3.select('body').append('svg')
    .attr('id', 'chart')
    .attr('width', width)
    .attr('height', height + 50)
    .append('g')
    .attr('transform', 'translate(80,20)');

let xScale = d3.time.scale().range([0, 600]);
let yScale = d3.scale.linear().range([height, 0]);

let xAxis = d3.svg.axis().scale(xScale).orient('bottom');
let yAxis = d3.svg.axis().scale(yScale).orient('left');

let lineFunction = d3.svg.line()
    .x(d => xScale(d.date))
    .y(d => yScale(d.capacity))
    .interpolate('basis');

let parseDate = d3.time.format('%Y-%m').parse;

// Load Data
d3.csv('source-data/lake-capacities.csv')
    .row(d => ({capacity: d.SHA, date: d.date}))
    .get(function (err, table) {

        if (err) return console.error(err);

        table.forEach(row => {
            row.capacity = +row.capacity / 4552100;
            row.date = parseDate(row.date);
        });

        xScale.domain(d3.extent(table, d => d.date));
        yScale.domain([0, d3.max(table, d => d.capacity)]);

        svg.append('g')
            .attr('class', 'x axis')
            .attr('transform', `translate(0,${height})`)
            .call(xAxis);

        svg.append('g')
            .attr('class', 'y axis')
            .call(yAxis);

        svg.append('path')
            .datum(table)
            .attr('d', lineFunction)
            .attr('class', 'line');

    });
