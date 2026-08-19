#!/usr/bin/env python3
"""Static repository validation for Matterworks.

This validates invariants that can be proven from the Git checkout itself.
Runtime recipe registration, mod interoperability, fluid/tag resolution and
multiblock formation still belong to the local Minecraft runtime gate.
"""

from __future__ import annotations

import hashlib
import json
import math
import re
import sys
from collections import defaultdict
from pathlib import Path

try:
    import tomllib
except ImportError as exc:  # pragma: no cover
    raise SystemExit("Matterworks validation requires Python 3.11+ (tomllib)") from exc

ROOT = Path(__file__).resolve().parents[2]
RECIPE_ID_RE = re.compile(r"\.id\(\s*['\"]([^'\"]+)['\"]\s*\)")
CRITICAL_PACK_ROOTS = ("kubejs",)
QUEST_ID_RE = re.compile(r'\bid:\s*"(\d{16})"')
DEPENDENCY_RE = re.compile(r'\bdependencies:\s*\[([^\]]*)\]')
QUOTED_ID_RE = re.compile(r'"(\d{16})"')
QUEST_LINE_RE = re.compile(r'\bid:\s*"(\d{16})".*?\bx:\s*(-?\d+(?:\.\d+)?)d.*?\by:\s*(-?\d+(?:\.\d+)?)d')
OWNER_QUEST_RE = re.compile(r"ownerQuest:\s*['\"](\d{16})['\"]")
STAGE_RE = re.compile(r"stage:\s*['\"]([^'\"]+)['\"]")
LONG_EDGE_THRESHOLD = 16.0


def digest(path: Path, algorithm: str) -> str:
    hasher = hashlib.new(algorithm)
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            hasher.update(chunk)
    return hasher.hexdigest()


def load_toml(path: Path) -> dict:
    with path.open("rb") as stream:
        return tomllib.load(stream)


def validate_packwiz(errors: list[str]) -> tuple[int, set[str]]:
    pack_path = ROOT / "pack.toml"
    pack = load_toml(pack_path)
    index_config = pack.get("index", {})
    index_rel = index_config.get("file")
    algorithm = index_config.get("hash-format")
    expected_index_hash = index_config.get("hash")

    if not index_rel or not algorithm or not expected_index_hash:
        errors.append("pack.toml: incomplete [index] configuration")
        return 0, set()

    index_path = ROOT / index_rel
    if not index_path.is_file():
        errors.append(f"pack.toml: index file does not exist: {index_rel}")
        return 0, set()

    try:
        actual_index_hash = digest(index_path, algorithm)
    except ValueError:
        errors.append(f"pack.toml: unsupported hash algorithm: {algorithm}")
        return 0, set()

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
        return 0, set()

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
            errors.append(f"{index_rel}: hash mismatch for {rel} (expected {expected}, actual {actual})")
    return len(entries), seen


def validate_packwiz_coverage(indexed: set[str], errors: list[str]) -> int:
    expected: set[str] = set()
    for root_name in CRITICAL_PACK_ROOTS:
        root = ROOT / root_name
        if root.is_dir():
            expected.update(path.relative_to(ROOT).as_posix() for path in root.rglob("*") if path.is_file())

    mods_root = ROOT / "mods"
    if mods_root.is_dir():
        expected.update(path.relative_to(ROOT).as_posix() for path in mods_root.glob("*.pw.toml") if path.is_file())

    for rel in sorted(expected - indexed):
        errors.append(f"index.toml: pack-owned file is not indexed: {rel}")
    return len(expected)


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
            errors.append(f"duplicate KubeJS recipe id {recipe_id!r}: " + ", ".join(files))
    return len(occurrences)


