import type { OmniEdge, OmniGraph, OmniNode } from '@layerzerolabs/utils'
import { isOmniPoint } from '@layerzerolabs/utils'
import { omniContractToPoint } from '@layerzerolabs/utils-evm'
import { createContractFactory } from './coordinates'
import type { OmniContractFactoryHardhat, OmniEdgeHardhat, OmniGraphHardhat, OmniNodeHardhat } from './types'

export const createOmniNodeHardhatTransformer =
    (contractFactory: OmniContractFactoryHardhat = createContractFactory()) =>
    async <TNodeConfig>({ contract, config }: OmniNodeHardhat<TNodeConfig>): Promise<OmniNode<TNodeConfig>> => {
        const point = isOmniPoint(contract) ? contract : omniContractToPoint(await contractFactory(contract))

        return { point, config: config as TNodeConfig }
    }

export const createOmniEdgeHardhatTransformer =
    (contractFactory: OmniContractFactoryHardhat = createContractFactory()) =>
    async <TEdgeConfig>({
        from: fromContract,
        to: toContract,
        config,
    }: OmniEdgeHardhat<TEdgeConfig>): Promise<OmniEdge<TEdgeConfig>> => {
        const from = isOmniPoint(fromContract) ? fromContract : omniContractToPoint(await contractFactory(fromContract))
        const to = isOmniPoint(toContract) ? toContract : omniContractToPoint(await contractFactory(toContract))

        return { vector: { from, to }, config: config as TEdgeConfig }
    }

export type OmniGraphHardhatTransformer<TNodeConfig = unknown, TEdgeConfig = unknown> = (
    graph: OmniGraphHardhat<TNodeConfig, TEdgeConfig>
) => Promise<OmniGraph<TNodeConfig, TEdgeConfig>>

export const createOmniGraphHardhatTransformer =
    <TNodeConfig, TEdgeConfig>(
        nodeTransformer = createOmniNodeHardhatTransformer(),
        edgeTransformer = createOmniEdgeHardhatTransformer()
    ): OmniGraphHardhatTransformer<TNodeConfig, TEdgeConfig> =>
    async (graph) => ({
        contracts: await Promise.all(graph.contracts.map(nodeTransformer)),
        connections: await Promise.all(graph.connections.map(edgeTransformer)),
    })