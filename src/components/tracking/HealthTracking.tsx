import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Activity, 
  Heart, 
  Thermometer, 
  Weight, 
  Droplets,
  Moon,
  Calendar,
  Plus
} from "lucide-react";

export const HealthTracking = () => {
  const [metrics] = useState([
    {
      id: 1,
      name: "Heart Rate",
      value: 72,
      unit: "bpm",
      icon: Heart,
      status: "Normal",
      color: "text-green-500",
      trend: "+2%"
    },
    {
      id: 2,
      name: "Blood Pressure",
      value: "120/80",
      unit: "mmHg",
      icon: Activity,
      status: "Optimal",
      color: "text-green-500",
      trend: "-1%"
    },
    {
      id: 3,
      name: "Temperature",
      value: 98.6,
      unit: "°F",
      icon: Thermometer,
      status: "Normal",
      color: "text-blue-500",
      trend: "0%"
    },
    {
      id: 4,
      name: "Weight",
      value: 165,
      unit: "lbs",
      icon: Weight,
      status: "Stable",
      color: "text-yellow-500",
      trend: "-0.5%"
    },
    {
      id: 5,
      name: "Hydration",
      value: 75,
      unit: "%",
      icon: Droplets,
      status: "Good",
      color: "text-blue-500",
      trend: "+5%"
    },
    {
      id: 6,
      name: "Sleep Quality",
      value: 8.2,
      unit: "/10",
      icon: Moon,
      status: "Excellent",
      color: "text-purple-500",
      trend: "+12%"
    }
  ]);

  const recentLogs = [
    { date: "Today", activity: "Blood pressure recorded", value: "118/78 mmHg" },
    { date: "Yesterday", activity: "Weight logged", value: "164.8 lbs" },
    { date: "2 days ago", activity: "Sleep tracked", value: "7.5 hours" },
    { date: "3 days ago", activity: "Heart rate monitored", value: "avg 71 bpm" }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-foreground mb-4">Health Tracking Dashboard</h2>
        <p className="text-muted-foreground">Monitor your health metrics and track progress over time</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((metric) => (
          <Card key={metric.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.name}</CardTitle>
              <metric.icon className={`h-4 w-4 ${metric.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {metric.value} <span className="text-sm text-muted-foreground">{metric.unit}</span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <Badge variant={metric.status === "Normal" || metric.status === "Optimal" || metric.status === "Excellent" ? "default" : "secondary"}>
                  {metric.status}
                </Badge>
                <span className="text-xs text-muted-foreground">{metric.trend} vs last week</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Weekly Health Goals
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Daily Water Intake</span>
              <span>6/8 glasses</span>
            </div>
            <Progress value={75} className="h-2" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Exercise Minutes</span>
              <span>180/300 min</span>
            </div>
            <Progress value={60} className="h-2" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Sleep Quality</span>
              <span>5/7 days optimal</span>
            </div>
            <Progress value={71} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Health Logs</CardTitle>
          <Button size="sm" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Entry
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentLogs.map((log, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="text-sm font-medium">{log.activity}</p>
                  <p className="text-xs text-muted-foreground">{log.date}</p>
                </div>
                <Badge variant="outline">{log.value}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};