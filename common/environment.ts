export const environment = {
    db: { url: process.env.MONGO_URI as string},
    server: { port: process.env.SERVER_PORT || 3000 },
    security: {
        saltRounds: process.env.SALT_ROUNDS || 10,
        apiSecret: process.env.API_SECRET || "segredo-api-pesquisa",
        sessionSecret: process.env.SESSION_SECRET || "segredo-sessao"
    }
};