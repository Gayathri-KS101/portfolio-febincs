// All of the site's copy lives here. Edit this file to update the portfolio.
// Images are in public/photos/.

export type Shot = {
  src: string;
  caption: string;
  width: number;
  height: number;
  title?: string; // shown above the caption on cards
  tag?: string; // small mono label, e.g. a date
  story?: string; // a few sentences in his own words, shown with a certificate
};

// The site's pages, in nav order
export const pages = [
  { href: "/about", label: "About" },
  { href: "/work", label: "Work" },
  { href: "/workshops", label: "Workshops" },
  { href: "/recognition", label: "Recognition" },
  { href: "/experience", label: "Experience" },
  { href: "/contact", label: "Contact" },
];

export const profile = {
  name: "Febin C S",
  role: "Embedded Systems Engineer",
  focus: "Firmware Development & PCB Design",
  location: "Thrissur, Kerala, India",
  email: "febinsibin157@gmail.com",
  altEmail: "febinsibincu@gmail.com",
  linkedin: "https://www.linkedin.com/in/febincs",
  linkedinLabel: "linkedin.com/in/febincs",
  resume: "/Febin-C-S-Resume.pdf",
  portrait: {
    src: "/photos/speaking-bw.jpg",
    caption: "Fig. 2 / At IEDC Summit 2026",
    width: 784,
    height: 960,
  },
  tagline: "I build things, break them, learn, and build them again. And I love talking about it.",
  // the first paragraph is the lead; a label, where given, heads its paragraph on phones
  about: [
    { text: "I am an Electronics and Communication engineer who likes owning the whole path from an idea to a working device: the schematic, the board, the solder joints and the firmware that brings it to life." },
    { label: "Building", text: "I led the teams behind LasE Wave, a laser link that carries typed text and audio, and HydroGreens, an ESP32 controller that grows microgreens on its own. Along the way I won an Internet of Things competition and built a laser game that a second college hired us to run again." },
    { label: "Teaching", text: "Alongside building, I teach. I run electronics and embedded labs at Keltron Knowledge Centre, and at IEDC Summit 2026 I conducted hands-on sessions on PCB Design and Device-to-Device Communication." },
  ],
  facts: [
    { label: "Based in", value: "Thrissur, Kerala" },
    { label: "Currently", value: "Academic Executive, Keltron Knowledge Centre" },
    { label: "Looking for", value: "Embedded software and firmware roles" },
    { label: "Languages", value: "English, Malayalam" },
  ],
};

// Hero board: an animated amplitude-modulation slide.
// `board` holds its corners as fractions of the frame (TL, TR, BR, BL). A plain rectangle
// sits flat; move the corners to tilt it in perspective.
export const hero: { board: [number, number][]; caption: string } = {
  board: [
    [0, 0],
    [1, 0],
    [1, 1],
    [0, 1],
  ],
  caption: "Fig. 1 / Live signal",
};

// Glass tiles floating over the hero board. `x` and `y` place a tile's top-left
// corner on the board, as a percentage of its width and height.
export const boardTiles = [
  { ref: "P01", name: "LasE Wave", href: "/work#p01", x: 8, y: 6 },
  { ref: "P02", name: "HydroGreens", href: "/work#p02", x: 66, y: 16 },
  { ref: "P04", name: "D2D Kit", href: "/work#p04", x: 3, y: 46 },
  { ref: "P03", name: "Laser Maze", href: "/work#p03", x: 27, y: 74 },
];

// Home page: the latest things worth knowing, newest first. Each row links to its page.
export const achievements = [
  {
    when: "2026",
    title: "Workshop trainer, IEDC Summit 2026",
    detail: "Ran hands-on sessions on PCB Design and Device-to-Device Communication at Kerala Startup Mission's summit.",
    href: "/workshops",
  },
  {
    when: "Mar 2025",
    title: "Guided STM32 projects at Firmware Frenzy",
    detail: "Appreciated for guiding participants through STM32-based project development at the embedded systems workshop.",
    href: "/recognition",
  },
  {
    when: "2025",
    title: "Led LasE Wave, a laser link for text and audio",
    detail: "Owned the circuit, the carrier PCB and the firmware of our B.Tech final project.",
    href: "/work#p01",
  },
  {
    when: "Aug 2024",
    title: "First Prize, Internet of Things competition",
    detail: "SAE India Collegiate Club, GEC Palakkad.",
    href: "/recognition",
  },
];

