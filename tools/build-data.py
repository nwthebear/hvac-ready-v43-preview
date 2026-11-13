#!/usr/bin/env python3
"""Rebuild js/progression-data.js from data/progression.json.
Edit the research JSON (module order, stages, rules), then run:  python3 tools/build-data.py"""
import json, pathlib
root = pathlib.Path(__file__).resolve().parent.parent
d = json.loads((root / "data/progression.json").read_text())
(root / "js/progression-data.js").write_text(
    "/* AUTO-GENERATED from data/progression.json by tools/build-data.py. Do not edit by hand. */\n"
    "window.PROGRESSION = " + json.dumps(d, ensure_ascii=False) + ";\n")
print("wrote js/progression-data.js", len(d["paths"]), "paths")