def validate_dissolver_recipe(rel: str, data: dict, errors: list[str]) -> None:
    input_data = data.get("input")
    output_data = data.get("output")
    if not isinstance(input_data, dict):
        errors.append(f"{rel}: alchemistry:dissolver input must be an object")
        return
    ingredient = input_data.get("ingredient")
    count = input_data.get("count")
    if not isinstance(ingredient, dict) or not (isinstance(ingredient.get("item"), str) or isinstance(ingredient.get("tag"), str)):
        errors.append(f"{rel}: alchemistry:dissolver input.ingredient requires item or tag")
    if not isinstance(count, int) or isinstance(count, bool) or count <= 0:
        errors.append(f"{rel}: alchemistry:dissolver input.count must be positive")

    if not isinstance(output_data, dict):
        errors.append(f"{rel}: alchemistry:dissolver output must be an object")
        return
    rolls = output_data.get("rolls")
    weighted = output_data.get("weighted")
    groups = output_data.get("groups")
    if not isinstance(rolls, int) or isinstance(rolls, bool) or rolls <= 0:
        errors.append(f"{rel}: alchemistry:dissolver output.rolls must be positive")
    if not isinstance(weighted, bool):
        errors.append(f"{rel}: alchemistry:dissolver output.weighted must be boolean")
    if not isinstance(groups, list) or not groups:
        errors.append(f"{rel}: alchemistry:dissolver output.groups must be non-empty")
        return
    for group_index, group in enumerate(groups):
        if not isinstance(group, dict):
            errors.append(f"{rel}: alchemistry:dissolver output.groups[{group_index}] must be an object")
            continue
        probability = group.get("probability")
        results = group.get("results")
        if not isinstance(probability, (int, float)) or isinstance(probability, bool) or probability < 0 or probability > 100:
            errors.append(f"{rel}: alchemistry:dissolver output.groups[{group_index}].probability must be in [0, 100]")
        if not isinstance(results, list) or not results:
            errors.append(f"{rel}: alchemistry:dissolver output.groups[{group_index}].results must be non-empty")
            continue
        for result_index, result in enumerate(results):
            if not isinstance(result, dict):
                errors.append(f"{rel}: alchemistry:dissolver output.groups[{group_index}].results[{result_index}] must be an object")
                continue
            item = result.get("item")
            result_count = result.get("count")
            if not isinstance(item, str) or ":" not in item:
                errors.append(f"{rel}: alchemistry:dissolver result item must be a namespaced item ID")
            if not isinstance(result_count, int) or isinstance(result_count, bool) or result_count <= 0:
                errors.append(f"{rel}: alchemistry:dissolver result count must be positive")


def validate_json_files(errors: list[str]) -> int:
    kubejs_root = ROOT / "kubejs"
    assets_root = kubejs_root / "assets"
    checked = 0
    for path in sorted(kubejs_root.rglob("*.json")):
        checked += 1
        rel = path.relative_to(ROOT).as_posix()
        try:
            data = json.loads(path.read_text(encoding="utf-8"))
        except json.JSONDecodeError as exc:
            errors.append(f"{rel}: invalid JSON: {exc}")
            continue
        if not isinstance(data, dict):
            continue
        if data.get("type") == "alchemistry:dissolver":
            validate_dissolver_recipe(rel, data, errors)
        try:
            path.relative_to(assets_root)
        except ValueError:
            continue
        textures = data.get("textures")
        if not isinstance(textures, dict):
            continue
        for texture in textures.values():
            if not isinstance(texture, str) or texture.startswith("#"):
                continue
            namespace, separator, texture_path = texture.partition(":")
            if not separator:
                namespace, texture_path = "minecraft", texture
            if namespace != "kubejs":
                continue
            texture_file = assets_root / namespace / "textures" / f"{texture_path}.png"
            if not texture_file.is_file():
                errors.append(f"{rel}: missing local texture {texture!r}")
    return checked


def extract_quest_records(path: Path) -> tuple[set[str], dict[str, list[str]], dict[str, tuple[float, float]]]:
    text = path.read_text(encoding="utf-8")
    ids = set(QUEST_ID_RE.findall(text))
    deps: dict[str, list[str]] = {}
    coords: dict[str, tuple[float, float]] = {}

    lines = text.splitlines()
    current_multiline_id: str | None = None
    multiline_x: float | None = None
    for line in lines:
        match = QUEST_LINE_RE.search(line)
        if match:
            qid, x, y = match.groups()
            coords[qid] = (float(x), float(y))
        elif current_multiline_id is None:
            id_match = re.search(r'^\s*id:\s*"(\d{16})"\s*$', line)
            if id_match:
                current_multiline_id = id_match.group(1)
        elif multiline_x is None:
            x_match = re.search(r'^\s*x:\s*(-?\d+(?:\.\d+)?)d\s*$', line)
            if x_match:
                multiline_x = float(x_match.group(1))
        else:
            y_match = re.search(r'^\s*y:\s*(-?\d+(?:\.\d+)?)d\s*$', line)
            if y_match:
                coords[current_multiline_id] = (multiline_x, float(y_match.group(1)))
                current_multiline_id = None
                multiline_x = None

    for line in lines:
        owner_match = re.search(r'\bid:\s*"(\d{16})"', line)
        dep_match = DEPENDENCY_RE.search(line)
        if owner_match and dep_match:
            deps[owner_match.group(1)] = QUOTED_ID_RE.findall(dep_match.group(1))

    return ids, deps, coords


