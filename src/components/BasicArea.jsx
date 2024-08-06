import React, { useContext, useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts'; // Correct imports
import axios from 'axios';
import { DateContext } from './DateContext';
import dayjs from 'dayjs';

const BasicArea = () => {
  const { selectedDate } = useContext(DateContext);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (selectedDate) {
          const formattedDate = dayjs(selectedDate).format('YYYY-MM-DDTHH:mm:ss');
          const response = await axios.get('http://localhost:5000/getRDI', {
            params: { date: formattedDate }
          });

          // Make sure to correctly map the data structure
          setChartData(response.data.map(item => ({
            timestamp: new Date(item.CreatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }),
            value: item.RDIValue, // Ensure this matches the key in your data
          })));
        }
      } catch (error) {
        console.error('Error fetching chart data:', error);
      }
    };

    fetchData();
  }, [selectedDate]);

  // Transform chart data for the new chart format
  const transformedData = chartData.map(item => ({ x: item.timestamp, y: item.value }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={transformedData}>
        <XAxis 
          dataKey="x" 
          label={{ value: 'Time', position: 'insideBottomRight', offset: -5,fill:'white' }} 
          stroke="pink" // Change X-axis line color
          tick={{ fill: 'pink' }} // Change X-axis tick color
        />
        <YAxis 
          label={{ value: 'RDI Value', angle: -90, position: 'insideLeft' ,fill: 'white' }} 
          stroke="skyblue" // Change Y-axis line color
          tick={{ fill: 'skyblue' }} // Change Y-axis tick color
        />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="y" stroke="#8884d8" activeDot={{ r: 8 }} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default BasicArea;
