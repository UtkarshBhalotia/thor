interface IClientRequestParam {
    url: string;
    timeout?: number;
    code?: string;
    accessToken?: string;
    data?: any;
    /** HTTP verb for the new REST endpoints. Defaults to GET in clientRestHandler. */
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    /** Query-string params (for GET / path-less filters). */
    params?: Record<string, any>;
    /** Skip JWT injection for public endpoints (login, register, forgot-password...). */
    anon?: boolean;
    /**
     * Keep the JWT but don't treat a 401 as a session expiry. Needed where 401
     * carries a business meaning on an authenticated call (change-password uses
     * it for "current password is incorrect").
     */
    ignoreUnauthorized?: boolean;
}