// Home page: the pinout. One pin per side of him; `pin` is the short name printed beside
// the pin, `name` and `detail` are what the chip's face shows when that pin is chosen.
export const sides = [
  {
    pin: "BUILD",
    name: "Builder",
    detail: "Boards, firmware and the debugging in between. A laser link, a hydroponics controller, a laser maze.",
  },
  {
    pin: "TRAIN",
    name: "Trainer",
    detail: "I run electronics and embedded labs at Keltron Knowledge Centre, and teach by getting people to build.",
  },
  {
    pin: "SPEAK",
    name: "Speaker",
    detail: "I love to talk about this stuff. Sessions at IEDC Summit 2026 and with Tecknow Club.",
  },
  {
    pin: "LEARN",
    name: "Learner",
    detail: "Still a student at heart: I get things wrong, learn and go again. Lately exploring AI, ML and data science.",
  },
  {
    pin: "TEAM",
    name: "Teammate",
    detail: "Led two project teams, co-founded Tecknow Club, and happiest when building alongside others.",
  },
  {
    pin: "GND",
    name: "Grounded",
    detail: "Based in Thrissur, Kerala, and open to embedded software and firmware roles.",
  },
];

export const capabilities = [
  {
    ref: "U1",
    label: "Microcontrollers & boards",
    items: ["ESP32", "ESP8266 / NodeMCU", "Arduino UNO, Nano", "STM32", "Raspberry Pi", "Raspberry Pi Pico"],
  },
  {
    ref: "U2",
    label: "Interfaces & protocols",
    items: ["UART", "I2C", "SPI", "Single-wire", "Wi-Fi (TCP sockets)", "Bluetooth", "ESP-NOW", "LoRa (SX1278)", "MQTT"],
  },
  {
    ref: "U3",
    label: "PCB design",
    items: ["EasyEDA", "KiCad", "Proteus", "Schematic to Gerbers", "Boards with and without MCUs", "Etching"],
  },
  {
    ref: "U4",
    label: "Hardware & debugging",
    items: ["Soldering and rework", "Board bring-up", "Multimeter and oscilloscope fault finding", "Appliance board repair"],
  },
  {
    ref: "U5",
    label: "Programming & tools",
    items: ["Embedded C", "C", "Python", "STM32CubeIDE", "Arduino IDE", "MATLAB", "Blynk", "Linux"],
  },
];

export const process = [
  { step: "Schematic", detail: "Circuit design and schematic capture in EasyEDA or KiCad." },
  { step: "Layout", detail: "Component placement, routing and Gerber generation." },
  { step: "Fabrication", detail: "Hand-off to the fab, or etching the board in-house." },
  { step: "Assembly", detail: "Soldering the parts, with rework where needed." },
  { step: "Bring-up", detail: "Power-on, then fault finding with a multimeter and scope." },
  { step: "Firmware", detail: "Embedded C for peripherals, sensors and communication." },
];

export type Project = {
  name: string;
  kind: string;
  meta: string; // year and role
  summary: string;
  points: string[];
  specs?: { label: string; value: string }[];
  links?: { name: string; boards: string; note: string; wireless?: boolean }[];
  stack: string[];
  chain?: { label: string; wireless?: boolean }[];
  shots?: Shot[];
  cover: string; // photo behind the project's card on the Work page
};

