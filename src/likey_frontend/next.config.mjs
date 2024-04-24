/** @type {import('next').NextConfig} */
import webpack from 'webpack';
import dotenv from 'dotenv'

const { parsed: myEnv } = dotenv.config({
    path:'../../.env'
})

const nextConfig = {
    output: 'export',
    webpack(config) {
        config.plugins.push(new webpack.EnvironmentPlugin(myEnv))
        return config
    }
};

export default nextConfig;
