## R eward Question

O dysseus is trapped inside Cyclops's island. He must travel from S (Start), in the top-left corner, t o the Temple (T), in the bottom-right corner, using the 10×10 grid below. Two long walls of s nakes cut across the island — each has only one narrow gap, and the gaps are not aligned w ith each other. A route that ignores the walls will not survive; a route that only looks for the n earest gap may not find the cheapest way through.

- Odysseus can move Up, Down, Left, or Right only (no diagonals).

- SN — Snake — BLOCKED. This cell cannot be entered.

- SEA — costs 2 moves to enter (instead of 1).

- CY — Cyclops — after entering this cell, Odysseus must move one more step in the same d irection before he is allowed to turn.

- T — Temple — the destination.

- Every normal (blank) cell costs 1 move to enter.

- 1 . Find the minimum-cost route from S to T.

- 2 . Write the route using directions (U / D / L / R).

- 3 . Calculate its total cost.

## M ovement Rules

## T asks


S olution


## Q 1: The Forbidden Decision Tree

T he Witch has hidden Odysseus' final escape code inside a Decision Tree. The tree has been b roken into rules, and the ships approaching the island must be classified as SAFE or D ANGER.

T he team must first reconstruct the tree and then use it to find the ships that can escape.

## The Eight Ships

Each team receives the following data:

| Ship | Speed | Distance Waves | Hidden Num |
| --- | --- | --- | --- |
| A |   |   |   |
| B |   |   |   |
| D |   |   |   |
| E |   |   |   |
| F |   |   |   |
| G |   |   |   |


## T ask

R econstruct the correct decision tree using the Witch's rules. P ass each of the eight ships through the tree. D etermine whether each ship reaches SAFE or DANGER. D iscard the hidden numbers belonging to DANGER ships. R ead the remaining hidden numbers in ship order (A → H). F inal Clue “ Only those who find the safe waters may carry the key.” E scape Condition T he remaining numbers form the final escape code.

A nswer format:

_ _ _ _ _ _

## S olution

S hip A B C D E F G H

7 29586

- Hint 1: The tree has only one path that survives every decision.

- Hint 2: Every branch hides a choice—follow the condition that holds true, and let it guide y our next step.

- Hint 3: The answer is found by following, not guessing.

R esult D ANGER S AFE S AFE S AFE S AFE D ANGER S AFE S AFE

K eep? - 7 2 9 5 - 8

6

## A nswer format :


## Q 2: Circe’s Enchanted Domain

Y ou have landed on the island of Aeaea, but a terrible spell has been cast! The witch Circe has t ransformed your crew into swine and locked their true forms inside enchanted archives s cattered across her domain.

T he god Hermes has granted you a vision of the island's structure and the divine commands ( unzip, tar, unrar) needed to break her magic. You must navigate the island, unseal the three s pell fragments, and speak the final incantation to restore your crew and unlock the terminal.

P articipants are presented with the following directory structure, representing Circe's island:

## T he Lore :

## T he Map (Directory Tree)

## A nswer:

P refix files with a . so participants must use ls -a to find them.

- Potions_Lab/.spell_alpha.zip unzip MOLY

- Mud_Pits/.spell_beta.tar.gz tar -xzf SWINE

- Stag_Clearing/.spell_gamma.rar unrar e OATH

" Break the curse using Hermes's formula: [Fragment 1]_[Fragment 2]_[Fragment 3]"

F inal Terminal Submission:

- Hint 1: Folders look empty? Use ls -a to reveal hidden files that start with a dot.

- Hint 2 : Use the right tool for the extension: unzip (for .zip), tar -xzf (for .tar.gz), and unrar e (for .rar).

- Hint 3: Use cat to read the extracted text files, then combine the three words using u nderscores (_).

## M OLY_SWINE_OATH


## B ackup questions:

## 1 Odysseus’ Frozen Navigation System

O dysseus' navigation system has crashed while crossing the sea. Four processes are running t he ship's control system, but the system has completely frozen.

T here are four resources:

R 1 — Navigation Sensor

R 2 — GPS Module

R 3 — Communication Channel

R 4 — Engine Controller

F our processes currently hold resources and are waiting for another:

| Process | Currently Holds | Waiting For |
| --- | --- | --- |
| P1 | R1 | R2 |
| P2 | R2 | R3 |
| P3 | R3 | R4 |
| P4 | R4 | R1 |

## A dditional instructions:

- The process holding R4 is the first process that can be terminated.

- Terminating a process releases the resource it currently holds.

- Once a resource is released, the process waiting for it can continue.

- The number of the terminated process is the first digit of the escape code.

- The second digit is the number of processes that remain blocked immediately after t ermination but before any released resource is reused.

- Q 1. Why has the navigation system frozen?

- Q 2. Which process must Odysseus terminate according to the Captain's Log?

- Q 3. How many processes remain blocked immediately after termination?

- Q 4. If the escape code is [terminated process number][blocked processes], what is the 2-digit e scape code?

- 1 . The dependency chain is: P1 → R2 → P2 → R3 → P3 → R4 → P4 → R1 → P1 S o the processes form a circular dependency.

T herefore, the system is in deadlock.

## Q uestions

## S olution


