#include <WiFiClientSecure.h>
#include <MQTT.h>

const char ssid[] = "realme XT";
const char pass[] = "123446788";

WiFiClientSecure net;
MQTTClient client;

unsigned long lastMillis = 0;

void connect() {
  Serial.print("checking wifi...");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(1000);
  }

  Serial.print("\nconnecting...");
  // do not verify tls certificate
  // check the following example for methods to verify the server:
  // https://github.com/espressif/arduino-esp32/blob/master/libraries/WiFiClientSecure/examples/WiFiClientSecure/WiFiClientSecure.ino
  net.setInsecure();
  while (!client.connect("clientId-mW8A079mPj", "Funny8ee", "Funny8ee")) {
    Serial.print(".");
    delay(1000);
  }

  Serial.println("\nconnected!");

  client.subscribe("/hello");
  // client.unsubscribe("/hello");
}

void messageReceived(String &topic, String &payload) {
  Serial.println("incoming: " + topic + " - " + payload);

  // Note: Do not use the client in the callback to publish, subscribe or
  // unsubscribe as it may cause deadlocks when other things arrive while
  // sending and receiving acknowledgments. Instead, change a global variable,
  // or push to a queue and handle it in the loop after calling `client.loop()`.
}

void setup() {
  Serial.begin(9600);
  WiFi.begin(ssid, pass);

  // Note: Local domain names (e.g. "Computer.local" on OSX) are not supported
  // by Arduino. You need to set the IP address directly.
  //
  // MQTT brokers usually use port 8883 for secure connections.
  client.begin("e9079bc3a54a48bb859818346853e5d2.s2.eu.hivemq.cloud", 8883, net);
  client.onMessage(messageReceived);

  connect();
  // pinMode(14, INPUT);
  delay(2000);
}

int i = 0;
void loop() {
  String json = "{\"label\":";
  json += i;
  json += ",";
  json += "\"ecg\":";
  json += String(analogRead(32));
  json += ",";
  json += "\"ppg\":";
  json += String(analogRead(33));
  json += "}";


  client.loop();
  delay(20);  // sampling rate

  if (!client.connected()) {
    connect();
  }
  client.publish("mqtt", json.c_str());

  i++;
}