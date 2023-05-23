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
// isPostRequested is set to true when we want to send data even before timer expires
// initialized to true so that liquid level is taken and POST is sent at system boot
bool isPostRequested = true;

const int LEVEL_LOW = 0;
const int LEVEL_MEDIUM = 1;
const int LEVEL_HIGH = 2;

const int LEVEL_POWER_PIN = 27;
const int LEVEL_LOW_PIN = 13;
const int LEVEL_MEDIUM_PIN = 12;
const int LEVEL_HIGH_PIN = 14;
// Delay to wait for the liquid level to properly "boot"
const int levelBootDelay = 50;

const int LED_LOW_PIN = 32;
const int LED_MEDIUM_PIN = 35;
const int LED_HIGH_PIN = 34;
int levelLedPin = -1;   // pin of LED which should be enabled

// The amount of time an LED stays on (2 seconds per cycle)
const int ledOnDuration = 2*1000;
// Amount of time before LED turns on again (3 seconds)
const int ledOnInterval = 3*1000;
const int ledCycleTime = ledOnDuration + ledOnInterval;
int lastLedOnTime = 0;

const int getCurrentLiquidLevel() {
  // Supply power to liquid level sensor, wait for proper "boot"
  digitalWrite(LEVEL_POWER_PIN, HIGH);
  delay(levelBootDelay);

  // Get readings for each level output pin
  const PinStatus LOW_VAL = digitalRead(LEVEL_LOW_PIN);
  const PinStatus MEDIUM_VAL = digitalRead(LEVEL_MEDIUM_PIN);
  const PinStatus HIGH_VAL = digitalRead(LEVEL_HIGH_PIN);

  // Cut power to liquid level sensor to minimize corrosion of probes
  digitalWrite(LEVEL_POWER_PIN, LOW);

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

const int getLedPinForLevel(const int level) {
  int pin;
  switch (level) {
    case LEVEL_HIGH:
      pin = LED_HIGH_PIN; break;
    case LEVEL_MEDIUM:
      pin = LED_MEDIUM_PIN; break;
    case LEVEL_LOW:
      pin = LED_LOW_PIN; break;
    default:    // should normally not happend
      pin = -1; // set to -1 to indicate error
      break;
  }

  Serial.print("Liquid level:");
  Serial.println(level);
  Serial.print("Associated LED pin:");
  Serial.println(pin);

  return pin;
}


void setup() {
  pinMode(BUTTON_PIN, INPUT);
  pinMode(LEVEL_LOW_PIN, INPUT);
  pinMode(LEVEL_MEDIUM_PIN, INPUT);
  pinMode(LEVEL_HIGH_PIN, INPUT);

  pinMode(LEVEL_POWER_PIN, OUTPUT);
  pinMode(LED_LOW_PIN, OUTPUT);
  pinMode(LED_MEDIUM_PIN, OUTPUT);
  pinMode(LED_HIGH_PIN, OUTPUT);

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

  // check if LED light needs to be updated
  // NOTE: LED pin can be -1 if liquid level can not be properly determined
  if (levelLedPin != -1) {
    const PinStatus currLedState = digitalRead(levelLedPin);
    if (currLedState == LOW && (now - lastLedOnTime) >= ledCycleTime) {
      // Start next LED cycle, turn on LED
      digitalWrite(levelLedPin, HIGH);
      lastLedOnTime = now;
    } else if (currLedState == HIGH && (now - lastLedOnTime) >= ledOnDuration) {
      // LED already active for alloted time, turn off until next LED cycle
      digitalWrite(levelLedPin, LOW);
    }
  }

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
    if (WiFi.status() != WL_CONNECTED) {
      Serial.println("WiFi Disconnected");
    } else {
      HTTPClient http;
      String serverPath = serverName + "/data";

      http.begin(serverPath.c_str());
      http.addHeader("Content-Type", "application/json");   // POST payload is JSON

      // update current liquid level
      const int currLiquidLevel = getCurrentLiquidLevel();

      const int newLedPin = getLedPinForLevel(currLiquidLevel);
      if (newLedPin != levelLedPin) {
        // level changed, switch pin and immediately start new LED cycle
        if (levelLedPin != -1) digitalWrite(levelLedPin, LOW);   // turn old LED off
        if (newLedPin != -1)   digitalWrite(newLedPin, HIGH);    // turn new LED on

        lastLedOnTime = now;
        levelLedPin = newLedPin;
      }

      JSONVar dispenserStatus;
      dispenserStatus["DispenserID"] = DISPENSER_ID;
      dispenserStatus["Level"] =  currLiquidLevel;

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
