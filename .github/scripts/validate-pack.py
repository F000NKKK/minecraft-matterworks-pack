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
CRITICAL_PACK_ROOTS = ("kubejs",)


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
            f"{index_rel}: hash-format {index_algorithm!r} does not match "
            f"pack.toml {algorithm!r}"
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
            errors.append(
                f"{index_rel}: hash mismatch for {rel} "
                f"(expected {expected}, actual {actual})"
            )

    return len(entries), seen


def validate_packwiz_coverage(indexed: set[str], errors: list[str]) -> int:
    """Catch new pack-owned files that were not added to index.toml.

    This deliberately checks only roots whose complete contents are shipped by
    Matterworks. Repository-only paths such as docs/ and .github/ are excluded
    through .packwizignore and are not part of this coverage contract.
    """

    expected: set[str] = set()

    for root_name in CRITICAL_PACK_ROOTS:
        root = ROOT / root_name
        if not root.is_dir():
            continue

        expected.update(
            path.relative_to(ROOT).as_posix()
            for path in root.rglob("*")
            if path.is_file()
        )

    mods_root = ROOT / "mods"
    if mods_root.is_dir():
        expected.update(
            path.relative_to(ROOT).as_posix()
            for path in mods_root.glob("*.pw.toml")
            if path.is_file()
        )

    missing = sorted(expected - indexed)
    for rel in missing:
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
            errors.append(
                f"duplicate KubeJS recipe id {recipe_id!r}: " + ", ".join(files)
            )

    return len(occurrences)


def validate_dissolver_recipe(rel: str, data: dict, errors: list[str]) -> None:
    """Validate the stable subset of Alchemistry Dissolver JSON used by the pack."""

    input_data = data.get("input")
    output_data = data.get("output")

    if not isinstance(input_data, dict):
        errors.append(f"{rel}: alchemistry:dissolver input must be an object")
        return

    ingredient = input_data.get("ingredient")
    count = input_data.get("count")
    if not isinstance(ingredient, dict) or not (
        isinstance(ingredient.get("item"), str)
        or isinstance(ingredient.get("tag"), str)
    ):
        errors.append(
            f"{rel}: alchemistry:dissolver input.ingredient requires item or tag"
        )
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
            errors.append(
                f"{rel}: alchemistry:dissolver output.groups[{group_index}] "
                "must be an object"
            )
            continue

        probability = group.get("probability")
        results = group.get("results")

        if (
            not isinstance(probability, (int, float))
            or isinstance(probability, bool)
            or probability < 0
            or probability > 100
        ):
            errors.append(
                f"{rel}: alchemistry:dissolver output.groups[{group_index}]."
                "probability must be in [0, 100]"
            )

        if not isinstance(results, list) or not results:
            errors.append(
                f"{rel}: alchemistry:dissolver output.groups[{group_index}]."
                "results must be non-empty"
            )
            continue

        for result_index, result in enumerate(results):
            if not isinstance(result, dict):
                errors.append(
                    f"{rel}: alchemistry:dissolver output.groups[{group_index}]."
                    f"results[{result_index}] must be an object"
                )
                continue

            item = result.get("item")
            result_count = result.get("count")

            if not isinstance(item, str) or ":" not in item:
                errors.append(
                    f"{rel}: alchemistry:dissolver output.groups[{group_index}]."
                    f"results[{result_index}].item must be a namespaced item ID"
                )
            if (
                not isinstance(result_count, int)
                or isinstance(result_count, bool)
                or result_count <= 0
            ):
                errors.append(
                    f"{rel}: alchemistry:dissolver output.groups[{group_index}]."
                    f"results[{result_index}].count must be positive"
                )


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

    indexed_files, indexed_paths = validate_packwiz(errors)
    pack_owned_files = validate_packwiz_coverage(indexed_paths, errors)
    recipe_ids = validate_recipe_ids(errors)
    json_files = validate_json_files(errors)

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
        f"{json_files} JSON files checked."
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
