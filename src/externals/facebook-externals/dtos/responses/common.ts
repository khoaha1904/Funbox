export class FacebookExternalsPagingDto {
    cursors: {
        before: string;
        after: string;
    };
}

export class FacebookExternalsError {
    message: string;
    type: string;
    code: number;
    error_subcode: number;
    fbtrace_id: string;
}

export class FacebookPagingExternalsResponse<T = any> {
    data: T[];
    paging?: FacebookExternalsPagingDto;
    error?: FacebookExternalsError;
}
