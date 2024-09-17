import { ReceiveWebhookResponse } from "../dtos/responses/recieve-webhook.dto";

export const WebhookService = Symbol.for('WebhookService');
export type WebhookService = {
    syncMessage(request: ReceiveWebhookResponse): Promise<void>;
};
