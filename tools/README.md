# Matterworks development tools

## Chemistry compatibility audit

`audit-chemistry-compatibility.py` inspects the actual installed ChemLib, Alchemistry, NuclearCraft and Mekanism JAR resources and builds a Markdown compatibility report.

Typical PrismLauncher usage:

```bash
python3 tools/audit-chemistry-compatibility.py \
  ~/.local/share/PrismLauncher/instances/Matterworks/minecraft/mods \
  --strict \
  --output chemistry-audit.md
```

The audit reports:

- exact solid-material overlaps through Forge tags;
- native fluid-tag intersections between ChemLib, NuclearCraft and Mekanism;
- protected phase/isotope/nuclear-state collisions;
- ChemLib entries contributed to the upstream `minecraft:water` tag;
- Alchemistry Dissolver routes touching U/Th/Po/Ra;
- concrete Alchemistry Atomizer fluid inputs;
- whether Matterworks still contains the required water, radioactive-material and post-ring transmutation guards.

Run it after changing any chemistry/nuclear mod version and before merging a progression PR. A new overlap is not automatically an error: classify it as exact identity, naming alias, process conversion or protected state first, then update the compatibility policy intentionally.

The entire `tools/` directory is excluded by `.packwizignore` and is not shipped as pack content.
