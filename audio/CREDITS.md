# Splash intro sounds

The whoosh, impact-driver rattle, drill-bite impact, and trailer riser used in the HVAC Ready splash intro were **synthesized for this app** (Python / NumPy offline render for the one-shot files, Web Audio for the live riser; one-shots then ffmpeg `loudnorm` to about −16 LUFS, encoded as mono mp3 + m4a).

Freesound and Pixabay both blocked automated downloads from this environment (HTTP 403; Pixabay presented a Cloudflare challenge), so no third-party recordings were copied. The files in this folder are original:

| File | Role | How it was made | License |
|---|---|---|---|
| `splash-whoosh.mp3` / `.m4a` | Torch / flame sweep at ~0.8 s | Filtered noise with a falling band (airy high end into a warm low flame rumble) and a short 0.58 s envelope | Original, made for HVAC Ready |
| `splash-rattle.mp3` / `.m4a` | Impact-driver burst under the spark sweep (~0.8 s) | Rising motor body plus a run of sharp metallic ratchet hits (~0.58 s) | Original, made for HVAC Ready |
| `splash-impact.mp3` / `.m4a` | Drill bite / metal hit on the tagline drop at 1.4 s | Short chuck chatter, a grind as the bit catches, then a hard transient and decaying steel-like modal partials (~0.62 s) | Original, made for HVAC Ready |

The **riser** (low drone that climbs and lands on C, the root of the menu / “chill” theme) is synthesized live in the Web Audio API at playback time so it can resolve into the main song. It is not a third-party recording.

Each encoded one-shot is well under 60 KB. Playback goes through the app's mixer (master + a sensible bus) and stays silent if Sound is muted or the AudioContext is not running.

Research notes (not used): CC0 candidates on Freesound included “Basic Fire whoosh” (LookIMadeAThing, 260554), “Flamethrower” (SamsterBirdies, 490166), and “Metal Impact” (RyanKingArt, 620077, explicitly Creative Commons 0). Pages were reviewed; the files themselves could not be downloaded.


# UI click

| File | Role | Source | License |
|---|---|---|---|
| `ui-click.mp3` / `.m4a` | Soft mouse-click for UI taps (short, low volume; no synth beep) | Mixkit “Mouse click close” (asset 1113), trimmed to the down/up click and peak-normalized to −16 dBFS | [Mixkit License](https://mixkit.co/license/#sfxFree) (free to use in this app) |
