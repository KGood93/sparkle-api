module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    DATABASE_URL: process.env.DATABASE_URL || 'postgresql://Katy:test@localhost/sparkle-api',
    JWT_SECRET: process.env.JWT_SECRET || 'change-this-secret',
    JWT_EXPIRY:process.env.JWT_EXPIRY || '200000s',
    TEST_DATABASE_URL: process.env.TEST_DATABASE_URL || 'postgresql://Katy:test@localhost/sparkle-api-test',
    CLIENT_ORIGIN: ['https://sparkle-app.now.sh', 'https://sparkle-app-1bojitddx.now.sh', 'https://sparkle-app.goodreaukath.now.sh']
}