import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
 webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push('@google/genai');
      config.externals.push('@google/generative-ai');
      config.externals.push('@langchain/google-genai');
      config.externals.push('@pinecone-database/pinecone');
    }
    return config;
  },
};

export default nextConfig;
