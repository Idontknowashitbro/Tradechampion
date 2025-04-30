import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Area,
  ComposedChart,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, TrendingUp, TrendingDown, Clock } from "lucide-react";

interface TradePerformanceChartProps {
  className?: string;
}

const TradePerformanceChart: React.FC<TradePerformanceChartProps> = ({ className }) => {
  const [timeRange, setTimeRange] = useState<string>("7d");

  // Mock data - this would be replaced with real trade data from an API
  const dailyData = [
    { date: "Apr 20", pnl: 1.2, drawdown: 0.3, balance: 50600 },
    { date: "Apr 21", pnl: 2.5, drawdown: 0.8, balance: 51200 },
    { date: "Apr 22", pnl: 1.8, drawdown: 1.2, balance: 51800 },
    { date: "Apr 23", pnl: -0.5, drawdown: 2.1, balance: 51400 },
    { date: "Apr 24", pnl: 0.7, drawdown: 1.8, balance: 51850 },
    { date: "Apr 25", pnl: 2.3, drawdown: 1.2, balance: 53050 },
    { date: "Apr 26", pnl: 3.1, drawdown: 0.9, balance: 54700 },
  ];

  const weeklyData = [
    { date: "Week 1", pnl: 4.5, drawdown: 1.8, balance: 52250 },
    { date: "Week 2", pnl: 6.2, drawdown: 2.3, balance: 53100 },
    { date: "Week 3", pnl: 3.1, drawdown: 3.1, balance: 54700 },
    { date: "Week 4", pnl: 7.8, drawdown: 1.8, balance: 55900 },
  ];

  const monthlyData = [
    { date: "Jan", pnl: 10.5, drawdown: 4.2, balance: 55250 },
    { date: "Feb", pnl: 8.2, drawdown: 3.8, balance: 53100 },
    { date: "Mar", pnl: 15.1, drawdown: 5.2, balance: 61700 },
    { date: "Apr", pnl: 11.8, drawdown: 2.8, balance: 55900 },
  ];

  // Select data based on time range
  const getData = () => {
    switch (timeRange) {
      case "7d":
        return dailyData;
      case "1m":
        return weeklyData;
      case "3m":
        return monthlyData;
      default:
        return dailyData;
    }
  };

  const data = getData();
  
  // Calculate overall performance metrics
  const currentBalance = data[data.length - 1].balance;
  const initialBalance = 50000; // Mock initial balance
  const overallPnl = ((currentBalance - initialBalance) / initialBalance) * 100;
  const maxDrawdown = Math.max(...data.map(item => item.drawdown));
  
  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-forex-card/90 backdrop-blur-sm p-3 rounded-md border border-forex-border/20 shadow-lg">
          <p className="text-white/90 font-medium">{label}</p>
          <div className="space-y-1 mt-2">
            <p className="text-forex-primary text-sm flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              PnL: <span className="font-medium ml-1">{payload[0].value}%</span>
            </p>
            <p className="text-red-400 text-sm flex items-center">
              <TrendingDown className="h-3 w-3 mr-1" />
              Drawdown: <span className="font-medium ml-1">{payload[1].value}%</span>
            </p>
            <p className="text-white/80 text-sm flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              Balance: <span className="font-medium ml-1">${payload[2].value.toLocaleString()}</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className={`bg-forex-card/30 border-forex-border/20 overflow-hidden ${className}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-white text-lg">Trading Performance</CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="bg-forex-primary/10 border-forex-primary/30 text-forex-primary px-2 py-1 text-xs">
              <CalendarDays className="h-3 w-3 mr-1" />
              {timeRange === "7d" ? "7 Days" : timeRange === "1m" ? "1 Month" : "3 Months"}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-forex-dark/40 p-3 rounded-lg">
            <p className="text-white/60 text-sm">Current Balance</p>
            <h3 className="text-xl font-bold text-white">${currentBalance.toLocaleString()}</h3>
            <div className="flex items-center mt-1">
              <Badge className="bg-green-500/20 text-green-500 text-xs">
                +${(currentBalance - initialBalance).toLocaleString()}
              </Badge>
            </div>
          </div>
          
          <div className="bg-forex-dark/40 p-3 rounded-lg">
            <p className="text-white/60 text-sm">Overall P&L</p>
            <h3 className="text-xl font-bold text-forex-primary">+{overallPnl.toFixed(2)}%</h3>
            <div className="flex items-center mt-1">
              <Badge className="bg-forex-primary/20 text-forex-primary text-xs">
                <TrendingUp className="h-3 w-3 mr-1" />
                {timeRange === "7d" ? "Last 7 days" : timeRange === "1m" ? "Last month" : "Last 3 months"}
              </Badge>
            </div>
          </div>
          
          <div className="bg-forex-dark/40 p-3 rounded-lg">
            <p className="text-white/60 text-sm">Max Drawdown</p>
            <h3 className="text-xl font-bold text-red-400">-{maxDrawdown.toFixed(2)}%</h3>
            <div className="flex items-center mt-1">
              <Badge className="bg-red-500/20 text-red-400 text-xs">
                <TrendingDown className="h-3 w-3 mr-1" />
                {timeRange === "7d" ? "Last 7 days" : timeRange === "1m" ? "Last month" : "Last 3 months"}
              </Badge>
            </div>
          </div>
        </div>
        
        <Tabs defaultValue="7d" className="mb-4" onValueChange={(value) => setTimeRange(value)}>
          <TabsList className="bg-forex-dark/40 border border-forex-border/10">
            <TabsTrigger value="7d" className="data-[state=active]:bg-forex-primary data-[state=active]:text-white text-white/70">7D</TabsTrigger>
            <TabsTrigger value="1m" className="data-[state=active]:bg-forex-primary data-[state=active]:text-white text-white/70">1M</TabsTrigger>
            <TabsTrigger value="3m" className="data-[state=active]:bg-forex-primary data-[state=active]:text-white text-white/70">3M</TabsTrigger>
          </TabsList>
          
          <TabsContent value="7d" className="mt-4">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={dailyData}
                  margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorPnl" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.15} />
                  <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} tickMargin={10} />
                  <YAxis
                    yAxisId="left"
                    stroke="#9ca3af"
                    fontSize={12}
                    tickFormatter={(value) => `${value}%`}
                    domain={[-5, 5]}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    stroke="#9ca3af"
                    fontSize={12}
                    tickFormatter={(value) => `$${(value / 1000).toFixed(1)}k`}
                    domain={[45000, 60000]}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    verticalAlign="top"
                    height={36}
                    wrapperStyle={{ fontSize: "12px", color: "#f3f4f6" }}
                  />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="pnl"
                    stroke="#0ea5e9"
                    strokeWidth={2}
                    fill="url(#colorPnl)"
                    activeDot={{ r: 6 }}
                    name="PnL %"
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="drawdown"
                    stroke="#f87171"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 6 }}
                    name="Drawdown %"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="balance"
                    stroke="#22c55e"
                    strokeWidth={2}
                    dot={{ r: 4, fill: "#22c55e" }}
                    activeDot={{ r: 6 }}
                    name="Balance $"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="1m" className="mt-4">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={weeklyData}
                  margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorPnl" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.15} />
                  <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} tickMargin={10} />
                  <YAxis
                    yAxisId="left"
                    stroke="#9ca3af"
                    fontSize={12}
                    tickFormatter={(value) => `${value}%`}
                    domain={[0, 10]}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    stroke="#9ca3af"
                    fontSize={12}
                    tickFormatter={(value) => `$${(value / 1000).toFixed(1)}k`}
                    domain={[50000, 60000]}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    verticalAlign="top"
                    height={36}
                    wrapperStyle={{ fontSize: "12px", color: "#f3f4f6" }}
                  />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="pnl"
                    stroke="#0ea5e9"
                    strokeWidth={2}
                    fill="url(#colorPnl)"
                    activeDot={{ r: 6 }}
                    name="PnL %"
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="drawdown"
                    stroke="#f87171"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 6 }}
                    name="Drawdown %"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="balance"
                    stroke="#22c55e"
                    strokeWidth={2}
                    dot={{ r: 4, fill: "#22c55e" }}
                    activeDot={{ r: 6 }}
                    name="Balance $"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="3m" className="mt-4">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={monthlyData}
                  margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorPnl" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.15} />
                  <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} tickMargin={10} />
                  <YAxis
                    yAxisId="left"
                    stroke="#9ca3af"
                    fontSize={12}
                    tickFormatter={(value) => `${value}%`}
                    domain={[0, 20]}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    stroke="#9ca3af"
                    fontSize={12}
                    tickFormatter={(value) => `$${(value / 1000).toFixed(1)}k`}
                    domain={[50000, 65000]}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    verticalAlign="top"
                    height={36}
                    wrapperStyle={{ fontSize: "12px", color: "#f3f4f6" }}
                  />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="pnl"
                    stroke="#0ea5e9"
                    strokeWidth={2}
                    fill="url(#colorPnl)"
                    activeDot={{ r: 6 }}
                    name="PnL %"
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="drawdown"
                    stroke="#f87171"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 6 }}
                    name="Drawdown %"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="balance"
                    stroke="#22c55e"
                    strokeWidth={2}
                    dot={{ r: 4, fill: "#22c55e" }}
                    activeDot={{ r: 6 }}
                    name="Balance $"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TradePerformanceChart; 