import type { IRaribleSdk } from "@rarible/sdk/src/domain"
import type { BlockchainWallet } from "@rarible/sdk-wallet"
import type { Order } from "@rarible/api-client"
import type { OrderRequest, PrepareOrderRequest } from "@rarible/sdk/src/types/order/common"

/**
 * Make new bid order
 */
export async function bid(sdk: IRaribleSdk,
						   wallet: BlockchainWallet,
						   prepareOrderRequest: PrepareOrderRequest,
						   orderRequest: OrderRequest): Promise<Order> {
	console.log("bid, prepare_order_update_request=", prepareOrderRequest)
	// Get bid info
	const bidPrepare = await sdk.order.bid(prepareOrderRequest)

	console.log("bid, order_request=", orderRequest)
	// Submit bid order
	const orderId = await bidPrepare.submit(orderRequest)

	// Check order
	//return await awaitOrderStock(sdk, orderId, orderRequest.price.toString())
	return await sdk.apis.order.getOrderById({ id: orderId })
}
