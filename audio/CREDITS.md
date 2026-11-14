# Splash intro sounds

The HVAC Ready trailer one-shots in this folder are mixes of **Mixkit** recordings (free Mixkit License, same family as the UI click). They were trimmed, layered, lightly equalized, peak-limited, and loudnormed for a trailer-style mix, then encoded as stereo mp3 + m4a. The in-app intro video stays muted; these files play on cue via `Sound.playSplash` after the iOS “Tap to start” unlock.

Cue times (v45, 8.80 s trailer; tighter mix, no overlap):

| File | Cue | Role | Mix sources (Mixkit) | Target |
|---|---|---|---|---|
| `splash-whoosh.mp3` / `.m4a` | 1.00 s (0.24 s clip, ends before 1.25) | Tight torch whoosh on the flare | 1345 Short fire whoosh, 1342 Ignition metal fire, 1492 Cinematic whoosh fast transition (high-passed, no long burning tail) | peak ≈ −2.2 dBTP |
| `splash-rattle.mp3` / `.m4a` | 1.25 s (0.82 s clip, faded out by ≈ 2.07) | Welding sparks / crackle locked to the spark burst | 824 Welding and sparks, with a light 833 Metal hammer tick (high-passed so it does not muddy the slam) | peak ≈ −2.7 dBTP |
| `splash-impact.mp3` / `.m4a` | 2.20 s (attack at 0.06 s in the clip; 1.85 s polished ring tail) | Stamp slam on the impact frame, richer sub, clean trailer tail | 2980 Factory metal hard hit, 2908 Movie trailer epic impact (leaner mid), 2900 Movie logo intro impact, 2609 Whoosh resonating metallic hit, 833 Metal hammer hit, plus a deeper 34–68 Hz kick | peak −1.1 dBTP |

License: [Mixkit License](https://mixkit.co/license/#sfxFree) (free to use in this app).

The optional **riser** in `preview-intro.html` (not the live launch trailer) is still synthesized in the Web Audio API. It is not used on the shipped intro.

# Music beds and stings (v44 loudness pass)

Menu / quiz / arcade / study / sim / exam loops were two-pass `loudnorm`’d to ≈ −16 LUFS (true peak under −1.5 dB) so the menu song stays clearly audible but sits under the intro and game SFX. `ending` and `fanfare-pass` stings were lifted from ≈ −19 LUFS to ≈ −16 LUFS. `ui-click` was left at its designed subtle level (true peak ≈ −16 dBFS).

# UI click

| File | Role | Source | License |
|---|---|---|---|
| `ui-click.mp3` / `.m4a` | Soft mouse-click for UI taps (short, low volume; no synth beep) | Mixkit “Mouse click close” (asset 1113), trimmed to the down/up click and peak-normalized to −16 dBFS | [Mixkit License](https://mixkit.co/license/#sfxFree) (free to use in this app) |

## v47 intro SFX (hvac-v47)

App stems `splash-impact`, `splash-drill`, and `splash-torch` are mixed from the following, locked to the 9.2 s full-bleed intro (slam 1.45 s, impact-driver 2.05 s, torch 3.20 s). No music in the intro. Integrated loudness of the preview mix is about −14 LUFS, true peak −1.2 dBTP.

### Mixkit Sound Effects Free License (sfxFree)

https://mixkit.co/license/ — free for commercial and personal use in an end product; not redistributed on their own. Attribution is not required; it is given here for traceability.

| ID | Title | Use |
|----|-------|-----|
| 817 | Garage pneumatic screwer | Impact-driver / rattle-gun body |
| 855 | Electrical drill | Driver metallic buzz |
| 815 | Quick drilling machine hum | Driver body hum |
| 1342 | Ignition metal fire | Torch ignite pop |
| 1341 | Intense long fire beam | Sustained torch roar |
| 1345 | Short fire whoosh | Torch onset |
| 824 | Welding and sparks | Spark flicks under driver and torch |
| 2980 | Factory metal hard hit | Slam body |
| 833 | Metal hammer hit | Slam transient |
| 2908 | Movie trailer epic impact | Slam weight |
| 2900 | Movie logo intro impact | Slam layer |
| 2609 | Whoosh resonating metallic hit | Slam ring-out |

Local copies: `/workspace/report/sfx/`. Mix script: `/workspace/report/intro-v47/mix_sfx.py`.
