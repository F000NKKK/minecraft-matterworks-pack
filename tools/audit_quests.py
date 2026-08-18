#!/usr/bin/env python3
"""Static sanity checks for Matterworks FTB Quests chapters.

The audit intentionally focuses on structural mistakes that are easy to create
while editing SNBT by hand:
- the same item used as a mandatory Main Program task in multiple quests;
- guide tasks duplicating Main Program progression items;
- dependencies pointing to unknown quest IDs;
- dependencies from an earlier phase to a later phase;
- a later phase rewarding an item that was already a progression gate earlier.

It uses only the Python standard library and does not try to implement a full
SNBT parser. The quest files use a deliberately regular layout, so balanced
brace/bracket extraction is sufficient and fails loudly when that layout is
broken.
"""

from __future__ import annotations

import re
import sys
from dataclasses import dataclass
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CHAPTERS = ROOT / "config" / "ftbquests" / "quests" / "chapters"

ID_RE = re.compile(r'\bid:\s*"(\d{16})"')
ITEM_RE = re.compile(r'\bitem:\s*"([^"]+)"')
DEPENDENCY_RE = re.compile(r'\bdependencies:\s*\[([^\]]*)\]', re.S)
QUOTED_ID_RE = re.compile(r'"(\d{16})"')
PHASE_RE = re.compile(r"phase_(\d+)_")


@dataclass(frozen=True)
class Quest:
    chapter: Path
    quest_id: str
    phase: int | None
    guide: bool
    task_items: tuple[str, ...]
    reward_items: tuple[str, ...]
    dependencies: tuple[str, ...]


def extract_balanced(text: str, start: int, opener: str, closer: str) -> tuple[str, int]:
    depth = 0
    in_string = False
    escaped = False
    for i in range(start, len(text)):
        ch = text[i]
        if in_string:
            if escaped:
                escaped = False
            elif ch == "\\":
                escaped = True
            elif ch == '"':
                in_string = False
            continue
        if ch == '"':
            in_string = True
        elif ch == opener:
            depth += 1
        elif ch == closer:
            depth -= 1
            if depth == 0:
                return text[start : i + 1], i + 1
    raise ValueError(f"Unbalanced {opener}{closer} starting at offset {start}")


def quest_blocks(text: str) -> list[str]:
    marker = "quests: ["
    pos = text.find(marker)
    if pos < 0:
        return []
    array_start = text.find("[", pos)
    array, _ = extract_balanced(text, array_start, "[", "]")

    blocks: list[str] = []
    i = 1
    while i < len(array) - 1:
        if array[i] == '"':
            _, i = _skip_string(array, i)
            continue
        if array[i] == "{":
            block, i = extract_balanced(array, i, "{", "}")
            blocks.append(block)
            continue
        i += 1
    return blocks


def _skip_string(text: str, start: int) -> tuple[str, int]:
    escaped = False
    for i in range(start + 1, len(text)):
        ch = text[i]
        if escaped:
            escaped = False
        elif ch == "\\":
            escaped = True
        elif ch == '"':
            return text[start : i + 1], i + 1
    raise ValueError(f"Unterminated string at offset {start}")


def section_items(block: str, marker: str) -> tuple[str, ...]:
    pos = block.find(marker)
    if pos < 0:
        return ()
    array_start = block.find("[", pos)
    if array_start < 0:
        return ()
    section, _ = extract_balanced(block, array_start, "[", "]")
    return tuple(ITEM_RE.findall(section))


def parse_chapter(path: Path) -> list[Quest]:
    text = path.read_text(encoding="utf-8")
    phase_match = PHASE_RE.search(path.name)
    phase = int(phase_match.group(1)) if phase_match else None
    guide = path.name.startswith("guide_")
    result: list[Quest] = []

    for block in quest_blocks(text):
        id_match = ID_RE.search(block)
        if not id_match:
            raise ValueError(f"Quest without a 16-digit id in {path}")
        dep_match = DEPENDENCY_RE.search(block)
        dependencies = tuple(QUOTED_ID_RE.findall(dep_match.group(1))) if dep_match else ()
        result.append(
            Quest(
                chapter=path,
                quest_id=id_match.group(1),
                phase=phase,
                guide=guide,
                task_items=section_items(block, "tasks:"),
                reward_items=section_items(block, "rewards:"),
                dependencies=dependencies,
            )
        )
    return result


def main() -> int:
    quests: list[Quest] = []
    for path in sorted(CHAPTERS.glob("*.snbt")):
        quests.extend(parse_chapter(path))

    errors: list[str] = []
    by_id: dict[str, Quest] = {}
    for quest in quests:
        if quest.quest_id in by_id:
            errors.append(
                f"duplicate quest id {quest.quest_id}: {by_id[quest.quest_id].chapter.name} and {quest.chapter.name}"
            )
        else:
            by_id[quest.quest_id] = quest

    main_item_owners: dict[str, Quest] = {}
    for quest in quests:
        if quest.guide:
            continue
        for item in quest.task_items:
            previous = main_item_owners.get(item)
            if previous and previous.quest_id != quest.quest_id:
                errors.append(
                    f"duplicate Main Program task item {item}: "
                    f"{previous.chapter.name}/{previous.quest_id} and {quest.chapter.name}/{quest.quest_id}"
                )
            else:
                main_item_owners[item] = quest

    for quest in quests:
        if quest.guide:
            for item in quest.task_items:
                owner = main_item_owners.get(item)
                if owner:
                    errors.append(
                        f"guide duplicates progression item {item}: "
                        f"{quest.chapter.name}/{quest.quest_id} overlaps {owner.chapter.name}/{owner.quest_id}"
                    )

        if not quest.guide and quest.phase is not None:
            for item in quest.reward_items:
                owner = main_item_owners.get(item)
                if (
                    owner is not None
                    and owner.phase is not None
                    and owner.phase < quest.phase
                ):
                    errors.append(
                        f"late reward repeats earlier progression item {item}: "
                        f"phase {quest.phase} {quest.chapter.name}/{quest.quest_id} rewards item gated in "
                        f"phase {owner.phase} {owner.chapter.name}/{owner.quest_id}"
                    )

        for dependency in quest.dependencies:
            target = by_id.get(dependency)
            if target is None:
                errors.append(
                    f"unknown dependency {dependency}: {quest.chapter.name}/{quest.quest_id}"
                )
                continue
            if (
                quest.phase is not None
                and target.phase is not None
                and target.phase > quest.phase
            ):
                errors.append(
                    f"backward phase dependency: phase {quest.phase} quest {quest.quest_id} "
                    f"depends on phase {target.phase} quest {dependency}"
                )

    if errors:
        print("Matterworks quest audit FAILED:")
        for error in errors:
            print(f"  - {error}")
        return 1

    main_quests = sum(1 for q in quests if not q.guide)
    guide_quests = sum(1 for q in quests if q.guide)
    print(
        f"Matterworks quest audit OK: {main_quests} Main Program quests, "
        f"{guide_quests} guide quests, {len(main_item_owners)} unique progression task items"
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
