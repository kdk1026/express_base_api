module.exports = {
    apps : [{
        name : "base-api",
        script : "server.js",
        env: {
          NODE_ENV: "local",
        },
        env_development: {
          NODE_ENV: "development",
        },
        env_production: {
          NODE_ENV: "production",
        }
    }]
}