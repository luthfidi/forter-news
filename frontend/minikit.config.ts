const ROOT_URL =
  process.env.NEXT_PUBLIC_URL ||
  (process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`) ||
  "https://forter.app";

/**
 * MiniApp configuration object. Must follow the mini app manifest specification.
 *
 * @see {@link https://docs.base.org/mini-apps/features/manifest}
 */
export const minikitConfig = {
  accountAssociation: {
    header: "",
    payload: "",
    signature: "",
  },
  baseBuilder: {
    allowedAddresses: ["0x4030986A078f97fbdC74d43dAFeb646D6caBb8A9"],
  },
  miniapp: {
    version: "1",
    name: "Forter - Forecast Porter",
    subtitle: "Stake on Credibility, Not Luck",
    description:
      "Permissionless information finance protocol. Create predictions, analyze with reasoning, and build on-chain reputation through verifiable insights.",
    screenshotUrls: [
      `${ROOT_URL}/screenshots/news-browse.png`,
      `${ROOT_URL}/screenshots/pool-creation.png`,
      `${ROOT_URL}/screenshots/staking-interface.png`,
    ],
    iconUrl: "/forter.webp",
    splashImageUrl: "/forter.webp",
    splashBackgroundColor: "#0f0f0f",
    homeUrl: ROOT_URL,
    webhookUrl: `${ROOT_URL}/api/webhook`,
    primaryCategory: "entertainment",
    tags: [
      "information",
      "finance",
      "prediction",
      "reputation",
      "farcaster",
      "base",
    ],
    heroImageUrl: "/forter.webp",
    tagline: "Transform credibility into yield",
    ogTitle: "Forter - Forecast Porter",
    ogDescription:
      "Stake on credibility, not luck. Build on-chain reputation through verifiable analysis and earn from accurate insights.",
    ogImageUrl: `${ROOT_URL}/og-image.png`,
    noindex: false,
  },
} as const;
