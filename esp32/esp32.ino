// Comment out the symbolic Macro below if running on ESP32
// #define ARDUINO_MODE

#include <Arduino_JSON.h>

#ifndef ARDUINO_MODE
#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <HTTPClient.h>
#endif

#define PinStatus int

const int DISPENSER_ID = 1;

const char* ssid = "alco-OL";
const char* password = "stayhydrated145";

String serverName = "https://alco-ol-backend.netlify.app/.netlify/functions/api";
const char* rootCACertificate = \
"-----BEGIN CERTIFICATE-----\n" \
"MIIDrzCCApegAwIBAgIQCDvgVpBCRrGhdWrJWZHHSjANBgkqhkiG9w0BAQUFADBh\n" \
"MQswCQYDVQQGEwJVUzEVMBMGA1UEChMMRGlnaUNlcnQgSW5jMRkwFwYDVQQLExB3\n" \
"d3cuZGlnaWNlcnQuY29tMSAwHgYDVQQDExdEaWdpQ2VydCBHbG9iYWwgUm9vdCBD\n" \
"QTAeFw0wNjExMTAwMDAwMDBaFw0zMTExMTAwMDAwMDBaMGExCzAJBgNVBAYTAlVT\n" \
"MRUwEwYDVQQKEwxEaWdpQ2VydCBJbmMxGTAXBgNVBAsTEHd3dy5kaWdpY2VydC5j\n" \
"b20xIDAeBgNVBAMTF0RpZ2lDZXJ0IEdsb2JhbCBSb290IENBMIIBIjANBgkqhkiG\n" \
"9w0BAQEFAAOCAQ8AMIIBCgKCAQEA4jvhEXLeqKTTo1eqUKKPC3eQyaKl7hLOllsB\n" \
"CSDMAZOnTjC3U/dDxGkAV53ijSLdhwZAAIEJzs4bg7/fzTtxRuLWZscFs3YnFo97\n" \
"nh6Vfe63SKMI2tavegw5BmV/Sl0fvBf4q77uKNd0f3p4mVmFaG5cIzJLv07A6Fpt\n" \
"43C/dxC//AH2hdmoRBBYMql1GNXRor5H4idq9Joz+EkIYIvUX7Q6hL+hqkpMfT7P\n" \
"T19sdl6gSzeRntwi5m3OFBqOasv+zbMUZBfHWymeMr/y7vrTC0LUq7dBMtoM1O/4\n" \
"gdW7jVg/tRvoSSiicNoxBN33shbyTApOB6jtSj1etX+jkMOvJwIDAQABo2MwYTAO\n" \
"BgNVHQ8BAf8EBAMCAYYwDwYDVR0TAQH/BAUwAwEB/zAdBgNVHQ4EFgQUA95QNVbR\n" \
"TLtm8KPiGxvDl7I90VUwHwYDVR0jBBgwFoAUA95QNVbRTLtm8KPiGxvDl7I90VUw\n" \
"DQYJKoZIhvcNAQEFBQADggEBAMucN6pIExIK+t1EnE9SsPTfrgT1eXkIoyQY/Esr\n" \
"hMAtudXH/vTBH1jLuG2cenTnmCmrEbXjcKChzUyImZOMkXDiqw8cvpOp/2PV5Adg\n" \
"06O/nVsJ8dWO41P0jmP6P6fbtGbfYmbW0W5BjfIttep3Sp+dWOIrWcBAI+0tKIJF\n" \
"PnlUkiaY4IBIqDfv8NZ5YBberOgOzW6sRBc4L0na4UU+Krk2U886UAb3LujEV0ls\n" \
"YSEY1QSteDwsOoBrp+uvFRTp2InBuThs4pFsiv9kuXclVzDAGySj4dzp30d8tbQk\n" \
"CAUw7C29C79Fv1C5qfPrmAESrciIxpg0X40KPMbp1ZWVbd4=\n" \
"-----END CERTIFICATE-----\n";

// Indicates if sending POST failed (for any reason)
bool hasPostError = false;
// Only retry sending of POST after 200ms
const unsigned long postRetryDelay = 1000;

unsigned long lastPostTime = 0;
// Set timer to 5 seconds (5000) for debugging
// TODO: Set to actual interval for deployment (e.g. 10 minutes)
unsigned long postInterval = 5*1000;