export const projects: Project[] = [
  {
    name: "LasE Wave",
    cover: "/photos/lasewave-pcb.jpg",
    kind: "Free-space laser link for text and audio",
    meta: "B.Tech final project, 2025 · Team lead, team of four",
    summary:
      "A device-to-device link that carries keypad-typed text and audio over a 650 nm laser beam, received by a solar panel one metre away.",
    points: [
      "Led the team and owned the circuit, hardware and firmware: an Arduino Nano switches the laser through an IRF520N MOSFET driver.",
      "Wrote the firmware: multi-tap text entry on a 4x4 keypad, Morse-coded on-off keying of the laser, and a receiver that times pulses from the solar-panel photodetector to decode characters onto an I2C LCD.",
      "Designed and had fabricated the carrier PCB (Nano socket, voltage regulators, text/audio mode switch, power input, headers) and built the audio path around an LA6283 amplifier.",
    ],
    specs: [
      { label: "Range", value: "1 m, line of sight" },
      { label: "Laser", value: "650 nm, 1.91 eV per photon against silicon's 1.12 eV bandgap" },
      { label: "Audio gain", value: "45 dB, about 178x, from a millivolt-level panel signal" },
      { label: "Modes", value: "Text or audio, chosen by a toggle switch" },
    ],
    stack: ["Arduino Nano", "650 nm laser", "IRF520N", "LA6283", "7805 / 7809", "4x4 keypad", "I2C LCD", "Solar panel"],
    chain: [
      { label: "Keypad / AUX" },
      { label: "Arduino Nano" },
      { label: "IRF520N" },
      { label: "Laser", wireless: true },
      { label: "Solar panel" },
      { label: "Arduino Nano" },
      { label: "LCD / speaker" },
    ],
    shots: [
      { src: "/photos/lasewave-pcb.jpg", caption: "Carrier PCB, 3D view from the layout", width: 758, height: 550 },
      { src: "/photos/lasewave-transmitter.jpg", caption: "Transmitter on the bench", width: 500, height: 500 },
      { src: "/photos/lasewave-receiver.jpg", caption: "Receiver: LCD, amplifier and speaker", width: 1247, height: 791 },
      { src: "/photos/lasewave-typed.jpg", caption: "Message typed on the keypad", width: 963, height: 1280 },
      { src: "/photos/lasewave-received.jpg", caption: "The same message, decoded at the receiver", width: 1434, height: 532 },
      { src: "/photos/lasewave-block-tx.png", caption: "Transmitter block diagram", width: 976, height: 593 },
      { src: "/photos/lasewave-block-rx.png", caption: "Receiver block diagram", width: 679, height: 503 },
    ],
  },
  {
    name: "HydroGreens",
    cover: "/photos/hydrogreens-setup.jpg",
    kind: "IoT hydroponics controller",
    meta: "B.Tech mini project, 2024 · Team lead, team of four",
    summary:
      "An ESP32 controller that grows microgreens without soil: it watches the growing conditions, tops up the water, doses nutrients and reports everything to a phone.",
    points: [
      "Built the controller to read temperature, humidity, TDS, gas and water level, refill the reservoir when the level drops and dose nutrients every 24 hours, with a grow light, exhaust fan and air pump.",
      "Streamed live readings to a Blynk dashboard for remote monitoring.",
      "In a 7-day trial the microgreens grew faster than a batch kept in open conditions.",
    ],
    specs: [
      { label: "Sensing", value: "DHT11, TDS probe, MQ9 gas, water-level depth" },
      { label: "Actuation", value: "Refill pump, nutrient pumps, exhaust fan, air pump, LED grow light" },
      { label: "Trial", value: "7 days, logged on Blynk, against an open-air batch" },
    ],
    stack: ["ESP32", "DHT11", "TDS sensor", "MQ9", "Water-level sensor", "Blynk", "Wi-Fi"],
    chain: [
      { label: "Sensors" },
      { label: "ESP32" },
      { label: "Pumps / fan / light" },
      { label: "Wi-Fi", wireless: true },
      { label: "Blynk cloud" },
      { label: "Phone" },
    ],
    shots: [
      { src: "/photos/hydrogreens-setup.jpg", caption: "Grow chamber with light, pumps and exhaust fan", width: 1028, height: 863 },
      { src: "/photos/hydrogreens-blynk.jpg", caption: "Day 1 readings on the Blynk dashboard", width: 1050, height: 605 },
      { src: "/photos/hydrogreens-day7.jpg", caption: "Day 7, grown in HydroGreens", width: 713, height: 423 },
      { src: "/photos/hydrogreens-open-day7.jpg", caption: "Day 7, grown in open conditions", width: 1152, height: 864 },
      { src: "/photos/hydrogreens-chamber.jpg", caption: "Reservoir and tubing inside the chamber", width: 486, height: 820 },
      { src: "/photos/hydrogreens-block.jpg", caption: "System block diagram", width: 982, height: 782 },
    ],
  },
  {
    name: "Laser Maze Runner",
    cover: "/photos/laser-maze-lit.jpg",
    kind: "Laser-and-sensor game with real-time scoring",
    meta: "Invento 2023 and Tharang 2.0 · Technical events coordinator",
    summary:
      "An Arduino game in which players cross a dark room without breaking the laser beams. More than 100 people played it across two college fests.",
    points: [
      "Implemented the sensor interfacing, timing and scoring logic so that a broken beam registers at once.",
      "Built for Invento 2023 at GEC Palakkad. Jyothi Engineering College then hired us to run it again as Intruders Quest at its Tharang 2.0 fest in November 2023.",
    ],
    stack: ["Arduino", "Laser modules", "Sensors", "Digital control logic"],
    chain: [
      { label: "Laser", wireless: true },
      { label: "Sensor" },
      { label: "Arduino" },
      { label: "Score" },
    ],
    shots: [
      { src: "/photos/laser-maze-dark.jpg", caption: "A player in the maze", width: 960, height: 1280 },
      { src: "/photos/laser-maze-lit.jpg", caption: "The beams across the room at Tharang 2.0", width: 720, height: 1280 },
      { src: "/photos/laser-team.jpg", caption: "The crew at Intruders Quest", width: 1280, height: 960 },
      { src: "/photos/laser-poster.jpg", caption: "Event poster, Jyothi Engineering College", width: 964, height: 1280 },
    ],
  },
  {
    name: "Device-to-Device Communication Kit",
    cover: "/photos/summit-d2d-talk.jpg",
    kind: "Paired sender and receiver firmware for eight links",
    meta: "Workshop material, 2026 · Sole author",
    summary:
      "The teaching kit behind my IEDC Summit session: eight ways for two boards to talk, from wired buses to long-range radio, each as a matched sender and receiver sketch.",
    points: [
      "Includes a register-level SPI slave, a bit-banged single-wire link with microsecond timing, and callback-driven I2C and ESP-NOW receivers.",
      "Every sketch reports its start-up stage by stage over serial, so a participant can see exactly where a link fails.",
    ],
    links: [
      { name: "UART", boards: "Arduino UNO to UNO", note: "Asynchronous serial" },
      { name: "I2C", boards: "Arduino UNO to UNO", note: "Master and callback-driven slave" },
      { name: "SPI", boards: "Arduino UNO to UNO", note: "Master and register-level slave" },
      { name: "Single-wire", boards: "Arduino UNO to UNO", note: "Bit-banged, microsecond timing" },
      { name: "Wi-Fi", boards: "NodeMCU to NodeMCU", note: "Access point and station, TCP sockets", wireless: true },
      { name: "Bluetooth", boards: "ESP32 to ESP32", note: "Master and slave", wireless: true },
      { name: "ESP-NOW", boards: "NodeMCU to NodeMCU", note: "Callback-driven receiver", wireless: true },
      { name: "LoRa", boards: "Arduino UNO + SX1278", note: "433 MHz long-range radio", wireless: true },
    ],
    stack: ["Arduino UNO", "ESP32", "NodeMCU", "SX1278 LoRa RA-02"],
    shots: [
      { src: "/photos/summit-d2d-talk.jpg", caption: "Teaching with the kit at IEDC Summit 2026", width: 1536, height: 1024 },
    ],
  },
];

