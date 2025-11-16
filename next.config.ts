import type { NextConfig } from "next";
import { withWorkflow } from "workflow/next";

const nextConfig: NextConfig = {
  serverExternalPackages: [
    "@resvg/resvg-js",
    "@resvg/resvg-js-darwin-arm64",
    "@resvg/resvg-js-darwin-x64",
    "@resvg/resvg-js-linux-x64-gnu",
    "@resvg/resvg-js-linux-arm64-gnu",
    "@resvg/resvg-js-win32-x64-msvc",
  ],
};

export default withWorkflow(nextConfig);
