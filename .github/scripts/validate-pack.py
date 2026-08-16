#!/usr/bin/env python3
"""Static repository validation for Matterworks.

This intentionally validates only invariants that can be checked from the Git
checkout itself. Runtime recipe registration, mod interoperability and
multiblock formation still belong to the local Minecraft runtime gate.
"""

from __future__ import annotations

import hashlib
import json
import re
import sys
from collections import defaultdict
from pathlib import Path

try:
    import tomllib
except ImportError as exc:  # pragma: no cover - explicit developer diagnostic
    raise SystemExit("Matterworks validation requires Python 3.11+ (tomllib)") from exc


ROOT = Path(__file__).resolve().parents[2]
RECIPE_ID_RE = re.compile(r"\.id\(\s*['\"]([^'\"]+)['\"]\s*\)")


def digest(path: Path, algorithm: str) -> str:
    hasher = hashlib.new(algorithm)
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            hasher.update(chunk)
    return hasher.hexdigest()


def load_toml(path: Path) -> dict:
    with path.open("rb") as stream:
        return tomllib.load(stream)


def validate_packwiz(errors: list[str]) -> int:
    pack_path = ROOT / "pack.toml"
    pack = load_toml(pack_path)

    index_config = pack.get("index", {})
    index_rel = index_config.get("file")
    algorithm = index_config.get("hash-format")
    expected_index_hash = index_config.get("hash")

    if not index_rel or not algorithm or not expected_index_hash:
        errors.append("pack.toml: incomplete [index] configuration")
        return 0

    index_path = ROOT / index_rel
    if not index_path.is_file():
        errors.append(f"pack.toml: index file does not exist: {index_rel}")
        return 0

    try:
        actual_index_hash = digest(index_path, algorithm)
    except ValueError:
        errors.append(f"pack.toml: unsupported hash algorithm: {algorithm}")
        return 0

    if actual_index_hash != expected_index_hash:
        errors.append(
            "pack.toml: index hash mismatch "
            f"(expected {expected_index_hash}, actual {actual_index_hash})"
        )

    index = load_toml(index_path)
    index_algorithm = index.get("hash-format")
    if index_algorithm != algorithm:
        errors.append(
            f"{index_rel}: hash-format {index_algorithm!r} does not match pack.toml {algorithm!r}"
        )
        return 0

    entries = index.get("files", [])
    seen: set[str] = set()

    for entry in entries:
        rel = entry.get("file")
        expected = entry.get("hash")
        if not rel or not expected:
            errors.append(f"{index_rel}: malformed file entry: {entry!r}")
            continue

        if rel in seen:
            errors.append(f"{index_rel}: duplicate file entry: {rel}")
            continue
        seen.add(rel)

        path = ROOT / rel
        if not path.is_file():
            errors.append(f"{index_rel}: indexed file is missing: {rel}")
            continue

        actual = digest(path, algorithm)
        if actual != expected:
            errors.append(
                f"{index_rel}: hash mismatch for {rel} "
                f"(expected {expected}, actual {actual})"
            )

    return len(entries)


def validate_recipe_ids(errors: list[str]) -> int:
    occurrences: dict[str, list[str]] = defaultdict(list)
    scripts_root = ROOT / "kubejs"

    for path in sorted(scripts_root.rglob("*.js")):
        text = path.read_text(encoding="utf-8")
        rel = path.relative_to(ROOT).as_posix()
        for recipe_id in RECIPE_ID_RE.findall(text):
            occurrences[recipe_id].append(rel)

    for recipe_id, files in sorted(occurrences.items()):
        if len(files) > 1:
            errors.append(
                f"duplicate KubeJS recipe id {recipe_id!r}: " + ", ".join(files)
            )

    return len(occurrences)


def validate_json_assets(errors: list[str]) -> int:
    assets_root = ROOT / "kubejs" / "assets"
    checked = 0

    for path in sorted(assets_root.rglob("*.json")):
        checked += 1
        rel = path.relative_to(ROOT).as_posix()
        try:
            data = json.loads(path.read_text(encoding="utf-8"))
        except json.JSONDecodeError as exc:
            errors.append(f"{rel}: invalid JSON: {exc}")
            continue

        textures = data.get("textures")
        if not isinstance(textures, dict):
            continue

        for texture in textures.values():
            if not isinstance(texture, str) or texture.startswith("#"):
                continue

            namespace, separator, texture_path = texture.partition(":")
            if not separator:
                namespace = "minecraft"
                texture_path = texture

            # Only validate assets owned by this repository. References to
            # Create/Mekanism/etc. are resolved by those mods at runtime.
            if namespace != "kubejs":
                continue

            texture_file = assets_root / namespace / "textures" / f"{texture_path}.png"
            if not texture_file.is_file():
                errors.append(f"{rel}: missing local texture {texture!r}")

    return checked


def main() -> int:
    errors: list[str] = []

    indexed_files = validate_packwiz(errors)
    recipe_ids = validate_recipe_ids(errors)
    json_assets = validate_json_assets(errors)

    if errors:
        print("Matterworks repository validation FAILED:", file=sys.stderr)
        for error in errors:
            print(f"  - {error}", file=sys.stderr)
        return 1

    print(
        "Matterworks repository validation passed: "
        f"{indexed_files} Packwiz entries, "
        f"{recipe_ids} explicit recipe IDs, "
        f"{json_assets} JSON assets checked."
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
