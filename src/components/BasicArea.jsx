import React, { useContext, useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,LabelList,CartesianGrid  } from 'recharts'; // Correct imports
import axios from 'axios';
import { DateContext } from './DateContext';
import dayjs from 'dayjs';
import utc from 'dayjs-plugin-utc';
dayjs.extend(utc);

const BasicArea = () => {
  const { selectedDate } = useContext(DateContext);
  const [chartData, setChartData] = useState([]);
  const API_URL="http://10.5.45.182:5000";
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (selectedDate) {
            
          const formattedDate = dayjs(selectedDate).format('YYYY-MM-DDTHH:mm:ss');
          console.log(formattedDate,"Date passed")
          const response = await axios.get(`${API_URL}/getRDI`, {
            params: { date: formattedDate }
          });
          console.log(response.data);
        

          // Make sure to correctly map the data structure
          setChartData(response.data.map(item => ({
            // timestamp: new Date(item.CreatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }),
            timestamp: dayjs(item.CreatedAt).utc().format('hh:mm A'), // Displaying the time in a readable format
            value: item.RDIValue, // Ensure this matches the key in your data
          })));
        }
      } catch (error) {
        console.error('Error fetching chart data:', error);
      }
    };

    fetchData();
  }, [selectedDate]);

 
  // Custom label renderer
  const renderCustomLabel = (props) => {
    const { x, y, value, index } = props;
    const isLeft = index < chartData.length / 2; // Determine if the label is on the left or right half
    const dx = isLeft ? -20 : -2; // Move labels on the left to the left, and on the right to the right
    const dy = 20; // Move labels below the dots

    return (
      <text x={x} y={y} dx={dx} dy={dy} fill="#00FF00" fontWeight="bold"fontSize={"20px"} textAnchor={isLeft ? 'start' : 'end'}>
        {value}
      </text>
    );
  };
  // Transform chart data for the new chart format
  const transformedData = chartData.map(item => ({ x: item.timestamp, y: parseFloat(item.value).toFixed(2)}));

  return (
    <ResponsiveContainer width="100%" height={300}>
    <LineChart data={transformedData}>
      <CartesianGrid vertical={false} horizontal={true} stroke="grey" strokeDasharray={'3 3'}  strokeWidth="2"/> {/* Add grid lines */}
      <XAxis 
        dataKey="x" 
        label={{ value: 'Time', position: 'insideBottomRight', offset: -5, fill: 'white' }} 
        stroke="pink" // Change X-axis line color
        tick={{ fill: 'pink' }} // Change X-axis tick color
        axisLine={true}
        tickLine={true}
      />
      <YAxis 
        label={{ value: 'RDI Value', angle: -90, position: 'insideLeft', fill: 'white' }} 
        stroke="skyblue" // Change Y-axis line color
        tick={{ fill: 'skyblue' }} // Change Y-axis tick color
      />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="y" stroke="#8884d8" activeDot={{ r: 8 }}>
        <LabelList dataKey="y" content={renderCustomLabel} /> {/* Display values on the chart */}
      </Line>
    </LineChart>
  </ResponsiveContainer>
  );
};

export default BasicArea;
//stroke="#8884d8"