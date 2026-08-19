#!/usr/bin/env python3

from __future__ import annotations

import importlib.util
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]


def load_module(name: str, relative_path: str):
    path = ROOT / relative_path
    spec = importlib.util.spec_from_file_location(name, path)
    if spec is None or spec.loader is None:
        raise RuntimeError(f"Could not load {path}")
    module = importlib.util.module_from_spec(spec)
    sys.modules[name] = module
    spec.loader.exec_module(module)
    return module


layout = load_module(
    "matterworks_quest_layout_test",
    ".github/scripts/validate-quest-layout.py",
)


class QuestLayoutParserTests(unittest.TestCase):
    def parse_text(self, text: str):
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / "chapter.snbt"
            path.write_text(text, encoding="utf-8")
            return layout.parse(path)

    def test_parses_compact_quest_objects(self):
        coords, deps = self.parse_text(
            '''{
                quests: [
                    { dependencies: ["1000000000000000"] id: "2000000000000001" x: 1.0d y: 2.0d tasks: [{ id: "3000000000000001", type: "item" }] }
                    { dependencies: ["2000000000000001"] id: "2000000000000002" x: 1.0d y: 6.0d }
                ]
            }'''
        )

        self.assertEqual(coords["2000000000000001"], (1.0, 2.0))
        self.assertEqual(coords["2000000000000002"], (1.0, 6.0))
        self.assertEqual(deps["2000000000000001"], ["1000000000000000"])
        self.assertEqual(deps["2000000000000002"], ["2000000000000001"])

    def test_parses_multiline_quest_objects_without_confusing_task_ids(self):
        coords, deps = self.parse_text(
            '''{
                quests: [
                    {
                        dependencies: ["1000000000000000"]
                        id: "2000000000000001"
                        title: "Root"
                        x: -3.5d
                        y: 4.0d
                        tasks: [
                            { id: "3000000000000001", item: "minecraft:iron_ingot", type: "item" }
                        ]
                    }
                    {
                        dependencies: ["2000000000000001"]
                        id: "2000000000000002"
                        x: 3.5d
                        y: 8.0d
                    }
                ]
            }'''
        )

        self.assertEqual(set(coords), {"2000000000000001", "2000000000000002"})
        self.assertEqual(coords["2000000000000001"], (-3.5, 4.0))
        self.assertNotIn("3000000000000001", coords)
        self.assertEqual(deps["2000000000000002"], ["2000000000000001"])

    def test_top_level_extractor_ignores_nested_task_objects(self):
        text = '''{
            quests: [
                { id: "2000000000000001" x: 0.0d y: 0.0d tasks: [{ id: "3000000000000001" }] }
                { id: "2000000000000002" x: 0.0d y: 4.0d }
            ]
        }'''

        objects = layout.extract_quest_objects(text)
        self.assertEqual(len(objects), 2)


if __name__ == "__main__":
    unittest.main()
