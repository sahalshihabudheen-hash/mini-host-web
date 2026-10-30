export const APK = {
  name: 'MiniHost.apk',
  url: '/MiniHost.apk',
  sizeMB: 5.4,
  version: '5.2.4',
  minAndroid: 'Android 8.0',
  arch: '64-bit (arm64) phones',
}

/**
 * Your Discord snowflake (Discord Settings → Advanced → Developer Mode on,
 * then right-click your own profile → Copy User ID).
 * Lanyard only answers once you have joined https://discord.gg/lanyard once.
 */
export const DISCORD_ID = '1146350719507648643'

export const lanyardUrl = (id: string) => `https://api.lanyard.rest/v1/users/${id}`

export type Feature = {
  title: string
  text: string
  icon: string
}

export const features: Feature[] = [
  {
    title: 'A server that lives in your pocket',
    text: 'MiniHost runs a full Minecraft: Java Edition server (Paper) right on your Android phone. Pick a Minecraft version in the app and switch it later whenever you want.',
    icon: 'server',
  },
  {
    title: 'No PC, no Termux, no setup scripts',
    text: 'Everything happens inside the app. MiniHost even downloads and manages its own Java runtime, so you never touch a command line.',
    icon: 'phone',
  },
  {
    title: 'Friends join from anywhere',
    text: 'A built-in tunnel gives your server a public address, so friends can connect over the internet — not just the same Wi-Fi.',
    icon: 'globe',
  },
  {
    title: 'Bedrock crossplay built in',
    text: 'One tap in Settings sets up Geyser and Floodgate, so players on Minecraft: Bedrock Edition (phones & consoles) can join your Java server too.',
    icon: 'bridge',
  },
  {
    title: 'Plugin browser',
    text: 'Install community plugins straight from Modrinth — EssentialsX, LuckPerms, WorldEdit, WorldGuard, ViaVersion, DiscordSRV and more.',
    icon: 'puzzle',
  },
  {
    title: 'WorldEdit & schematics',
    text: 'Set up WorldEdit with one tap, upload schematic files from your phone, then paste them in game with //schem load.',
    icon: 'cube',
  },
  {
    title: 'Backups & a real file manager',
    text: 'Back up your world with a tap, restore from earlier saves, upload files and folders, and edit configs right in the app.',
    icon: 'shield',
  },
  {
    title: 'Make it yours',
    text: 'Customize the server name and message players see in their server list, the tab list, the sidebar scoreboard, the welcome message, the server logo and game rules.',
    icon: 'wand',
  },
]

export type Shot = {
  src: string
  alt: string
  caption: string
}

export const shots: Shot[] = [
  {
    src: '/images/minecart-tunnel.jpg',
    alt: 'Two Minecraft players riding minecarts along rails through a narrow torch-lit tunnel, the leading player wearing a black outfit with a white, blue and red visor, the second raising a tool overhead as daylight shows at the far end.',
    caption: 'Tunnel run with my brother',
  },
  {
    src: '/images/petting-wolves.jpg',
    alt: 'A Minecraft player in a long black coat with purple trim crouching down to hold the paws of a tamed wolf wearing a red collar, a second wolf lying on the grass nearby, in front of a stepped dirt hillside with a wooden door.',
    caption: 'The boys getting some pets',
  },
  {
    src: '/images/riding-the-dragon.jpg',
    alt: 'Two Minecraft players riding on the back of a large winged ender dragon with glowing magenta eyes as it flies over a village, a river and forested hills under a bright blocky sky.',
    caption: 'Flying home with my brother',
  },
  {
    src: '/images/the-night.jpg',
    alt: 'A player holding a torch at night beside a chest, crafting table and furnace, with a glowing square moon and a starry sky.',
    caption: 'Home base under the stars',
  },
  {
    src: '/images/friends-night.jpg',
    alt: 'Two players standing back-to-back with a diamond sword, surrounded by zombies, creepers, skeletons and spiders at night.',
    caption: 'When night falls, stick together',
  },
  {
    src: '/images/fight.jpg',
    alt: 'An Enderman unleashing a shockwave that sends several players and blocks of dirt flying across a grassy field.',
    caption: 'Every world has its surprises',
  },
  {
    src: '/images/getting-ready.jpg',
    alt: 'An archer and a TV-headed robot facing off across a crafting table with a diamond sword leaning against it.',
    caption: 'Getting ready for the duel',
  },
  {
    src: '/images/friend-with-cow.jpg',
    alt: 'A player waving beside a cow in front of a wooden house, with a bright sun flare and blurred green trees behind.',
    caption: 'Making friends along the way',
  },
  {
    src: '/images/ambush.jpg',
    alt: 'A villager with a bomb for a head floating in a boat on dark water, facing an Enderman holding a golden sword, with fire glowing on nether-brick structures behind.',
    caption: 'Expect the unexpected',
  },
  {
    src: '/images/night-desk.jpg',
    alt: 'A player enjoying a mug by a desk with a monitor and cookies while another player stands behind, in a cozy plank-walled room at night.',
    caption: 'After a long day in the world',
  },
]

export type Step = {
  title: string
  text: string
}

export const steps: Step[] = [
  {
    title: 'Install MiniHost',
    text: 'Download the APK from this page and install it on your Android phone. On first launch you can sign in with Google or skip it for now.',
  },
  {
    title: 'Quick first-time setup',
    text: 'MiniHost asks which Wi-Fi to use, scans your device, then lets you name your server and pick a look. You can change all of it later in Settings.',
  },
  {
    title: 'Press Start server',
    text: 'MiniHost sets up its own Java runtime and the Paper server software, then boots your world — watch it come alive in the built-in console.',
  },
  {
    title: 'Share the address',
    text: 'Once the server is running, an address appears on Home. Send it to your friends and they can join through the built-in tunnel — from anywhere.',
  },
]

export type Faq = { q: string; a: string }

export const faqs: Faq[] = [
  {
    q: 'What is MiniHost?',
    a: 'MiniHost is an Android app that hosts Minecraft: Java Edition servers (Paper server software) directly on your phone. It handles Java, the server, plugins, backups and a tunnel so friends can join — without a PC, Termux or any command line.',
  },
  {
    q: 'How do I download the APK?',
    a: 'Use the Download page on this site. The APK is served directly — there is no store listing, so this website (or wherever the developer shares it) is the official source. Only download MiniHost from a source you trust.',
  },
  {
    q: 'How do I install it?',
    a: 'Open the downloaded APK on your phone. Android may ask you to approve installing apps from that source (your browser or file manager) — allow it, then confirm the install. After that, updates can be installed from inside the app when it offers them.',
  },
  {
    q: 'Which devices and Minecraft versions are supported?',
    a: 'You need an Android phone running Android 8.0 or newer with a 64-bit (arm64) processor. The Minecraft version is chosen inside the app from the versions Paper currently offers, and you can switch versions later. Bedrock players can join through the built-in Geyser crossplay.',
  },
  {
    q: 'How do I get help?',
    a: 'Two ways. Inside the app there is a "Suggestion or bug?" option that goes straight to the developer, and the About & Contact page on this site has a form that delivers your message to the same place, plus a live Discord presence card so you can see when someone is around.',
  },
]
