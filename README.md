<p align="center">
  <img src="/src/public/logo.svg" alt="yt-iptv-hono" width="200" />
</p>

<h1 align="center">yt-iptv-hono</h1>

<p align="center">
  A lightweight YouTube to IPTV streaming server built with Hono, Bun, Nunjucks, and TailwindCSS (DaisyUI). 
</p>

<p align="center">
  <strong>Transform your non-smart TV into a YouTube streaming device via IPTV!</strong>
</p>

---

## Overview

This project is designed to generate an M3U file for IPTV players, allowing you to stream YouTube videos directly to a TV via your home network. It includes a web interface where users can search for and select YouTube videos, dynamically creating IPTV streams for them.

### Why?

Many older TVs do not have access to modern streaming services like YouTube. **yt-iptv-hono** offers a workaround by leveraging IPTV streams, allowing these older devices to play YouTube content over a shared home network.

---

## Features

- **YouTube to IPTV**: Generate M3U files that IPTV players can use to stream YouTube videos.
- **Web Interface**: Built using Nunjucks, DaisyUI, and TailwindCSS for a clean, responsive UI.
- **Search and Play**: Search for YouTube videos directly from the web interface and add them to the playlist.
- **Supports Legacy TVs**: Stream YouTube videos to non-smart TVs over a shared Wi-Fi network.
- **Dynamic Playlist**: The M3U file dynamically updates the YouTube video being played.

---

## Usage

### Requirements
- Ensure your TV and the device running this server are on the same Wi-Fi network.
- You'll need to regenerate and re-download the M3U file if the device's IP address changes.

### Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/yt-iptv-hono.git
    cd yt-iptv-hono
    ```

2. Install dependencies:
    ```bash
    bun install
    ```

3. Start the server:
    ```bash
    bun run src/index.ts
    ```

4. Access the web interface at `http://localhost:3000` to search and select YouTube videos.

### M3U File Generation

- After starting the server, download the M3U file from the web interface. This file can be used by your TV's IPTV player to stream YouTube videos.
- If the device's IP address changes, you'll need to regenerate and re-download the M3U file.

---

## Limitations

- **Same Wi-Fi Network**: The TV and server device must be connected to the same Wi-Fi network (unless deployed).
- **Dynamic IP**: If the server's device IP changes (common on home networks), you'll need to download and update the M3U file again.
- **YouTube Video Playback**: Limited to the capabilities of the IPTV player on your TV.

---

## Remove Wi-Fi Network Limitation

If you wish to remove the limitation of requiring the same Wi-Fi network, you can deploy this app. However, YouTube's restrictions may prevent direct video streaming when deployed. Visit the [@distube/ytdl-core](https://github.com/distubejs/ytdl-core) GitHub repository to explore how to handle these limitations.

---

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.
