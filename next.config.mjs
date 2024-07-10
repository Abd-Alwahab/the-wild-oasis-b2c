/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "bdmulytkkwfaehbvtpuq.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/cabin-images/**", // Match any cabin image path
      },
    ],
  },
};

export default nextConfig;
