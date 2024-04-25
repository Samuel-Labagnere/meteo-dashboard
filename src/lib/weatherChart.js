import * as d3 from 'd3';
import { weather } from './store';

export const drawChart = () => {
	// Declare the chart dimensions and margins.
	const width = 700;
	const height = 225;
	const marginTop = 20;
	const marginRight = 30;
	const marginBottom = 30;
	const marginLeft = 40;

	let weatherData;
	weather.subscribe((value) => (weatherData = value.hourly.slice(0, 12)));

	// Declare the x (horizontal position) scale.
	// @ts-ignore
	const x = d3.scaleUtc(
		// @ts-ignore
		d3.extent(weatherData, (d) => d[0]),
		[marginLeft, width - marginRight]
	);

	// Declare the y (vertical position) scale.
	// @ts-ignore
	const y = d3.scaleLinear(
		// @ts-ignore
		[0, d3.max(weatherData, (d) => d[1])],
		[height - marginBottom, marginTop]
	);

	// Declare the line generator.
	const line = d3
		.line()
		.x((d) => x(d[0]))
		.y((d) => y(d[1]));

	// Create the SVG container.
	const svg = d3
		.create('svg')
		.attr('width', width)
		.attr('height', height)
		.attr('viewBox', [0, 0, width, height])
		.attr('style', 'max-width: 100%; height: auto; height: intrinsic;');

	// Add the x-axis.
	svg
		.append('g')
		.attr('transform', `translate(0,${height - marginBottom})`)
		// @ts-ignore
		.call(
			d3
				.axisBottom(x)
				.ticks(width / 120)
				.tickSizeOuter(0)
				// @ts-ignore
				.tickFormat(d3.utcFormat('%d/%m %H:%M'))
		)
		.call((g) =>
			g
				.append('text')
				.attr('x', -marginLeft)
				.attr('y', -marginBottom)
				.attr('fill', 'currentColor')
				.text('Tel jour')
		);

	// Add the y-axis, remove the domain line, add grid lines and a label.
	svg
		.append('g')
		.attr('transform', `translate(${marginLeft},0)`)
		.call(d3.axisLeft(y).ticks(height / 40))
		.call((g) => g.select('.domain').remove())
		.call((g) =>
			g
				.selectAll('.tick line')
				.clone()
				.attr('x2', width - marginLeft - marginRight)
				.attr('stroke-opacity', 0.1)
		)
		.call((g) =>
			g
				.append('text')
				.attr('x', -marginLeft)
				.attr('y', 10)
				.attr('fill', 'currentColor')
				.attr('text-anchor', 'start')
				.text('Température (°C)')
		);

	// Append a path for the line.
	svg
		.append('path')
		.attr('fill', 'none')
		.attr('stroke', 'steelblue')
		.attr('stroke-width', 1.5)
		// @ts-ignore
		.attr('d', line(weatherData));

	return svg.node();
};
