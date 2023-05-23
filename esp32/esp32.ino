#include <Arduino_JSON.h>
#include <WiFi.h>
#include <HTTPClient.h>

#define PinStatus int

const int DISPENSER_ID = 2;

const char* ssid = "alco-OL";
const char* password = "stayhydrated145";
String serverName = "http://192.168.10.20:5000";    // NOTE: always update this when (re)connecting to WiFi

unsigned long lastPostTime = 0;
// Set timer to 10 seconds (10000)
unsigned long postInterval = 10*1000;

// NOTE: Pin 0 is connected to "Boot" button in ESP32
const int BUTTON_PIN = 0;
PinStatus lastButtonState = 0;
unsigned long lastButtonCheckTime = 0;
// Only check button state every 200ms
unsigned long buttonCheckInterval = 100;
bool isPostRequested = false;

const int LEVEL_LOW = 0;
const int LEVEL_MEDIUM = 1;
const int LEVEL_HIGH = 2;

const int LEVEL_LOW_PIN = 13;
const int LEVEL_MEDIUM_PIN = 12;
const int LEVEL_HIGH_PIN = 14;

const int getCurrentLiquidLevel() {
  const PinStatus LOW_VAL = digitalRead(LEVEL_LOW_PIN);
  const PinStatus MEDIUM_VAL = digitalRead(LEVEL_MEDIUM_PIN);
  const PinStatus HIGH_VAL = digitalRead(LEVEL_HIGH_PIN);

  // DEBUG: print probe readings
  Serial.println("");
  Serial.print("LOW PROBE:");
  Serial.println(LOW_VAL);
  Serial.print("MEDIUM PROBE:");
  Serial.println(MEDIUM_VAL);
  Serial.print("HIGH PROBE:");
  Serial.println(HIGH_VAL);

  if (HIGH_VAL)        return LEVEL_HIGH;
  else if (MEDIUM_VAL) return LEVEL_MEDIUM;
  else                 return LEVEL_LOW;
}

void setup() {
  pinMode(BUTTON_PIN, INPUT);
  pinMode(LEVEL_LOW_PIN, INPUT);
  pinMode(LEVEL_MEDIUM_PIN, INPUT);
  pinMode(LEVEL_HIGH_PIN, INPUT);

  Serial.begin(115200);

  WiFi.begin(ssid, password);
  Serial.print("Connecting to ");
  Serial.print(ssid);
  while(WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.print("Connected to WiFi network with IP Address: ");
  Serial.println(WiFi.localIP());
}

void loop() {
  const unsigned long now = millis();
  if ((now - lastButtonCheckTime) >= buttonCheckInterval) {
    PinStatus currButtonState = digitalRead(BUTTON_PIN);
    if (lastButtonState == LOW &&  currButtonState == HIGH) {   // Rising edge
      Serial.println("Button pressed, manually requesting for POST.");
      isPostRequested = true;
    }

    lastButtonCheckTime = now;
    lastButtonState = currButtonState;
  }

  if ((now - lastPostTime) >= postInterval || isPostRequested) {
    // Check WiFi connection status
    if(WiFi.status() != WL_CONNECTED) {
      Serial.println("WiFi Disconnected");
    } else {
      HTTPClient http;
      String serverPath = serverName + "/data";

      http.begin(serverPath.c_str());
      http.addHeader("Content-Type", "application/json");   // POST payload is JSON

      JSONVar dispenserStatus;
      dispenserStatus["DispenserID"] = DISPENSER_ID;
      dispenserStatus["Level"] = getCurrentLiquidLevel();

      String httpRequestData = JSON.stringify(dispenserStatus);
      int httpResponseCode = http.POST(httpRequestData);

      if (httpResponseCode > 0) {
        Serial.print("HTTP Response code: ");
        Serial.println(httpResponseCode);
        String payload = http.getString();
        Serial.println(payload);
      }
      else {
        Serial.print("Error code: ");
        Serial.println(httpResponseCode);
      }

      http.end();   // Free resources

      lastPostTime = millis();
      isPostRequested = false;
    }

    Serial.println("");
  }
}
