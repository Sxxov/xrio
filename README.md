# XRIO

Display 3D models in the browser using [three.js](https://threejs.org/), controlled by a connected WebXR-capable headset on the same server.

## Requirements

You will need to have the following programs installed:

1. [NodeJS](https://nodejs.org/en/download/current) version >= 18
2. [Git](https://git-scm.com/downloads)

## Installation

```bash
git clone https://github.com/sxxov/xrio.git
cd xrio
npm i
npm run build
```

## Updating

```bash
git pull
npm i
npm run build
```

## Usage

### Step 1: Start the server

```bash
npm run preview
```

> `npm start` is currently broken due to WebXR requiring HTTPS. Use `npm run preview` instead to use Vite's built-in HTTPS server.

### Step 2: Connect your headset

On a WebXR-capable headset (i.e. Meta Quest 3, Pico 4), navigate to `https://<your-ip>:4173/in` and click the "Enter VR" button.

### Step 3: Connect your viewer

On a device connected to the same network as the server, navigate to `https://<your-ip>:4173/out`. After a few seconds, the viewer should connect and you should see some content being shown on the canvas.

> If it doesn't load after a bit, ensure that at least one headset is connected to the server.

### Step 4: Load a model

**TODO**

Currently you are limited to the 2 included models.

## License

WTFPL