// The last card on the Work page: everything smaller, listed in `builds` below
export const otherWorks = {
  name: "Other works",
  kind: "Smaller builds and work in progress",
  summary: "A diploma project, practice builds and things still on the bench.",
  cover: "/photos/etched-board.jpg",
};

export const builds: { name: string; meta: string; detail: string; image?: Shot }[] = [
  {
    name: "Seido Tracker",
    meta: "Diploma project, 2021 · Team of six",
    detail: "A Raspberry Pi that reads runners' RFID tags to count laps and record finish times in relays and races.",
  },
  {
    name: "STM32 builds",
    meta: "STM32CubeIDE",
    detail: "Fundamentals-level builds with sensor interfacing and board-to-board communication.",
  },
  {
    name: "MicroRoots",
    meta: "In progress",
    detail:
      "An ESP32 that pushes light, air-quality and smoke readings (LDR, MQ135, MQ7) to Firebase Realtime Database, shown live in a Flutter app.",
  },
  {
    name: "Hand-etched boards",
    meta: "Keltron Knowledge Centre",
    detail: "Single-sided boards taken from layout to copper by etching, the same process I teach in the PCB workshop.",
    image: { src: "/photos/etched-board.jpg", caption: "Single-sided board etched at Keltron Knowledge Centre", width: 899, height: 1599 },
  },
];

