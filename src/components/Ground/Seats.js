// src/SeatBooking.js

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const SeatBooking = () => {
  const svgRef = useRef();

  useEffect(() => {
    const svg = d3.select(svgRef.current)
      .attr('width', 600)
      .attr('height', 400)
      .style('border', '1px solid black');

    const seats = [
      { id: 1, x: 50, y: 50, status: 'available' },
      { id: 2, x: 150, y: 50, status: 'booked' },
      { id: 3, x: 250, y: 50, status: 'available' },
      { id: 4, x: 350, y: 50, status: 'booked' },
      { id: 5, x: 450, y: 50, status: 'available' },
      // Add more seats as needed
    ];

    const seatGroup = svg.selectAll('g')
      .data(seats)
      .enter()
      .append('g')
      .attr('transform', d => `translate(${d.x}, ${d.y})`);

    seatGroup.append('circle')
      .attr('r', 20)
      .attr('fill', d => d.status === 'available' ? 'green' : 'red')
      .on('click', function (event, d) {
        d3.select(this).attr('fill', d.status === 'available' ? 'red' : 'green');
        d.status = d.status === 'available' ? 'booked' : 'available';
      });

    seatGroup.append('text')
      .attr('x', 0)
      .attr('y', 5)
      .attr('text-anchor', 'middle')
      .attr('fill', 'white')
      .text(d => d.id);

  }, []);

  return <svg ref={svgRef}></svg>;
};

export default SeatBooking;
