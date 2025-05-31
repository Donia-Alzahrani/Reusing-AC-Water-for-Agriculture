"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Navigation } from "@/components/Navigation";
import { Checkbox } from "@/components/ui/checkbox";

export default function NotificationsPage() {
  const [email, setEmail] = useState("");
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [cooldownMinutes, setCooldownMinutes] = useState(10);
  const [noNotifications, setNoNotifications] = useState(false);
  const [noNotificationsStart, setNoNotificationsStart] = useState("");
  const [noNotificationsEnd, setNoNotificationsEnd] = useState("");
  const [noNotificationDays, setNoNotificationDays] = useState<{
  
    [key: string]: boolean;
  }>({});

  const { toast } = useToast();

  // Fetch settings from server on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch("https://flask-classifier.onrender.com/get-settings");
        const data = await response.json();

        setEmail(data.email || "");
        setNotificationsEnabled(data.enabled ?? false);
        setCooldownMinutes(data.cooldown_minutes ?? 10);
        if (data.no_notify) {
          setNoNotifications(true); // Only show "Don't Disturb" UI if it exists
          setNoNotificationsStart(data.no_notify.start || "");
          setNoNotificationsEnd(data.no_notify.end || "");
          setNoNotificationDays(data.no_notify.days || {});
        }
      } catch (error) {
        console.error("Failed to fetch settings:", error);
        toast({
          title: "Failed to load settings",
          description: "Unable to fetch notification settings.",
          variant: "destructive",
        });
      }
    };

    fetchSettings();
  }, [toast]);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSaveSettings = async () => {
    try {
      const response = await fetch("https://flask-classifier.onrender.com/update-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          enabled: notificationsEnabled,
          no_notify: noNotifications
            ? {
                start: noNotificationsStart,
                end: noNotificationsEnd,
                days: noNotificationDays,
              }
            : null,
          cooldown_minutes: cooldownMinutes,
        }),
        
      });

      if (!response.ok) throw new Error("Server returned an error");

      toast({
        title: "Settings Saved",
        description: "Notification settings have been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Failed to save settings",
        description: "Please check your connection or try again later.",
        variant: "destructive",
      });
      console.error("Error saving settings:", error);
    }
  };

  const handleDayToggle = (day: string) => {
    setNoNotificationDays({
      ...noNotificationDays,
      [day]: !noNotificationDays[day],
    });
  };

  return (
    <div className="bg-[#80cbc4] min-h-screen">
      <Navigation />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Notifications</h1>
        <Card>
          <CardHeader>
            <CardTitle>Notification Settings</CardTitle>
            <CardDescription>
              Manage your notification preferences.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={handleEmailChange}
                className="col-span-3"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="notifications"
                checked={notificationsEnabled}
                onCheckedChange={(checked) =>
                  setNotificationsEnabled(!!checked)
                }
              />
              <Label htmlFor="notifications">Enable Notifications</Label>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cooldownMinutes" className="text-right">
                Email Cooldown (minutes)
              </Label>
              <Input
                id="cooldownMinutes"
                type="number"
                min={1}
                value={cooldownMinutes}
                onChange={(e) => setCooldownMinutes(parseInt(e.target.value))}
                className="col-span-3"
              />
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="noNotifications"
                  checked={noNotifications}
                  onCheckedChange={(checked) =>
                    setNoNotifications(!!checked)
                  }
                />
                <Label htmlFor="noNotifications">Don't Disturb Mode</Label>
              </div>

              {noNotifications && (
                <div className="mt-2">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="noNotificationsStart" className="text-right">
                      Do not notify after
                    </Label>
                    <Input
                      id="noNotificationsStart"
                      type="time"
                      value={noNotificationsStart}
                      onChange={(e) =>
                        setNoNotificationsStart(e.target.value)
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="noNotificationsEnd" className="text-right">
                      Resume notifications at
                    </Label>
                    <Input
                      id="noNotificationsEnd"
                      type="time"
                      value={noNotificationsEnd}
                      onChange={(e) =>
                        setNoNotificationsEnd(e.target.value)
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="mt-2">
                    <Label>Do not notify on these days:</Label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {Object.entries(noNotificationDays).map(([day, checked]) => (
                        <div key={day} className="flex items-center space-x-1">
                          <Checkbox
                            id={`day-${day}`}
                            checked={checked}
                            onCheckedChange={() => handleDayToggle(day)}
                          />
                          <Label htmlFor={`day-${day}`}>
                            {day.charAt(0).toUpperCase() + day.slice(1)}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Button onClick={handleSaveSettings}>Save Settings</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