export const workshop = {
  intro:
    "I teach by getting people to build. These are some of the sessions I have run or helped run, from a state-wide summit to club workshops and lab classes.",
  events: [
    {
      name: "IEDC Summit 2026",
      chips: ["10,000+ attendees", "2 hands-on sessions", "PCB etching", "8 device links"],
      meta: "Kerala Startup Mission · 2026",
      detail:
        "Two hands-on sessions at a summit of more than 10,000 attendees. In PCB Design, each participant drew a two-transistor LED flasher in EasyEDA and etched it in ferric chloride. In Device-to-Device Communication, we ran eight links between two boards, from UART to LoRa.",
      shots: [
        { src: "/photos/summit-etching-demo.jpg", caption: "Etching demo, with the flasher circuit on screen", width: 1024, height: 1536 },
        { src: "/photos/summit-d2d-talk.jpg", caption: "Device-to-Device Communication session", width: 1536, height: 1024 },
        { src: "/photos/summit-etch-tray.jpg", caption: "Copper coming off in the etchant", width: 1536, height: 1024 },
        { src: "/photos/summit-easyeda.jpg", caption: "Checking a layout in EasyEDA", width: 1024, height: 1536 },
        { src: "/photos/summit-room.jpg", caption: "The chemistry behind etching", width: 1536, height: 1024 },
        { src: "/photos/summit-materials.jpg", caption: "Copper-clad boards, etchant and solder", width: 1536, height: 1024 },
        { src: "/photos/summit-explaining.jpg", caption: "Talking a participant through a design", width: 1024, height: 1536 },
        { src: "/photos/summit-participants.jpg", caption: "Between sessions", width: 1536, height: 1024 },
      ],
    },
    {
      name: "STM32 workshop",
      chips: ["STM32F103", "STM32CubeMX", "Proteus", "Tecknow Club"],
      meta: "Tecknow Club, GEC Palakkad",
      detail:
        "Guiding participants through STM32 project development: pin configuration in STM32CubeMX, then the circuit simulated in Proteus before it goes on a board.",
      shots: [
        { src: "/photos/stm32-room.jpg", caption: "Participants at work", width: 632, height: 632 },
        { src: "/photos/stm32-cubemx.jpg", caption: "STM32F103 pin setup in CubeMX", width: 632, height: 632 },
        { src: "/photos/stm32-proteus.jpg", caption: "The circuit simulated in Proteus", width: 632, height: 632 },
        { src: "/photos/stm32-group.jpg", caption: "The workshop group", width: 632, height: 632 },
      ],
    },
    {
      name: "Introduction to Arduino",
      chips: ["31 Jan 2025", "TinkerCAD", "First embedded code for most", "TinkerHub + Tecknow"],
      meta: "TinkerHub and Tecknow Club · Jan 2025",
      detail:
        "An open session using TinkerCAD: no soldering iron, no breadboard, just a laptop. For most of the room it was their very first line of embedded code.",
      shots: [
        { src: "/photos/tecknow-talk.jpg", caption: "Mentoring at Introduction to Arduino", width: 960, height: 722 },
        { src: "/photos/tecknow-audience.jpg", caption: "The room, GEC Palakkad, 31 January 2025", width: 1277, height: 960 },
        { src: "/photos/lab-pcb-session.jpg", caption: "Another day: a PCB layout class in the lab", width: 963, height: 1280 },
      ],
    },
  ] as { name: string; meta: string; detail: string; chips: string[]; shots: Shot[] }[],
};

