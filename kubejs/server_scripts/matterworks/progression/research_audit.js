console.info('[Matterworks] Loading research/progression audit')

ServerEvents.recipes(event => {
    const composition = global.MatterworksComposition || {}
    const research = global.MatterworksResearch || {}
    const families = research.synthesisFamilies || {}
    const phases = research.phases || []
    const provenanceOnly = new Set(research.provenanceOnly || [])
    const unresolved = new Set(research.unresolved || [])
    const owners = {}
    const duplicateOwners = []
    const missingQuestOwners = []
    const duplicateQuestOwners = []
    const questOwnerKeys = {}

    Object.entries(families).forEach(([familyKey, family]) => {
        ;(family.materials || []).forEach(material => {
            if (material in owners) {
                duplicateOwners.push(`${material}:${owners[material]}+${familyKey}`)
            } else {
                owners[material] = familyKey
            }
        })

        if (!family.ownerQuest) {
            missingQuestOwners.push(`synthesis:${familyKey}`)
        } else {
            const ownerKey = `quest:${family.ownerQuest}`
            if (ownerKey in questOwnerKeys) {
                duplicateQuestOwners.push(`${family.ownerQuest}:${questOwnerKeys[ownerKey]}+synthesis:${familyKey}`)
            } else {
                questOwnerKeys[ownerKey] = `synthesis:${familyKey}`
            }
        }
    })

    phases.forEach(phase => {
        if (!phase.ownerQuest) {
            missingQuestOwners.push(`phase:${phase.id}`)
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

    if (missingPolicy.length > 0) {
        console.warn(`[Matterworks] Research audit: composition entries without policy: ${missingPolicy.join(', ')}`)
    }

    if (missingResearch.length > 0) {
        console.warn(`[Matterworks] Research audit: materials without synthesis/provenance disposition: ${missingResearch.join(', ')}`)
    }

    if (missingQuestOwners.length > 0) {
        console.warn(`[Matterworks] Research audit: research entries without quest owner: ${missingQuestOwners.join(', ')}`)
    }

    if (duplicateQuestOwners.length > 0) {
        console.warn(`[Matterworks] Research audit: quest IDs own multiple synthesis families: ${duplicateQuestOwners.join(', ')}`)
    }

    console.info(
        `[Matterworks] Research audit registered: ${Object.keys(owners).length} materials assigned to synthesis families, ` +
        `${provenanceOnly.size} provenance-only, ${unresolved.size} unresolved; ` +
        `duplicateOwners=${duplicateOwners.length}, missingResearch=${missingResearch.length}, ` +
        `missingQuestOwners=${missingQuestOwners.length}, duplicateQuestOwners=${duplicateQuestOwners.length}`
    )
})
