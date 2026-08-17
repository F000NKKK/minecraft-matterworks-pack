console.info('[Matterworks] Loading research/progression audit')

ServerEvents.recipes(event => {
    const composition = global.MatterworksComposition || {}
    const research = global.MatterworksResearch || {}
    const families = research.synthesisFamilies || {}
    const capabilities = research.capabilities || {}
    const phases = research.phases || []
    const provenanceOnly = new Set(research.provenanceOnly || [])
    const unresolved = new Set(research.unresolved || [])
    const owners = {}
    const duplicateOwners = []
    const missingQuestOwners = []
    const malformedQuestOwners = []
    const duplicateQuestOwners = []
    const questOwners = {}
    const phaseIds = new Set()
    const duplicatePhaseIds = []
    const unknownPhaseRefs = []
    const stages = {}
    const duplicateStages = []

    function registerQuestOwner(kind, key, ownerQuest) {
        if (!ownerQuest) {
            missingQuestOwners.push(`${kind}:${key}`)
            return
        }

        if (!/^\d{16}$/.test(String(ownerQuest))) {
            malformedQuestOwners.push(`${kind}:${key}:${ownerQuest}`)
        }

        const ownerKey = `${kind}:${key}`
        if (!(ownerQuest in questOwners)) {
            questOwners[ownerQuest] = []
        }
        questOwners[ownerQuest].push(ownerKey)
    }

    function registerStage(kind, key, stage) {
        if (!stage) {
            return
        }

        if (stage in stages) {
            duplicateStages.push(`${stage}:${stages[stage]}+${kind}:${key}`)
            return
        }

        stages[stage] = `${kind}:${key}`
    }

    phases.forEach(phase => {
        if (phaseIds.has(phase.id)) {
            duplicatePhaseIds.push(phase.id)
        } else {
            phaseIds.add(phase.id)
        }

        registerQuestOwner('phase', phase.id, phase.ownerQuest)
        registerStage('phase', phase.id, phase.stage)
    })

    Object.entries(families).forEach(([familyKey, family]) => {
        ;(family.materials || []).forEach(material => {
            if (material in owners) {
                duplicateOwners.push(`${material}:${owners[material]}+${familyKey}`)
            } else {
                owners[material] = familyKey
            }
        })

        if (!phaseIds.has(family.phase)) {
            unknownPhaseRefs.push(`synthesis:${familyKey}:${family.phase}`)
        }

        registerQuestOwner('synthesis', familyKey, family.ownerQuest)
        registerStage('synthesis', familyKey, family.stage)
    })

    Object.entries(capabilities).forEach(([capabilityKey, capability]) => {
        if (!phaseIds.has(capability.phase)) {
            unknownPhaseRefs.push(`capability:${capabilityKey}:${capability.phase}`)
        }

        registerQuestOwner('capability', capabilityKey, capability.ownerQuest)
        registerStage('capability', capabilityKey, capability.stage)
    })

    Object.entries(questOwners).forEach(([questId, entries]) => {
        const phaseEntries = entries.filter(entry => entry.startsWith('phase:'))
        const capabilityEntries = entries.filter(entry => entry.startsWith('capability:'))

        // A final phase quest may intentionally own one phase plus one or more
        // synthesis families and one capability. Multiple phases or multiple
        // distinct capabilities sharing one quest is suspicious.
        if (phaseEntries.length > 1 || capabilityEntries.length > 1) {
            duplicateQuestOwners.push(`${questId}:${entries.join('+')}`)
        }
    })

    const missingPolicy = []
    const missingResearch = []

    Object.entries(composition).forEach(([material, entry]) => {
        if (!entry || !entry.policy) {
            missingPolicy.push(material)
            return
        }

        if (!(material in owners) && !provenanceOnly.has(material) && !unresolved.has(material)) {
            missingResearch.push(material)
        }
    })

    if (duplicateOwners.length > 0) {
        console.warn(`[Matterworks] Research audit: duplicate synthesis owners: ${duplicateOwners.join(', ')}`)
    }

    if (duplicateQuestOwners.length > 0) {
        console.warn(`[Matterworks] Research audit: suspicious duplicate quest ownership: ${duplicateQuestOwners.join(', ')}`)
    }

    if (duplicatePhaseIds.length > 0) {
        console.warn(`[Matterworks] Research audit: duplicate phase ids: ${duplicatePhaseIds.join(', ')}`)
    }

    if (unknownPhaseRefs.length > 0) {
        console.warn(`[Matterworks] Research audit: unknown phase references: ${unknownPhaseRefs.join(', ')}`)
    }

    if (duplicateStages.length > 0) {
        console.warn(`[Matterworks] Research audit: duplicate research stages: ${duplicateStages.join(', ')}`)
    }

    if (malformedQuestOwners.length > 0) {
        console.warn(`[Matterworks] Research audit: malformed quest owner ids: ${malformedQuestOwners.join(', ')}`)
    }

    if (missingPolicy.length > 0) {
        console.warn(`[Matterworks] Research audit: composition entries without policy: ${missingPolicy.join(', ')}`)
    }

    if (missingResearch.length > 0) {
        console.warn(`[Matterworks] Research audit: materials without synthesis/provenance disposition: ${missingResearch.join(', ')}`)
    }

    if (missingQuestOwners.length > 0) {
        console.warn(`[Matterworks] Research audit: research entries without quest owner: ${missingQuestOwners.join(', ')}`)
    }

    console.info(
        `[Matterworks] Research audit registered: ${Object.keys(owners).length} materials assigned to synthesis families, ` +
        `${Object.keys(capabilities).length} capabilities, ${phaseIds.size} phases, ` +
        `${provenanceOnly.size} provenance-only, ${unresolved.size} unresolved; ` +
        `duplicateOwners=${duplicateOwners.length}, duplicateQuestOwners=${duplicateQuestOwners.length}, ` +
        `duplicateStages=${duplicateStages.length}, unknownPhaseRefs=${unknownPhaseRefs.length}, ` +
        `malformedQuestOwners=${malformedQuestOwners.length}, missingResearch=${missingResearch.length}, ` +
        `missingQuestOwners=${missingQuestOwners.length}`
    )
})
