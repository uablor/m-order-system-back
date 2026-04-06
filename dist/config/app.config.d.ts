declare const _default: (() => {
    port: number;
    env: string;
    throttle: {
        ttl: number;
        limit: number;
    };
    cache: {
        ttl: number;
    };
    jwt: {
        secret: string;
        expiresIn: string;
        expiresInSeconds: number;
    };
}) & import("@nestjs/config").ConfigFactoryKeyHost<{
    port: number;
    env: string;
    throttle: {
        ttl: number;
        limit: number;
    };
    cache: {
        ttl: number;
    };
    jwt: {
        secret: string;
        expiresIn: string;
        expiresInSeconds: number;
    };
}>;
export default _default;
