#!/usr/bin/env python3

from __future__ import annotations

import importlib.util
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
    spec.loader.exec_module(module)
    return module


ownership = load_module(
    "matterworks_recipe_ownership_test",
    ".github/scripts/validate-recipe-ownership.py",
)
dependencies = load_module(
    "matterworks_recipe_dependencies_test",
    ".github/scripts/validate-recipe-dependencies.py",
)


class RecipeOwnershipValidatorTests(unittest.TestCase):
    def test_resolves_string_array_for_each_removal(self):
        text = """
        const outputs = [
            'mekanism:free_runners',
            'mekanism:jetpack'
        ]
        outputs.forEach(output => event.remove({ output: output }))
        """

        resolved, expressions = ownership.resolve_grouped_removals(text)

        self.assertEqual(
            resolved,
            {'mekanism:free_runners', 'mekanism:jetpack'},
        )
        self.assertEqual(expressions, {'output'})

    def test_resolves_numeric_array_template_removal(self):
        text = """
        const levels = [1, 2, 3]
        levels.forEach(level => event.remove({ output: `pneumaticcraft:jet_boots_upgrade_${level}` }))
        """

        resolved, expressions = ownership.resolve_grouped_removals(text)

        self.assertEqual(
            resolved,
            {
                'pneumaticcraft:jet_boots_upgrade_1',
                'pneumaticcraft:jet_boots_upgrade_2',
                'pneumaticcraft:jet_boots_upgrade_3',
            },
        )
        self.assertEqual(
            expressions,
            {'`pneumaticcraft:jet_boots_upgrade_${level}`'},
        )

    def test_literal_expression_classifier_does_not_mark_quotes_dynamic(self):
        self.assertTrue(ownership.is_literal_expression("'nuclearcraft:alloy_smelter'"))
        self.assertTrue(ownership.is_literal_expression('"pneumaticcraft:refinery"'))
        self.assertFalse(ownership.is_literal_expression('output'))
        self.assertFalse(
            ownership.is_literal_expression('`pneumaticcraft:jet_boots_upgrade_${level}`')
        )

    def test_unknown_dynamic_output_is_detectable(self):
        text = "event.remove({ output: chooseOutput() })"
        match = ownership.ANY_OUTPUT_REMOVE_RE.search(text)
        self.assertIsNotNone(match)
        expr = match.group('expr').strip()
        self.assertEqual(expr, 'chooseOutput()')
        self.assertFalse(ownership.is_literal_expression(expr))


class RecipeDependencyValidatorTests(unittest.TestCase):
    def test_balanced_call_parser_handles_nested_calls(self):
        text = "event.shaped('kubejs:a', ['AAA'], { A: helper('kubejs:b') }).id('x:y')"
        open_index = text.index('(')
        close_index = dependencies.find_matching_paren(text, open_index)
        self.assertIsNotNone(close_index)
        body = text[open_index + 1 : close_index]
        self.assertEqual(dependencies.first_argument(body), "'kubejs:a'")

    def test_parses_literal_and_constant_dependencies(self):
        source = """
        const core = 'kubejs:core'
        event.shaped('kubejs:machine', ['ABC'], {
            A: core,
            B: 'nuclearcraft:ring_accelerator_controller',
            C: '#forge:ingots/steel'
        }).id('matterworks:test/machine')
        """

        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / 'recipe.js'
            path.write_text(source, encoding='utf-8')
            calls = dependencies.parse_recipe_calls(path)

        self.assertEqual(len(calls), 1)
        self.assertEqual(calls[0].output, 'kubejs:machine')
        self.assertIn('kubejs:core', calls[0].dependencies)
        self.assertIn(
            'nuclearcraft:ring_accelerator_controller',
            calls[0].dependencies,
        )

    def test_cycle_detection_finds_bootstrap_loop(self):
        graph = {
            'kubejs:a': {'kubejs:b'},
            'kubejs:b': {'kubejs:c'},
            'kubejs:c': {'kubejs:a'},
        }
        cycles = dependencies.find_cycles(graph)
        self.assertEqual(len(cycles), 1)
        self.assertEqual(cycles[0][0], cycles[0][-1])
        self.assertEqual(set(cycles[0][:-1]), {'kubejs:a', 'kubejs:b', 'kubejs:c'})

    def test_cycle_detection_accepts_acyclic_chain(self):
        graph = {
            'kubejs:a': {'kubejs:b'},
            'kubejs:b': {'kubejs:c'},
            'kubejs:c': set(),
        }
        self.assertEqual(dependencies.find_cycles(graph), [])


if __name__ == '__main__':
    unittest.main()
