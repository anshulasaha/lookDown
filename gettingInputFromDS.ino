//this code is successful 

#define TRIG_PIN_1 2
#define ECHO_PIN_1 4
#define TRIG_PIN_2 6
#define ECHO_PIN_2 8

void setup() {
  Serial.begin(9600);
  pinMode(TRIG_PIN_1, OUTPUT);
  pinMode(ECHO_PIN_1, INPUT);
  pinMode(TRIG_PIN_2, OUTPUT);
  pinMode(ECHO_PIN_2, INPUT);
}

long getDistance(int trigPin, int echoPin) {
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);

  long duration = pulseIn(echoPin, HIGH);
  return duration * 0.034 / 2;  // Convert duration to distance in cm
}

void loop() {
  long distance1 = getDistance(TRIG_PIN_1, ECHO_PIN_1); // First sensor
  long distance2 = getDistance(TRIG_PIN_2, ECHO_PIN_2); // Second sensor

  // Print both distances to the Serial Monitor
  Serial.print("Sensor 1: ");
  Serial.print(distance1);
  Serial.print(" cm, Sensor 2: ");
  Serial.print(distance2);
  Serial.println(" cm");

  delay(500); // Update every 0.5 seconds
}