// NOTE: Pin 0 is connected to "Boot" button in ESP32
const int BUTTON_PIN = 0;
PinStatus lastButtonState = 0;
unsigned long lastButtonCheckTime = 0;
// Only check button state every 200ms
unsigned long buttonCheckInterval = 100;
// isLevelReadRequested is set to true when we want to re-check dispenser level ahead of scheduled POST
// initialized to true so that liquid level is taken and POST is sent at system boot
bool isLevelReadRequested = true;

const int LEVEL_LOW = 1;
const int LEVEL_MEDIUM = 2;
const int LEVEL_HIGH = 3;

#ifndef ARDUINO_MODE
const int LEVEL_GND_PIN = 33;
const int LEVEL_LOW_PIN = 27;
const int LEVEL_MEDIUM_PIN = 26;
const int LEVEL_HIGH_PIN = 25;
#else
const int LEVEL_GND_PIN = 13;
const int LEVEL_LOW_PIN = 8;
const int LEVEL_MEDIUM_PIN = 9;
const int LEVEL_HIGH_PIN = 10;
#endif
// Delay to wait for the liquid level to properly "boot"
const int levelBootDelay = 50;

#ifndef ARDUINO_MODE
const int LED_LOW_PIN = 13;
const int LED_MEDIUM_PIN = 12;
const int LED_HIGH_PIN = 14;
#else
const int LED_LOW_PIN = 5;
const int LED_MEDIUM_PIN = 6;
const int LED_HIGH_PIN = 7;
#endif
unsigned long levelLedPin = -1;   // pin of LED which should be enabled

// The amount of time an LED stays on (3 seconds per cycle)
const int ledOnDuration = 3*1000;
// Amount of time before LED turns on again (3 seconds)
const int ledOnInterval = 3*1000;
const int ledCycleTime = ledOnDuration + ledOnInterval;
int lastLedOnTime = 0;

// When we get a -1 reading, retry for a few times before sending data
const int LEVEL_ERROR_RETRY = 5;
// TODO: Set to actual interval for deployment (e.g. 100ms)
unsigned long levelRetryInterval = 1*1000;
unsigned long lastLevelReadTime = 0;
int numLevelErrors = 0;

const int getCurrentLiquidLevel() {
  // Supply power to liquid level sensor, wait for proper "boot"
  // NOTE: Since we are controlling the ground pin, we must set it to LOW for power to flow
  digitalWrite(LEVEL_GND_PIN, LOW);
  delay(levelBootDelay);

  // Get readings for each level output pin
  // NOTE: For some unknown reason, the readings are inverted, so we invert the outputs
  //       e.g. if none of the probes are in contact, all have a reading of 1 instead of 0
  const PinStatus LOW_VAL = !digitalRead(LEVEL_LOW_PIN);
  const PinStatus MEDIUM_VAL = !digitalRead(LEVEL_MEDIUM_PIN);
  const PinStatus HIGH_VAL = !digitalRead(LEVEL_HIGH_PIN);

  // Cut power to liquid level sensor to minimize corrosion of probes
  // NOTE: Liquid level sensor's VCC is connected to +5V; driving GND pin to HIGH cuts power
  digitalWrite(LEVEL_GND_PIN, HIGH);
  lastLevelReadTime = millis();

  // DEBUG: print probe readings
  Serial.println("");
  Serial.print("LOW PROBE:");
  Serial.println(LOW_VAL);
  Serial.print("MEDIUM PROBE:");
  Serial.println(MEDIUM_VAL);
  Serial.print("HIGH PROBE:");
  Serial.println(HIGH_VAL);

  if ((LOW_VAL == LOW && (HIGH_VAL || MEDIUM_VAL))  // MEDIUM or HIGH probes in contact with water, but not LOW probe
      || (MEDIUM_VAL == LOW && HIGH_VAL)            // HIGH probe in contact with water, but not MEDIUM probe
     ) {

    // either probe(s) are broken, liquid level sensor is broken, or dispenser is tilted
    // return -1 to inform caller of error
    Serial.println("Erroneous probe data. Please check liquid sensor/probes/dispenser.");
    return -1;
  }

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

  pinMode(LEVEL_GND_PIN, OUTPUT);
  pinMode(LED_LOW_PIN, OUTPUT);
  pinMode(LED_MEDIUM_PIN, OUTPUT);
  pinMode(LED_HIGH_PIN, OUTPUT);

  Serial.begin(115200);

#ifndef ARDUINO_MODE
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
#else
  Serial.println("ARDUINO_MODE macro defined, running on Debug mode. No HTTP POSTs will be sent.");
#endif
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
      Serial.println("Button pressed, manually requesting for liquid level reading.");
      isLevelReadRequested = true;
    }

    lastButtonCheckTime = now;
    lastButtonState = currButtonState;
  }

  if (levelLedPin == -1 && (now - lastLevelReadTime) >= levelRetryInterval) {
    // Retry reading liquid level since last read had error|
    isLevelReadRequested = true;
  }


  const unsigned long millisSinceLastPost = (now - lastPostTime);
