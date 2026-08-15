console.info('[Matterworks] Registering process fluids')

StartupEvents.registry('fluid', event => {
    /*
     * Compressed air is a process mixture, not a chemical species.
     *
     * ChemLib already owns the actual N2/O2/H2/NH3 substances. Matterworks
     * therefore registers only the process-stream representation needed to
     * model atmospheric compression before separation.
     */
    const compressedAir = event.create('compressed_air')
        .displayName('Compressed Air')
        .thinTexture(0xDDEAF2)
        .bucketColor(0xDDEAF2)
        .gaseous()
        .density(-1000)
        .temperature(300)
        .viscosity(100)
        .noBlock()

    /*
     * Forge's dynamic fluid-container model already has a gas presentation.
     * flip_gas renders the filled bucket upside down, making gas containers
     * visually distinct from ordinary liquid buckets without a custom texture.
     */
    compressedAir.bucketItem.modelJson({
        parent: 'forge:item/bucket',
        loader: 'forge:fluid_container',
        fluid: 'kubejs:compressed_air',
        flip_gas: true
    })
})
