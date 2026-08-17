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
    const duplicateQuestOwners = []
    const questOwners = {}

    function registerQuestOwner(kind, key, ownerQuest) {
        if (!ownerQuest) {
            missingQuestOwners.push(`${kind}:${key}`)
            return
        }

        const ownerKey = `${kind}:${key}`
        if (!(ownerQuest in questOwners)) {
            questOwners[ownerQuest] = []
        }
        questOwners[ownerQuest].push(ownerKey)
    }

    Object.entries(families).forEach(([familyKey, family]) => {
        ;(family.materials || []).forEach(material => {
            if (material in owners) {
                duplicateOwners.push(`${material}:${owners[material]}+${familyKey}`)
            } else {
                owners[material] = familyKey
            }
        })

        registerQuestOwner('synthesis', familyKey, family.ownerQuest)
    })

    Object.entries(capabilities).forEach(([capabilityKey, capability]) => {
        registerQuestOwner('capability', capabilityKey, capability.ownerQuest)
    })

    phases.forEach(phase => {
        registerQuestOwner('phase', phase.id, phase.ownerQuest)
    })

    Object.entries(questOwners).forEach(([questId, entries]) => {
        const phaseEntries = entries.filter(entry => entry.startsWith('phase:'))
        const capabilityEntries = entries.filter(entry => entry.startsWith('capability:'))

        // A final phase quest may intentionally own one phase plus one or more
        // capabilities/synthesis families. Multiple phases or multiple distinct
        // capabilities sharing one quest is suspicious and should be reviewed.
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
        `${Object.keys(capabilities).length} capabilities, ${provenanceOnly.size} provenance-only, ${unresolved.size} unresolved; ` +
        `duplicateOwners=${duplicateOwners.length}, duplicateQuestOwners=${duplicateQuestOwners.length}, ` +
        `missingResearch=${missingResearch.length}, missingQuestOwners=${missingQuestOwners.length}`
    )
})
