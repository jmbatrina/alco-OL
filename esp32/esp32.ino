// If using HTTP (e.g. via the local backend server), comment out the HTTPS_MODE definition below
#define HTTPS_MODE

#include <Arduino_JSON.h>

#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <HTTPClient.h>

#define PinStatus int

const int DISPENSER_ID = 1;

const char* ssid = "alco-OL";
const char* password = "stayhydrated145";

#ifdef HTTPS_MODE
String serverName = "https://alco-ol-backend.netlify.app/.netlify/functions/api";
#else
// IMPORTANT NOTE: Change the IP address to the IP of the computer running the server (NOT the gateway/hostpost connection)
String serverName = "http://192.168.10.20:5000";
#endif
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
// Set timer to 3 seconds (3000ms) for debugging
// TODO: Set to actual interval for deployment (e.g. 10 minutes)
unsigned long postInterval = 3*1000;

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

const int LEVEL_LOW_PIN = 26;
const int LEVEL_MEDIUM_PIN = 25;
const int LEVEL_HIGH_PIN = 33;

const int LED_LOW_PIN = 13;
const int LED_MEDIUM_PIN = 14;
const int LED_HIGH_PIN = 27;
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

const int DISPENSER_POWER_PIN = 34;
const float DISPENSER_INACTIVE_VOLTAGE = 2.0;

// The ESP32 GPIO pins have a max voltage input of 3.3V
// The ESP32 has 12-bits resolution for analog values; 2^12 = 4096
const float ESP32_GPIO_VOLTAGE = 3.3;
const int ESP32_ANALOG_MAX = 4096;
bool isDispenserActive;

