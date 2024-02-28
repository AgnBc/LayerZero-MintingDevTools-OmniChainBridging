// eslint-disable-next-line @typescript-eslint/no-var-requires
import { EndpointId } from '@layerzerolabs/lz-definitions'

const contractName = 'MyONFT721'

const sepoliaContract = {
    eid: EndpointId.SEPOLIA_V2_TESTNET,
    contractName,
}

const fujiContract = {
    eid: EndpointId.AVALANCHE_V2_TESTNET,
    contractName,
}

const mumbaiContract = {
    eid: EndpointId.POLYGON_V2_TESTNET,
    contractName,
}

export default {
    contracts: [
        {
            contract: fujiContract,
        },
        {
            contract: sepoliaContract,
        },
        {
            contract: mumbaiContract,
        },
    ],
    connections: [
        {
            from: fujiContract,
            to: sepoliaContract,
            config: {},
        },
        {
            from: fujiContract,
            to: mumbaiContract,
        },
        {
            from: sepoliaContract,
            to: fujiContract,
        },
        {
            from: sepoliaContract,
            to: mumbaiContract,
        },
        {
            from: mumbaiContract,
            to: sepoliaContract,
        },
        {
            from: mumbaiContract,
            to: fujiContract,
        },
    ],
}
