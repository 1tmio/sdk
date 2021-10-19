import { RaribleSdk } from "@rarible/protocol-ethereum-sdk"
import { Action } from "@rarible/action"
import { toBigNumber } from "@rarible/types"
import { BlockchainEthereumTransaction } from "@rarible/sdk-transaction"
import { BurnRequest, PrepareBurnRequest } from "../../nft/burn/domain"

export class Burn {
	constructor(
		private sdk: RaribleSdk,
	) {
		this.burn = this.burn.bind(this)
	}

	async burn(prepare: PrepareBurnRequest) {
		if (!prepare.itemId) {
			throw new Error("ItemId has not been specified")
		}

		const itemId = await this.sdk.apis.nftItem.getNftItemById({
			itemId: prepare.itemId,
		})
		const contract = await this.sdk.apis.nftCollection.getNftCollectionById({
			collection: itemId.contract,
		})

		return {
			multiple: contract.type === "ERC1155",
			maxAmount: itemId.supply,
			submit: Action.create({
				id: "burn" as const,
				run: async (request: BurnRequest) => {
					const amount = request?.amount !== undefined ? toBigNumber(request.amount.toFixed()) : undefined

					const tx = await this.sdk.nft.burn(
						{
							contract: itemId.contract,
							tokenId: itemId.tokenId,
						},
						amount
					)

					return new BlockchainEthereumTransaction(tx)
				},
			}),
		}
	}
}
