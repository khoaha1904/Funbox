

export class ReceiveWebhookMessaging {
    sender: {
        id: string;
    };
    recipient: {
        id: string;
    };
    timestamp: number;
    message: {
        mid: string;
        text: string;
        is_echo: boolean;
        app_id: number;
        attachments: {
            type: string,
            payload: {
                url: string
            },
        }
    };
}

export class ReceiveWebhookEntry {
    time: number;
    id: string;
    messaging: ReceiveWebhookMessaging[];
}

export class ReceiveWebhookResponse {
    object: string;
    entry: ReceiveWebhookEntry[];
}
