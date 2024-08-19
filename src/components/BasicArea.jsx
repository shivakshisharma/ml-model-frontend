import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, LabelList, CartesianGrid } from 'recharts';
import axios from 'axios';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

const API_URL = "http://10.5.45.182:8081";

const BasicArea = ({ startDate, endDate }) => {

  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let formattedStartDate = dayjs(startDate).format('YYYY-MM-DDTHH:mm:ss');
        let formattedEndDate = dayjs(endDate).format('YYYY-MM-DDTHH:mm:ss');
        console.log(formattedStartDate,formattedEndDate,"Console")

        const response = await axios.get(`${API_URL}/getRDI`, {
          params: { startDate: formattedStartDate, endDate: formattedEndDate }
        });

        setChartData(response.data.map(item => ({
          timestamp: dayjs(item.CreatedAt).utc().format('hh:mm A'),
          value: item.RDIValue,
        })));
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
    const dy = 20;

    return (
      <text x={x} y={y} dx={dx} dy={dy} fill="#00FF00" fontWeight="bold" fontSize={"20px"} textAnchor={isLeft ? 'start' : 'end'}>
        {value}
      </text>
    );
  };

  const transformedData = chartData.map(item => ({ x: item.timestamp, y: parseFloat(item.value).toFixed(2) }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={transformedData}>
        <CartesianGrid vertical={false} horizontal={true} stroke="grey" strokeDasharray={'3 3'} strokeWidth="2" />
        <XAxis
          dataKey="x"
          label={{ value: 'Time', position: 'insideBottomRight', offset: -5, fill: 'white' }}
          stroke="pink"
          tick={{ fill: 'pink' }}
          axisLine={true}
          tickLine={true}
        />
        <YAxis
          label={{ value: 'RDI Value', angle: -90, position: 'insideLeft', fill: 'white' }}
          stroke="skyblue"
          tick={{ fill: 'skyblue' }}
        />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="y" stroke="#8884d8" activeDot={{ r: 8 }}>
          <LabelList dataKey="y" content={renderCustomLabel} />
        </Line>
      </LineChart>
    </ResponsiveContainer>
  );
};

export default BasicArea;
