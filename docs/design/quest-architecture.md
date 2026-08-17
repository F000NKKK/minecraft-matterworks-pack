# Matterworks quest architecture

## Purpose

Matterworks uses two different kinds of quest content. They must not be conflated.

1. **Main progression — Phases 1..N** owns advancement, research, synthesis unlocks and cross-mod engineering goals.
2. **Mod guides** teach individual mods and remain primarily explanatory/reference content.

A mod guide may explain how Alchemistry works. A main-phase quest may require the player to use chemical analysis as part of an engineering program. Only the latter is progression authority unless a quest is explicitly marked as a research milestone.

## Main progression: Phases 1..N

The main quest line describes Matterworks itself, not any individual mod. It is a cross-mod technology tree.

Each phase represents a technological capability and may freely combine mechanics from Create, Mekanism, Alchemistry/ChemLib, NuclearCraft, AE2, CC:Tweaked and other installed mods.

Main-phase quests may:

- unlock research stages;
- unlock synthesis of a material or material family;
- prove construction of machinery or infrastructure;
- require production of a process output rather than mere possession of a controller;
- unlock the next phase;
- branch into optional engineering goals while preserving a clear critical path.

The phase number is a pack-level concept. It must not be inferred from a mod's internal tier numbering.

### Initial phase skeleton

The exact contents will evolve, but the intended macrostructure is:

- **Phase 1 — Mechanical Industry**: Create-based production, basic processing, coke and repeatable mechanical infrastructure.
- **Phase 2 — Chemical Analysis**: ChemLib/Alchemistry analysis, decomposition, material identity and early chemical processes. Analysis is not equivalent to synthesis knowledge.
- **Phase 3 — Electrotechnics and Process Industry**: Mekanism power, gases, pressure/process abstractions, industrial metallurgy and controlled synthesis families.
- **Phase 4 — Digital Industry**: AE2 logistics plus CC:Tweaked measurement/control requirements where appropriate.
- **Phase 5 — Nuclear Engineering**: NuclearCraft feed preparation, fission infrastructure, fuel cycle, irradiation and reprocessing.
- **Phase 6 — Nuclear Research**: accelerator/isotope program and the research milestones required for atomic transformation.
- **Phase 7 — Atomic Engineering**: Alchemistry Fission becomes a controlled end-game capability; nuclear provenance rules still apply.
- **Phase 8 — Fusion Engineering**: Alchemistry Fusion and the highest-order synthetic material program.

This list is a design baseline, not a promise that Matterworks ends at Phase 8. New phases may be inserted or appended as the pack grows.

## Mod-guide branches

Every major gameplay mod should have its own guide chapter/branch, for example:

- Create
- Mekanism
- Alchemistry / ChemLib
- NuclearCraft: Neoteric
- Applied Energistics 2
- CC:Tweaked

These branches answer questions such as:

- what does this machine do?
- how do this mod's transport/storage systems work?
- what are the important machine families?
- what terminology does the mod use?
- what mistakes are easy to make?
- where does Matterworks intentionally change vanilla mod behaviour?

They are documentation/tutorials, not the primary technology tree.

### Chemistry example

The **Alchemistry / ChemLib guide** explains the Dissolver, Combiner, elements, compounds and Matterworks-specific restrictions.

The **Main Progression / Phase 2 — Chemical Analysis** instead asks the player to establish an analysis laboratory and demonstrate analysis of selected materials. Later main phases use that capability to unlock new synthesis research.

Thus there may be two quests concerning the same machine without duplication of responsibility:

- mod guide: "This is a Dissolver; this is how it works."
- main progression: "Build an analytical chemistry capability and prove that you can characterize material X."

Only the main progression quest grants progression/research state.

## Research ownership

FTB Quests is the player-facing authority for progression.

Research flow:

`physical capability -> main quest completion -> research stage -> recipe/process permission`

Mod-guide completion must not accidentally grant broad progression. If a tutorial needs to grant a stage, that relationship must be explicit in the research registry and audit output.

Material synthesis unlocks belong to main progression even when the underlying machine comes from a particular mod.

Examples:

- Create guide teaches heated mixing; a main metallurgy quest unlocks a controlled alloy synthesis family.
- Mekanism guide teaches gas handling; a main process-engineering quest unlocks synthesis routes requiring industrial gases.
- NuclearCraft guide teaches reactor concepts; a main nuclear-program quest proves an actual fuel cycle and unlocks subsequent research.
- Alchemistry guide teaches Combiner operation; it does not grant universal permission to synthesize every known material.

## Quest graph rules

1. Main phases form the canonical critical path.
2. A later phase can require milestones from multiple earlier phases.
3. Mod-guide branches may be completed independently when their items become available.
4. Guide quests should avoid hard-locking the player merely for failing to read documentation.
5. Progression rewards/stages are normally owned by main-phase quests.
6. Machine possession alone is weak evidence. Prefer a meaningful output, process result or multistep objective where possible.
7. Team progression uses FTB Teams/FTB Quests semantics so a factory operated by a team advances the team's research consistently.
8. Recipe removal and KubeJS enforcement exist to prevent bypasses, not to replace the quest graph.
9. JEI visibility must not imply availability: locked synthesis routes require a real server-side permission boundary.
10. Every research stage must have exactly one documented progression owner and at least one runtime consumer.

## Presentation

Quest-book organization should visibly separate the two layers:

### Matterworks — Main Program

- Phase 1
- Phase 2
- ...
- Phase N

### Mod Guides

- Create
- Mekanism
- Alchemistry / ChemLib
- NuclearCraft
- AE2
- CC:Tweaked
- ...

The player should always be able to answer two different questions from the book:

- **What should I do next?** -> Main Program.
- **How does this mod/system work?** -> Mod Guides.

## Audit requirements

The progression audit must eventually detect:

- main progression stages without quest owners;
- research stages granted only by guide quests unintentionally;
- synthesis permissions without research owners;
- phase quests whose unlocks have no runtime consumer;
- guide quests that accidentally become mandatory critical-path dependencies;
- stock recipes that bypass main-progression research;
- materials that can be synthesized before their research milestone;
- circular quest/research dependencies.
