#include "arduino_secrets.h"

/*
   ESP32 â Flask Server Integration

  This sketch reads data from Temperature, TDS, pH, and Turbidity sensors,
  and sends it to a Flask server that classifies it and updates Firebase.

*/

#include <Arduino.h>
#include <WiFi.h>
#include <EEPROM.h>
#include <HTTPClient.h>
#include <OneWire.h>
#include <DallasTemperature.h>

// --- EEPROM for WiFi credentials ---
#define EEPROM_SIZE 100
#define SSID_ADDR 0
#define PASS_ADDR 50

// --- Sensor Pin Definitions ---
#define PH_Pin 33
#define TDS_Pin 32
#define Turbidity_pin 34
#define ONE_WIRE_BUS 18 // DS18B20 data line

// --- Sensor Setup ---
OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature sensors(&oneWire);

// --- Timing ---
unsigned long sendDataPrevMillis = 0;
unsigned long sendInterval = 5000; // 5 seconds

// --- WiFi EEPROM Helpers ---
void writeStringToEEPROM(int addrOffset, const String &str) {
  int len = str.length();
  for (int i = 0; i < len; i++) {
    EEPROM.write(addrOffset + i, str[i]);
  }
  EEPROM.write(addrOffset + len, '\0'); // Null terminator
  EEPROM.commit();
}

String readStringFromEEPROM(int addrOffset) {
  char data[51];
  int len = 0;

  while (len < 50) {
    char k = EEPROM.read(addrOffset + len);
    if (k == '\0') break;
    data[len++] = k;
  }

  data[len] = '\0';
  return String(data);
}

// --- pH Sensor Calibration ---
float checkPHValue(int value) {
  float ph = 0.0;

  if (value > 3900) {
    ph = 0.0 + (value - 3900) * (7.0 - 0.0) / (4095.0 - 3900.0);
  } else if (value > 2900) {
    ph = 7.0 + (value - 2900) * (8.5 - 7.0) / (3900.0 - 2900.0);
  } else {
    ph = 8.5 + (value - 0) * (14.0 - 8.5) / (2900.0 - 0.0);
  }

  ph = constrain(ph, 0.0, 14.0);
  return ph;
}

float readPHRaw() {
  int samples = 10;
  float total = 0;
  for (int i = 0; i < samples; i++) {
    total += analogRead(PH_Pin);
    delay(10);
  }
  return total / samples;
}

float readPH() {
  float raw = readPHRaw();
  return checkPHValue(int(raw));
}

// --- TDS Sensor Reading ---
float readTemp(); // Forward declaration

float readTDS() {
  float temperature = readTemp();
  if (temperature == -127.0) return -1.0;

  int analogValue = analogRead(TDS_Pin);
  float voltage = analogValue * 3.3 / 4095.0;

  float compensationCoefficient = 1.0 + 0.02 * (temperature - 25.0);
  float tdsValue = (voltage * 0.5) * 1000;
  tdsValue = tdsValue / compensationCoefficient;

  return (tdsValue < 0) ? 0 : tdsValue;
}

// --- DS18B20 Temperature Sensor ---
float readTemp() {
  sensors.requestTemperatures();
  float temperatureC = sensors.getTempCByIndex(0);
  if (temperatureC == DEVICE_DISCONNECTED_C) {
    Serial.println("Error: Could not read temperature sensor.");
    return -127.0;
  }
  return temperatureC;
}

// --- Turbidity Sensor Reading ---
float readTurbidity() {
  int sensorValue = analogRead(Turbidity_pin);
  float turbidity = map(sensorValue, 0, 2800, 0, 5000);
  return turbidity / 1000.0; // NTU
}

// --- Setup ---
void setup() {
  Serial.begin(115200);
  Serial.println("\nESP32 Flask Sender");

  EEPROM.begin(EEPROM_SIZE);

  String ssid = readStringFromEEPROM(SSID_ADDR);
  String password = readStringFromEEPROM(PASS_ADDR);

  if (ssid.length() == 0 || password.length() == 0) {
    Serial.println("Enter Wi-Fi SSID:");
    while (ssid.length() == 0) {
      if (Serial.available()) {
        ssid = Serial.readStringUntil('\n');
        ssid.trim();
      }
    }

    Serial.println("Enter Wi-Fi Password:");
    while (password.length() == 0) {
      if (Serial.available()) {
        password = Serial.readStringUntil('\n');
        password.trim();
      }
    }

    writeStringToEEPROM(SSID_ADDR, ssid);
    writeStringToEEPROM(PASS_ADDR, password);
    Serial.println("Wi-Fi credentials saved!");
  } else {
    Serial.println("Using saved Wi-Fi credentials.");
    Serial.println("Type 'reset' in 5 seconds to clear saved credentials...");
    unsigned long startTime = millis();
    while (millis() - startTime < 5000) {
      if (Serial.available()) {
        String input = Serial.readStringUntil('\n');
        input.trim();
        if (input.equalsIgnoreCase("reset")) {
          writeStringToEEPROM(SSID_ADDR, "");
          writeStringToEEPROM(PASS_ADDR, "");
          Serial.println("Credentials cleared. Restarting...");
          delay(1000);
          ESP.restart();
        }
      }
    }
  }

  WiFi.begin(ssid.c_str(), password.c_str());
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(500);
  }
  Serial.println("\nWiFi Connected.");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());

  sensors.begin(); // Start temperature sensor
}

// --- Loop ---
void loop() {
  if (WiFi.status() == WL_CONNECTED && (millis() - sendDataPrevMillis > sendInterval || sendDataPrevMillis == 0)) {
    sendDataPrevMillis = millis();

    float tempC = readTemp();
    float phValue = checkPHValue(readPHRaw());
    float tdsValue = readTDS();
    float turbidityValue = readTurbidity();

    if (tempC == DEVICE_DISCONNECTED_C || tdsValue < 0) {
      Serial.println("Sensor error detected. Skipping this cycle.");
      return;
    }

    Serial.printf("Temp: %.2f Â°C | TDS: %.2f ppm | pH: %.2f | Turb: %.2f NTU\n",
                  tempC, tdsValue, phValue, turbidityValue);

    // --- Prepare JSON for Flask Server ---
    String jsonPayload = "{";
    jsonPayload += "\"reading\":{";
    jsonPayload += "\"temp_sensor\":" + String(tempC, 2) + ",";
    jsonPayload += "\"tds_sensor\":" + String(tdsValue, 2) + ",";
    jsonPayload += "\"ph_sensor\":" + String(phValue, 2) + ",";
    jsonPayload += "\"turbidity_sensor\":" + String(turbidityValue, 2);
    jsonPayload += "},";
    jsonPayload += "\"path\":\"/sensor_data_classified\"";
    jsonPayload += "}";

    HTTPClient http;
    http.begin("https://flask-classifier.onrender.com/classify");
    http.addHeader("Content-Type", "application/json");

    int httpResponseCode = http.POST(jsonPayload);

    if (httpResponseCode > 0) {
      String response = http.getString();
      Serial.printf("Server response: %s\n", response.c_str());
    } else {
      Serial.printf("HTTP POST failed, error: %s\n",
                    http.errorToString(httpResponseCode).c_str());
    }

    http.end();
  }

  delay(100);
}

// --- Required if not globally defined ---
#ifndef DEVICE_DISCONNECTED_C
#define DEVICE_DISCONNECTED_C -127.0
#endif
