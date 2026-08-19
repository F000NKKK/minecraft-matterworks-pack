# Matterworks quest architecture

## Purpose

Matterworks has two quest layers with different responsibilities.

1. **Matterworks — Main Program** owns progression, research stages, synthesis permissions and cross-mod engineering milestones.
2. **Mod Guides** teach individual systems and remain explanatory/reference curricula.

A guide may teach how a machine works. The Main Program proves that the factory can use that machine as part of a technological capability. Only the Main Program owns progression unless a guide milestone is explicitly registered as an exception.

## Canonical progression model

The canonical macrostructure is now **Ages**, not numbered phases:

- **Age I — Industrial Age**: mechanical manufacturing, analytical chemistry, electrical engineering, pressure/process engineering, atmospheric separation, polymers, high-temperature metallurgy, petrochemistry and industrial control foundations.
- **Age II — Atomic Age**: digital supervision, AE2/CC:Tweaked integration, nuclear fuel-cycle engineering, accelerator research, isotope handling and controlled atomic fission/transmutation.
- **Age III — Fusion Age**: fusion engineering, antimatter-scale requirements, parent-element synthesis and prestige engineering.

An Age contains several engineering branches. Branches should converge on real capability milestones rather than form one long linear spine.

The preferred visual grammar is:

`branch -> local capability -> convergence milestone -> new branches`

A later Age may require milestones from multiple branches of an earlier Age. New Ages may be appended as the pack grows.

### Compatibility terminology

The old Phase 1..8 model was the design scaffold used before 0.5.6. Runtime code may retain `phase` aliases temporarily for 0.5.x compatibility, but new design, quest and research work must use Age terminology. Old phase numbers are not progression authority.

## Main Program responsibilities

Main Program quests may:

- grant an Age or capability research stage;
- unlock synthesis of a material or material family;
- prove construction of machinery or infrastructure;
- require a meaningful process output rather than possession of a controller block;
- require evidence from multiple engineering branches;
- unlock the next Age;
- expose optional engineering goals without weakening the critical path.

Machine possession alone is weak evidence. Prefer outputs, multistep processing, controlled infrastructure and cross-system integration.

## Mod-guide branches

Every major gameplay system should have a guide chapter where useful, including Create, Mekanism, Alchemistry/ChemLib, NuclearCraft, AE2, CC:Tweaked and pressure engineering.

Guides answer questions such as:

- what does this machine or subsystem do?
- what transport/storage model does the mod use?
- what terminology is important?
- what common configuration mistakes exist?
- where does Matterworks intentionally alter stock behaviour?

Guides are curricula, not the primary technology tree. They must not become hidden critical-path dependencies.

## Research ownership

FTB Quests is the player-facing progression authority.

Research flow:

`physical capability -> Main Program quest completion -> research stage -> recipe/process permission`

Every registered Age, capability and synthesis family must have exactly one documented Main Program owner quest unless explicitly documented otherwise.

Every research stage must also have at least one runtime consumer. A stage that is granted but never enforced is documentation, not a progression boundary.

Material synthesis permissions belong to the Main Program even when the underlying machine belongs to a specific mod.

Examples:

- Create guide teaches heated mixing; a Main Program metallurgy milestone owns controlled alloy synthesis.
- Mekanism guide teaches gases; a Main Program process milestone owns industrial-gas-dependent synthesis.
- NuclearCraft guide teaches reactor concepts; the Main Program proves a real fuel cycle before later nuclear research unlocks.
- Alchemistry guide teaches the Combiner; it does not grant universal synthesis of every known material.

## Quest graph rules

1. Ages form the canonical critical path.
2. Engineering disciplines branch inside an Age and should converge on capability milestones.
3. A later Age can require milestones from multiple earlier branches.
4. Mod guides may be completed independently when their hardware becomes available.
5. Guide quests must not accidentally become mandatory Main Program dependencies.
6. Progression stages are normally owned by Main Program quests.
7. Machine possession alone is insufficient where a meaningful output can prove capability.
8. Team progression follows FTB Teams/FTB Quests semantics.
9. Recipe removal and KubeJS enforcement prevent bypasses; they do not replace the quest graph.
10. JEI visibility must not imply availability. Locked processes require a real server-side boundary.
11. Every research stage has exactly one owner and at least one runtime consumer.
12. Quest dependencies must form a DAG: no cycles, no missing dependency IDs and no unreachable critical-path nodes.
13. Main Program graph layout must avoid overlapping nodes and pathological long/crossing edges where a clearer branch/convergence layout is possible.

## Industrial Age branch model

Industrial Age should read as a factory architecture rather than a numbered recipe checklist. Its principal branches are:

- mechanical manufacturing and electromechanical components;
- analytical chemistry and controlled reconstruction;
- electrical metallurgy and power conversion;
- pressure engineering and atmospheric separation;
- electrochemistry and reaction chemistry;
- polymer engineering;
- high-temperature metallurgy;
- petrochemistry and renewable organic processing;
- specialist industrial chemistry.

These branches converge on **Industrial Age Established** only after the player has demonstrated the major process capabilities required by later Atomic Age infrastructure.

## Atomic and Fusion Ages

Atomic Age owns digitally supervised nuclear-scale industry: networks, programmable control, fuel-cycle provenance, accelerator research and atomic engineering.

Fusion Age owns the highest-order process capabilities: fusion, antimatter-derived requirements, controlled parent-element synthesis and prestige equipment. Near-creative equipment should require evidence from several independent programs rather than a single expensive crafting recipe.

## Presentation

The quest book must make two questions easy to answer:

- **What should I do next?** -> Matterworks — Main Program / current Age.
- **How does this system work?** -> Mod Guides.

Age graphs should be predominantly top-down and visibly branched. Local branches should be compact; convergence nodes should communicate why previously independent capabilities are now being combined.

## Audit requirements

Static and runtime audits should jointly detect:

- duplicate chapter, quest, task and reward IDs;
- missing quest dependency IDs;
- circular quest dependencies;
- unreachable Main Program quests;
- registered research owners whose quest does not exist;
- research stages without owners;
- research stages without runtime consumers;
- multiple registered owners for one stage/material family;
- guide quests accidentally used as Main Program dependencies;
- synthesis permissions without research disposition;
- stock recipes that bypass Main Program progression;
- materials synthesizable before their research milestone;
- malformed owner IDs and unknown Age references;
- unresolved/backlog materials without a named target process family;
- overlapping quest coordinates and suspiciously long graph edges that indicate layout regressions.

The repository validator should enforce everything that can be proven statically. Minecraft runtime verification remains mandatory for recipe registration, mod interoperability, fluid/tag resolution, multiblock behaviour and other game-engine semantics.