const int getCurrentLiquidLevel() {
  // Get readings for each level output pin
  // NOTE: For some unknown reason, the readings are inverted, so we invert the outputs
  //       e.g. if none of the probes are in contact, all have a reading of 1 instead of 0
  const PinStatus LOW_VAL = !digitalRead(LEVEL_LOW_PIN);
  const PinStatus MEDIUM_VAL = !digitalRead(LEVEL_MEDIUM_PIN);
  const PinStatus HIGH_VAL = !digitalRead(LEVEL_HIGH_PIN);
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

const int getIsDispenserActive() {
  // Translate analog reading from 0-4095 to 0V-3.3V
  const float battery_voltage = (analogRead(DISPENSER_POWER_PIN) * ESP32_GPIO_VOLTAGE) / ESP32_ANALOG_MAX;

  // DEBUG: show current battery voltage
  // Serial.print("Dispenser Battery voltage:");
  // Serial.println(battery_voltage);

  if (battery_voltage > DISPENSER_INACTIVE_VOLTAGE)
    return true;
  else
    return false;
}

void setup() {
  pinMode(BUTTON_PIN, INPUT);
  pinMode(LEVEL_LOW_PIN, INPUT);
  pinMode(LEVEL_MEDIUM_PIN, INPUT);
  pinMode(LEVEL_HIGH_PIN, INPUT);

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

  isDispenserActive = getIsDispenserActive();
}

// This section will run forever after the setup() function. Each loop cycle will have
// a liquid level reading
// an LED lighting
// and a POST attempt
void loop() {
  const unsigned long now = millis();

  const int isDispenserActive_new = getIsDispenserActive();
  if (isDispenserActive_new != isDispenserActive) {
    // Status of dispenser battery changed. Send POST immediately to inform server of change
    isLevelReadRequested = true;
    isDispenserActive = isDispenserActive_new;
  }

  // Recall that we use a LED cycle for power saving purposes, and the following expressions
  // help facilitate that by checking if an LED light needs to be updated.
  // NOTE: LED pin can be -1 if liquid level can not be properly determined
  if (levelLedPin != -1) {
    const PinStatus currLedState = digitalRead(levelLedPin);  // check if currentLed is ON or OFF
    // if the LED has already blinked (turned ON and OFF for the specified amount of time) within the current LED cycle,
    // we start the next the next LED cycle by turning it ON
    if (currLedState == LOW && (now - lastLedOnTime) >= ledCycleTime) {
      // Start next LED cycle, turn on LED
      digitalWrite(levelLedPin, HIGH);
      lastLedOnTime = now;
      // else if LED is currently ON, then it means that it's in the middle of the LED cycle (just turned ON) and now
      // we check if the LED was already turned ON for the specified amount of time (3 sec in this case), then we turn it OFF
      // Note that this constitutes the next half of the LED cycle.
    } else if (currLedState == HIGH && (now - lastLedOnTime) >= ledOnDuration) {
      // LED already active for alloted time, turn off until next LED cycle
      digitalWrite(levelLedPin, LOW);
    }
  }

  // TODO: Fetch explanation from Javi
  if ((now - lastButtonCheckTime) >= buttonCheckInterval) {
    PinStatus currButtonState = digitalRead(BUTTON_PIN);
    if (lastButtonState == LOW &&  currButtonState == HIGH) {   // Rising edge
      Serial.println("Button pressed, manually requesting for liquid level reading.");
      isLevelReadRequested = true;
    }

    lastButtonCheckTime = now;
    lastButtonState = currButtonState;
  }

  // Recall that levelLedPin is set to -1 initially and when the current liquid level
  // is -1, both indicates error. We only set it if the interval between the previous retry and now has passed. 
  if (levelLedPin == -1 && (now - lastLevelReadTime) >= levelRetryInterval) {
    // Retry reading liquid level since last read had error|
    isLevelReadRequested = true;
  }

  // Here, we get the time since a last POST has been successfully sent
  // (successful indicating that all guard conditions on WiFi connection, liquid level errors have been passed and we received an HTTP OK (200) from server)
  const unsigned long millisSinceLastPost = (now - lastPostTime);
  // If there were errors, request recheck of level (+ sending of POST) immediately
  // Triggered upon not being able to receive an HTTP OK from the server (connection lost, received a != 200 HTTP Code)
  if (millisSinceLastPost >= postRetryDelay && hasPostError) {
    isLevelReadRequested = true;
    hasPostError = false;
  }

// postInterval is the time between each scheduled status update of the dispenser
// millisSinceLastPost is when the last successful post was sent, se we only try to send when
// we the postInterval has elapsed relative to millisSinceLastPost
  if (millisSinceLastPost >= postInterval     // "Normal" scheduled sending of data
      || isLevelReadRequested                 // Force recheck of liquid level, e.g. on boot, when error occured, or when BOOT pin is pressed
     ) {

    // Print battery status every time we try to send a POST
    Serial.print("Dispenser Power:");
    Serial.println(isDispenserActive_new ? "ACTIVE" : "INACTIVE");

    // Check WiFi connection status
    if (WiFi.status() != WL_CONNECTED) {
      Serial.println("WiFi Disconnected.");
      hasPostError = true;
    } else {
#ifdef HTTPS_MODE
      // With a WiFi connection, we can now establish a secure HTTP connection with the backend server.
      // The secure connection is contained by a WiFiClientSecure instance
      WiFiClientSecure *client = new WiFiClientSecure;
      if (!client) {
        Serial.println("Cannot establish secure connection.");
        hasPostError = true;
      } else {
        // We set the certificate of the POST request to that of the same public certificate used by the backend server
        // so that the server can verify that the POST request is coming from a legitemate source (i.e. the dispenser)
        client->setCACert(rootCACertificate);
        // client.setInsecure(); // TODO: set insecure to unencrypt packets for easier Wireshark sniffing
#endif
        HTTPClient http;
        String serverPath = serverName + "/data"; // The endpoint for updating dispenser data is serverName appended with /data.

#ifdef HTTPS_MODE
        http.begin(*client, serverPath.c_str());
#else
        http.begin(serverPath.c_str());
#endif
        http.addHeader("Content-Type", "application/json");   // POST payload is JSON

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
          dispenserStatus["isActive"] = isDispenserActive;

          String httpRequestData = JSON.stringify(dispenserStatus);
          Serial.println(httpRequestData);

          int httpResponseCode = http.POST(httpRequestData);

          if (httpResponseCode == 200) {
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

          lastPostTime = millis();
          // we just sent our level readings, reset numLevelErrors
          numLevelErrors = 0;
        } else {
          Serial.print("Error in Liquid level readings. Next run is Retry #");
          Serial.println(numLevelErrors);
        }
#ifdef HTTPS_MODE
      }
#endif
    }

    Serial.println("");
  }
}
