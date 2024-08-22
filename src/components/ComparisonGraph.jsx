import React, { useState, useEffect } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from'recharts';

const API_URL = "http://10.5.45.182:5000";

const CompGraph = ({ startDate, endDate }) => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let formattedStartDate = dayjs(startDate).format('YYYY-MM-DDTHH:mm:ss');
        let formattedEndDate = dayjs(endDate).format('YYYY-MM-DDTHH:mm:ss');

        const response = await axios.get(`${API_URL}/getActRDI_PredRDI`, {
          params: { startDate: formattedStartDate, endDate: formattedEndDate }
        });

        // Transform the data
        const data = response.data.map(item => ({
          timestamp: dayjs(item.CreatedAt).utc().format('YYYY-MM-DDTHH:mm:ss'),
          date: dayjs(item.CreatedAt).utc().format("MM-DD"),
          actual_RDI: item.ActualRDI,
          pred_RDI: item.PredictedRDI,
        }));

        // Sort data by timestamp
        data.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

        // Check if the transformed data is correct
        console.log(data);

        // Prepare data for chart
        const transformedData = data.map(item => ({
          date: item.date,
          actual_RDI: item.actual_RDI,
          pred_RDI: item.pred_RDI
        }));

        setChartData(transformedData);
        setLoading(false);

      } catch (error) {
        console.error('Error fetching chart data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [startDate, endDate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
      <ResponsiveContainer width="100%" height={380}>
        <LineChart data={chartData}>
        <CartesianGrid vertical={false} horizontal={true} stroke="grey" strokeDasharray={'3 3'} strokeWidth="2" />
          <XAxis
           label={{ value: 'Time', position: 'insideBottomRight', offset: -5, fill: 'white' }}
            scaleType= 'point' dataKey="date" stroke="pink" axisLine={true} />
          <YAxis 
          label={{ value: 'Actual Vs Predicted RDI', angle: -90, position: 'insideLeft', fill: 'white' }}
          stroke="skyblue" axisLine={true} />
          <Tooltip contentStyle={{ backgroundColor: '#333', color: '#fff' }} />
          <Legend />
          <Line type="monotone" dataKey="actual_RDI" stroke="#FFA07A" activeDot={{ r: 8 }}/>
          <Line type="monotone" dataKey="pred_RDI" stroke="#87CEFA"  activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    
  );
};

export default CompGraph;
