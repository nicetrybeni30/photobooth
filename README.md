# Photobooth

A browser photobooth built with React, styled like a vintage stainless-steel mall photobooth in a
red-curtain room. Pick a filter, pose for 4 photos with a 3-2-1 countdown, choose your paper color,
and watch your strip "print" out of the slot. Then download it as a PNG.

Everything runs in the browser: no backend, and no photos leave your computer.

## How it works

The screen walks you through the same 4 steps as the engraved plate on the booth:

1. **Choose a filter**: Color, B&W, Sepia or Warm, previewed live on the camera
2. **Strike your best pose**: 3-2-1 countdown and a flash for each of the 4 photos;
   the slots at the bottom of the screen fill up as you go
3. **Pick your paper**: White, Black, Pink or Cream, with a live strip preview
4. **Grab your print**: the strip slides out of the print slot; Download PNG or Retake

## Features

- Live, mirrored (selfie-style) camera preview, center-cropped to a classic 4:3 frame
- Friendly message when camera permission is denied or no camera is found
- Photos are mirrored and cropped like the preview, so what you see is what you get
- Filters are color matrices: the same numbers drive the live preview (SVG `feColorMatrix`)
  and the saved photo (canvas pixels), so they match in every browser, including Safari
- Strip with paper-colored border, a script logo and today's date
- Download the strip as PNG, or Retake to start over

## Tech stack

- [Vite](https://vite.dev/) + [React](https://react.dev/), plain JavaScript
- Plain CSS, one file per component (brushed steel and curtain are pure CSS gradients)
- Google Fonts: Great Vibes (script logo) and Cormorant Garamond (engraved text)
- Browser APIs: `navigator.mediaDevices.getUserMedia`, `<canvas>`, `canvas.toBlob`

## Project structure

```
src/
  App.jsx                 the step flow (filter → shoot → paper → print) and booth layout
  components/
    CameraView.jsx        <video> preview (with live filter) + error message
    ChoicePicker.jsx      row of options, used for filters and paper colors
    Countdown.jsx         3-2-1 overlay, calls onDone() at the end
    FilterDefs.jsx        hidden SVG filters used by the live preview
    PrintTray.jsx         print slot the strip slides out of
    ShotSlots.jsx         the 4 photo slots along the bottom of the screen
    StepPlate.jsx         engraved steel plate with the 4 steps
  hooks/
    useCamera.js          starts the webcam on mount, stops it on unmount
  utils/
    capture.js            copies one mirrored, 4:3-cropped, filtered frame onto a canvas
    download.js           saves a canvas as PNG
    filters.js            filter color matrices
    papers.js             paper colors
    strip.js              draws the 4 photos + footer onto one canvas
```

## Running locally

Requires Node.js 20.19+ (or 22+).

```bash
npm install
npm run dev
```

Open **http://localhost:5173**. When running inside WSL, open the same URL in your Windows browser:
WSL2 forwards `localhost` to Windows automatically.

> If `npm install` fails with `Cannot read properties of null (reading 'edgesOut')`, that's a bug in
> npm 10. Update npm (`npm install -g npm@11`) or run `npx npm@11 install`.

Other scripts: `npm run build` (production build into `dist/`), `npm run preview` (serve that build),
`npm run lint` (oxlint).

## Testing without a webcam

Chrome can pretend to have a camera. It shows a green test pattern with a moving shape and a timer.

1. **Close every Chrome window** (Chrome ignores these flags if it's already running), or use the
   separate profile in the commands below, which lets you keep your normal Chrome open.
2. Start Chrome with the fake-camera flags.

**Windows (PowerShell):**

```powershell
& "C:\Program Files\Google\Chrome\Application\chrome.exe" `
  --use-fake-device-for-media-stream `
  --use-fake-ui-for-media-stream `
  --user-data-dir="$env:TEMP\chrome-fake-cam" `
  http://localhost:5173
```

**Windows (Command Prompt / Win+R):**

```bat
"C:\Program Files\Google\Chrome\Application\chrome.exe" --use-fake-device-for-media-stream --use-fake-ui-for-media-stream --user-data-dir="%TEMP%\chrome-fake-cam" http://localhost:5173
```

**macOS:**

```bash
open -na "Google Chrome" --args --use-fake-device-for-media-stream --use-fake-ui-for-media-stream \
  --user-data-dir=/tmp/chrome-fake-cam http://localhost:5173
```

What the flags do:

- `--use-fake-device-for-media-stream`: replaces the real camera with a generated test video
- `--use-fake-ui-for-media-stream`: auto-accepts the camera permission prompt

To test the **permission denied** message, leave out `--use-fake-ui-for-media-stream` and click
**Block** on the permission prompt.

## Why the camera only works on localhost or HTTPS

`getUserMedia` only exists in a [secure context](https://developer.mozilla.org/en-US/docs/Web/Security/Secure_Contexts):
pages served over `https://`, or from `localhost` / `127.0.0.1`. Browsers treat camera access as
powerful, so they refuse it on plain `http://` pages, where anyone on the network could tamper with
the page. On an insecure page, `navigator.mediaDevices` is `undefined` and the app shows a message.

That's why `http://localhost:5173` works, but `http://192.168.x.x:5173` from another device does not.
To test on another device, deploy to an HTTPS host (see PB-004).

## Done

- **PB-001**: camera, countdown, 4-photo strip, download, retake
- **PB-002**: filters (Color, B&W, Sepia, Warm)
- **PB-003** (part): paper colors (White, Black, Pink, Cream)
- **PB-006**: booth-style UI (stainless-steel panel, step plate, red curtain room, print slot)

## Planned

- **PB-003** (rest): frames / stickers on the strip
- **PB-004**: deploy to GitHub Pages or Vercel (HTTPS) for MacBook testing
- **PB-005**: mobile-friendly layout (basic small-screen support exists; needs a proper pass)
