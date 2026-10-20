# Photobooth

A browser photobooth built with React. Press **Start**, follow the 3-2-1 countdown, and the app takes
4 photos from your webcam. It combines them into a classic vertical photo strip with today's date,
which you can download as a PNG.

Everything runs in the browser: no backend, and no photos leave your computer.

## Features (PB-001)

- Live, mirrored (selfie-style) camera preview
- Friendly message when camera permission is denied or no camera is found
- 3-2-1 countdown before each of the 4 photos; Start is disabled while a session runs
- Photos are mirrored like the preview, so what you see is what you get
- Photo strip with white border, spacing and a date footer
- Download the strip as PNG, or Retake to start over

## Tech stack

- [Vite](https://vite.dev/) + [React](https://react.dev/), plain JavaScript
- Plain CSS, one file per component
- Browser APIs: `navigator.mediaDevices.getUserMedia`, `<canvas>`, `canvas.toBlob`

## Project structure

```
src/
  App.jsx                 session state: photos, isRunning, layout
  components/
    CameraView.jsx        <video> preview + error message
    Countdown.jsx         3-2-1 overlay, calls onDone() at the end
    PhotoStrip.jsx        strip preview + Download / Retake
  hooks/
    useCamera.js          starts the webcam on mount, stops it on unmount
  utils/
    capture.js            copies one mirrored video frame onto a canvas
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

## Planned

- **PB-002**: filters (black & white, sepia, warm)
- **PB-003**: frames / stickers on the strip
- **PB-004**: deploy to GitHub Pages or Vercel (HTTPS) for MacBook testing
- **PB-005**: mobile-friendly layout
