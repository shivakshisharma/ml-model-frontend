import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, LabelList, CartesianGrid } from 'recharts';
import axios from 'axios';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

const API_URL = "http://10.5.45.182:5000";

const BasicArea = ({ startDate, endDate }) => {

  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let formattedStartDate = dayjs(startDate).format('YYYY-MM-DDTHH:mm:ss');
        let formattedEndDate = dayjs(endDate).format('YYYY-MM-DDTHH:mm:ss');
       

        const response = await axios.get(`${API_URL}/getRDI`, {
          params: { startDate: formattedStartDate, endDate: formattedEndDate }
        });
        console.log(response);

        const data = response.data.map(item => ({
          timestamp: dayjs(item.CreatedAt).utc().format('YYYY-MM-DDTHH:mm:ss'),
          date: dayjs(item.CreatedAt).utc().format("MM-DD"),
          time: dayjs(item.CreatedAt).utc().format('hh:mm A'),
          value: item.RDIValue,
        }));

        // Sort data by timestamp to ensure correct chronological order
        data.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        setChartData(data);
        
      } catch (error) {
        console.error('Error fetching chart data:', error);
      }
    };

   
      fetchData();
    
  }, [startDate, endDate]);

  const renderCustomLabel = (props) => {
    const { x, y, value, index } = props;
    const isLeft = index < chartData.length / 2;
    const dx = isLeft ? -20 : -2;
    const dy = 18;

    return (
      <text x={x} y={y} dx={dx} dy={dy} fill="#00FF00" fontWeight="bold" fontSize={"20px"} textAnchor={isLeft ? 'start' : 'end'}>
        {value}
      </text>
    );
  };
  // CustomTick Component that uses date and time from the transformed data
  const CustomTick = ({ x, y, payload }) => {
    if (!payload || !payload.value) {
      return null;
    }

    // Map x-axis value (timestamp) to your data and get the date
    const tickData = chartData.find(data => dayjs(data.timestamp).format('YYYY-MM-DDTHH:mm:ss') === payload.value);
    
    if (!tickData) return null;

    const { time, date } = tickData;

    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} dy={-10} textAnchor="middle" fill="pink" fontSize={12}>
          {time}
        </text>
        <text x={0} y={0} dx={-10} dy={15} textAnchor="middle" fill="white" fontSize={12}>
          {date}
        </text>
      </g>
    );
  };


  const transformedData = chartData.map(item => ({ x: item.timestamp, y: parseFloat(item.value).toFixed(2),date1:item.date }))
  console.log(transformedData,"Hey");

  return (
    <ResponsiveContainer width="100%" height={380}>
      <LineChart data={transformedData}>
        <CartesianGrid vertical={false} horizontal={true} stroke="grey" strokeDasharray={'3 3'} strokeWidth="2" />
        <XAxis
          dataKey="x"
          label={{ value: 'Time', position: 'insideBottomRight', offset: -5, fill: 'white' }}
          stroke="pink"
          tick={<CustomTick />}
          axisLine={true}
          tickLine={true}
          interval={0}  // Ensures that all ticks are displayed
        />
        <YAxis
          label={{ value: 'Predicted RDI', angle: -90, position: 'insideLeft', fill: 'white' }}
          stroke="skyblue"
          tick={{ fill: 'skyblue' }}
        />
        <Tooltip contentStyle={{ backgroundColor: '#333', color: '#fff' }} />
        <Legend />
        <Line type="monotone" dataKey="y" stroke="#8884d8" activeDot={{ r: 8 }}>
          <LabelList dataKey="y" content={renderCustomLabel} />
        </Line>
      </LineChart>
    </ResponsiveContainer>
  );
};

export default BasicArea;
