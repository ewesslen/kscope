# kscope

A REST API that extracts dominant brand colors from images using k-means clustering. Upload an image and get back structured color data including hex, RGB, HSL, human-readable color names, and dominance percentages.

## Setup

```bash
npm install
npm start
```

The server starts on port 3000 by default. Set the `PORT` environment variable to change it.

## Usage

Upload an image to the `/analyze` endpoint:

```bash
curl -F "image=@logo.png" http://localhost:3000/analyze
```

Optionally specify how many colors to extract (default 5):

```bash
curl -F "image=@logo.png" -F "maxColors=3" http://localhost:3000/analyze
```

### Response

```json
{
  "filename": "logo.png",
  "totalColors": 3,
  "colors": [
    {
      "hex": "#ff5733",
      "rgb": { "r": 255, "g": 87, "b": 51 },
      "hsl": { "h": 11, "s": 100, "l": 60 },
      "name": "red",
      "dominance": 45.2
    }
  ]
}
```

## Tests

```bash
npm test
```