export const recognition: Shot[] = [
  {
    src: "/photos/cert-sae-iot-first.jpg",
    story: "The competition asked for real-world IoT solutions, so it came down to thinking critically and applying engineering principles, alongside some very good peers. Winning it left me wanting bigger challenges in electronics and IoT.",
    tag: "Aug 2024",
    title: "First Prize, Internet of Things competition",
    caption: "SAE India Collegiate Club, GEC Palakkad, TIER 1 events 2024.",
    width: 1280,
    height: 905,
  },
  {
    src: "/photos/cert-tharang-jyothi.jpg",
    story: "Jyothi Engineering College's AI and DS association brought our laser maze to their fest, Tharang 2.0, and I looked after the technical side for all three days. It was a chance to put my skills to work for a new team and a new crowd.",
    tag: "Nov 2023",
    title: "Technical assistance, Intruders Quest",
    caption: "Hired by Jyothi Engineering College to run the laser game at its Tharang 2.0 fest.",
    width: 1280,
    height: 905,
  },
  {
    src: "/photos/cert-firmware-frenzy.jpg",
    story: "A two-day embedded systems workshop run by TinkerHub and Tecknow Club. I volunteered to guide participants through their STM32-based projects.",
    tag: "Mar 2025",
    title: "STM32 project guidance, Firmware Frenzy",
    caption: "Appreciated for guiding STM32-based project development at the embedded systems workshop, GEC Palakkad.",
    width: 1280,
    height: 905,
  },
  {
    src: "/photos/cert-tecknow-project-head.jpg",
    story: "I helped start Tecknow Club as the ECE department's technical community, then spent the year as its Project Head, taking club projects from an idea to something that works.",
    tag: "2024 – 25",
    title: "Co-founder and Project Head, Tecknow Club",
    caption: "The Department of ECE's student technical community at GEC Palakkad.",
    width: 1280,
    height: 905,
  },
  {
    src: "/photos/cert-iedc-quality-lead.jpg",
    story: "A year of keeping IEDC's workshops, events and documentation up to standard, so that the ideas people brought in had a fair chance of becoming something.",
    tag: "2024 – 25",
    title: "Quality and Operation Lead, IEDC",
    caption: "Innovation and Entrepreneurship Development Centre, GEC Palakkad.",
    width: 1280,
    height: 905,
  },
  {
    src: "/photos/cert-arduino-mentor.jpg",
    story: "For most people in the room this was their first line of embedded code, written in TinkerCAD. Their questions pushed me to think deeper and sharpen my own understanding. The best part was that the learning went both ways.",
    tag: "Jan 2025",
    title: "Mentor, Introduction to Arduino",
    caption: "TinkerHub GEC Palakkad with Tecknow Club.",
    width: 1280,
    height: 905,
  },
  {
    src: "/photos/cert-invento-2023.jpg",
    story: "I coordinated the Lazer Maze Runner event at our college's national-level multifest. It honed my problem-solving and circuit skills, and it is the game another college later asked us to bring to their fest.",
    tag: "Sep 2023",
    title: "Coordinator, Technical Events",
    caption: "Lazer Maze Runner at Invento 2023, the national-level multifest of GEC Palakkad.",
    width: 800,
    height: 565,
  },
];

export const experience = [
  {
    role: "Academic Executive",
    org: "Keltron Knowledge Centre, Thrissur",
    period: "Nov 2025 – Present",
    points: [
      "Run hands-on electronics and embedded labs.",
      "Help students build and debug their hardware and firmware.",
    ],
  },
  {
    role: "Workshop Trainer",
    org: "IEDC Summit 2026, Kerala Startup Mission",
    period: "2026",
    points: ["Conducted hands-on sessions on PCB Design and Device-to-Device Communication."],
  },
  {
    role: "Junior Robotics Instructor",
    org: "Tinkertodz",
    period: "",
    points: ["Taught robotics and electronics through builds: Arduino programming, sensor integration and mechanical design."],
  },
  {
    role: "Intern, Computer Hardware & Software",
    org: "Keltron Knowledge Centre, Thrissur",
    period: "Jul 2024",
    points: ["PC assembly, hardware troubleshooting, Windows and Linux installation, system configuration and C programming."],
  },
];

export const education = [
  {
    degree: "B.Tech, Electronics and Communication Engineering",
    school: "Government Engineering College Palakkad, Sreekrishnapuram",
    period: "2022 – 2025",
    note: "Course completed; degree awaited",
  },
  {
    degree: "Diploma, Electronics and Communication Engineering",
    school: "Government Polytechnic College, Kunnamkulam",
    period: "2018 – 2021",
    note: "First Class",
  },
];