2 . The process holding R4 is P3, so Terminate P3.

3 . P3 releases R3 and R3 is what P2 was waiting for.

H owever, immediately after termination, before released resources are reused:

P 1 → still waiting for R2

P 2 → waiting for R3

P 4 → waiting for R1

S o 3 processes remain blocked at that exact moment.

4 .Terminated process = 3

B locked processes = 3

E scape Code: 33

H int 1: Every process is waiting, but none can move forward.

H int 2: Look for a cycle in the way processes hold and request resources.

H int 3: Identify the process whose termination can break the cycle and release the resources.

## 2 The Hearth of Aeaea

H aving landed upon the mystical island of Aeaea, the cunning Odysseus discovers that his men h ave been transformed into swine by the dread witch Circe. To save them, he must infiltrate her i nner sanctum. However, Circe’s chamber is guarded by an arcane thermal ward governed by a n ancient artifact known as the Loom of Uno (an Arduino Uno).

H ermes has warned Odysseus that this artifact monitors the heat of her potion cauldron. The w ard is meant to decree NORMAL when the heat is below 30°C, WARNING between 30°C and 4 0°C, and DANGER at 40°C or above. Should it sense DANGER, the Loom will awaken a b linding Crimson Ruby (an LED) and a screeching Bronze Owl (a buzzer) to alert the witch.

O dysseus observes the following hardware connections tethering the ward:

S ensor VCC (Divine Power) → 5V

S ensor GND (Mortal Earth) → GND

S ensor OUT (Prophecy Line) → A0

C rimson Ruby (LED) → Digital Pin 8

B ronze Owl (Buzzer) → Digital Pin 9

U sing his wit, Odysseus deciphered the logic scroll uploaded to the artifact:

i nt sensorPin = 0;

i nt ledPin = 8;

i nt buzzerPin = 9;

v oid setup() {


```
S erial.begin(9600);
p inMode(ledPin, OUTPUT);
p inMode(buzzerPin, OUTPUT);
}
v oid loop() {
i nt sensorValue = analogRead(sensorPin);
f loat voltage = sensorValue * (5.0 / 1023.0);
f loat temperature = voltage * 100;
i f (temperature < 30) {
S erial.println("NORMAL");
}
e lse if (temperature >= 30 && temperature < 40) {
S erial.println("WARNING");
}
e lse if (temperature > 40) {
S erial.println("DANGER");
d igitalWrite(ledPin, HIGH);
d igitalWrite(buzzerPin, HIGH);
}
d elay(1000);
}
```

O dysseus uses a stolen golden multimeter and measures that the sensor is currently producing a n output voltage of 3.2 V.

## Y our Tasks:

- Calculate the ADC value (the Loom's digital prophecy) corresponding to the 3.2 V output.

- Using the provided scroll (program logic), calculate the exact temperature detected by t he artifact.

- State what the Loom will display in the serial monitor and whether the Ruby (LED) and O wl (buzzer) will be activated at this temperature.

- Analyze the scroll. Circe’s magic is flawed; identify the logic issues that could cause her w ard to fail or behave incorrectly. Suggest the required corrections to perfect her spell.

H ermes' Note: The Loom of Uno utilizes a 10-bit ADC, which converts an analog input voltage b etween 0–5 V into a discrete digital value ranging from 0 to 1023.

H int 1 : Think about how the Arduino converts the sensor's analog voltage into a digital value.

H int 2 : Compare the sensor's physical connection with the pin being used in the code.

H int 3 : Check what happens exactly at 40°C and what happens to the LED and buzzer when t he temperature decreases.


S olution T ask 1: ADC Value 6 54 or 655 (Calculated as 3.2V × 204.6 = 654.72, rounded to the nearest integer).

T ask 2: Detected Temperature 3 20°C (Calculated as 3.2V × 100).

T ask 3: System Display & Hardware

D isplay: "DANGER"

H ardware: Both the LED and Buzzer turn ON (set to HIGH).

T ask 4: Code Corrections

B ug 1 (40°C Blindspot): The code does nothing if the temperature is exactly 40°C. F ix: Change the final condition to >= 40.

B ug 2 (Alarm Never Resets): The LED and buzzer stay on forever once triggered.

F ix: Add digitalWrite(..., LOW) commands to turn them off during the "NORMAL" and " WARNING" conditions.

## 3 Odysseus’ Four Ships

U se the clues:

O dysseus’ ship crosses immediately before Ship C.

S hip A crosses after Theseus’ ship but before Perseus’ ship.

S hip B is not 1st or 4th.

A jax’s ship crosses exactly two positions after Ship D.

S hip C is not commanded by Perseus.

T heseus’ ship crosses before Ship D.

S hip A is not commanded by Odysseus.

V erified solution

P osition - Ship - Captain

1 st - D - Theseus

2 nd- A - Odysseus

3 rd- B - Ajax

4 th - C -Perseus

H int(if asked) : Use the “two positions after” clue to place D and Ajax.

F our ships : A, B, C, D must cross four checkpoints in exactly one of the positions 1st, 2nd, 3rd, 4 th.

E ach ship has a different captain: Ajax, Odysseus, Perseus, Theseus.

Q uestion: Determine the exact order of the four ships and the captain of each ship.
