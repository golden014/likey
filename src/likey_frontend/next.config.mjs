import webpack from 'webpack';
import dotenv from 'dotenv'

const { parsed: myEnv } = dotenv.config({
    path:'../../.env'
})

const nextConfig = {
    output: 'export',
    webpack(config) {
        config.plugins.push(new webpack.EnvironmentPlugin(myEnv))
        images:{
          domains: ['pbs.twimg.com', "i.pinimg.com", "i.redd.it", "preview.redd.it", "staticg.sportskeeda.com"]
        }
        return config

    }
};

export default nextConfig;