#ifndef ARDUINO_MODE
  // If there were errors, request recheck of level (+ sending of POST) immediately
  if (millisSinceLastPost >= postRetryDelay && hasPostError) {
    isLevelReadRequested = true;
    hasPostError = false;
  }
#endif

  if (millisSinceLastPost >= postInterval     // "Normal" scheduled sending of data
      || isLevelReadRequested                 // Force recheck of liquid level, e.g. on boot, when error occured
     ) {
#ifndef ARDUINO_MODE
    // Check WiFi connection status
    if (WiFi.status() != WL_CONNECTED) {
      Serial.println("WiFi Disconnected.");
      hasPostError = true;
    } else {
      WiFiClientSecure *client = new WiFiClientSecure;
      if (!client) {
        Serial.println("Cannot establish secure connection.");
        hasPostError = true;
      } else {
        client->setCACert(rootCACertificate);
        HTTPClient http;
        String serverPath = serverName + "/data";

        http.begin(*client, serverPath.c_str());
        http.addHeader("Content-Type", "application/json");   // POST payload is JSON
#endif

        // update current liquid level
        const int currLiquidLevel = getCurrentLiquidLevel();
         // we just read liquid level data, so reset isLevelReadRequested
        isLevelReadRequested = false;

        const int newLedPin = getLedPinForLevel(currLiquidLevel);
        if (newLedPin != levelLedPin) {
          // level changed, switch pin and immediately start new LED cycle
          if (levelLedPin != -1) digitalWrite(levelLedPin, LOW);   // turn old LED off
          if (newLedPin != -1)   digitalWrite(newLedPin, HIGH);    // turn new LED on

          lastLedOnTime = now;
          levelLedPin = newLedPin;
        }

        // If we get a faulty liquid level reading, increment numLevelErrors
        if (currLiquidLevel == -1) {
          ++numLevelErrors;
        } else {
          numLevelErrors = 0;
        }

        if (numLevelErrors == 0                      // no liquid level error so far, reading is OK
           || numLevelErrors > LEVEL_ERROR_RETRY     // still has error in liquid level reading, exhausted number of retries
           ) {
          // NOTE: at this point, currLiquidLevel can be -1, but we still always send POST
          //       so that a) error will be visible in logs without needing to wait for timeout,
          //       and b) this error will be distinguishable to "battery/power ran out" case
          JSONVar dispenserStatus;
          dispenserStatus["DispenserID"] = DISPENSER_ID;
          dispenserStatus["Level"] =  currLiquidLevel;

          String httpRequestData = JSON.stringify(dispenserStatus);
          Serial.println(httpRequestData);

#ifndef ARDUINO_MODE
          int httpResponseCode = http.POST(httpRequestData);

          if (httpResponseCode > 0) {
            Serial.print("HTTP Response code: ");
            Serial.println(httpResponseCode);
            String payload = http.getString();
            Serial.println(payload);
          } else {
            Serial.print("Error code: ");
            Serial.println(httpResponseCode);
            hasPostError = true;
          }

          http.end();   // Free resources
#endif

          lastPostTime = millis();
          // we just sent our level readings, reset numLevelErrors
          numLevelErrors = 0;
        } else {
          Serial.print("Error in Liquid level readings. Next run is Retry #");
          Serial.println(numLevelErrors);
        }
#ifndef ARDUINO_MODE
      }
    }
#endif

    Serial.println("");
  }
}