def validate_quests(errors: list[str]) -> tuple[int, int]:
    chapters_root = ROOT / "config" / "ftbquests" / "quests" / "chapters"
    if not chapters_root.is_dir():
        errors.append("FTB Quests chapters directory is missing")
        return 0, 0

    all_ids: dict[str, list[str]] = defaultdict(list)
    quest_deps: dict[str, list[str]] = {}
    quest_coords: dict[str, tuple[float, float]] = {}
    quest_file: dict[str, str] = {}
    main_quests: set[str] = set()
    guide_quests: set[str] = set()
    chapter_count = 0

    for path in sorted(chapters_root.glob("*.snbt")):
        chapter_count += 1
        rel = path.relative_to(ROOT).as_posix()
        ids, deps, coords = extract_quest_records(path)
        is_main = path.name.startswith("age_")
        is_guide = path.name.startswith("guide_")
        for qid in ids:
            all_ids[qid].append(rel)
            quest_file[qid] = rel
        quest_deps.update(deps)
        quest_coords.update(coords)
        if is_main:
            main_quests.update(ids)
        if is_guide:
            guide_quests.update(ids)

    for qid, files in sorted(all_ids.items()):
        if len(files) > 1:
            errors.append(f"FTB Quests duplicate 16-digit id {qid}: {', '.join(files)}")

    known_ids = set(all_ids)
    for qid, deps in sorted(quest_deps.items()):
        for dep in deps:
            if dep not in known_ids:
                errors.append(f"{quest_file.get(qid, qid)}: quest {qid} depends on missing id {dep}")
            if qid in main_quests and dep in guide_quests:
                errors.append(f"{quest_file.get(qid, qid)}: Main Program quest {qid} depends on guide quest {dep}")

    visiting: set[str] = set()
    visited: set[str] = set()

    def visit(qid: str, trail: list[str]) -> None:
        if qid in visited:
            return
        if qid in visiting:
            cycle = trail[trail.index(qid):] + [qid] if qid in trail else trail + [qid]
            errors.append("FTB Quests dependency cycle: " + " -> ".join(cycle))
            return
        visiting.add(qid)
        for dep in quest_deps.get(qid, []):
            if dep in known_ids:
                visit(dep, trail + [qid])
        visiting.remove(qid)
        visited.add(qid)

    for qid in sorted(known_ids):
        visit(qid, [])

    by_position: dict[tuple[str, float, float], list[str]] = defaultdict(list)
    for qid, (x, y) in quest_coords.items():
        if qid not in main_quests:
            continue
        rel = quest_file.get(qid, "")
        by_position[(rel, x, y)].append(qid)
    for (rel, x, y), ids in sorted(by_position.items()):
        if len(ids) > 1:
            errors.append(f"{rel}: overlapping Main Program quests at ({x}, {y}): {', '.join(ids)}")

    for qid, deps in sorted(quest_deps.items()):
        if qid not in main_quests or qid not in quest_coords:
            continue
        x, y = quest_coords[qid]
        for dep in deps:
            if dep not in main_quests or dep not in quest_coords:
                continue
            dx, dy = x - quest_coords[dep][0], y - quest_coords[dep][1]
            distance = math.hypot(dx, dy)
            if distance > LONG_EDGE_THRESHOLD:
                errors.append(f"{quest_file.get(qid, qid)}: suspicious long edge {dep} -> {qid} ({distance:.1f} units)")

    research_path = ROOT / "kubejs" / "server_scripts" / "matterworks" / "progression" / "research.js"
    if research_path.is_file():
        research_text = research_path.read_text(encoding="utf-8")
        for owner in sorted(set(OWNER_QUEST_RE.findall(research_text))):
            if owner not in known_ids:
                errors.append(f"research.js: ownerQuest {owner} does not exist in FTB Quests")
        stage_occurrences: dict[str, int] = defaultdict(int)
        for stage in STAGE_RE.findall(research_text):
            stage_occurrences[stage] += 1
        for stage, count in sorted(stage_occurrences.items()):
            if count > 1:
                errors.append(f"research.js: duplicate research stage {stage!r} ({count} registrations)")

    return chapter_count, len(known_ids)


def main() -> int:
    errors: list[str] = []
    indexed_files, indexed_paths = validate_packwiz(errors)
    pack_owned_files = validate_packwiz_coverage(indexed_paths, errors)
    recipe_ids = validate_recipe_ids(errors)
    json_files = validate_json_files(errors)
    quest_chapters, quest_ids = validate_quests(errors)

    if errors:
        print("Matterworks repository validation FAILED:", file=sys.stderr)
        for error in errors:
            print(f"  - {error}", file=sys.stderr)
        return 1

    print(
        "Matterworks repository validation passed: "
        f"{indexed_files} Packwiz entries, "
        f"{pack_owned_files} critical pack-owned files covered, "
        f"{recipe_ids} explicit recipe IDs, "
        f"{json_files} JSON files checked, "
        f"{quest_chapters} quest chapters / {quest_ids} unique 16-digit IDs checked."
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
