console.info('[Matterworks] Loading NuclearCraft fuel-cycle corrections')

ServerEvents.recipes(event => {
    if (!Platform.isLoaded('nuclearcraft')) {
        console.warn('[Matterworks] Nuclear fuel-cycle corrections skipped: NuclearCraft not loaded')
        return
    }

    /*
     * NuclearCraft 1.2.34 exposes two uranium-separation inputs:
     *
     *   yellowcake -> U-238/U-235
     *   generic uranium dust -> U-238/U-235
     *
     * The second edge bypasses the mod's own conversion chain
     * (uranium + oxygen -> uranium-oxide fluid -> crystallizer -> yellowcake).
     * Matterworks removes only that bypass. The underlying NuclearCraft
     * Fluid Enricher, Crystallizer and Isotope Separator remain process
     * authorities; we do not replace their serializers with invented chemistry.
     */
    event.remove({ id: 'nuclearcraft:isotope_separator/dusts_uranium' })

    console.info(
        '[Matterworks] Nuclear fuel cycle registered: generic uranium separation blocked; uranium oxide -> yellowcake -> isotope separation is authoritative'
    )
})
