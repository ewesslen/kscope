# kscope

A REST API that extracts dominant brand colors from images. Upload a logo or brand image and get back the key colors that define that brand — including hex codes, RGB and HSL values, human-readable color names, and how much of the image each color occupies.

## Prerequisites

Before you begin, make sure you have **Node.js** (version 18 or later) installed on your computer. You can check by opening a terminal and running:

```bash
node --version
```

If you don't have it, download it from [nodejs.org](https://nodejs.org).

## Getting Started

**Step 1.** Open a terminal and navigate to the project folder:

```bash
cd kscope
```

**Step 2.** Install the project dependencies:

```bash
npm install
```

**Step 3.** Start the server:

```bash
npm start
```

You should see the message: `kscope brand color analyzer running on port 3000`

Keep this terminal window open — the server needs to stay running.

## Analyzing an Image

Open a **second** terminal window and run one of the following commands, depending on your system:

**Mac / Linux:**

```bash
curl -F "image=@examples/sport-shooting-depot.png" http://localhost:3000/analyze
```

**Windows (PowerShell):**

```powershell
curl.exe -F "image=@examples/sport-shooting-depot.png" http://localhost:3000/analyze
```

> **Windows note:** PowerShell has a built-in `curl` that is not the same program. Use `curl.exe` (with the `.exe`) to run the real curl that ships with Windows 10+.

### Example

The included sample image is the **Sport Shooting Depot** logo:

![Sport Shooting Depot](examples/sport-shooting-depot.png)

Running the command above produces:

```json
{
  "filename": "sport-shooting-depot.png",
  "totalColors": 5,
  "colors": [
    {
      "hex": "#010100",
      "rgb": { "r": 1, "g": 1, "b": 0 },
      "hsl": { "h": 60, "s": 100, "l": 0 },
      "name": "black",
      "dominance": 85.9
    },
    {
      "hex": "#cecece",
      "rgb": { "r": 206, "g": 206, "b": 206 },
      "hsl": { "h": 0, "s": 0, "l": 81 },
      "name": "light gray",
      "dominance": 5.5
    },
    {
      "hex": "#616f6b",
      "rgb": { "r": 97, "g": 111, "b": 107 },
      "hsl": { "h": 163, "s": 7, "l": 41 },
      "name": "gray",
      "dominance": 4.1
    },
    {
      "hex": "#2b2e28",
      "rgb": { "r": 43, "g": 46, "b": 40 },
      "hsl": { "h": 90, "s": 7, "l": 17 },
      "name": "dark gray",
      "dominance": 4
    },
    {
      "hex": "#c3761d",
      "rgb": { "r": 195, "g": 118, "b": 29 },
      "hsl": { "h": 32, "s": 74, "l": 44 },
      "name": "orange",
      "dominance": 0.6
    }
  ]
}
```

This tells us the logo is primarily **black** (85.9%), with **light gray/white text** (5.5%), and accent colors in the circular emblem.

### Options

You can control how many colors are extracted by adding a `maxColors` field:

**Mac / Linux:**

```bash
curl -F "image=@examples/sport-shooting-depot.png" -F "maxColors=3" http://localhost:3000/analyze
```

**Windows (PowerShell):**

```powershell
curl.exe -F "image=@examples/sport-shooting-depot.png" -F "maxColors=3" http://localhost:3000/analyze
```

### Understanding the Output

Each color in the response includes:

| Field | What it means |
|---|---|
| `hex` | The color as a hex code (e.g. `#ff5733`), used in web design and most design tools |
| `rgb` | Red, green, and blue values (0–255) |
| `hsl` | Hue (0–360), saturation (0–100%), and lightness (0–100%) |
| `name` | A human-readable color name like "red", "dark blue", or "light gray" |
| `dominance` | What percentage of the image this color occupies |

## Tests

```bash
npm test
```
