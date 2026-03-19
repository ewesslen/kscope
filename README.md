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
      "hex": "#000000",
      "rgb": { "r": 0, "g": 0, "b": 0 },
      "hsl": { "h": 0, "s": 0, "l": 0 },
      "name": "black",
      "dominance": 91.4
    },
    {
      "hex": "#fafafa",
      "rgb": { "r": 250, "g": 250, "b": 250 },
      "hsl": { "h": 0, "s": 0, "l": 98 },
      "name": "white",
      "dominance": 5.7
    },
    {
      "hex": "#386736",
      "rgb": { "r": 56, "g": 103, "b": 54 },
      "hsl": { "h": 118, "s": 31, "l": 31 },
      "name": "green",
      "dominance": 1.3
    },
    {
      "hex": "#657c9f",
      "rgb": { "r": 101, "g": 124, "b": 159 },
      "hsl": { "h": 216, "s": 23, "l": 51 },
      "name": "blue",
      "dominance": 0.9
    },
    {
      "hex": "#cf741f",
      "rgb": { "r": 207, "g": 116, "b": 31 },
      "hsl": { "h": 29, "s": 74, "l": 47 },
      "name": "orange",
      "dominance": 0.7
    }
  ]
}
```

This tells us the logo is primarily **black** (91.4%) background with **white** text (5.7%), plus the **green**, **blue**, and **orange** accent colors from the circular emblem.

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
