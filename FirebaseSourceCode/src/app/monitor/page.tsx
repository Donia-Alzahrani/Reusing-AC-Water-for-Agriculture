"use client";

import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Navigation } from "@/components/Navigation";
import { database } from "@/lib/firebase";
import { ref, onValue, query, orderByChild, limitToLast } from "firebase/database";

interface SensorData {
  temp_sensor: number;
  tds_sensor: number;
  ph_sensor: number;
  turbidity_sensor: number;
  time: number;
  classification: string;
}

export default function MonitorPage() {
  const [sensorData, setSensorData] = useState<SensorData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    setIsLoading(true);
    const sensorDataRef = ref(database, 'sensor_data_classified');
    const latestDataQuery = query(sensorDataRef, orderByChild('time'), limitToLast(1));
  
    const unsubscribe = onValue(latestDataQuery, (snapshot) => {
      if (snapshot.exists()) {
        const dataObj = snapshot.val();
        const key = Object.keys(dataObj)[0];
        const rawData = dataObj[key];
  
        const latestData: SensorData = {
          temp_sensor: rawData.reading?.temp_sensor ?? null,
          tds_sensor: rawData.reading?.tds_sensor ?? null,
          ph_sensor: rawData.reading?.ph_sensor ?? null,
          turbidity_sensor: rawData.reading?.turbidity_sensor ?? null,
          time: rawData.time,
          classification: String(rawData.classification ?? "")
        };
  
        setSensorData(latestData);
      } else {
        toast({
          title: "No Data",
          description: "No sensor data found in the database.",
          variant: "destructive"
        });
      }
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching data from Firebase:", error);
      toast({
        title: "Firebase Error",
        description: `Failed to fetch data: ${error.message}`,
        variant: "destructive"
      });
      setIsLoading(false);
    });
  
    return () => unsubscribe();
  }, [toast]);

  const formatTimestamp = (timestamp: number | undefined): string => {
    if (!timestamp) return 'N/A';
    try {
      return new Date(timestamp).toLocaleString();
    } catch (e) {
      console.error("Error formatting timestamp:", e);
      return 'Invalid Date';
    }
  };

  const getJustification = (data: SensorData): string[] => {
    const reasons: string[] = [];
  
    if (data.classification === "0") {
      if (typeof data.ph_sensor !== "number" || data.ph_sensor < 6.5 || data.ph_sensor > 8.5) {
        reasons.push("pH is outside the safe range (6.5–8.5).");
      }
      if (typeof data.turbidity_sensor !== "number" || data.turbidity_sensor > 5      ) {
        reasons.push("Turbidity is too high (> 5 NTU).");
      }
      if (typeof data.tds_sensor !== "number" || data.tds_sensor > 1000) {
        reasons.push("TDS exceeds the recommended maximum (1000 ppm).");
      }
      else if (typeof data.tds_sensor !== "number" || data.tds_sensor < 10) {
        reasons.push("TDS is too low.");
      }
      if (typeof data.temp_sensor !== "number" || data.temp_sensor < 10 || data.temp_sensor > 25) {
        reasons.push("Temperature is outside the optimal range (10°C–25°C).");
      }
    } else if (data.classification === "1") {
      reasons.push("All values are within acceptable ranges.");
    } else {
      reasons.push("Classification is unknown or missing.");
    }
  
    return reasons;
  };

  return (
    <div className="bg-[#80cbc4] min-h-screen">
      <Navigation />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4 text-center text-primary-foreground">
          Dashboard
        </h1>

        {isLoading && (
          <p className="text-center text-primary-foreground">
            Loading latest sensor data...
          </p>
        )}

        {!isLoading && !sensorData && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>No Data Available</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Could not retrieve sensor data from the database. Please ensure the system is running and check back later.
              </p>
            </CardContent>
          </Card>
        )}

        {sensorData && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="mt-8">
              <CardHeader>
                <CardTitle style={{ color: "#d190a8" }}>Temperature</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{sensorData.temp_sensor} °C</p>
              </CardContent>
            </Card>

            <Card className="mt-8">
              <CardHeader>
                <CardTitle style={{ color: "#9787a1" }}>TDS</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{sensorData.tds_sensor} ppm</p>
              </CardContent>
            </Card>

            <Card className="mt-8">
              <CardHeader>
                <CardTitle style={{ color: "#9bbd82" }}>pH</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{sensorData.ph_sensor}</p>
              </CardContent>
            </Card>

            <Card className="mt-8">
              <CardHeader>
                <CardTitle style={{ color: "#72bab2" }}>Turbidity</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{sensorData.turbidity_sensor} NTU</p>
              </CardContent>
            </Card>

            <Card className="mt-8 col-span-1 sm:col-span-2 md:col-span-4">
              <CardHeader>
                <CardTitle>Classification</CardTitle>
              </CardHeader>
              <CardContent>
                <p className={sensorData.classification === "1" ? "text-green-600" : "text-red-600"}>
                  {sensorData.classification === "1" ? "✅ Suitable" : "❌ Unsuitable"}
                </p>
                <div className="mt-4">
                  <h4 className={`font-semibold ${sensorData.classification === "1" ? "text-green-700" : "text-red-700"}`}>
                    Reason{getJustification(sensorData).length > 1 ? "s" : ""}:
                  </h4>
                  <ul className="list-disc list-inside">
                    {getJustification(sensorData).map((reason, index) => (
                      <li key={index}>{reason}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
