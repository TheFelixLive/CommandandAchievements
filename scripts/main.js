import { system, world, EntityTypes, EffectTypes, ItemTypes, BlockTypes, EnchantmentTypes, WeatherType, CustomCommandParamType, CommandPermissionLevel, CustomCommandStatus} from "@minecraft/server";
import { ActionFormData, ModalFormData, MessageFormData  } from "@minecraft/server-ui"
import { CustomForm, MessageBox, ObservableBoolean, ObservableNumber, ObservableString } from "@minecraft/server-ui"

import { operatorMode } from "./mode.js"

// let operatorMode = world.getPackSettings()[com2hard:operator_mode]; // Will be enabled in the future when the API is available, for now it is determined by the subpack

const version_info = {
  name: "Command&Achievement",
  version: "v.8.0.0",
  build: "B058",
  release_type: 0, // 0 = Development version (with debug); 1 = Beta version; 2 = Stable version
  unix: 1781997016496,
  update_message_period_unix: 6 * 30 * 24 * 60 * 60 * 1000, // Normally 6 months = 15897600
  uuid: "a9bdf889-7080-419c-b23c-adfc8704c4c1",
  changelog: {
    // new_features
    new_features: [
      "Utilized the new OreUI Menu system to improve the performance and reliability of the addon",
    ],
    // general_changes
    general_changes: [
      "Rewrote the entire menu system, to support search indexing",
    ],
    // bug_fixes
    bug_fixes: [
    ]
  }
}

console.log("Hello from " + version_info.name + " - "+version_info.version+" ("+version_info.build+") - Further debugging is "+ (version_info.release_type == 0? "enabled" : "disabled" ) + " by the version")

/*------------------------
  Development world settings --- will removed in final release, ignore for now
-------------------------*/

system.run(() => {
  if (version_info.release_type != 0) return; // Only run in development version

  world.getDimension("overworld").runCommand("gamerule showCoordinates true");
  world.getDimension("overworld").runCommand("gamemode creative @a");
  world.getDimension("overworld").runCommand("gamerule doDayLightCycle false");
  world.getDimension("overworld").runCommand("gamerule doWeatherCycle false");
  world.getDimension("overworld").runCommand("difficulty peaceful");
});

/*------------------------
  Internal lists
-------------------------*/

const links = [
  {name: "§l§5Github:§r", link: "github.com/TheFelixLive/Command2Hardcore"},
  {name: "§l§7Curseforge:§r", link: "curseforge.com/projects/1277546"},
  {name: "§l§aMcpedl:§r", link: "mcpedl.com/commandandachievements"}

]

const timezone_list = [
  {
    name: "Baker Island Time",
    utc: -12,
    short: "BIT",
    location: ["Baker Island"],
    lang: ["en_us"]
  },
  {
    name: "Niue Time",
    utc: -11,
    short: "NUT",
    location: ["Niue", "American Samoa"],
    lang: ["en_us"]
  },
  {
    name: "Hawaii-Aleutian Standard Time",
    utc: -10,
    short: "HAST",
    location: ["Hawaii", "Honolulu"],
    lang: ["en_us"]
  },
  {
    name: "Marquesas Time",
    utc: -9.5,
    short: "MART",
    location: ["Marquesas Islands"],
    lang: ["fr_fr", "ty_ty"]
  },
  {
    name: "Alaska Standard Time",
    utc: -9,
    short: "AKST",
    location: ["Anchorage"],
    lang: ["en_us"]
  },
  {
    name: "Pacific Standard Time",
    utc: -8,
    short: "PST",
    location: ["Los Angeles (Winter)", "Vancouver (Winter)"],
    lang: ["en_us", "en_ca"]
  },
  {
    name: "Pacific Daylight / Mountain Standard Time",
    utc: -7,
    short: "PDT / MST",
    location: ["Los Angeles (Summer)", "Vancouver (Summer)", "Denver (Winter)", "Phoenix"],
    lang: ["en_us", "en_ca"]
  },
  {
    name: "Mountain Daylight / Central Standard Time",
    utc: -6,
    short: "MDT / CST",
    location: ["Denver (Summer)", "Chicago (Winter)", "Mexico City (Winter)"],
    lang: ["en_us", "es_mx"]
  },
  {
    name: "Central Daylight / Eastern Standard Time",
    utc: -5,
    short: "CDT / EST",
    location: ["Chicago (Summer)", "New York (Winter)", "Toronto (Winter)"],
    lang: ["en_us", "fr_ca", "fr_fr"]
  },
  {
    name: "Atlantic Standard / Eastern Daylight Time",
    utc: -4,
    short: "AST / EDT",
    location: ["Santiago (Winter)", "Caracas (Winter)", "New York (Summer)", "Toronto (Summer)"],
    lang: ["en_us", "es_cl", "es_ve", "fr_ca"]
  },
  {
    name: "Newfoundland Standard Time",
    utc: -3.5,
    short: "NST",
    location: ["St. John's (Winter)"],
    lang: ["en_ca"]
  },
  {
    name: "Atlantic Daylight / Argentina Time",
    utc: -3,
    short: "ADT / ART",
    location: ["Santiago (Summer)", "Buenos Aires", "São Paulo"],
    lang: ["es_cl", "es_ar", "pt_br"]
  },
  {
    name: "Newfoundland Daylight Time",
    utc: -2.5,
    short: "NDT",
    location: ["St. John's (Summer)"],
    lang: ["en_ca"]
  },
  {
    name: "South Georgia Time",
    utc: -2,
    short: "GST",
    location: ["South Georgia"],
    lang: ["en_gb"]
  },
  {
    name: "Azores Standard Time",
    utc: -1,
    short: "AZOT",
    location: ["Azores (Winter)"],
    lang: ["pt_pt"]
  },
  {
    name: "Greenwich Mean Time / Azores Summer Time",
    utc: 0,
    short: "GMT / AZOST",
    location: ["London (Winter)", "Reykjavík", "Azores (Summer)"],
    lang: ["en_gb", "is_is", "pt_pt"]
  },
  {
    name: "Central European Time / British Summer Time",
    utc: 1,
    short: "CET / BST",
    location: ["Berlin (Winter)", "Paris (Winter)", "Rome (Winter)", "London (Summer)"],
    lang: [ "de_de", "de_at", "de_ch", "fr_fr", "fr_be", "fr_ch", "it_it", "en_gb"]
  },
  {
    name: "Central European Summer / Eastern European Time",
    utc: 2,
    short: "CEST / EET",
    location: ["Berlin (Summer)", "Paris (Summer)", "Rome (Summer)", "Athens (Winter)", "Cairo (Winter)", "Helsinki (Winter)"],
    lang: ["de_de", "de_at", "de_ch", "fr_fr", "fr_be", "fr_ch", "it_it", "el_gr", "ar_eg", "ar_sa", "fi_fi", "sv_se"]
  },
  {
    name: "Eastern European Summer / Moscow Time",
    utc: 3,
    short: "EEST / MSK",
    location: ["Athens (Summer)", "Cairo (Summer)", "Moscow", "Istanbul"],
    lang: ["el_gr", "ar_eg", "ar_sa", "ru_ru", "ru_ua", "tr_tr"]
  },
  {
    name: "Iran Standard Time",
    utc: 3.5,
    short: "IRST",
    location: ["Tehran (Winter)"],
    lang: ["fa_ir"]
  },
  {
    name: "Iran Daylight Time / Gulf Standard Time",
    utc: 4,
    short: "IRDT / GST",
    location: ["Tehran (Summer)", "Dubai", "Abu Dhabi"],
    lang: ["fa_ir", "ar_ae", "ar_sa"]
  },
  {
    name: "Afghanistan Time",
    utc: 4.5,
    short: "AFT",
    location: ["Kabul"],
    lang: ["ps_af", "fa_ir"]
  },
  {
    name: "Pakistan Standard Time",
    utc: 5,
    short: "PKT",
    location: ["Karachi", "Islamabad"],
    lang: ["en_pk", "ur_pk"]
  },
  {
    name: "India Standard Time",
    utc: 5.5,
    short: "IST",
    location: ["New Delhi", "Mumbai", "Colombo"],
    lang: ["en_in", "hi_in", "si_lk", "ta_in", "ta_lk"]
  },
  {
    name: "Nepal Time",
    utc: 5.75,
    short: "NPT",
    location: ["Kathmandu"],
    lang: ["ne_np"]
  },
  {
    name: "Bangladesh Time",
    utc: 6,
    short: "BST",
    location: ["Dhaka"],
    lang: ["bn_bd"]
  },
  {
    name: "Cocos Islands Time",
    utc: 6.5,
    short: "CCT",
    location: ["Cocos Islands"],
    lang: ["en_au"]
  },
  {
    name: "Indochina Time",
    utc: 7,
    short: "ICT",
    location: ["Bangkok", "Hanoi", "Jakarta"],
    lang: ["th_th", "vi_vn", "id_id"]
  },
  {
    name: "China Standard Time",
    utc: 8,
    short: "CST",
    location: ["Beijing", "Shanghai", "Singapore"],
    lang: ["zh_cn", "en_sg", "ms_sg", "ta_sg"]
  },
  {
    name: "Australian Central Western Time",
    utc: 8.75,
    short: "ACWST",
    location: ["Eucla"],
    lang: ["en_au"]
  },
  {
    name: "Japan Standard Time",
    utc: 9,
    short: "JST",
    location: ["Tokyo", "Seoul"],
    lang: ["ja_jp", "ko_kr"]
  },
  {
    name: "Australian Central Standard Time",
    utc: 9.5,
    short: "ACST",
    location: ["Adelaide", "Darwin"],
    lang: ["en_au"]
  },
  {
    name: "Australian Eastern Standard Time",
    utc: 10,
    short: "AEST",
    location: ["Brisbane", "Melbourne", "Sydney"],
    lang: ["en_au"]
  },
  {
    name: "Lord Howe Standard Time",
    utc: 10.5,
    short: "LHST",
    location: ["Lord Howe Island"],
    lang: ["en_au"]
  },
  {
    name: "Solomon Islands Time",
    utc: 11,
    short: "SBT",
    location: ["Honiara", "New Caledonia"],
    lang: ["en_nz", "fr_nc"]
  },
  {
    name: "New Zealand Standard Time",
    utc: 12,
    short: "NZST",
    location: ["Wellington", "Auckland"],
    lang: ["en_nz", "mi_nz"]
  },
  {
    name: "Chatham Islands Standard Time",
    utc: 12.75,
    short: "CHAST",
    location: ["Chatham Islands"],
    lang: ["en_nz", "mi_nz"]
  },
  {
    name: "Tonga Time",
    utc: 13,
    short: "TOT",
    location: ["Tonga", "Tokelau"],
    lang: ["en_nz", "to_to"]
  },
  {
    name: "Line Islands Time",
    utc: 14,
    short: "LINT",
    location: ["Kiritimati", "Line Islands"],
    lang: ["en_ki", "gil_ki"]
  }
];

const entity_blocklist = [
  {
    id: "agent" // Not working properly since it is invisible for the Script Engine & Commands
  },
  {
    id: "area_effect_cloud" // WTF
  },
  {
    id: "armor_stand"
  },
  {
    id: "arrow"
  },
  {
    id: "boat"
  },
  {
    id: "breeze_wind_charge_projectile"
  },
  {
    id: "chest_boat"
  },
  {
    id: "chest_minecart"
  },
  {
    id: "command_block_minecart"
  },
  {
    id: "dragon_fireball"
  },
  {
    id: "egg"
  },
  {
    id: "ender_crystal"
  },
  {
    id: "ender_pearl"
  },
  {
    id: "eye_of_ender_signal"
  },
  {
    id: "fireball"
  },
  {
    id: "fireworks_rocket"
  },
  {
    id: "fishing_hook"
  },
  {
    id: "hopper_minecart"
  },
  {
    id: "lightning_bolt"
  },
  {
    id: "lingering_potion"
  },
  {
    id: "llama_spit"
  },
  {
    id: "minecart"
  },
  {
    id: "ominous_item_spawner"
  },
  {
    id: "player"
  },
  {
    id: "shulker_bullet"
  },
  {
    id: "small_fireball"
  },
  {
    id: "snowball"
  },
  {
    id: "splash_potion"
  },
  {
    id: "thrown_trident"
  },
  {
    id: "tnt"
  },
  {
    id: "tnt_minecart"
  },
  {
    id: "tripod_camera" // WTF
  },
  {
    id: "wind_charge_projectile"
  },
  {
    id: "wither_skull"
  },
  {
    id: "wither_skull_dangerous"
  },
  {
    id: "xp_bottle"
  },
  {
    id: "xp_orb"
  },
  // Minecraft still has the V1 Villagers in the code, the ones before 1.14, which you will no longer find because they are all replaced by V2 automatically
  {
    id: "zombie_villager"
  },
  {
    id: "villager"
  },
  // Only available if edu is activated
  {
    id: "balloon"
  },
  {
    id: "ice_bomb"
  }
]

const entity_exceptionlist = {
  evocation_illager: {
    icon: "textures/items/spawn_eggs/spawn_egg_evoker"
  },

  zombie_pigman: {
    icon: "textures/items/spawn_eggs/spawn_egg_zombified_piglin"
  },

  villager_v2: {
    icon: "textures/items/spawn_eggs/spawn_egg_villager"
  },

  zombie_villager_v2: {
    icon: "textures/items/spawn_eggs/spawn_egg_zombie_villager"
  }
}

const gamerules = [
  { id: "commandBlockOutput", type: "boolean", tooltip: "Command blocks output messages to operators.", name: "Command Blocks send Feedback", default: true },
  { id: "commandBlocksEnabled", type: "boolean", tooltip: "Command blocks are enabled.", name: "Command Blocks", default: true },
  { id: "doDayLightCycle", type: "boolean", tooltip: "The daylight cycle progresses naturally.", name: "Daylight Cycle", default: true },
  { id: "doEntityDrops", type: "boolean", tooltip: "Entities drop items when destroyed.", name: "Objects drop Items", default: true },
  { id: "doFireTick", type: "boolean", tooltip: "Fire spreads and extinguishes naturally.", name: "Fire spreads", default: true },
  { id: "doImmediateRespawn", type: "boolean", tooltip: "players respawn immediately without death screen.", name: "Immediate Respawn after a death", default: false },
  { id: "doInsomnia", type: "boolean", tooltip: "Phantoms spawn when players haven’t slept.", name: "Phantoms can spawn", default: true },
  { id: "doLimitedCrafting", type: "boolean", tooltip: "Only unlocked recipes can be crafted.", name: "Limited Crafting", default: false },
  { id: "doMobLoot", type: "boolean", tooltip: "Mobs drop loot on death.", name: "Mobs drop Loot", default: true },
  { id: "doMobSpawning", type: "boolean", tooltip: "Mobs spawn naturally.", name: "Mobs spawn", default: true },
  { id: "doTileDrops", type: "boolean", tooltip: "Blocks drop items when broken.", name: "Blocks drop Items", default: true },
  { id: "doWeatherCycle", type: "boolean", tooltip: "Weather changes naturally.", name: "Weather Cycle", default: true },

  { id: "drowningDamage", type: "boolean", tooltip: "players take damage from drowning.", name: "Drowning Damage", default: true },
  { id: "fallDamage", type: "boolean", tooltip: "players take fall damage.", name: "Fall Damage", default: true },
  { id: "fireDamage", type: "boolean", tooltip: "players take damage from fire.", name: "Fire Damage", default: true },
  { id: "freezeDamage", type: "boolean", tooltip: "players take damage from freezing.", name: "Freeze Damage", default: true },

  { id: "functionCommandLimit", type: "numberText", tooltip: "Max number of commands a function can run.", name: "Function Command Limit", default: 10000 },

  { id: "keepInventory", type: "boolean", tooltip: "players keep inventory after death.", name: "Keep Inventory on Death", default: false },
  { id: "maxCommandChainLength", type: "numberText", tooltip: "Maximum number of commands in a command chain.", name: "Max Command Chain Length", default: 65536 },

  { id: "mobGriefing", type: "boolean", tooltip: "Mobs can modify the world (e.g., Creepers explode blocks).", name: "Mobs can modify the Blocks", default: true },
  { id: "naturalRegeneration", type: "boolean", tooltip: "players regenerate health naturally.", name: "Natural Health Regeneration", default: true },

  { id: "playersSleepingPercentage", type: "slider", min: 0, max: 100, step: 1, tooltip: "Percent of players required to sleep to skip the night.", name: "Players Sleeping Percentage", default: 100 },

  { id: "projectilesCanBreakBlocks", type: "boolean", tooltip: "Projectiles can break blocks.", name: "Projectiles can break Blocks", default: false },
  { id: "pvp", type: "boolean", tooltip: "players can damage each other (PvP enabled).", name: "Player vs. Player Combat (PvP)", default: true },

  { id: "randomTickSpeed", type: "slider", min: 0, max: 1000, step: 1, tooltip: "Rate of random ticks (affects growth, fire, etc.).", name: "Random Tick Speed", default: 1 },

  { id: "recipesUnlock", type: "boolean", tooltip: "Recipes unlock automatically as you progress.", name: "Automatic Recipe Unlocking", default: true },
  { id: "respawnBlocksExplode", type: "boolean", tooltip: "Respawn anchors explode when used improperly.", name: "Respawn anchors can explode", default: true },
  { id: "sendCommandFeedback", type: "boolean", tooltip: "Feedback from commands appears in chat.", name: "Command Feedback in Chat", default: true },
  { id: "showBorderEffect", type: "boolean", tooltip: "World border visual effect is visible.", name: "Border Block Effect", default: true },
  { id: "showCoordinates", type: "boolean", tooltip: "Displays coordinates in the HUD.", name: "Coordinates in HUD", default: false },
  { id: "showDaysPlayed", type: "boolean", tooltip: "Displays the number of in-game days played.", name: "Days Played in HUD", default: false },
  { id: "showDeathMessages", type: "boolean", tooltip: "Death messages are displayed in chat.", name: "Death Messages in Chat", default: true },
  { id: "showRecipeMessages", type: "boolean", tooltip: "Recipe unlock messages are shown.", name: "Recipe Unlock Messages", default: true },
  { id: "showTags", type: "boolean", tooltip: "Entity tags are shown.", name: "Show Item restrictions", default: true },

  { id: "spawnRadius", type: "slider", min: 0, max: 100, step: 1, tooltip: "Spawn radius from the world spawn point.", name: "Spawn Radius", default: 10 },

  { id: "tntExplodes", type: "boolean", tooltip: "TNT can explode.", name: "TNT Explodes", default: true },
  { id: "tntExplosionDropDecay", type: "boolean", tooltip: "Explosions reduce the amount of dropped items.", name: "Reduces items dropped by explosions", default: true }
];

const command_categories = [
  {
    name: "Agent Commands",
    description: "Control and manage your Agent",
    icon: "textures/items/spawn_eggs/spawn_egg_agent"
  },
  {
    name: "World Commands",
    description: "Modify the world",
    icon: "textures/ui/worldsIcon"
  },
  {
    name: "Entity Commands",
    description: "Manage entities",
    icon: "textures/ui/promo_creeper"
  },
  {
    name: "Player Commands",
    description: "Manage players",
    icon: "textures/ui/warning_alex"
  },
  {
    name: "Game Commands",
    description: "Manage game settings and rules",
    icon: "textures/ui/controller_glyph_color_switch"
  }
]

const command_list = [
  // types: literal, string, int, float, bool, location, blocktype, itemtype, entityType, entityselector, playerselector, effectType, enchantType, weathertype, json, choice, repeat, command_tail, (gameruletype), enum
  {
    name: "agent",
    aliases: ["agent"],
    description: "Control and manage your Agent",
    textures: "textures/items/spawn_eggs/spawn_egg_agent",
    category: 0,
    syntaxes: [
      { type: "literal", value: "agent" },
      {
        type: "choice",
        options: [
          { name: "create", syntaxes: [] },
          { name: "remove", syntaxes: [] },
          {
            name: "move",
            syntaxes: [
              {
                type: "enum",
                name: "direction",
                value: ["forward", "back", "left", "right", "up", "down"]
              }
            ]
          },
          {
            name: "turn",
            syntaxes: [
              {
                type: "enum",
                name: "turnDirection",
                value: ["left", "right"]
              }
            ]
          },
          {
            name: "attack",
            syntaxes: [
              {
                type: "enum",
                name: "direction",
                value: ["forward", "up", "down"]
              }
            ]
          },
          {
            name: "destroy",
            syntaxes: [
              {
                type: "enum",
                name: "direction",
                value: ["forward", "up", "down"]
              }
            ]
          },
          {
            name: "place",
            syntaxes: [
              { type: "int", name: "slotNum" },
              {
                type: "enum",
                name: "direction",
                value: ["forward", "up", "down"]
              }
            ]
          },
          {
            name: "collect",
            syntaxes: [{ type: "itemtype", name: "item" }]
          },
          {
            name: "drop",
            syntaxes: [
              { type: "int", name: "slotNum" },
              { type: "int", name: "quantity", optional: true },
              {
                type: "enum",
                name: "direction",
                optional: true,
                value: ["forward", "up", "down"]
              }
            ]
          },
          {
            name: "transfer",
            syntaxes: [
              { type: "int", name: "srcSlotNum" },
              { type: "int", name: "quantity" },
              { type: "int", name: "dstSlotNum" }
            ]
          },
          {
            name: "inspect",
            syntaxes: [
              {
                type: "enum",
                name: "direction",
                value: ["forward", "up", "down"]
              }
            ]
          },
          { name: "getposition", syntaxes: [] },
          {
            name: "tp",
            syntaxes: [{ type: "location", name: "coordinates" }]
          }
        ]
      }
    ]
  },

  // --- Fill ---
  {
    name: "fill",
    aliases: ["fill"],
    textures: "textures/items/wood_axe",
    description: "Fill area with blocks",
    category: 1,
    syntaxes: [
      { type: "literal", value: "fill" },
      { type: "location", name: "from" },
      { type: "location", name: "to" },
      { type: "blocktype", name: "block" },
      { type: "int", name: "data", optional: true },
      {
        type: "enum",
        name: "mode",
        value: ["destroy", "hollow", "keep", "outline", "replace"]
      }
    ]
  },

  // --- Effect ---
  {
    name: "effect",
    aliases: ["effect"],
    textures: "textures/ui/strength_effect",
    description: "Add/remove potion effects",
    recommended: (player) => player.getEffects().length > 0 || !(world.getTimeOfDay() < 12000) || player.isInWater || player.isFalling,
    vc_hiperlink: (player, on_output) => {
      if (anyplayerHasEffect()) visual_command_effect_select(player, on_output);
      else visual_command_effect_add(player, on_output);
    },
    vc_available: (player) => true,
    category: 2,
    syntaxes: [
      { type: "literal", value: "effect" },
      { type: "entityselector", name: "target" },
      { type: "effecttype", name: "effect" },
      { type: "int", name: "seconds", optional: true },
      { type: "int", name: "amplifier", optional: true },
      { type: "bool", name: "hideParticles", optional: true }
    ]
  },

  // --- Give ---
  {
    name: "give",
    recommended: (player) => getStackCount(player) < 5,
    aliases: ["give"],
    description: "Gives an item to a player",
    textures: "textures/items/diamond_sword",
    category: 3,
    syntaxes: [
      { type: "literal", value: "give" },
      { type: "playerselector", name: "target" },
      { type: "itemtype", name: "item" },
      { type: "int", name: "count", optional: true },
      { type: "string", name: "data", optional: true },
      { type: "json", name: "components", optional: true }
    ]
  },

  // --- Summon ---
  {
    name: "summon",
    aliases: ["summon"],
    description: "Summons an entity",
    textures: "textures/items/spawn_eggs/spawn_egg_creeper",
    category: 2,
    syntaxes: [
      { type: "literal", value: "summon" },
      { type: "entityType", name: "entityType" },
      { type: "location", name: "pos", optional: true },
      { type: "json", name: "components", optional: true }
    ]
  },

  // --- Teleport ---
  {
    name: "teleport",
    recommended: (player) => isFarthestPlayerFarAway(player, 300),
    aliases: ["teleport", "tp"],
    description: "Teleport entity or player",
    textures: "textures/ui/dressing_room_skins",
    category: 3,
    syntaxes: [
      { type: "literal", value: "teleport" },
      { type: "entityselector", name: "victim" },
      {
        type: "choice",
        options: [
          {
            name: "toEntity",
            emit: false,
            syntaxes: [
              { type: "entityselector", name: "destination" },
              { type: "bool", name: "checkForBlocks", optional: true }
            ]
          },
          {
            name: "toLocation",
            emit: false,
            syntaxes: [
              { type: "location", name: "destination" },
              { type: "float", name: "yRot", optional: true },
              { type: "float", name: "xRot", optional: true },
              { type: "bool", name: "checkForBlocks", optional: true }
            ]
          },
          {
            name: "toLocationFacingPosition",
            emit: false,
            syntaxes: [
              { type: "location", name: "destination" },
              { type: "float", name: "yRot", optional: true },
              { type: "float", name: "xRot", optional: true },
              { type: "bool", name: "checkForBlocks", optional: true },
              { type: "literal", value: "facing" },
              { type: "location", name: "lookAtPosition" }
            ]
          },
          {
            name: "toLocationFacingEntity",
            emit: false,
            syntaxes: [
              { type: "location", name: "destination" },
              { type: "float", name: "yRot", optional: true },
              { type: "float", name: "xRot", optional: true },
              { type: "bool", name: "checkForBlocks", optional: true },
              { type: "literal", value: "facing" },
              { type: "entityselector", name: "lookAtEntity" }
            ]
          }
        ]
      }
    ]
  },

  // --- Camera ---
  {
    name: "camera",
    aliases: ["camera"],
    textures: "textures/ui/camera-yo",
    description: "Control camera",
    category: 3,
    syntaxes: [
      { type: "literal", value: "camera" },
      { type: "playerselector", name: "targets" },
      {
        type: "choice",
        options: [
          {
            name: "attach_to_entity",
            syntaxes: [{ type: "entityselector", name: "target" }]
          },
          { name: "clear", syntaxes: [] },
          { name: "detach_from_entity", syntaxes: [] },
          {
            name: "fade",
            optional: true,
            syntaxes: [
              {
                type: "choice",
                options: [
                  {
                    name: "time",
                    syntaxes: [
                      { type: "float", name: "fadeInSeconds" },
                      { type: "float", name: "holdSeconds" },
                      { type: "float", name: "fadeOutSeconds" },
                      { type: "int", name: "red", optional: true },
                      { type: "int", name: "green" },
                      { type: "int", name: "blue" }
                    ]
                  },
                  {
                    name: "color",
                    syntaxes: [
                      { type: "int", name: "red" },
                      { type: "int", name: "green" },
                      { type: "int", name: "blue" }
                    ]
                  }
                ]
              }
            ]
          },
          { name: "remove_target", syntaxes: [] },
          {
            name: "set",
            syntaxes: [
              {
                type: "enum",
                name: "preset",
                value: [
                  "minecraft:first_person",
                  "minecraft:fixed_boom",
                  "minecraft:follow_orbit",
                  "minecraft:free",
                  "minecraft:third_person",
                  "minecraft:third_person_front"
                ]
              },
              {
                name: "ease",
                optional: true,
                syntaxes: [
                  { type: "float", name: "easeTime" },
                  {
                    type: "enum",
                    name: "easing",
                    optional: true,
                    value: [
                      "linear", "spring", "in_quad", "out_quad", "in_out_quad",
                      "in_cubic", "out_cubic", "in_out_cubic", "in_quart", "out_quart",
                      "in_out_quart", "in_quint", "out_quint", "in_out_quint", "in_sine",
                      "out_sine", "in_out_sine", "in_expo", "out_expo", "in_out_expo",
                      "in_circ", "out_circ", "in_out_circ", "in_bounce", "out_bounce",
                      "in_out_bounce", "in_back", "out_back", "in_out_back", "in_elastic",
                      "out_elastic", "in_out_elastic"
                    ]
                  }
                ]
              },
              {
                name: "pos",
                optional: true,
                syntaxes: [{ type: "location", name: "position" }]
              },
              {
                name: "rot",
                optional: true,
                syntaxes: [
                  { type: "float", name: "xRot" },
                  { type: "float", name: "yRot" }
                ]
              },
              {
                name: "facing",
                optional: true,
                syntaxes: [
                  { type: "entityselector", name: "lookAtEntity", optional: true },
                  { type: "location", name: "lookAtPosition", optional: true }
                ]
              },
              {
                name: "view_offset",
                optional: true,
                syntaxes: [
                  { type: "float", name: "xViewOffset" },
                  { type: "float", name: "yViewOffset" }
                ]
              },
              {
                name: "entity_offset",
                optional: true,
                syntaxes: [
                  { type: "float", name: "xEntityOffset" },
                  { type: "float", name: "yEntityOffset" },
                  { type: "float", name: "zEntityOffset" }
                ]
              }
            ]
          },
          {
            name: "target_entity",
            syntaxes: [
              { type: "entityselector", name: "entity" },
              {
                name: "target_center_offset",
                optional: true,
                syntaxes: [
                  { type: "float", name: "xTargetCenterOffset" },
                  { type: "float", name: "yTargetCenterOffset" },
                  { type: "float", name: "zTargetCenterOffset" }
                ]
              }
            ]
          },
          {
            name: "fov_set",
            syntaxes: [
              { type: "float", name: "fov_value" },
              { type: "float", name: "fovEaseTime", optional: true },
              {
                type: "enum",
                name: "fovEaseType",
                optional: true,
                value: [
                  "linear", "spring", "in_quad", "out_quad", "in_out_quad",
                  "in_cubic", "out_cubic", "in_out_cubic", "in_quart", "out_quart",
                  "in_out_quart", "in_quint", "out_quint", "in_out_quint", "in_sine",
                  "out_sine", "in_out_sine", "in_expo", "out_expo", "in_out_expo",
                  "in_circ", "out_circ", "in_out_circ", "in_bounce", "out_bounce",
                  "in_out_bounce", "in_back", "out_back", "in_out_back", "in_elastic",
                  "out_elastic", "in_out_elastic"
                ]
              }
            ]
          },
          {
            name: "fov_clear",
            syntaxes: [
              { type: "float", name: "fovEaseTime", optional: true },
              {
                type: "enum",
                name: "fovEaseType",
                optional: true,
                value: [
                  "linear", "spring", "in_quad", "out_quad", "in_out_quad",
                  "in_cubic", "out_cubic", "in_out_cubic", "in_quart", "out_quart",
                  "in_out_quart", "in_quint", "out_quint", "in_out_quint", "in_sine",
                  "out_sine", "in_out_sine", "in_expo", "out_expo", "in_out_expo",
                  "in_circ", "out_circ", "in_out_circ", "in_bounce", "out_bounce",
                  "in_out_bounce", "in_back", "out_back", "in_out_back", "in_elastic",
                  "out_elastic", "in_out_elastic"
                ]
              }
            ]
          }
        ]
      }
    ]
  },

  // --- Playsound ---
  {
    name: "playsound",
    aliases: ["playsound"],
    textures: "textures/ui/sound_glyph_color_2x",
    description: "Play a sound",
    category: 4,
    syntaxes: [
      { type: "literal", value: "playsound" },
      { type: "string", name: "sound" },
      { type: "playerselector", name: "targets", optional: true },
      { type: "location", name: "pos", optional: true },
      { type: "float", name: "volume", optional: true },
      { type: "float", name: "pitch", optional: true },
      { type: "float", name: "minVolume", optional: true }
    ]
  },

  // --- Setblock ---
  {
    name: "setblock",
    aliases: ["setblock"],
    description: "Set block at coordinates",
    category: 1,
    syntaxes: [
      { type: "literal", value: "setblock" },
      { type: "location", name: "pos" },
      { type: "blocktype", name: "block" },
      { type: "int", name: "data", optional: true },
      {
        type: "enum",
        name: "mode",
        optional: true,
        value: ["destroy", "keep", "replace"]
      }
    ]
  },

  // --- Weather ---
  {
    name: "weather",
    aliases: ["weather"],
    textures: "textures/ui/cloud_only_storage",
    recommended: (player) => false,
    description: "Set or query the weather",
    category: 1,
    syntaxes: [
      { type: "literal", value: "weather" },
      { type: "weathertype", name: "type" },
      { type: "int", name: "duration", optional: true }
    ]
  },

  // --- Help ---
  {
    name: "help",
    aliases: ["help", "?"],
    textures: "textures/ui/icons/icon_staffpicks",
    cc_hidden: true,
    description: "Show help for commands or a specific command",
    category: 3,
    syntaxes: [
      { type: "literal", value: "help" },
      { type: "string", name: "command", optional: true }
    ]
  },

  // --- Daylock ---
  {
    name: "daylock",
    aliases: ["daylock", "alwaysday"],
    textures: "textures/ui/lock_color",
    description: "Lock/unlock the time of day",
    category: 1,
    syntaxes: [
      { type: "literal", value: "daylock" },
      { type: "bool", name: "enabled" }
    ]
  },

  // --- Clear ---
  {
    name: "clear",
    recommended: (player) => getStackCount(player) > 10,
    aliases: ["clear"],
    textures: "textures/ui/icon_none",
    description: "Clear items from a player's inventory",
    category: 3,
    syntaxes: [
      { type: "literal", value: "clear" },
      { type: "playerselector", name: "player", optional: true },
      { type: "itemtype", name: "item", optional: true },
      { type: "int", name: "count", optional: true }
    ]
  },

  // --- Clearspawnpoint ---
  {
    name: "clearspawnpoint",
    textures: "textures/ui/icon_trash",
    aliases: ["clearspawnpoint"],
    description: "Clear world spawnpoint or player's spawn",
    category: 1,
    syntaxes: [
      { type: "literal", value: "clearspawnpoint" },
      { type: "playerselector", name: "player", optional: true }
    ]
  },

  // --- Clone ---
  {
    name: "clone",
    aliases: ["clone"],
    textures: "textures/ui/icon_recipe_item",
    description: "Clone blocks from one region to another",
    category: 1,
    syntaxes: [
      { type: "literal", value: "clone" },
      { type: "location", name: "begin" },
      { type: "location", name: "end" },
      { type: "location", name: "destination" },
      {
        type: "enum",
        name: "mode",
        optional: true,
        value: ["replace", "masked", "filtered"]
      },
      { type: "string", name: "filterBlock", optional: true }
    ]
  },

  // --- Damage ---
  {
    name: "damage",
    aliases: ["damage"],
    textures: "textures/ui/heart_half",
    description: "Damage an entity",
    category: 2,
    syntaxes: [
      { type: "literal", value: "damage" },
      { type: "entityselector", name: "target" },
      { type: "int", name: "amount" },
      { type: "string", name: "damagetype", optional: true },
      { type: "entityselector", name: "source of the damage", optional: true }
    ]
  },

  // --- Dialogue ---
  {
    name: "dialogue",
    aliases: ["dialogue"],
    textures: "textures/ui/icon_book_writable",
    description: "Show an NPC dialogue to player",
    category: 3,
    syntaxes: [
      { type: "literal", value: "dialogue" },
      { type: "playerselector", name: "player" },
      { type: "string", name: "dialogueId" }
    ]
  },

  // --- Difficulty ---
  {
    name: "difficulty",
    aliases: ["difficulty"],
    textures: "textures/ui/hardcore/freeze_heart",
    description: "Set or query difficulty",
    category: 4,
    syntaxes: [
      { type: "literal", value: "difficulty" },
      {
        type: "enum",
        name: "level",
        value: ["peaceful", "easy", "normal", "hard"]
      }
    ]
  },

  // --- Enchant ---
  {
    name: "enchant",
    aliases: ["enchant"],
    textures: "textures/items/book_enchanted",
    vc_hiperlink: (player, on_output) => visual_command_enchant(player, on_output),
    vc_available: (player) => true,
    visible: (player) => getCompatibleEnchantmentTypes(player.getComponent("minecraft:inventory")?.container?.getItem(player.selectedSlotIndex)).length > 0,
    recommended: (player) => {
      const firstWithEnchantable = world.getAllPlayers().find(p => {
        const item = p.getComponent("minecraft:inventory")?.container?.getItem(p.selectedSlotIndex);
        return !!item && getCompatibleEnchantmentTypes(item).length > 0;
      });
      return !!firstWithEnchantable && firstWithEnchantable.name === player.name;
    },
    description: "Apply an enchantment to an item",
    category: 2,
    syntaxes: [
      { type: "literal", value: "enchant" },
      { type: "playerselector", name: "player" },
      { type: "enchanttype", name: "enchantment" },
      { type: "int", name: "level", optional: true }
    ]
  },

  // --- Event ---
  {
    name: "event",
    textures: "textures/ui/raid_omen_effect",
    aliases: ["event"],
    description: "Trigger a game event",
    category: 4,
    syntaxes: [
      { type: "literal", value: "event" },
      { type: "entityselector", name: "targetEntity" },
      { type: "string", name: "eventName" }
    ]
  },

  // --- Execute ---
  {
    name: "execute",
    aliases: ["execute"],
    description: "Execute a command with modified execution context",
    category: 4,
    syntaxes: [
      { type: "literal", value: "execute" },
      {
        type: "repeat",
        syntaxes: [
          {
            type: "choice",
            name: "ExecuteChainedOption",
            options: [
              { name: "as", syntaxes: [{ type: "entityselector", name: "targets" }] },
              { name: "at", syntaxes: [{ type: "entityselector", name: "targets" }] },
              { name: "in", syntaxes: [{ type: "string", name: "dimension" }] },
              {
                name: "positioned",
                syntaxes: [
                  {
                    type: "choice",
                    name: "positioned_mode",
                    options: [
                      { name: "as", syntaxes: [{ type: "entityselector", name: "targets" }] },
                      { name: "over", syntaxes: [{ type: "string", name: "heightMap" }] },
                      { name: "position", syntaxes: [{ type: "location", name: "position" }] }
                    ]
                  }
                ]
              },
              {
                name: "rotated",
                syntaxes: [
                  {
                    type: "choice",
                    name: "rotated_mode",
                    options: [
                      { name: "as", syntaxes: [{ type: "entityselector", name: "targets" }] },
                      { name: "angles", syntaxes: [{ type: "float", name: "yaw" }, { type: "float", name: "pitch" }] }
                    ]
                  }
                ]
              },
              {
                name: "facing",
                syntaxes: [
                  {
                    type: "choice",
                    name: "facing_mode",
                    options: [
                      {
                        name: "entity",
                        syntaxes: [
                          { type: "entityselector", name: "targets" },
                          {
                            type: "choice",
                            name: "anchor",
                            options: [
                              { name: "eyes", syntaxes: [] },
                              { name: "feet", syntaxes: [] }
                            ]
                          }
                        ]
                      },
                      { name: "position", syntaxes: [{ type: "location", name: "position" }] }
                    ]
                  }
                ]
              },
              { name: "align", syntaxes: [{ type: "string", name: "axes" }] },
              {
                name: "anchored",
                syntaxes: [
                  {
                    type: "choice",
                    name: "anchor",
                    options: [
                      { name: "eyes", syntaxes: [] },
                      { name: "feet", syntaxes: [] }
                    ]
                  }
                ]
              },
              {
                name: "if",
                syntaxes: [
                  {
                    type: "choice",
                    name: "if_mode",
                    options: [
                      {
                        name: "block",
                        syntaxes: [
                          { type: "location", name: "position" },
                          { type: "blocktype", name: "block" },
                          { type: "can_exit_loop" }
                        ]
                      },
                      {
                        name: "blocks",
                        syntaxes: [
                          { type: "location", name: "start" },
                          { type: "location", name: "end" },
                          { type: "location", name: "destination" },
                          {
                            type: "choice",
                            name: "scanMode",
                            options: [
                              { name: "all", syntaxes: [] },
                              { name: "masked", syntaxes: [] }
                            ]
                          },
                          { type: "can_exit_loop" }
                        ]
                      },
                      {
                        name: "entity",
                        syntaxes: [
                          { type: "entityselector", name: "target" },
                          { type: "can_exit_loop" }
                        ]
                      },
                      {
                        name: "score",
                        syntaxes: [
                          { type: "string", name: "target" },
                          { type: "string", name: "targetObjective" },
                          {
                            type: "choice",
                            name: "operator",
                            options: [
                              { name: "<", syntaxes: [] },
                              { name: "<=", syntaxes: [] },
                              { name: "=", syntaxes: [] },
                              { name: ">=", syntaxes: [] },
                              { name: ">", syntaxes: [] }
                            ]
                          },
                          { type: "string", name: "source" },
                          { type: "string", name: "sourceObjective" },
                          { type: "can_exit_loop" }
                        ]
                      }
                    ]
                  }
                ]
              },
              {
                name: "unless",
                syntaxes: [
                  {
                    type: "choice",
                    name: "unless_mode",
                    options: [
                      {
                        name: "block",
                        syntaxes: [
                          { type: "location", name: "position" },
                          { type: "blocktype", name: "block" },
                          { type: "can_exit_loop" }
                        ]
                      },
                      {
                        name: "blocks",
                        syntaxes: [
                          { type: "location", name: "start" },
                          { type: "location", name: "end" },
                          { type: "location", name: "destination" },
                          {
                            type: "choice",
                            name: "scanMode",
                            options: [
                              { name: "all", syntaxes: [] },
                              { name: "masked", syntaxes: [] }
                            ]
                          },
                          { type: "can_exit_loop" }
                        ]
                      },
                      {
                        name: "entity",
                        syntaxes: [
                          { type: "entityselector", name: "target" },
                          { type: "can_exit_loop" }
                        ]
                      },
                      {
                        name: "score",
                        syntaxes: [
                          { type: "string", name: "target" },
                          { type: "string", name: "targetObjective" },
                          {
                            type: "choice",
                            name: "operator",
                            options: [
                              { name: "<", syntaxes: [] },
                              { name: "<=", syntaxes: [] },
                              { name: "=", syntaxes: [] },
                              { name: ">=", syntaxes: [] },
                              { name: ">", syntaxes: [] }
                            ]
                          },
                          { type: "string", name: "source" },
                          { type: "string", name: "sourceObjective" },
                          { type: "can_exit_loop" }
                        ]
                      }
                    ]
                  }
                ]
              },
              {
                name: "run",
                syntaxes: [
                  { type: "command_tail", name: "command" },
                  { type: "exit_loop" }
                ]
              }
            ]
          }
        ]
      }
    ]
  },

  // --- XP ---
  {
    name: "xp",
    aliases: ["xp", "experience"],
    textures: "textures/items/experience_bottle",
    description: "Grant experience points",
    category: 3,
    syntaxes: [
      { type: "literal", value: "xp" },
      { type: "int", name: "amount" },
      { type: "playerselector", name: "player", optional: true }
    ]
  },

  // --- Fog ---
  {
    name: "fog",
    aliases: ["fog"],
    textures: "textures/ui/bottle_empty_pocket",
    description: "Control fog",
    category: 1,
    syntaxes: [
      { type: "literal", value: "fog" },
      { type: "playerselector", name: "targets", optional: true },
      {
        type: "choice",
        options: [
          {
            name: "set",
            syntaxes: [
              { type: "float", name: "density", optional: true },
              {
                name: "color",
                optional: true,
                syntaxes: [
                  { type: "int", name: "red" },
                  { type: "int", name: "green" },
                  { type: "int", name: "blue" }
                ]
              },
              {
                name: "distance",
                optional: true,
                syntaxes: [
                  { type: "float", name: "startDistance" },
                  { type: "float", name: "endDistance", optional: true }
                ]
              },
              {
                name: "transition",
                optional: true,
                syntaxes: [
                  { type: "float", name: "timeSeconds" },
                  {
                    type: "enum",
                    name: "easing",
                    optional: true,
                    value: [
                      "linear", "spring", "in_quad", "out_quad", "in_out_quad",
                      "in_cubic", "out_cubic", "in_out_cubic"
                    ]
                  }
                ]
              }
            ]
          },
          {
            name: "preset",
            syntaxes: [
              {
                type: "enum",
                name: "presetName",
                value: ["default", "dense", "light", "haze", "underwater"]
              },
              { type: "float", name: "transitionTime", optional: true }
            ]
          },
          {
            name: "color",
            syntaxes: [
              { type: "int", name: "red" },
              { type: "int", name: "green" },
              { type: "int", name: "blue" }
            ]
          },
          {
            name: "blend",
            syntaxes: [
              { type: "float", name: "durationSeconds" },
              { type: "float", name: "fromDensity" },
              { type: "int", name: "fromRed" },
              { type: "int", name: "fromGreen" },
              { type: "int", name: "fromBlue" },
              { type: "float", name: "toDensity" },
              { type: "int", name: "toRed" },
              { type: "int", name: "toGreen" },
              { type: "int", name: "toBlue" }
            ]
          },
          { name: "clear", syntaxes: [] },
          { name: "follow_weather", syntaxes: [] },
          {
            name: "toggle",
            syntaxes: [{ type: "bool", name: "enabled", optional: true }]
          }
        ]
      }
    ]
  },

  // --- Function ---
  {
    name: "function",
    aliases: ["function"],
    description: "Run a function",
    textures: "textures/ui/copy",
    category: 4,
    syntaxes: [
      { type: "literal", value: "function" },
      { type: "string", name: "name" }
    ]
  },

  // --- Gamemode ---
  {
    name: "gamemode",
    aliases: ["gamemode", "gm"],
    textures: "textures/ui/permissions_op_crown",
    description: "Set a player's game mode",
    vc_hiperlink: (player, on_output) => visual_command_gamemode(player, on_output),
    vc_available: (player) => true,
    visible: (player) => world.isHardcore === false,
    recommended: (player) => {
      const gm = player.getGameMode();
      return gm !== "Survival" && gm !== "Creative";
    },
    category: 4,
    syntaxes: [
      { type: "literal", value: "gamemode" },
      {
        type: "enum",
        name: "mode",
        value: ["survival", "creative", "adventure", "default", "spectator", "s", "a", "d", "c"]
      },
      { type: "playerselector", name: "target", optional: true }
    ]
  },

  // --- Gamerule ---
  {
    name: "gamerule",
    aliases: ["gamerule"],
    cc_hidden: true,
    textures: "textures/ui/settings_pause_menu_icon",
    vc_hiperlink: (player, on_output) => visual_command_gamerule_new(player, on_output),
    recommended: (player) => world.gameRules.randomTickSpeed > 100,
    vc_available: (player) => true,
    description: "Set a gamerule",
    category: 4,
    syntaxes: [
      { type: "literal", value: "gamerule" },
      { type: "gameruletype", name: "rule" },
      { type: "string", name: "value" }
    ]
  },

  // --- HUD ---
  {
    name: "hud",
    aliases: ["hud"],
    textures: "textures/ui/hunger_full",
    description: "Control HUD elements",
    category: 3,
    syntaxes: [
      { type: "literal", value: "hud" },
      { type: "playerselector", name: "target" },
      {
        type: "enum",
        name: "visible",
        value: ["hide", "reset"]
      },
      {
        type: "enum",
        name: "hud_element",
        optional: true,
        value: [
          "hunger", "all", "paperdoll", "armor", "tooltips", "touch_controls",
          "crosshair", "hotbar", "health", "progress_bar", "air_bubbles",
          "horse_health", "status_effects", "item_text"
        ]
      }
    ]
  },

  // --- Inputpermission ---
  {
    name: "inputpermission",
    aliases: ["inputpermission"],
    textures: "textures/ui/controller_glyph_color_switch",
    description: "Grant or revoke input permissions",
    recommended: (player) => [...Array(13).keys()].some(x => !player.inputPermissions.isPermissionCategoryEnabled(x)),
    category: 3,
    syntaxes: [
      { type: "literal", value: "inputpermission" },
      {
        type: "enum",
        name: "subcommand",
        value: ["set", "reset", "query"]
      },
      { type: "playerselector", name: "player" },
      {
        type: "enum",
        name: "permission",
        optional: true,
        value: [
          "camera", "movement", "jump", "lateral_movement", "sneak",
          "dismount", "mount", "move_backward", "move_forward", "move_left",
          "move_right", "use_item", "all"
        ]
      },
      { type: "bool", name: "value", optional: true }
    ]
  },

  // --- Seed ---
  {
    name: "seed",
    category: 1,
    aliases: ["seed"],
    textures: "textures/ui/worldsIcon",
    description: "Gives the world seed",
    syntaxes: [{ type: "literal", value: "seed" }]
  },

  // --- Kill ---
  {
    name: "kill",
    aliases: ["kill"],
    textures: "textures/ui/heart_background",
    description: "Kill entities",
    category: 2,
    syntaxes: [
      { type: "literal", value: "kill" },
      { type: "entityselector", name: "target", optional: true }
    ]
  },

  // --- Music ---
  {
    name: "music",
    aliases: ["music"],
    textures: "textures/ui/sound_glyph_color_2x",
    description: "Play / queue / stop music tracks",
    category: 4,
    syntaxes: [
      { type: "literal", value: "music" },
      {
        type: "choice",
        options: [
          {
            name: "play",
            syntaxes: [
              { type: "string", name: "trackName" },
              { type: "float", name: "volume", optional: true },
              { type: "float", name: "fadeSeconds", optional: true },
              {
                type: "enum",
                name: "repeatMode",
                optional: true,
                value: ["play_once", "loop"]
              }
            ]
          },
          {
            name: "queue",
            syntaxes: [
              { type: "string", name: "trackName" },
              { type: "float", name: "volume", optional: true },
              { type: "float", name: "fadeSeconds", optional: true },
              {
                type: "enum",
                name: "repeatMode",
                optional: true,
                value: ["play_once", "loop"]
              }
            ]
          },
          {
            name: "stop",
            syntaxes: [{ type: "float", name: "fadeSeconds", optional: true }]
          },
          {
            name: "volume",
            syntaxes: [{ type: "float", name: "volume" }]
          }
        ]
      }
    ]
  },

  // --- Particle ---
  {
    name: "particle",
    aliases: ["particle"],
    textures: "textures/ui/realms_particles",
    description: "Spawn particles",
    category: 2,
    syntaxes: [
      { type: "literal", value: "particle" },
      { type: "string", name: "particleName" },
      { type: "location", name: "pos", optional: true },
      { type: "int", name: "count", optional: true }
    ]
  },

  // --- Playanimation ---
  {
    name: "playanimation",
    aliases: ["playanimation"],
    textures: "textures/ui/icons/icon_trailer",
    description: "Play an animation on an entity",
    category: 2,
    syntaxes: [
      { type: "literal", value: "playanimation" },
      { type: "entityselector", name: "target" },
      { type: "string", name: "animation" }
    ]
  },

  // --- Recipe ---
  {
    name: "recipe",
    aliases: ["recipe"],
    textures: "textures/ui/icon_book_writable",
    description: "Grant or revoke recipes",
    category: 4,
    syntaxes: [
      { type: "literal", value: "recipe" },
      { type: "playerselector", name: "player" },
      {
        type: "choice",
        options: [
          {
            name: "give",
            syntaxes: [
              { type: "string", name: "recipeName", optional: true },
              { type: "string", name: "recipeNamespace", optional: true }
            ]
          },
          {
            name: "take",
            syntaxes: [
              { type: "string", name: "recipeName", optional: true },
              { type: "string", name: "recipeNamespace", optional: true }
            ]
          },
          {
            name: "grant",
            syntaxes: [
              { type: "string", name: "recipeName", optional: true },
              { type: "string", name: "recipeNamespace", optional: true }
            ]
          },
          {
            name: "revoke",
            syntaxes: [
              { type: "string", name: "recipeName", optional: true },
              { type: "string", name: "recipeNamespace", optional: true }
            ]
          },
          { name: "all", syntaxes: [] },
          { name: "none", syntaxes: [] }
        ]
      }
    ]
  },

  // --- Replaceitem ---
  {
    name: "replaceitem",
    aliases: ["replaceitem"],
    textures: "textures/ui/icon_new_item",
    description: "Replaces items in inventories or block containers",
    category: 4,
    syntaxes: [
      { type: "literal", value: "replaceitem" },
      {
        type: "choice",
        options: [
          {
            name: "entity",
            syntaxes: [
              { type: "entityselector", name: "target" },
              { type: "string", name: "slot" },
              { type: "itemtype", name: "item" },
              { type: "int", name: "count", optional: true },
              { type: "int", name: "data", optional: true },
              { type: "json", name: "components", optional: true }
            ]
          },
          {
            name: "block",
            syntaxes: [
              { type: "location", name: "pos" },
              { type: "string", name: "slot" },
              { type: "itemtype", name: "item" },
              { type: "int", name: "count", optional: true },
              { type: "int", name: "data", optional: true },
              { type: "json", name: "components", optional: true }
            ]
          }
        ]
      }
    ]
  },

  // --- Ride ---
  {
    name: "ride",
    aliases: ["ride"],
    recommended: (player) => isRideableEntityNearby(player, 5),
    textures: "textures/items/saddle",
    description: "Manage entity riding",
    category: 2,
    syntaxes: [
      { type: "literal", value: "ride" },
      { type: "entityselector", name: "rider" },
      {
        type: "choice",
        options: [
          {
            name: "start_riding",
            syntaxes: [
              { type: "entityselector", name: "ridee" },
              {
                type: "enum",
                name: "teleportRules",
                optional: true,
                value: ["teleport_rider", "teleport_ridee", "never"]
              },
              {
                type: "enum",
                name: "rideRules",
                optional: true,
                value: ["no_ride_change", "allow_stacking", "replace_rides"]
              }
            ]
          },
          { name: "stop_riding", syntaxes: [] },
          {
            name: "evict_riders",
            syntaxes: [{ type: "entityselector", name: "ridee" }]
          },
          {
            name: "summon_rider",
            syntaxes: [
              { type: "entityType", name: "entity" },
              { type: "location", name: "spawnPos", optional: true },
              { type: "string", name: "spawnEvent", optional: true }
            ]
          }
        ]
      }
    ]
  },

  // --- Schedule ---
  {
    name: "schedule",
    aliases: ["schedule"],
    textures: "textures/items/clock_item",
    description: "Schedule a function or command",
    category: 4,
    syntaxes: [
      { type: "literal", value: "schedule" },
      {
        type: "choice",
        options: [
          {
            name: "function",
            syntaxes: [
              { type: "string", name: "functionName" },
              { type: "int", name: "ticks" },
              { type: "string", name: "target", optional: true }
            ]
          },
          {
            name: "add",
            syntaxes: [
              { type: "string", name: "functionName" },
              { type: "int", name: "ticks" },
              { type: "string", name: "target", optional: true }
            ]
          },
          {
            name: "run",
            syntaxes: [
              { type: "string", name: "functionName" },
              { type: "string", name: "target", optional: true }
            ]
          },
          {
            name: "clear",
            syntaxes: [
              { type: "string", name: "functionName", optional: true },
              { type: "string", name: "target", optional: true }
            ]
          }
        ]
      }
    ]
  },

  // --- Scoreboard ---
  {
    name: "scoreboard",
    aliases: ["scoreboard"],
    textures: "textures/ui/dressing_room_skins",
    description: "Manage objectives and players",
    category: 4,
    syntaxes: [
      { type: "literal", value: "scoreboard" },
      {
        type: "choice",
        options: [
          {
            name: "objectives",
            syntaxes: [
              {
                type: "choice",
                options: [
                  {
                    name: "add",
                    syntaxes: [
                      { type: "string", name: "objective" },
                      { type: "string", name: "criteria", optional: true },
                      { type: "string", name: "displayName", optional: true }
                    ]
                  },
                  {
                    name: "remove",
                    syntaxes: [{ type: "string", name: "objective" }]
                  },
                  {
                    name: "setdisplay",
                    syntaxes: [
                      {
                        type: "enum",
                        name: "slot",
                        value: ["list", "sidebar", "belowName"]
                      },
                      { type: "string", name: "objective", optional: true }
                    ]
                  },
                  { name: "list", syntaxes: [] }
                ]
              }
            ]
          },
          {
            name: "players",
            syntaxes: [
              {
                type: "choice",
                options: [
                  {
                    name: "add",
                    syntaxes: [
                      { type: "playerselector", name: "player" },
                      { type: "string", name: "objective" },
                      { type: "int", name: "score", optional: true }
                    ]
                  },
                  {
                    name: "remove",
                    syntaxes: [
                      { type: "playerselector", name: "player" },
                      { type: "string", name: "objective", optional: true }
                    ]
                  },
                  {
                    name: "set",
                    syntaxes: [
                      { type: "playerselector", name: "player" },
                      { type: "string", name: "objective" },
                      { type: "int", name: "score" }
                    ]
                  },
                  {
                    name: "reset",
                    syntaxes: [
                      { type: "playerselector", name: "player", optional: true },
                      { type: "string", name: "objective", optional: true }
                    ]
                  },
                  {
                    name: "list",
                    syntaxes: [{ type: "playerselector", name: "player", optional: true }]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },

  // --- Setworldspawn ---
  {
    name: "setworldspawn",
    aliases: ["setworldspawn"],
    textures: "textures/items/compass_item",
    description: "Set the world spawn position",
    category: 1,
    syntaxes: [
      { type: "literal", value: "setworldspawn" },
      { type: "location", name: "pos", optional: true }
    ]
  },

  // --- Spawnpoint ---
  {
    name: "spawnpoint",
    aliases: ["spawnpoint"],
    textures: "textures/items/recovery_compass_item",
    description: "Set a player's spawnpoint",
    category: 1,
    syntaxes: [
      { type: "literal", value: "spawnpoint" },
      { type: "playerselector", name: "player", optional: true },
      { type: "location", name: "pos", optional: true }
    ]
  },

  // --- Spreadplayers ---
  {
    name: "spreadplayers",
    aliases: ["spreadplayers"],
    description: "Spread entities around a point",
    textures: "textures/items/ender_pearl",
    category: 1,
    syntaxes: [
      { type: "literal", value: "spreadplayers" },
      { type: "location", name: "center" },
      { type: "float", name: "spreadDistance" },
      { type: "float", name: "maxRange" },
      { type: "entityselector", name: "targets" }
    ]
  },

  // --- Stopsound ---
  {
    name: "stopsound",
    aliases: ["stopsound"],
    description: "Stop sounds for players",
    category: 4,
    syntaxes: [
      { type: "literal", value: "stopsound" },
      { type: "playerselector", name: "targets" },
      { type: "string", name: "sound", optional: true }
    ]
  },

  // --- Structure ---
  {
    name: "structure",
    aliases: ["structure"],
    description: "Save, load, or manage structures",
    textures: "textures/ui/structure_block",
    category: 1,
    syntaxes: [
      { type: "literal", value: "structure" },
      {
        type: "choice",
        options: [
          {
            name: "save",
            syntaxes: [
              { type: "string", name: "structureName" },
              { type: "location", name: "pos1" },
              { type: "location", name: "pos2" },
              { type: "bool", name: "includeEntities", optional: true },
              {
                type: "enum",
                name: "saveMode",
                optional: true,
                value: ["disk", "memory"]
              },
              { type: "bool", name: "includeBlocks", optional: true }
            ]
          },
          {
            name: "load",
            syntaxes: [
              { type: "string", name: "structureName" },
              { type: "location", name: "destination" },
              {
                type: "enum",
                name: "rotation",
                optional: true,
                value: ["0_degrees", "90_degrees", "180_degrees", "270_degrees"]
              },
              {
                type: "enum",
                name: "mirror",
                optional: true,
                value: ["none", "x", "xz", "z"]
              },
              { type: "bool", name: "includeEntities", optional: true },
              { type: "bool", name: "includeBlocks", optional: true },
              { type: "bool", name: "waterlogged", optional: true },
              { type: "float", name: "integrity", optional: true },
              { type: "string", name: "seed", optional: true }
            ]
          },
          {
            name: "delete",
            syntaxes: [{ type: "string", name: "structureName" }]
          }
        ]
      }
    ]
  },

  // --- Tag ---
  {
    name: "tag",
    aliases: ["tag"],
    description: "Add/remove/list tags on entities",
    textures: "textures/items/name_tag",
    category: 2,
    syntaxes: [
      { type: "literal", value: "tag" },
      { type: "entityselector", name: "target" },
      {
        type: "choice",
        options: [
          { name: "add", syntaxes: [{ type: "string", name: "tag" }] },
          { name: "remove", syntaxes: [{ type: "string", name: "tag" }] },
          { name: "list", syntaxes: [] }
        ]
      }
    ]
  },

  // --- Tellraw ---
  {
    name: "tellraw",
    aliases: ["tellraw"],
    textures: "textures/ui/achievements_pause_menu_icon",
    cc_hidden: true,
    description: "Send JSON-formatted chat messages",
    category: 3,
    syntaxes: [
      { type: "literal", value: "tellraw" },
      { type: "playerselector", name: "target" },
      { type: "json", name: "message" }
    ]
  },

  // --- Testfor ---
  {
    name: "testfor",
    aliases: ["testfor"],
    textures: "textures/ui/magnifyingGlass",
    description: "Test for entities matching criteria",
    category: 2,
    syntaxes: [
      { type: "literal", value: "testfor" },
      { type: "entityselector", name: "target" }
    ]
  },

  // --- Testforblock ---
  {
    name: "testforblock",
    aliases: ["testforblock"],
    textures: "textures/ui/magnifyingGlass",
    description: "Test a single block for a type/state",
    category: 1,
    syntaxes: [
      { type: "literal", value: "testforblock" },
      { type: "location", name: "pos" },
      { type: "blocktype", name: "block" }
    ]
  },

  // --- Testforblocks ---
  {
    name: "testforblocks",
    aliases: ["testforblocks"],
    textures: "textures/ui/magnifyingGlass",
    description: "Test that two regions contain identical blocks",
    category: 1,
    syntaxes: [
      { type: "literal", value: "testforblocks" },
      { type: "location", name: "begin" },
      { type: "location", name: "end" },
      { type: "location", name: "destination" },
      {
        type: "enum",
        name: "mode",
        optional: true,
        value: ["all", "masked"]
      },
      { type: "blocktype", name: "filterBlock", optional: true }
    ]
  },

  // --- Tickingarea ---
  {
    name: "tickingarea",
    aliases: ["tickingarea"],
    textures: "textures/items/redstone_dust",
    description: "Manage ticking areas",
    category: 1,
    syntaxes: [
      { type: "literal", value: "tickingarea" },
      {
        type: "choice",
        options: [
          {
            name: "add",
            syntaxes: [
              { type: "location", name: "pos1" },
              { type: "location", name: "pos2", optional: true },
              { type: "string", name: "name", optional: true }
            ]
          },
          {
            name: "remove",
            syntaxes: [{ type: "string", name: "name" }]
          },
          { name: "list", syntaxes: [] },
          { name: "remove_all", syntaxes: [] }
        ]
      }
    ]
  },

  // --- Time ---
  {
    name: "time",
    aliases: ["time"],
    textures: "textures/items/clock_item",
    description: "Change or query the time",
    vc_hiperlink: (player, on_output) => visual_command_time(player, on_output),
    vc_available: (player) => true,
    recommended: (player) => !(world.getTimeOfDay() < 12000),
    category: 1,
    syntaxes: [
      { type: "literal", value: "time" },
      {
        type: "choice",
        options: [
          {
            name: "set",
            syntaxes: [
              {
                type: "enum",
                name: "timeType",
                optional: true,
                value: ["day", "night", "noon", "midnight"]
              },
              { type: "int", name: "ticks", optional: true }
            ]
          },
          {
            name: "add",
            syntaxes: [{ type: "int", name: "ticks" }]
          },
          {
            name: "query",
            syntaxes: [
              {
                type: "enum",
                name: "queryType",
                value: ["daytime", "gametime", "day"]
              }
            ]
          }
        ]
      }
    ]
  },

  // --- Title ---
  {
    name: "title",
    aliases: ["title"],
    textures: "textures/ui/comment",
    description: "Display titles to players",
    category: 3,
    syntaxes: [
      { type: "literal", value: "title" },
      { type: "playerselector", name: "player" },
      {
        type: "choice",
        options: [
          { name: "title", syntaxes: [{ type: "string", name: "text" }] },
          { name: "subtitle", syntaxes: [{ type: "string", name: "text" }] },
          { name: "actionbar", syntaxes: [{ type: "string", name: "text" }] },
          {
            name: "times",
            syntaxes: [
              { type: "int", name: "fadeIn" },
              { type: "int", name: "stay" },
              { type: "int", name: "fadeOut" }
            ]
          },
          { name: "clear", syntaxes: [] },
          { name: "reset", syntaxes: [] }
        ]
      }
    ]
  },

  // --- Titleraw ---
  {
    name: "titleraw",
    aliases: ["titleraw"],
    textures: "textures/ui/achievements_pause_menu_icon",
    description: "Display raw JSON titles",
    category: 3,
    syntaxes: [
      { type: "literal", value: "titleraw" },
      { type: "playerselector", name: "player" },
      {
        type: "choice",
        options: [
          { name: "title", syntaxes: [] },
          { name: "subtitle", syntaxes: [] },
          { name: "actionbar", syntaxes: [] }
        ]
      },
      { type: "json", name: "message" }
    ]
  },

  // --- Toggledownfall ---
  {
    name: "toggledownfall",
    textures: "textures/ui/cloud_only_storage",
    aliases: ["toggledownfall"],
    description: "Toggle rain/snow",
    category: 1,
    syntaxes: [{ type: "literal", value: "toggledownfall" }]
  },

  // --- Camerashake ---
  {
    name: "camerashake",
    aliases: ["camerashake"],
    textures: "textures/ui/camera-yo",
    description: "Shake the camera for one or more players",
    category: 4,
    syntaxes: [
      { type: "literal", value: "camerashake" },
      {
        type: "choice",
        name: "action",
        options: [
          {
            value: "add",
            next: [
              { type: "playerselector", name: "targets" },
              { type: "float", name: "amplitude", optional: true },
              { type: "int", name: "durationTicks" },
              {
                type: "enum",
                name: "shakeType",
                optional: true,
                value: ["rotational", "positional"]
              }
            ]
          },
          {
            value: "stop",
            next: [{ type: "playerselector", name: "targets", optional: true }]
          }
        ]
      }
    ]
  },

  // --- List ---
  {
    name: "list",
    aliases: ["list"],
    textures: "textures/ui/lan_icon",
    cc_hidden: true,
    description: "List players on the server or query server info",
    category: 3,
    syntaxes: [{ type: "literal", value: "list" }]
  },

  // --- Locate ---
  {
    name: "locate",
    aliases: ["locate"],
    textures: "textures/items/map_locked",
    description: "Locate the nearest biome or structure",
    category: 1,
    syntaxes: [
      { type: "literal", value: "locate" },
      {
        type: "choice",
        options: [
          {
            name: "biome",
            syntaxes: [{ type: "string", name: "biomeName" }]
          },
          {
            name: "structure",
            syntaxes: [
              { type: "string", name: "structureName" },
              { type: "literal", value: "newChunksOnly", optional: true }
            ]
          }
        ]
      }
    ]
  },

  // --- Loot ---
  {
    name: "loot",
    aliases: ["loot"],
    textures: "textures/blocks/ender_chest_front",
    description: "Give or spawn loot from a loot table",
    category: 4,
    syntaxes: [
      { type: "literal", value: "loot" },
      {
        type: "choice",
        options: [
          {
            name: "give",
            syntaxes: [
              { type: "string", name: "lootTable" },
              { type: "playerselector", name: "target", optional: true },
              { type: "int", name: "count", optional: true }
            ]
          },
          {
            name: "spawn",
            syntaxes: [
              { type: "string", name: "lootTable" },
              { type: "location", name: "pos", optional: true },
              { type: "int", name: "count", optional: true }
            ]
          },
          {
            name: "insert",
            syntaxes: [
              { type: "string", name: "lootTable" },
              { type: "location", name: "containerPos" }
            ]
          }
        ]
      }
    ]
  },

  // --- Place ---
  {
    name: "place",
    aliases: ["place"],
    textures: "textures/ui/icons/icon_new",
    description: "Place an item or block at a position",
    category: 1,
    syntaxes: [
      { type: "literal", value: "place" },
      {
        type: "choice",
        options: [
          {
            name: "block",
            syntaxes: [
              { type: "blocktype", name: "block" },
              { type: "location", name: "pos", optional: true },
              {
                type: "enum",
                name: "mode",
                optional: true,
                value: ["replace", "keep", "destroy"]
              }
            ]
          },
          {
            name: "item",
            syntaxes: [
              { type: "itemtype", name: "item" },
              { type: "location", name: "pos", optional: true }
            ]
          },
          {
            name: "structure",
            syntaxes: [
              { type: "string", name: "structureName" },
              { type: "location", name: "destination", optional: true },
              {
                type: "enum",
                name: "rotation",
                optional: true,
                value: ["0", "90", "180", "270"]
              }
            ]
          }
        ]
      }
    ]
  },

  // --- Say ---
  {
    name: "say",
    aliases: ["say"],
    cc_hidden: true,
    textures: "textures/ui/achievements_pause_menu_icon",
    description: "Broadcast a chat message to all players",
    category: 3,
    syntaxes: [
      { type: "literal", value: "say" },
      { type: "string", name: "message" }
    ]
  },

  // --- Script ---
  {
    name: "script",
    aliases: ["script"],
    textures: "textures/ui/ui_debug_glyph_color",
    description: "Debugging, profiling and diagnostics controls for the scripting system",
    category: 4,
    syntaxes: [
      { type: "literal", value: "script" },
      {
        type: "choice",
        name: "category",
        options: [
          {
            value: "debugger",
            next: [
              {
                type: "choice",
                name: "debuggerAction",
                options: [
                  {
                    value: "listen",
                    next: [{ type: "int", name: "port" }]
                  },
                  {
                    value: "connect",
                    next: [
                      { type: "string", name: "host", optional: true },
                      { type: "int", name: "port", optional: true }
                    ]
                  },
                  { value: "close" }
                ]
              }
            ]
          },
          {
            value: "profiler",
            next: [
              {
                type: "choice",
                name: "profilerAction",
                options: [
                  { value: "start" },
                  { value: "stop" }
                ]
              }
            ]
          },
          {
            value: "diagnostics",
            next: [
              {
                type: "choice",
                name: "diagnosticsAction",
                options: [
                  { value: "startcapture" },
                  { value: "stopcapture" }
                ]
              }
            ]
          }
        ]
      }
    ]
  },

  // --- Scriptevent ---
  {
    name: "scriptevent",
    aliases: ["scriptevent"],
    description: "Trigger a script event",
    category: 4,
    syntaxes: [
      { type: "literal", value: "scriptevent" },
      { type: "string", name: "eventName" },
      { type: "entityselector", name: "target", optional: true },
      { type: "json", name: "eventData", optional: true }
    ]
  },

  // --- Tell ---
  {
    name: "tell",
    cc_hidden: true,
    textures: "textures/ui/achievements_pause_menu_icon",
    aliases: ["tell", "msg", "w"],
    description: "Send a private message to another player (whisper)",
    category: 3,
    syntaxes: [
      { type: "literal", value: "tell" },
      { type: "playerselector", name: "target" },
      { type: "string", name: "message" }
    ]
  }
];

const block_command_list = [
  /* Legend:
  rating = 0 - no warning
  rating = 1 - behaves strangely
  rating = 2 - bricks the world
  */
  {command_prefix: "gamemode", rating: 1, relevent: (world) => world.isHardcore},
  {command_prefix: "gamemode spectator", rating: 2, relevent: (world) => world.isHardcore},
  {command_prefix: "kill", rating: 2, relevent: (world) => world.isHardcore},
  {command_prefix: "agent create", rating: 1, relevent: (world) => true},
  {command_prefix: "agent remove", rating: 1, relevent: (world) => true}
]

let old_version = undefined; // If the got updated with this sesion, this variable contains the old version number. This is used to show update notes in the main menu
let server_mode = false; // Whether the current world is in a server environment (i.e. has a server running, or is connected to a server) or not. This is used to determine whether to show the "Server" tab in the main menu

system.run(async() => {
  // Checks if the world is in a server environment
  let players = world.getAllPlayers();

  while (players.length == 0) {
    await system.waitTicks(20);
    players = world.getAllPlayers();
  }

  server_mode = !players.some(p => p.commandPermissionLevel >= 3);
  print("Server environment: "+server_mode);
});



/*------------------------
  Multiple menu v2
-------------------------*/

// Status
let system_privileges = 2

/* This variable contains the status (or permissions) of your add-on:
2 means the system is not active (no other packs found);
1 means the system is acting as a host;
0 means the system is acting as a client;
*/

/*------------------------
 Client (an addon only needs to have the client function to be recognizable)
-------------------------*/

system.afterEvents.scriptEventReceive.subscribe(async event=> {
   if (event.id === "multiple_menu:data") {
    let player = event.sourceEntity, data, scoreboard = world.scoreboard.getObjective("mm_data")

    // Reads data from the scoreboard
    if (scoreboard) {
      try {
        data = JSON.parse(scoreboard.getParticipants()[0].displayName)
      } catch (e) {
        print("Wrong formated data: "+scoreboard.getParticipants()[0]) // Scoreboard IS available but contains garbisch
        world.scoreboard.removeObjective("mm_data")
        return -1
      }
    } else {
      // print("No Scoreboard!")
      return -1 // Scoreboard is not available: happens when an addon has already processed the request e.g. "open main menu"
    }


    // Initializing
    if (data.event == "mm_initializing") {
      scoreboard.removeParticipant(JSON.stringify(data))

      data.data.push({
        uuid: version_info.uuid,
        name: version_info.name,
        icon: "textures/ui/chat_send"
      })

      if (system_privileges == 2) system_privileges = 0;

      // Saves data in to the scoreboard
      scoreboard.setScore(JSON.stringify(data), 1)
    }

    // Will open the main menu of your addon
    if (data.event == "mm_open" && data.data.target == version_info.uuid && canPlayerUseMenu(player) && (operatorMode? player.commandPermissionLevel >= 1 : true)) {
        main_menu(player);
        world.scoreboard.removeObjective("mm_data")
    }


    // Host Only (which is why system_privileges == 1): Opens the multiple menu, is called by other addons as a back button
    if (data.event == "mm_open" && data.data.target == "main" && system_privileges == 1) {
        multiple_menu(player);
        world.scoreboard.removeObjective("mm_data")
    }
   }
})

/*------------------------
 Host
-------------------------*/

let addon_list; // When initialized properly, it contains the data of all supported add-ons

system.run(() => {
  initialize_multiple_menu()
});

async function initialize_multiple_menu() {
  // This fallback ensures that even if multiple add-ons could act as host, only one of them will be used as the host.
  try {
    world.scoreboard.addObjective("mm_data");
    world.scoreboard.getObjective("mm_data").setScore(JSON.stringify({event: "mm_initializing", data:[]}), 1);

    print("Multiple Menu: Initializing Host");
    system_privileges = 1;
  } catch (e) {
    print("Multiple Menu: Already Initialized");
    return -1;
  }

  // Requests addon information. Look into the Client
  world.getDimension("overworld").runCommand("scriptevent multiple_menu:data");

  await system.waitTicks(2);
  print("Multiple Menu: successfully initialized as Host");

  // Evaluation of the add-on information
  let data = JSON.parse(world.scoreboard.getObjective("mm_data").getParticipants()[0].displayName)
  world.scoreboard.removeObjective("mm_data")

  addon_list = data.data

  if (data.data.length == 1) {
    print("Multiple Menu: no other plugin found");
    system_privileges = 2;
  }
}

function multiple_menu(player) {
  let form = new ActionFormData();
  let actions = [];

  form.title("Multiple menu v.2.0");
  form.body("Select an addon to open it's menu");

  addon_list.forEach((addon) => {
    // Icon
    if (addon.icon) {
      form.button(addon.name, addon.icon);
    }
    // Only Name
    else if (addon.name) {
      form.button(addon.name);
    } else {
      form.button(addon.uuid);
    }

    actions.push(() => {
      world.scoreboard.addObjective("mm_data");
      world.scoreboard.getObjective("mm_data").setScore(JSON.stringify({event: "mm_open", data:{target: addon.uuid}}), 1);
      player.runCommand("scriptevent multiple_menu:data");
    });
  });

  form.show(player).then((response) => {
    if (response.selection == undefined ) {
      return -1
    }

    if (actions[response.selection]) {
      actions[response.selection]();
    }
  });
}


/*------------------------
 CC Commands
-------------------------*/

function registerAllCommands(init) {

  /* ---------- helpers ---------- */

  const failPlayerOnly = {
    status: CustomCommandStatus.Failure,
    message: "The Menu can only be displayed to players!"
  };

  const isPlayer = p => p && p.typeId === "minecraft:player";

  function registerMenuCommand({ name, description, handler }) {
    init.customCommandRegistry.registerCommand(
      { name, description, permissionLevel: operatorMode? 1 : 0, cheatsRequired: false },
      ({ sourceEntity }) => {
        if (!isPlayer(sourceEntity)) return failPlayerOnly;

        const result = handler(sourceEntity);

        // Wenn der Handler einen Status zurückgibt → weiterreichen
        if (result) return result;

        return {
          status: CustomCommandStatus.Success,
          message: "Opened the Menu to " + sourceEntity.name
        };
      }
    );
  }


  function resolveAlias(alias) {
    for (const cmd of command_list) {
      if (!cmd.aliases?.includes(alias)) continue;
      const lit = cmd.syntaxes?.find(s => s.type === "literal")?.value;
      if (lit) return lit.replace(/^\//, "");
    }
    return alias;
  }

  function formatArg(v) {
    if (v == null) return String(v);
    if (["string", "number", "boolean"].includes(typeof v)) return String(v);
    if (Array.isArray(v)) return v.map(formatArg).join(" ");

    if (typeof v === "object") {
      // Location
      const { x, y, z, X, Y, Z, id } = v;
      if (x ?? X ?? y ?? Y ?? z ?? Z)
        return [x ?? X, y ?? Y, z ?? Z].filter(Boolean).join(" ");

      // Player or Entity
      if (id && Number(id)) {
        const p = world.getAllPlayers().find(e => e.id === id);
        if (p) return p.name;
        const e = world.getEntity(id);
        if (e) return `@e[x=${e.location.x},y=${e.location.y},z=${e.location.z},r=20,type=!player,c=1]`;
        return String(id);
      }

      // Blocks
      if (v.id) {
        return v.id
      }


    }
    print("Unknown object:" + JSON.stringify(v));
    return String(v);
  }

  /* ---------- menu commands ---------- */

  registerMenuCommand({
    name: "com2hard:vc",
    description: "Opens the Visual Command menu",
    permissionLevel: operatorMode? 1 : 0,
    cheatsRequired: false,
    handler: p => {
      const e = load_save_data().find(d => d.id === p.id);
      if (p.commandPermissionLevel == 0 && !e?.allowed_commands.length) return {
          status: CustomCommandStatus.Failure,
          message: "There are no commands available to run"
      };
      system.run(() =>visual_command(p));
    }
  });

  registerMenuCommand({
    name: "com2hard:menu",
    description: "Opens the Main menu",
    permissionLevel: operatorMode? 1 : 0,
    cheatsRequired: false,
    handler: p => {
      system.run(() => system_privileges == 1 ? multiple_menu(p) : canPlayerUseMenu(p) && (operatorMode ? p.commandPermissionLevel >= 1 : true) ? TranslateMenuDefinition(p, main_menu(p)) : null);
    }
  });

  registerMenuCommand({
    name: "com2hard:history",
    description: "Opens the History menu",
    permissionLevel: operatorMode? 1 : 0,
    cheatsRequired: false,
    handler: p => {
      system.run(() => command_history_menu(p));
    }
  });

  registerMenuCommand({
    name: "com2hard:settings",
    description: "Opens the Settings menu",
    permissionLevel: operatorMode? 1 : 0,
    cheatsRequired: false,
    handler: p => {
      system.run(() => settings_main(p));
    }
  });

  /* ---------- built-in commands ---------- */

  init.customCommandRegistry.registerEnum("com2hard:chain_executionMode", ["execute", "edit"]);

  init.customCommandRegistry.registerCommand({
      name: "com2hard:chain",
      description: "Executes a specified command chain",
      permissionLevel: operatorMode? 1 : 0,
      cheatsRequired: false,
      optionalParameters: [
        { type: CustomCommandParamType.Integer, name: "chainIndex" },
        { type: CustomCommandParamType.Enum, name: "com2hard:chain_executionMode"}
      ],
    }, (origin, chainIndex, chain_executionMode) => {
      const player = origin.sourceEntity;
      if (!isPlayer(player)) return {
        status: CustomCommandStatus.Failure,
        message: "The command source must be a player to execute a command chain"
      };

      if (canPlayerUseChains(player) === false) return {
        status: CustomCommandStatus.Failure,
        message: "You are restricted from using chain commands by your Admin"
      };

      system.run(() => {
        if (chainIndex === undefined) {
          chain_overview(player);
        } else if (chain_executionMode === "edit") {
          chain_main(player, chainIndex);
        } else {
          execute_chain(player, chainIndex);
        }
      });
  });


  /* ---------- dynamic commands ---------- */

  const enumsDynamic = registerBuiltInDynamicEnums(init);

  for (const cmd of command_list) {
    if (cmd.cc_hidden) continue;

    const aliases = cmd.aliases?.length ? cmd.aliases : [cmd.name];
    const { mandatory, optional } = buildParamsFromTopLevel(init, cmd, enumsDynamic);
    if (!mandatory?.length && !optional?.length) continue;

    for (const alias of aliases) {
      try {
        init.customCommandRegistry.registerCommand(
          {
            name: `com2hard:${alias}`,
            description: cmd.description ?? "",
            permissionLevel: operatorMode? 1 : 0,
            cheatsRequired: false,
            mandatoryParameters: mandatory,
            optionalParameters: optional
          },
          (origin, ...args) =>
            {
              const player = origin.sourceEntity;
              if (!isPlayer(player)) return {
                status: CustomCommandStatus.Failure,
                message: "Coundn't verify premissions because the command source is not a player"
              };

              system.run(() => {
                const base = resolveAlias(alias);
                const argStr = args.map(formatArg).join(" ").trim();
                execute_command(player, `/${base}${argStr && " " + argStr}`, player);
              })
        }
        );
      } catch (e) {
        print(`Konnte Befehl com2hard:${alias} nicht registrieren:`, e)
      }
    }
  }
}


system.beforeEvents.startup.subscribe((init) => {
  registerAllCommands(init);
});


/*------------------------
 Save Data
-------------------------*/

// Creates or Updates Save Data if not present
system.run(() => {
  let save_data = load_save_data();

  const default_save_data_structure = {utc: undefined, utc_auto: true, version: version_info.version, sessions: []};

  if (!save_data) {
      save_data = [default_save_data_structure];
      print("Creating save_data...");
  } else {
      let data_entry = save_data[0];
      migrate_last_unix_to_sessions(data_entry);

      let changes_made = false;

      function merge_defaults(target, defaults) {
          for (const key in defaults) {
              if (defaults.hasOwnProperty(key)) {
                  if (!target.hasOwnProperty(key)) {
                      // Key existiert nicht in target → Fallback für old_version setzen
                      if (key === 'version') {
                          old_version = "unknown"; // oder z. B. "0.0.0"
                      }
                      target[key] = defaults[key];
                      changes_made = true;
                  } else if (typeof defaults[key] === 'object' && defaults[key] !== null && !Array.isArray(defaults[key])) {
                      if (typeof target[key] !== 'object' || target[key] === null || Array.isArray(target[key])) {
                          target[key] = defaults[key];
                          changes_made = true;
                      } else {
                          merge_defaults(target[key], defaults[key]);
                      }
                  }
                  // Falls der Key existiert, aber die Version nicht übereinstimmt
                  if (key === 'version' && target[key] !== defaults[key]) {
                    const comparison = compareVersions(target[key], defaults[key]);
                    if (comparison < 0) {
                      old_version = target[key]; // Alten Wert speichern
                      target[key] = defaults[key];
                      changes_made = true;
                    }
                  }
              }
          }
      }

      merge_defaults(data_entry, default_save_data_structure);
      if (!Array.isArray(save_data) || save_data.length === 0) {
          save_data = [data_entry];
          changes_made = true;
      } else {
          save_data[0] = data_entry;
      }

      if (changes_made) {
          print("Missing save_data attributes found and added.");
      }
  }

  startSession(save_data[0], Date.now()-1); // Otherwise, the server would be superior to the clients in the UI if they were using the same Unix time.

  // Jup this is only for /reload to start a Session again
  world.getAllPlayers().forEach(player => {
    const sd_index = save_data.findIndex(e => e.id === player.id);
    if (sd_index !== -1) {
      startSession(save_data[sd_index], Date.now());
    }
  });
  update_save_data(save_data);
})


const BASE_KEY = "com2hard:save_data";
const META_KEY = BASE_KEY + "_meta";
const MAX_BYTES = 32767;

function getSessions(entry) {
    if (!entry) return [];
    if (Array.isArray(entry.sessions)) return entry.sessions;
    if (entry.last_unix) {
        migrate_last_unix_to_sessions(entry);
        return Array.isArray(entry.sessions) ? entry.sessions : [];
    }
    return [];
}

function getLastSession(entry) {
    const sessions = getSessions(entry);
    return sessions[sessions.length - 1] || null;
}

function getLastLogin(entry) {
    return getLastSession(entry)?.login ?? null;
}

function getLastLogout(entry) {
    return getLastSession(entry)?.logout ?? null;
}

function startSession(entry, loginUnix) {
    if (!entry.sessions || !Array.isArray(entry.sessions)) entry.sessions = [];
    const last = entry.sessions[entry.sessions.length - 1];
    if (last && last.login !== undefined && last.logout === undefined) return;
    entry.sessions.push({login: loginUnix});
}

function endSession(entry, logoutUnix) {
    if (!entry.sessions || !Array.isArray(entry.sessions)) entry.sessions = [];
    const last = entry.sessions[entry.sessions.length - 1];
    if (last && last.login !== undefined && last.logout === undefined) {
        last.logout = logoutUnix;
    } else {
        entry.sessions.push({logout: logoutUnix});
    }
}

function uint8ToBase64(u8) {
    // chunked conversion to avoid apply() argument length limits
    const CHUNK = 0x8000;
    let parts = [];
    for (let i = 0; i < u8.length; i += CHUNK) {
        parts.push(String.fromCharCode.apply(null, Array.from(u8.subarray(i, i + CHUNK))));
    }
    return btoa(parts.join(''));
}

function base64ToUint8(b64) {
    const bin = atob(b64);
    const len = bin.length;
    const u8 = new Uint8Array(len);
    for (let i = 0; i < len; i++) u8[i] = bin.charCodeAt(i);
    return u8;
}

function get_save_meta() {
    const metaRaw = world.getDynamicProperty(META_KEY);
    if (!metaRaw) return null;
    try {
        return JSON.parse(metaRaw);
    } catch (e) {
        console.warn("Ungültiges META JSON:", e);
        return null;
    }
}

function clear_chunk_range(from, to) {
    if (typeof from !== "number" || typeof to !== "number" || from >= to) return;
    for (let i = from; i < to; i++) {
        try {
            world.setDynamicProperty(`${BASE_KEY}_${i}`, null);
        } catch (e) {
            // Falls die API das Nicht-Existieren anders handhabt, wenigstens keinen Fehler werfen
            console.warn(`Fehler beim Löschen von ${BASE_KEY}_${i}:`, e);
        }
    }
}

function delete_save_data() {
    try {
        const oldMeta = get_save_meta();
        if (oldMeta && typeof oldMeta.chunks === "number" && oldMeta.chunks > 0) {
            clear_chunk_range(0, oldMeta.chunks);
        }
        world.setDynamicProperty(BASE_KEY, null);
        world.setDynamicProperty(META_KEY, null);
    } catch (err) {
        console.error("Fehler beim vollständigen Löschen der Save-Daten:", err);
        throw err;
    }
}

function load_save_data() {
    try {
        const metaRaw = world.getDynamicProperty(META_KEY);
        // Falls Meta vorhanden: chunked storage
        if (metaRaw) {
            let meta;
            try { meta = JSON.parse(metaRaw); } catch (e) {
                console.warn("Invalid meta JSON for save_data; falling back to single property.", e);
                // Fallback zu altem Einzel-Property (siehe Migration weiter unten)
                const raw = world.getDynamicProperty(BASE_KEY);
                if (!raw) return;
                // Versuche Migration: in neuen Chunk-Standard konvertieren
                try {
                    world.setDynamicProperty(`${BASE_KEY}_0`, raw);
                    world.setDynamicProperty(META_KEY, JSON.stringify({ chunks: 1, encoding: "utf16" }));
                    world.setDynamicProperty(BASE_KEY, null);
                } catch (mErr) {
                    console.warn("Migration to chunked storage failed:", mErr);
                }
                return JSON.parse(raw);
            }

            const chunks = [];
            if (meta.encoding === "base64") {
                // join base64 chunks -> bytes -> decode utf-8 -> parse JSON
                const byteArrays = [];
                for (let i = 0; i < meta.chunks; i++) {
                    const partB64 = world.getDynamicProperty(`${BASE_KEY}_${i}`) || "";
                    if (!partB64) throw new Error(`Missing chunk ${i}`);
                    byteArrays.push(base64ToUint8(partB64));
                }
                // concat bytes
                let totalLen = byteArrays.reduce((s, a) => s + a.length, 0);
                const all = new Uint8Array(totalLen);
                let offset = 0;
                for (let a of byteArrays) {
                    all.set(a, offset);
                    offset += a.length;
                }
                const decoder = typeof TextDecoder !== "undefined" ? new TextDecoder() : null;
                const jsonStr = decoder ? decoder.decode(all) : (function() {
                    // Fallback: decode assuming UTF-8 manually (less efficient)
                    let s = "";
                    for (let i = 0; i < all.length; i++) s += String.fromCharCode(all[i]);
                    try { return decodeURIComponent(escape(s)); } catch (e) { return s; }
                })();
                return JSON.parse(jsonStr);
            } else {
                // encoding 'utf16' (simple substring chunks)
                for (let i = 0; i < meta.chunks; i++) {
                    chunks.push(world.getDynamicProperty(`${BASE_KEY}_${i}`) || "");
                }
                const raw = chunks.join("");
                return JSON.parse(raw);
            }
        } else {
            // kein Meta -> altes Einzel-Property verwenden (oder Migration durchführen)
            const raw = world.getDynamicProperty(BASE_KEY);
            if (!raw) return;

            // MIGRATION: convert old single property into new chunked standard
            try {
                // Speichere als single utf16-chunk unter BASE_KEY_0 und setze META_KEY
                world.setDynamicProperty(`${BASE_KEY}_0`, raw);
                world.setDynamicProperty(META_KEY, JSON.stringify({ chunks: 1, encoding: "utf16" }));
                // Setze alten Single-Property-Eintrag auf null (wie gewünscht)
                world.setDynamicProperty(BASE_KEY, null);
            } catch (mErr) {
                console.warn("Migration to chunked storage failed:", mErr);
            }

            return JSON.parse(raw);
        }
    } catch (err) {
        console.error("Fehler beim Laden der Save-Daten:", err);
        throw err;
    }
}

function update_save_data(input) {
    try {
        // vorhandenes META lesen, damit wir nachher überzählige chunks löschen können
        const oldMetaRaw = world.getDynamicProperty(META_KEY);
        let oldMeta = null;
        try { oldMeta = oldMetaRaw ? JSON.parse(oldMetaRaw) : null; } catch (e) { oldMeta = null; }

        // Falls noch der alte Einzel-Property-Standard vorhanden ist, vorab migrieren
        const existingBaseRaw = world.getDynamicProperty(BASE_KEY);
        if (existingBaseRaw) {
            try {
                // Migriere vorhandene Einzel-Property zu neuem Chunk-Format (utf16 chunk)
                world.setDynamicProperty(`${BASE_KEY}_0`, existingBaseRaw);
                world.setDynamicProperty(META_KEY, JSON.stringify({ chunks: 1, encoding: "utf16" }));
                // setze alten BASE_KEY auf null (wie gewünscht)
                world.setDynamicProperty(BASE_KEY, null);
                // Aktualisiere oldMeta damit alte chunk-Lösch-Logik später korrekt arbeitet
                oldMeta = { chunks: 1, encoding: "utf16" };
            } catch (mErr) {
                console.warn("Migration of existing single BASE_KEY to chunked failed:", mErr);
            }
        }

        const json = JSON.stringify(input);

        // WICHTIG: Neu: immer Chunk-Storage verwenden (auch wenn in einen Chunk passend).
        // Wenn TextEncoder verfügbar: sichere Byteorientierte Variante (UTF-8 + base64 chunks)
        if (typeof TextEncoder !== "undefined" && typeof btoa !== "undefined" && typeof atob !== "undefined") {
            const encoder = new TextEncoder();
            const bytes = encoder.encode(json);
            // Always use chunked storage; compute chunkCount even for small payloads
            const chunkCount = Math.ceil(bytes.length / MAX_BYTES) || 1;
            for (let i = 0; i < chunkCount; i++) {
                const slice = bytes.subarray(i * MAX_BYTES, (i + 1) * MAX_BYTES);
                const partB64 = uint8ToBase64(slice);
                world.setDynamicProperty(`${BASE_KEY}_${i}`, partB64);
            }
            world.setDynamicProperty(META_KEY, JSON.stringify({ chunks: chunkCount, encoding: "base64" }));
            // setze single BASE_KEY auf null (so loader bevorzugt meta und alter Standard ist entfernt)
            world.setDynamicProperty(BASE_KEY, null);

            // Alte, jetzt ungenutzte Chunks (falls vorher mehr waren) löschen
            if (oldMeta && typeof oldMeta.chunks === "number" && oldMeta.chunks > chunkCount) {
                clear_chunk_range(chunkCount, oldMeta.chunks);
            }
            return;
        }

        // Fallback: reiner String-Chunking (arbeitet auf JS-String-Länge, nicht genau Bytes!)
        // Always use chunked storage (utf16)
        const chunkCount = Math.ceil(json.length / MAX_BYTES) || 1;
        for (let i = 0; i < chunkCount; i++) {
            const part = json.slice(i * MAX_BYTES, (i + 1) * MAX_BYTES);
            world.setDynamicProperty(`${BASE_KEY}_${i}`, part);
        }
        world.setDynamicProperty(META_KEY, JSON.stringify({ chunks: chunkCount, encoding: "utf16" }));
        world.setDynamicProperty(BASE_KEY, null);

        // Alte, jetzt ungenutzte Chunks löschen
        if (oldMeta && typeof oldMeta.chunks === "number" && oldMeta.chunks > chunkCount) {
            clear_chunk_range(chunkCount, oldMeta.chunks);
        }
    } catch (err) {
        console.error("Fehler beim Speichern der Save-Daten:", err);
        throw err;
    }
}

function delete_player_save_data(player) {
  let save_data = load_save_data();

  save_data = save_data.filter(entry => entry.id !== player.id);
  update_save_data(save_data);
}

function create_player_save_data(playerId, playerName) {
  let save_data = load_save_data();

  // Define the default structure for a new player's save data
  const default_player_save_data_structure = () => ({
      id: playerId,
      name: playerName,
      sessions: [],
      gesture: { emote: false, sneak: false, nod: false, stick: false },
      command_history: [],
      quick_run: false,
      recommendations: true,
      allow_menu: true,
      allow_chains: true,
      has_ownership: server_mode ? !save_data.some(entry => entry.has_ownership) : false,
      chain_commands: [],
      allowed_commands: [],
  });

  let player_sd_index = save_data.findIndex(entry => entry.id === playerId);
  let player_data, changes_made = false;

  // Helper function to recursively merge default values
  const merge_defaults = (target, defaults) => {
      for (const key in defaults) {
          if (defaults.hasOwnProperty(key)) {
              if (!target.hasOwnProperty(key)) {
                  // Key is missing, add it with default value
                  target[key] = defaults[key];
              } else if (typeof defaults[key] === 'object' && defaults[key] !== null && !Array.isArray(defaults[key])) {
                  // If the default value is an object, recurse into it
                  if (typeof target[key] !== 'object' || target[key] === null || Array.isArray(target[key])) {
                      // If the existing value is not an object or is null/array, replace it with the default structure
                      target[key] = defaults[key];
                      changes_made = true;
                  } else {
                      merge_defaults(target[key], defaults[key]);
                  }
              }
          }
      }
  };

  if (player_sd_index === -1) {
      // player does not exist, create new entry
      print(`player ${playerName} (${playerId}) added!`);

      player_data = default_player_save_data_structure();
      save_data.push(player_data);
      player_sd_index = save_data.length - 1; // Set index to the newly added player
  } else {
      // player exists, get their data
      player_data = save_data[player_sd_index];
      migrate_last_unix_to_sessions(player_data);

      // Update player name if it's different
      if (player_data.name !== playerName) {
          player_data.name = playerName;
      }

      const dynamic_default_structure = default_player_save_data_structure(player_data.op);
      merge_defaults(player_data, dynamic_default_structure);
      normalizeUnixKeys(player_data);

      if (changes_made) {
          print(`Missing save_data attributes for player ${playerName} (${playerId}) found and added.`);
      }
  }

  const now = Date.now();
  startSession(save_data[player_sd_index], now);
  if (world.getAllPlayers().find(p => p.id === playerId)) {
    // Player is online

    world.getAllPlayers().forEach(player => {
      if (player.commandPermissionLevel >= 1 && player.id !== playerId && !operatorMode && save_data[player_sd_index].allowed_commands.length === 0) {
        player.sendMessage("§l§6[§eHelp§6]§r "+ playerName +" does not have permission to execute any command. This can now be changed in §lSettings -> Permission -> "+ playerName +"§r§f")
        player.playSound("random.pop")
      }
    })
  } else {
    // Player is offline (e.g. dummy join for data creation)
    endSession(save_data[player_sd_index], now);
  }

  update_save_data(save_data);
}

function assign_missing_ownership_if_needed(player) {
  if (!server_mode || player.commandPermissionLevel < 1) return false;

  const save_data = load_save_data();
  if (save_data.some(entry => entry.has_ownership)) return false;

  const player_sd_index = save_data.findIndex(entry => entry.id === player.id);
  if (player_sd_index === -1) return false;

  save_data[player_sd_index].has_ownership = true;
  update_save_data(save_data);
  print(`Ownership auto-assigned to ${player.name} (${player.id}) in server mode.`);
  return true;
}

// Migration helper for old save data that used last_unix instead of sessions
function migrate_last_unix_to_sessions(entry) {
    if (!entry || Array.isArray(entry.sessions)) return;

    const sessions = [];
    const logins = entry.last_unix && Array.isArray(entry.last_unix.login) ? entry.last_unix.login : [];
    const logouts = entry.last_unix && Array.isArray(entry.last_unix.logout) ? entry.last_unix.logout : [];
    const count = Math.max(logins.length, logouts.length);

    for (let i = 0; i < count; i++) {
        const session = {};
        if (i < logins.length) session.login = normalizeTimestamp(logins[i]);
        if (i < logouts.length) session.logout = normalizeTimestamp(logouts[i]);
        sessions.push(session);
    }

    entry.sessions = sessions;
    delete entry.last_unix;
}

function normalizeUnixKeys(obj) {
    if (Array.isArray(obj)) {
        return obj.map(item => normalizeUnixKeys(item));
    }

    if (typeof obj === 'object' && obj !== null) {
        for (const key in obj) {
            const value = obj[key];

            // 🎯 Nur Keys die mit "unix" anfangen
            if (key.startsWith('unix') && typeof value === 'number') {
                obj[key] = normalizeTimestamp(value);
            } else {
                obj[key] = normalizeUnixKeys(value);
            }
        }
    }

    return obj;
}

/*------------------------
 Join Messages and reminders
-------------------------*/

// Player leave (Online Time Tracking)
world.beforeEvents.playerLeave.subscribe(async ({ player }) => {
  let save_data = load_save_data();
  let player_sd_index = save_data.findIndex(entry => entry.id === player.id);

  if (player_sd_index !== -1) {
    print(`player ${player.name} (${player.id}) left!`)
    endSession(save_data[player_sd_index], Date.now());
    update_save_data(save_data);
  }
})

// Server shutdown (Online Time Tracking)
system.beforeEvents.shutdown.subscribe(async () => {
  print("Server is shutting down, updating online players' save data...");
  const now = Date.now();

  let save_data = load_save_data();

  // Beende alle aktiven Sessions für alle Spieler und den Server
  save_data.forEach((entry, index) => {
    const sessions = getSessions(entry);
    const lastSession = sessions[sessions.length - 1];
    if (lastSession && lastSession.login !== undefined && lastSession.logout === undefined) {
      print(`Ending active session for ${index === 0 ? 'Server' : entry.name} (${entry.id || 'N/A'})...`);
      endSession(entry, now);
    }
  });

  update_save_data(save_data);
})

world.afterEvents.playerSpawn.subscribe(async (eventData) => {
  const { player, initialSpawn } = eventData;
  if (!initialSpawn) return -1

  // If the player is joining for the first time, create their save data entry or update it if it already exists (e.g. due to missing attributes)
  create_player_save_data(player.id, player.name);
  assign_missing_ownership_if_needed(player);

  let save_data = load_save_data();
  let player_sd_index = save_data.findIndex(entry => entry.id === player.id);

  await system.waitTicks(40); // Wait for the player to be fully joined

  // Beta Feedback Request
  if (version_info.release_type !== 2 && playerIsAdmin(player)) {
    player.sendMessage("§l§7[§fSystem§7]§r "+ save_data[player_sd_index].name +" how is your experiences with "+ version_info.version +"? Does it meet your expectations? Would you like to change something and if so, what? Do you have a suggestion for a new feature? Share it at §l"+links[0].link)
  }

  if (old_version && playerIsAdmin(player)) {
    player.sendMessage("§l§1[§9Update§1]§r "+ version_info.name +" was updated from "+ old_version +" to "+ version_info.version +". If you encounter any issues, please report them at §l"+links[0].link)
  }

  // Help reminders
  const lastPlayerSession = getLastSession(save_data[player_sd_index]);
  const ONE_WEEK = 7 * 24 * 60 * 60 * 1000;

  if (Date.now() - lastPlayerSession?.login > ONE_WEEK) {
    player.sendMessage("§l§6[§eHelp§6]§r You can always open the menu with the command §l/com2hard:menu§r§f.")
  }
});

/*------------------------
 Menu shortcuts
-------------------------*/

// via. item
world.beforeEvents.itemUse.subscribe(event => {
  const save_data = load_save_data();
  const idx = save_data.findIndex(e => e.id === event.source.id);

  if (event.itemStack.typeId === "minecraft:stick" && save_data[idx].gesture.stick) {
      system.run(() => {
        if (system_privileges !== 0) {
          event.source.playSound("random.pop2")
          system_privileges == 1 ? multiple_menu(event.source) : canPlayerUseMenu(event.source) && (operatorMode ? event.source.commandPermissionLevel >= 1 : true) ? main_menu(event.source) : null;
        }
      });
  }
});

// via. jump gesture
const gestureCooldowns_jump = new Map();
const gestureState_reset = new Map();

async function gesture_jump() {
  const now = Date.now();

  for (const player of world.getAllPlayers()) {
    const lastUsed = gestureCooldowns_jump.get(player.id) || 0;
    const state = gestureState_reset.get(player.id) || { reset: true }; // true = darf wieder ausgelöst werden

    const isSneaking = player.isSneaking;
    const isJumping = player.isJumping;

    // Wenn beide false sind, erlauben wir wieder eine Auslösung beim nächsten Mal
    if (!isSneaking && !isJumping) {
      gestureState_reset.set(player.id, { reset: true });
    }

    // Wenn beide true sind UND vorher ein Reset war UND Cooldown abgelaufen
    if (isSneaking && isJumping && state.reset && (now - lastUsed >= 100)) {
      const save_data = load_save_data();
      const idx = save_data.findIndex(e => e.id === player.id);
      if (save_data[idx].gesture.sneak && system_privileges !== 0) {
        player.playSound("random.pop2")
        system_privileges == 1 ? multiple_menu(player) : canPlayerUseMenu(player) && (operatorMode ? player.commandPermissionLevel >= 1 : true) ? main_menu(player) : null;
      }

      gestureCooldowns_jump.set(player.id, now);
      gestureState_reset.set(player.id, { reset: false }); // Warten bis beide wieder false sind
      await system.waitTicks(10);
    }
  }
}

// via. emote gesture
const gestureCooldowns_emote = new Map();
const gestureState_reset_emote = new Map();

async function gesture_emote() {
  const now = Date.now();

  for (const player of world.getAllPlayers()) {
    const lastUsed = gestureCooldowns_emote.get(player.id) || 0;
    const state = gestureState_reset_emote.get(player.id) || { reset: true };

    const isEmoting = player.isEmoting;

    // Wenn Emoting zwischendurch false ist → Reset erlauben
    if (!isEmoting) {
      gestureState_reset_emote.set(player.id, { reset: true });
    }

    // Wenn Emoting aktiv ist, Reset gesetzt ist und Cooldown abgelaufen ist → Menü öffnen
    if (isEmoting && state.reset && (now - lastUsed >= 100)) {
      const save_data = load_save_data();
      const idx = save_data.findIndex(e => e.id === player.id);
      if (save_data[idx].gesture.emote && system_privileges !== 0) {
        player.playSound("random.pop2")
        system_privileges == 1 ? multiple_menu(player) : canPlayerUseMenu(player) && (operatorMode ? player.commandPermissionLevel >= 1 : true) ? main_menu(player) : null;
      }

      gestureCooldowns_emote.set(player.id, now);
      gestureState_reset_emote.set(player.id, { reset: false }); // Bis zum nächsten Emote-Ende blockieren
      await system.waitTicks(10);
    }
  }
}


// via. nod gesture
const playerHeadMovement = new Map();

async function gesture_nod() {
  const now = Date.now();

  for (const player of world.getAllPlayers()) {
    if (player.getGameMode() !== "Spectator") continue;

    const { x: pitch } = player.getRotation();

    const prev = playerHeadMovement.get(player.id) || {
      state: "idle",
      timestamp: now,
    };
    let { state, timestamp: lastTime } = prev;

    if (state === "idle" && pitch < -13) {
      state = "lookingUp";
      lastTime = now;
    }
    else if (state === "lookingUp" && pitch > 13) {
      const save_data = load_save_data();
      const idx = save_data.findIndex(e => e.id === player.id);
      if (save_data[idx].gesture.nod && system_privileges !== 0) {
        player.playSound("random.pop2")
        system_privileges == 1 ? multiple_menu(player) : canPlayerUseMenu(player) && (operatorMode ? player.commandPermissionLevel >= 1 : true) ? main_menu(player) : null;
      }

      state = "idle";
      lastTime = now;
    }
    else if (state === "lookingUp" && now - lastTime > 1000) {
      state = "idle";
      lastTime = now;
    }

    playerHeadMovement.set(player.id, { state, timestamp: lastTime });
  }
}


/*------------------------
 general helper functions
-------------------------*/

function print(input) {
  if (version_info.release_type === 0) {
    console.log(version_info.name + " - " + JSON.stringify(input))
  }
}

function getMemoryText(memoryTier) {
  switch (memoryTier) {
    case 0: return "Under 1.5 GB";
    case 1: return "1.5 - 2.0 GB";
    case 2: return "2.0 - 4.0 GB";
    case 3: return "4.0 - 8.0 GB";
    case 4: return "Over 8.0 GB";
    default: return "Unbekannt";
  }
}

function playerIsAdmin(player) {
  const save_data = load_save_data();
  const isIndex = typeof player === 'number';
  const player_sd_index = isIndex ? player : save_data.findIndex(entry => entry.id === player.id);

  const playerObj = isIndex ? save_data[player_sd_index] : player;
  return playerObj.commandPermissionLevel >= 3 ||
         (server_mode && save_data[player_sd_index]?.has_ownership);
}

function formatBytes(bytes) {
    if (bytes < 1024) return `${bytes} Bytes`;
    if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(2)} KB`;
    if (bytes < 1024 ** 3) return `${(bytes / 1024 ** 2).toFixed(2)} MB`;
    if (bytes < 1024 ** 4) return `${(bytes / 1024 ** 3).toFixed(2)} GB`;
    return `${(bytes / 1024 ** 4).toFixed(2)} TB`;
}

function getBytesfromInput(sdEntry) {
    if (!sdEntry) return { bytes: 0, chunks: [] };

    const json = JSON.stringify(sdEntry);

    if (typeof TextEncoder !== "undefined") {
        const encoder = new TextEncoder();
        const bytes = encoder.encode(json).length;
        return { bytes, chunks: [] };
    } else {
        return { bytes: json.length * 2, chunks: [] };
    }
}

function markdownToMinecraft(md) {
  if (typeof md !== 'string') return '';

  // normalize newlines
  md = md.replace(/\r\n?/g, '\n');

  const UNSUPPORTED_MSG = '§o§7Tabelles are not supported! Visit GitHub for this.';

  // helper: map admonition type -> minecraft color code (choose sensible defaults)
  function admonColor(type) {
    const t = (type || '').toLowerCase();
    if (['caution', 'warning', 'danger', 'important'].includes(t)) return '§c'; // red
    if (['note', 'info', 'tip', 'hint'].includes(t)) return '§b'; // aqua
    return '§e'; // fallback: yellow
  }

  // inline processor (handles code spans first, then bold/italic/strike, links/images, etc.)
  function processInline(text) {
    if (!text) return '';

    // tokenise code spans to avoid further processing inside them
    const tokens = [];
    text = text.replace(/(`+)([\s\S]*?)\1/g, (m, ticks, code) => {
      const safe = code.replace(/\n+/g, ' '); // inline code -> single line
      const repl = '§7' + safe + '§r';
      tokens.push(repl);
      return `__MD_TOKEN_${tokens.length - 1}__`;
    });

    // images -> unsupported (replace whole image with message)
    text = text.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, () => UNSUPPORTED_MSG);

    // links -> keep link text only (no URL)
    text = text.replace(/\[([^\]]+)\]\((?:[^)]+)\)/g, '$1');

    // bold: **text** or __text__ -> §ltext§r
    text = text.replace(/(\*\*|__)(?=\S)([\s\S]*?\S)\1/g, '§l$2§r');

    // italic: *text* or _text_ -> §otext§r
    // (do after bold so that **...** won't be partially matched)
    text = text.replace(/(\*|_)(?=\S)([\s\S]*?\S)\1/g, '§o$2§r');

    // strikethrough: ~~text~~ -> use italic+gray as fallback (no §m)
    text = text.replace(/~~([\s\S]*?)~~/g, '§o§7$1§r');

    // simple HTML tags or raw tags -> treat as unsupported (avoid exposing markup)
    if (/<\/?[a-z][\s\S]*?>/i.test(text)) return UNSUPPORTED_MSG;

    // restore code tokens
    text = text.replace(/__MD_TOKEN_(\d+)__/g, (m, idx) => tokens[Number(idx)] || '');

    return text;
  }

  // 1) Replace fenced code blocks (```...```) with unsupported message
  md = md.replace(/```[\s\S]*?```/g, () => UNSUPPORTED_MSG);

  // 2) Replace GitHub-style admonition blocks: ::: type\n...\n:::
  md = md.replace(/::: *([A-Za-z0-9_-]+)\s*\n([\s\S]*?)\n:::/gmi, (m, type, content) => {
    // flatten content lines, then process inline inside
    const inner = processInline(content.replace(/\n+/g, ' ').trim());
    const cap = type.charAt(0).toUpperCase() + type.slice(1);
    return `§l${admonColor(type)}${cap}: ${inner}§r`;
  });

  // now process line-by-line for tables / headings / lists / blockquotes / admonitions-as-blockquotes
  const lines = md.split('\n');
  const out = [];

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    // trim trailing CR/ spaces
    const raw = line;

    //  ---- detect table: a row with '|' and a following separator row like "| --- | --- |" or "---|---"
    const nextLine = lines[i + 1] || '';
    const isTableRow = /\|/.test(line);
    const nextIsSeparator = /^\s*\|?[:\-\s|]+$/.test(nextLine);
    if (isTableRow && nextIsSeparator) {
      // consume all contiguous table rows
      out.push(UNSUPPORTED_MSG);
      i++; // skip the separator
      while (i + 1 < lines.length && /\|/.test(lines[i + 1])) i++;
      continue;
    }

    //  ---- headings (#, ##, ###) -> §l + content + §r + \n
    const hMatch = line.match(/^(#{1,3})\s*(.*)$/);
    if (hMatch) {
      const content = hMatch[2].trim();
      out.push('§l' + processInline(content) + '§r\n');
      continue;
    }

    //  ---- GitHub-style single-line admonition in > or plain "Caution: ..." at line start
    const admonLineMatch = raw.match(/^\s*(?:>\s*)?(?:\*\*)?(Caution|Warning|Note|Tip|Important|Danger|Info)(?:\*\*)?:\s*(.+)$/i);
    if (admonLineMatch) {
      const type = admonLineMatch[1];
      const content = admonLineMatch[2].trim();
      out.push(`§l${admonColor(type)}${type}: ${processInline(content)}§r`);
      continue;
    }

    //  ---- blockquote lines starting with '>'
    if (/^\s*>/.test(line)) {
      const content = line.replace(/^\s*>+\s?/, '');
      out.push('§o' + processInline(content) + '§r');
      continue;
    }

    //  ---- images or html inline -> unsupported
    if (/^!\[.*\]\(.*\)/.test(line) || /<[^>]+>/.test(line)) {
      out.push(UNSUPPORTED_MSG);
      continue;
    }

    //  ---- unordered list (-, *, +) -> bullet + inline
    if (/^\s*[-*+]\s+/.test(line)) {
      const item = line.replace(/^\s*[-*+]\s+/, '');
      out.push('• ' + processInline(item));
      continue;
    }

    //  ---- ordered list (1. 2. ...) -> bullet as well
    if (/^\s*\d+\.\s+/.test(line)) {
      const item = line.replace(/^\s*\d+\.\s+/, '');
      out.push('• ' + processInline(item));
      continue;
    }

    //  ---- default: process inline formatting
    // empty line -> keep empty
    if (line.trim() === '') {
      out.push('');
      continue;
    }

    out.push(processInline(line));
  }

  // join with newline and return
  return out.join('\n');
}

function toRoman(num) {
  if (num <= 0 || num >= 4000) return ""; // Römer nutzten keine 0 oder Zahlen >= 4000

  const romanNumerals = [
    ["M", 1000],
    ["CM", 900],
    ["D", 500],
    ["CD", 400],
    ["C", 100],
    ["XC", 90],
    ["L", 50],
    ["XL", 40],
    ["X", 10],
    ["IX", 9],
    ["V", 5],
    ["IV", 4],
    ["I", 1]
  ];

  let result = "";
  for (const [roman, value] of romanNumerals) {
    while (num >= value) {
      result += roman;
      num -= value;
    }
  }
  return result;
}

function humanizeId(id) {
  if (!id) return "";
  // id wie "bane_of_arthropods" -> "Bane of Arthropods"
  const smallWords = new Set(["of","the","and","to","in","by","for","on","with","a","an","or"]);
  const parts = id.replace(/^minecraft:/, "").split("_");
  const words = parts.map((w, idx) => {
    w = w.toLowerCase();
    if (idx > 0 && smallWords.has(w)) return w; // keep small words lowercase (except first)
    return w.charAt(0).toUpperCase() + w.slice(1);
  });
  return words.join(" ");
}

function isCommandAvailable(player, cmd) {
  // Save-Daten laden
  const save_data = load_save_data();
  const player_sd_index = save_data.findIndex(e => e.id === player.id);

  const playerAllowed = save_data[player_sd_index].allowed_commands || [];

  // Befehl extrahieren
  const firstToken = (cmd || "").trim().split(/\s+/)[0] || "";
  const commandName = firstToken.replace(/^\//, "").toLowerCase();
  if (!commandName) return false;

  // Befehl in Liste finden
  if (!Array.isArray(command_list)) return false;
  const cmdIndex = command_list.findIndex(c =>
    c && c.name && c.name.toLowerCase() === commandName
  );

  // Permission-Level 2 = immer erlaubt (Admin)
  if (player.commandPermissionLevel >= 1) return true;

  if (cmdIndex === -1) return false;

  // Spieler muss explizit Berechtigung haben
  return playerAllowed.includes(cmdIndex);
}

function isVisualCommandAvailable(player, cmd) {
  if (typeof cmd.vc_available === "function" && !cmd.vc_available(player)) {
    return null;
  }

  if (typeof cmd.vc_hiperlink !== "function") {
    return null;
  }

  return (player, on_output) => cmd.vc_hiperlink(player, on_output);
}

function generate_command_lists(player, on_output) {
  const recommendedEntries = [];
  const allEntries = [];
  const categoryLists = command_categories.map((category, categoryIndex) => ({
    categoryIndex,
    category,
    entries: []
  }));

  function addTo(arr, label, icon, actionFn) {
    arr.push({ label, icon, actionFn });
  }

  for (const cmd of command_list) {
    let visible = true;
    visible = isCommandAvailable(player, `/${cmd.name}`);

    if (!visible) continue;

    if (typeof cmd.visible === "function") {
      visible = !!cmd.visible(player);
    } else if (typeof cmd.visible === "boolean") {
      visible = cmd.visible;
    }

    let isVC = isVisualCommandAvailable(player, cmd)

    // recommended Flag ermitteln
    let recommendedFlag = false;
    if (typeof cmd.recommended === "function") {
      try {
        recommendedFlag = !!cmd.recommended(player);
      } catch (err) {
        recommendedFlag = false;
        console.error("recommended() error for command", cmd.name, err);
      }
    } else {
      recommendedFlag = !!cmd.recommended;
    }

    // action function
    const actionFn = () => {
      if (isVC) {
        return isVC(player, on_output);
      } else {
        return visual_command_generic(player, cmd, on_output);
      }
    };

    // --- Kategorisierung ---
    if (recommendedFlag) {
      addTo(recommendedEntries, cmd.name, cmd.textures, actionFn);
    }

    const categoryIndex = Number.isInteger(cmd.category) ? cmd.category : -1;
    if (categoryIndex >= 0 && categoryIndex < categoryLists.length) {
      categoryLists[categoryIndex].entries.push({ label: cmd.name, icon: cmd.textures, actionFn });
    }

    addTo(allEntries, cmd.name, cmd.textures, actionFn);
  }

  // Sortieren optional
  const sorter = (a, b) => a.label.localeCompare(b.label);
  recommendedEntries.sort(sorter);
  allEntries.sort(sorter);
  for (const cat of categoryLists) {
    cat.entries.sort(sorter);
  }

  return {
    recommendedEntries,
    allEntries,
    categoryLists
  };
}

function generate_history_entries(player) {
  const saveData = load_save_data();
  const playerIndex = saveData.findIndex(entry => entry.id === player.id);
  const originalHistory = (playerIndex !== -1 && Array.isArray(saveData[playerIndex].command_history))
    ? saveData[playerIndex].command_history
    : [];

  const historyEntries = [...originalHistory]
    .filter(entry => entry.hidden !== true)
    .map(entry => {
      const cmdName = (entry.command || "").split(" ")[0].replace(/^\//, "").toLowerCase();
      const statusText = entry.successful ? "§2ran§r" : "§cfailed§r";
      const relativeTime = getRelativeTime(Date.now() - entry.unix);

      const matchingCommand = command_list.find(cmd =>
        Array.isArray(cmd.aliases) &&
        cmd.aliases.map(a => a.toLowerCase()).includes(cmdName)
      );

      const texture = matchingCommand?.textures ?? "textures/ui/chat_send";
      const originalIndex = originalHistory.indexOf(entry);

      return {
        category: "command",
        entry,
        unix: entry.unix,
        label: `/${cmdName}\n${statusText} | ${relativeTime} ago`,
        icon: texture,
        actionFn: () => {
          if (saveData[playerIndex].quick_run) {
            execute_command(player, entry.command, player);
          } else {
            command_menu(player, entry.command, originalIndex);
          }
        }
      };
    });

  const chainEntries = (playerIndex !== -1 && Array.isArray(saveData[playerIndex].chain_commands) && canPlayerUseChains(player))
    ? saveData[playerIndex].chain_commands
        .flatMap((chain, index) => {
          const unixArray = Array.isArray(chain.state.unix) ? chain.state.unix : [chain.state.unix].filter(u => u != null);
          return unixArray.map(unix => {
            const statusText = chain.state.successful ? "§2Successful§r" : "§cFailed§r";
            const relativeTime = getRelativeTime(Date.now() - unix);
            return {
              category: "chain",
              entry: chain,
              unix: unix,
              label: `Chain: ${chain.name || "Unnamed Chain"}\n${statusText} | ${relativeTime} ago`,
              icon: chain.icon || "textures/items/chain",
              actionFn: () => {
                chain_main(player, index);
              }
            };
          });
        })
    : [];

  const allEntries = [...historyEntries, ...chainEntries]
    .sort((a, b) => b.unix - a.unix);

  return allEntries;
}

function canPlayerUseMenu(player, player_sd_index) {
  const save_data = load_save_data();
  if (player.commandPermissionLevel >= 1 && (player_sd_index == save_data.findIndex(e => e.id === player.id))) return true; // Admins immer Zugriff

  player_sd_index = player_sd_index !== undefined ? player_sd_index : save_data.findIndex(e => e.id === player.id);

  return save_data[player_sd_index].allow_menu;
}

function canPlayerUseChains(player, player_sd_index) {
  const save_data = load_save_data();
  player_sd_index = player_sd_index !== undefined ? player_sd_index : save_data.findIndex(e => e.id === player.id);
  if (player.commandPermissionLevel >= 1) return true; // Admins immer Zugriff
  return save_data[player_sd_index].allow_chains;
}

function pushChainUnix(chainState, timestamp) {
  if (!chainState) return;
  if (!Array.isArray(chainState.unix)) {
    chainState.unix = chainState.unix != null ? [chainState.unix] : [];
  }
  chainState.unix.push(timestamp);
}

/*------------------------
  Logs
-------------------------*/

function generate_logs(player) {
  const logs = [];
  const save_data = load_save_data();
  const min_unix = getLastLogin(save_data[0]) // Since Server started

  // Hilfsfunktion: relative Zeit
  const ago = (unix) => getRelativeTime(Date.now() - unix);
  let actions = []


  const createLogActionForm = (title, labels) => {
    const form = new ActionFormData();
    form.title(title);
    form.body("§lGeneral");

    // Alle Labels hinzufügen
    labels.forEach(label => form.label(label));

    form.divider();

    form.button("")
    actions.push(() => {
      settings_main(player);
    });

    return form;
  };

  // ----------------------------
  // Hauptlog-Generierung
  // ----------------------------
  save_data.forEach((entry, index) => {
    const playerName = index === 0 ? "Server" : entry.name || "Unknown";

    // ----- Command History -----
    if (Array.isArray(entry.command_history)) {
      entry.command_history.forEach(command => {
        if (command.hidden) return;
        if (command.unix < min_unix) return;

        const statusColor = command.successful ? "§2" : "§c";
        const statusText = command.successful ? "Ran" : "Failed";
        const timeAgo = ago(command.unix);

        logs.push({
          label: `${statusColor}${statusText}§r ${command.command}\n${playerName} | ${timeAgo} ago`,
          icon: command.textures || "textures/ui/chat_send",
          unix: command.unix,
          actionFn: () => {
            const form = createLogActionForm("Command Details", [
              `Command: ${command.command}`,
              `Source: ${playerName}`,
              `Status: ${command.successful ? "Success" : "Failed"}`,
              `Time: ${timeAgo} ago`
            ]);
            form.show(player).then((response) => {
              if (response.selection == undefined ) {
                return -1
              }

              if (actions[response.selection]) {
                actions[response.selection]();
              }
            });
          }
        });
      });
    }

    // ----- Chain Commands -----
    if (Array.isArray(entry.chain_commands)) {
      entry.chain_commands.forEach(chain => {
        const chainName = chain.name || "Unnamed Chain";
        const timestamps = Array.isArray(chain.state?.unix) ? chain.state.unix : [];

        timestamps.forEach(unix => {
          if (unix < min_unix) return;

          const statusColor = chain.state.successful ? "§2" : "§c";
          const statusText = chain.state.successful ? "Ran" : "Failed";
          const timeAgo = ago(unix);

          logs.push({
            label: `${statusColor}${statusText}§r ${chainName}\n${playerName} | ${timeAgo} ago`,
            icon: chain.state.textures || "textures/items/chain",
            unix: unix,
            actionFn: () => {
              const form = createLogActionForm("Chain Details", [
                `Chain: ${chainName}`,
                `Executed by: ${playerName}`,
                `Status: ${chain.state.successful ? "Success" : "Failed"}`,
                `Time: ${timeAgo} ago`
              ]);
              form.show(player).then((response) => {
                if (response.selection == undefined ) {
                  return -1
                }

                if (actions[response.selection]) {
                  actions[response.selection]();
                }
            });
            }
          });
        });
      });
    }

    // ----- Sessions -----
    const sessions = getSessions(entry);
    sessions.forEach((session, i) => {
      // Logout
      if (session.logout !== undefined && session.logout >= min_unix) {
        const timeAgo = ago(session.logout);
        const sessionDuration = session.login !== undefined
          ? getRelativeTime(session.logout - session.login)
          : "unknown";

        logs.push({
          label: index === 0
            ? `§cShutdown§r after ${sessionDuration}§r\n${playerName} | ${timeAgo} ago`
            : `§cLeft§r after ${sessionDuration}§r\n${playerName} | ${timeAgo} ago`,
          icon: "textures/ui/Ping_Offline_Red",
          unix: session.logout,
          actionFn: () => {
            const form = createLogActionForm("Session Details", [
              index === 0
                ? `§eClosed the server`
                : `§e${playerName} left the server`,
              `Time: ${timeAgo} ago`,
              `Session Duration: ${sessionDuration}`
            ]);
            form.show(player).then((response) => {
              if (response.selection == undefined ) {
                return -1
              }

              if (actions[response.selection]) {
                actions[response.selection]();
              }
            });
          }
        });
      }

      // Login
      if (session.login !== undefined && session.login >= min_unix) {
        const timeAgo = ago(session.login );

        logs.push({
          label: index === 0
            ? `§2Started§r the Server the ${i + 1}. time§r\n${playerName} | ${timeAgo} ago`
            : `§2Joined§r the Server the ${i + 1}. time§r\n${playerName} | ${timeAgo} ago`,
          icon: index === 0 ? "textures/ui/servers" : "textures/ui/online",
          unix: session.login,
          actionFn: () => {
            const form = createLogActionForm("Session Details", [
              index === 0
                ? `§eStarted the server`
                : `§e${playerName} joined the server`,
              `Time: ${timeAgo} ago`,
              `Count: ${i + 1}`
            ]);
            form.show(player).then((response) => {
              if (response.selection == undefined ) {
                return -1
              }

              if (actions[response.selection]) {
                actions[response.selection]();
              }
            });
          }
        });
      }
    });
  });

  // Sortiere Logs nach Unix-Timestamp absteigend
  logs.sort((a, b) => b.unix - a.unix);
  return logs;
}

/*------------------------
  Visual Command Input Helpers
-------------------------*/

async function menu_text_input(player, input) {
  const form = new ModalFormData();
  form.title(input.title);
  form.textField(
    input.prompt,
    input.placeholder || "",
    {
      defaultValue: input.defaultValue || "",
      tooltip: input.tooltip || ""
    }
  );

  if (input.optional) {
    form.toggle("Skip", { tooltip: "Enable to skip this input" });
  }

  const response = await form.show(player);

  if (response.isCanceled) return -1;

  return {
    response: response.formValues[0],
    canceled: response.formValues[0] == "",
    skipped: input.optional ? response.formValues[1] : false
  };
}

async function menu_location_input(player, input) {
  const form = new ModalFormData();
  form.title(input.title);
  form.label(input.prompt || "");
  form.textField(
    "X:",
    String(Math.floor(player.location.x)) || "",
    {
      defaultValue: String(Math.floor(player.location.x)) || "",
      tooltip: input.tooltip || ""
    }
  );

  form.textField(
    "Y:",
    String(Math.floor(player.location.y)) || "",
    {
      defaultValue: String(Math.floor(player.location.y)) || "",
      tooltip: input.tooltip || ""
    }
  );

  form.textField(
    "Z:",
    String(Math.floor(player.location.z)) || "",
    {
      defaultValue: String(Math.floor(player.location.z)) || "",
      tooltip: input.tooltip || ""
    }
  );

  form.toggle("Inserting a location", { tooltip: "This will temporarily close the menu so that you can look at the coresponding location." });

  if (input.optional) {
    form.toggle("Skip", { tooltip: "Enable to skip this input" });
  }

  const response = await form.show(player);

  if (response.isCanceled) return -1;

  let skipped = input.optional ? response.formValues[5] : false;

  // "Inserting a location" toggled -> close menu and return current location as response
  if (response.formValues[4] && !skipped) {
      let block;
      while (!player.isSneaking) {
        const hit = player.getBlockFromViewDirection();
        block = hit?.block;
        const x = block?.location?.x ?? 0;
        const y = block?.location?.y ?? 0;
        const z = block?.location?.z ?? 0;
        if (x !== 0 || y !== 0 || z !== 0) {
          player.onScreenDisplay.setActionBar(`${x}, ${y}, ${z} - sneak to confirm`);
        } else {
          player.onScreenDisplay.setActionBar(`undefined - sneak to return to menu`);
        }
        await system.waitTicks(1);
      }

      const x = block?.location?.x;
      const y = block?.location?.y;
      const z = block?.location?.z;
      if (x == null || y == null || z == null) {
        player.onScreenDisplay.setActionBar("");
        return menu_location_input(player, input);
      }
      player.onScreenDisplay.setActionBar("");
      return {
        response: {
          x: Math.floor(x),
          y: Math.floor(y),
          z: Math.floor(z)
        },
        canceled: false,
        skipped: false
      };
  }

  return {
    response: {x: response.formValues[1], y: response.formValues[2], z: response.formValues[3]},
    canceled: response.formValues[1] == "" || response.formValues[2] == "" || response.formValues[3] == "",
    skipped: skipped
  };
}

async function menu_actions_input(player, input) {
  const form = new ActionFormData();
  form.title(input.title);
  form.body(input.prompt || "");

  for (const action of input.actions) {
    form.button(action.value || action.name, action.icon || "");
  }

  if (input.optional) {
    form.divider();
    form.button("Skip");
  }
  form.divider();
  form.button("");

  const response = await form.show(player);
  if (response?.isCanceled || response?.canceled || response?.selection === undefined) {
    return { response: null, skipped: false, canceled: true };
  }

  return {
    response:
      response.selection < input.actions.length
        ? input.actions[response.selection].value || input.actions[response.selection].id
        : null,

    skipped:
      input.optional &&
      response.selection === input.actions.length,

    canceled:
      response.selection ===
      (input.optional
        ? input.actions.length + 1
        : input.actions.length)
  };
}

// Maybe "menu_blocktype_input" or "menu_itemtype_input" in future

/*------------------------
  Custom Command Recommendation Helpers
-------------------------*/

function isFarthestPlayerFarAway(player, minDistance) {
    const players = world.getAllPlayers();

    let farthestPlayer;
    let maxDistance = -1;

    for (const p of players) {
        if (p.id === player.id) continue; // Sich selbst überspringen

        const dx = p.location.x - player.location.x;
        const dy = p.location.y - player.location.y;
        const dz = p.location.z - player.location.z;
        const distance = Math.sqrt(dx*dx + dy*dy + dz*dz);

        if (distance > maxDistance) {
            maxDistance = distance;
            farthestPlayer = p;
        }
    }

    // Falls keine weiteren Spieler existieren
    if (!farthestPlayer) return false;

    return maxDistance > minDistance;
}

function isRideableEntityNearby(player, radius) {
    const entities = world.getDimension("overworld").getEntities({
        location: player.location,
        maxDistance: radius
    });

    for (const entity of entities) {
      if (entity.id === player.id) continue; // Not sure why the player itself has an "minecraft:rideable" component...

      if (entity.hasComponent("minecraft:rideable")) {
          return true;
      }
    }

    return false;
}

function getStackCount(player) {
    const inventory = player.getComponent("minecraft:inventory").container;
    let count = 0;

    for (let i = 0; i < inventory.size; i++) {
        if (inventory.getItem(i)) {
            count++;
        }
    }

    return count;
}

/*------------------------
  Custom Command Helpers
-------------------------*/

function registerBuiltInDynamicEnums(init) {
  const enums = {};

  function safeGetKeys(getAllCandidate, label) {
    try {
      if (!getAllCandidate || typeof getAllCandidate !== "function") {
        print(`${label}.getAll ist nicht vorhanden oder keine Funktion.`)
        return [];
      }
      const all = getAllCandidate(); // synchron aufrufen
      // Wenn eine Hilfsfunktion getKeysFromGetAll existiert, verwende sie
      if (typeof getKeysFromGetAll === "function") {
        const keys = getKeysFromGetAll(all);
        return Array.isArray(keys) ? keys : [];
      }
      // Fallbacks
      if (Array.isArray(all)) return all.map(v => (typeof v === "object" ? (v.value ?? v.name ?? String(v)) : String(v)));
      if (all && typeof all === "object") return Object.keys(all);
      return [];
    } catch (e) {
      print(`Fehler beim Erzeugen der ${label}-enum:`, e)
      return [];
    }
  }

  const effectValues = safeGetKeys(EffectTypes && EffectTypes.getAll, "EffectTypes");
  if (effectValues.length) {
    try {
      init.customCommandRegistry.registerEnum("com2hard:effectType", effectValues);
      enums.effectType = "com2hard:effectType";
    } catch (e) {
      print("registerEnum effectType fehlgeschlagen:", e)
    }
  }

  const enchValues = safeGetKeys(EnchantmentTypes && EnchantmentTypes.getAll, "EnchantmentTypes");
  if (enchValues.length) {
    try {
      init.customCommandRegistry.registerEnum("com2hard:enchantType", enchValues);
      enums.enchantType = "com2hard:enchantType";
    } catch (e) {
      print("registerEnum enchantType fehlgeschlagen:", e)
    }
  }

  const weatherValues = safeGetKeys(WeatherType && WeatherType.getAll, "WeatherType");
  if (weatherValues.length) {
    try {
      init.customCommandRegistry.registerEnum("com2hard:weathertype", weatherValues);
      enums.weathertype = "com2hard:weathertype";
    } catch (e) {
      print("registerEnum weathertype fehlgeschlagen:", e)
    }
  }

  return enums;
}

// --- 2) registerInlineEnum: filtert Einträge mit 'next' heraus, registriert nur echte Werte ---
function registerInlineEnum(init, commandName, paramName, valuesArray) {
  if (!Array.isArray(valuesArray) || valuesArray.length === 0) return null;

  // Filter: entferne Objekte, die ein 'next' Feld besitzen (wie gewünscht)
  const filtered = valuesArray.filter(v => !(v && typeof v === "object" && Object.prototype.hasOwnProperty.call(v, "next")));
  if (filtered.length === 0) return null;

  // Mappe
  const entries = filtered.map(v => { if (v == null) return null; if (typeof v === "string") return v; if (typeof v === "object") return v.value ?? v.name ?? v.id ?? v.key ?? v.text ?? JSON.stringify(v); return String(v); }).filter(Boolean);

  if (entries.length === 0) return null;

  const enumId = `com2hard:${commandName}_${paramName}`;
  try {
    init.customCommandRegistry.registerEnum(enumId, entries);
    return enumId;
  } catch (e) {
    print(`Enum ${enumId} konnte nicht registriert werden:`, e)
    return null;
  }
}

// --- 3) buildParamsFromTopLevel: dynamische Enums werden ausgelassen, wenn nicht registriert ---
function buildParamsFromTopLevel(init, cmd, enumsDynamic) {
  const mandatory = [];
  const optional = [];
  const getChoiceOptions = (syntax) => Array.isArray(syntax?.options) ? syntax.options : [];
  const getEnumValues = (syntax) => (Array.isArray(syntax?.value) ? syntax.value : [])
    .map(v => String(v?.name ?? v?.value ?? v))
    .filter(Boolean);

  function mapSimpleType(typeStr) {
    switch (typeStr) {
      case "int": return CustomCommandParamType.Integer;
      case "float": return CustomCommandParamType.Float;
      case "string": return CustomCommandParamType.String; // json -> handled separately
      case "bool": return CustomCommandParamType.Boolean;
      case "location": return CustomCommandParamType.Location;
      case "blocktype": return CustomCommandParamType.BlockType;
      case "itemtype": return CustomCommandParamType.ItemType;
      case "entityType": return CustomCommandParamType.EntityType;
      case "entityselector": return CustomCommandParamType.EntitySelector;
      case "playerselector": return CustomCommandParamType.PlayerSelector;
      default:
        return null;
    }
  }

  for (const syn of cmd.syntaxes) {
    if (syn.type === "literal") continue;

    // Wenn das Syntax-Element ein 'next' hat, handelt es sich um verzweigte/nested Syntax,
    // die sich nicht flach in mandatory/optional abbilden lässt -> IGNORIEREN.
    if (syn && Object.prototype.hasOwnProperty.call(syn, "next") && Array.isArray(syn.next) && syn.next.length > 0) {
      print(`Syntax-Element '${syn.name || syn.type}' in command '${cmd.name}' hat 'next' -> wird ignoriert (nicht abbildbar).`)
      continue;
    }

    if (syn.type === "json") {
      const param = { type: CustomCommandParamType.String, name: syn.name || "json", optional: !!syn.optional };
      (param.optional ? optional : mandatory).push(param);
      continue;
    }

    if (syn.type === "repeat" || syn.type === "command_tail" || syn.type === "exit_loop" || syn.type === "can_exit_loop") {
      print(`Syntax-Element '${syn.type}' in command '${cmd.name}' wird nicht in CustomCommandParamType abgebildet.`)
      continue;
    }

    // Special: dynamische enums - nur hinzufügen, wenn enumsDynamic die registrierte Enum-ID liefert.
    if (syn.type === "effecttype" || syn.type === "enchanttype" || syn.type === "weathertype") {
      const enumKey = enumsDynamic && enumsDynamic[syn.type];
      if (enumKey) {
        const param = { type: CustomCommandParamType.Enum, name: enumKey, optional: !!syn.optional };
        (param.optional ? optional : mandatory).push(param);
        continue;
      } else {
        // **IGNORIERE** den Parameter wenn die dynamische enum nicht verfügbar ist (wie 'next' ungenutzt).
        print(`Dynamische enum '${syn.type}' nicht vorhanden -> Parameter '${syn.name}' wird zu Unbekannt.`)
      }
    }

    // inline enums
    if (syn.type === "enum") {
      const enumValues = getEnumValues(syn);
      const enumId = registerInlineEnum(init, cmd.name, syn.name || "enum", enumValues);
      if (!enumId) {
        print(`Inline-enum für ${cmd.name}.${syn.name} wurde herausgefiltert -> kein Parameter.`);
        continue;
      }
      const param = { type: CustomCommandParamType.Enum, name: enumId, optional: !!syn.optional };
      (param.optional ? optional : mandatory).push(param);
      continue;
    }
    if (syn.type === "choice") {
      const options = getChoiceOptions(syn);
      if (!options.length) {
        print(`Choice '${syn.name || "choice"}' in command '${cmd.name}' hat keine Optionen -> wird nicht flach gemappt.`);
        continue;
      }
      // Teilweise Abbildung: nur Optionen ohne Unter-Syntax als Enum zulassen.
      const flatOptions = options.filter(opt => {
        const optionSyntaxes = Array.isArray(opt?.syntaxes) ? opt.syntaxes : (Array.isArray(opt?.next) ? opt.next : []);
        return optionSyntaxes.length === 0;
      });
      if (!flatOptions.length) {
        print(`Choice '${syn.name || "choice"}' in command '${cmd.name}' hat nur Unter-Syntax -> wird nicht flach gemappt.`);
        continue;
      }
      if (flatOptions.length !== options.length) {
        print(`Choice '${syn.name || "choice"}' in command '${cmd.name}' wird teilweise als Enum gemappt (${flatOptions.length}/${options.length} Optionen ohne Unter-Syntax).`);
      }
      const values = flatOptions.map(v => String(v?.name ?? v?.value ?? "")).filter(Boolean);
      const enumId = registerInlineEnum(init, cmd.name, syn.name || "choice", values);
      if (!enumId) {
        print(`Inline-choice für ${cmd.name}.${syn.name} wurde herausgefiltert -> kein Parameter.`);
        continue;
      }
      const param = { type: CustomCommandParamType.Enum, name: enumId, optional: !!syn.optional };
      (param.optional ? optional : mandatory).push(param);
      continue;
    }

    const mapped = mapSimpleType(syn.type);
    if (mapped != null) {
      const param = { type: mapped, name: syn.name, optional: !!syn.optional };
      (param.optional ? optional : mandatory).push(param);
      continue;
    }

    // Unbekannter Typ: fallback zu String
    const param = { type: CustomCommandParamType.String, name: syn.name || syn.type, optional: !!syn.optional };
    (param.optional ? optional : mandatory).push(param);
    print(`Unbekannter param type '${syn.type}' bei command '${cmd.name}' -> als String registriert.`)
  }

  return { mandatory, optional };
}

/*------------------------
 Command fixing helpers
-------------------------*/

function levenshtein(a, b) {
  const dp = Array(a.length + 1).fill(null).map(() => Array(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i++) dp[i][0] = i;
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      );
    }
  }
  return dp[a.length][b.length];
}

function findClosest(input, list, typeName = "") {
  if (!list || list.length === 0) {
    print(`[DEBUG] Liste für Typ "${typeName}" ist leer!`);
    return null;
  }
  let closest = list[0];
  let minDist = levenshtein(input.toLowerCase(), closest.toLowerCase());
  for (const item of list) {
    const dist = levenshtein(input.toLowerCase(), item.toLowerCase());
    if (dist < minDist) {
      minDist = dist;
      closest = item;
    }
  }
  print(`[DEBUG] findClosest: "${input}" -> "${closest}" (Typ: ${typeName})`);
  return closest;
}

function findClosestCommandName(input, list) {
  const closest = findClosest(input, list, "command");
  if (!closest) return null;
  const distance = levenshtein(input.toLowerCase(), closest.toLowerCase());
  const maxDistance = Math.max(1, Math.floor(Math.min(input.length, closest.length) * 0.4));
  if (distance > maxDistance) {
    print(`[DEBUG] findClosestCommandName: "${input}" -> "${closest}" (Distanz ${distance} > ${maxDistance}), kein sicherer Treffer`);
    return null;
  }
  return closest;
}

function splitCommandParts(commandString) {
  return commandString.match(/"[^"]*"|'[^']*'|[^\s]+/g) || [];
}

function isLikelySyntaxMatch(input, typeDef, syntax) {
  if (input == null || input === "") return false;
  const typeName = (typeof typeDef === "string")
    ? typeDef.toLowerCase()
    : ((typeDef && (typeDef.type || typeDef.name)) || "").toLowerCase();
  const value = String(input).trim();
  if (value === "") return false;

  switch (typeName) {
    case "literal": {
      const rawExpected = syntax?.value || syntax?.values || syntax?.expected || [];
      const values = (Array.isArray(rawExpected) ? rawExpected : [rawExpected]).map(v => String(v?.value ?? v).replace(/^\//, "")).filter(Boolean);
      const normalized = value.replace(/^\//, "");
      if (values.length === 0) return false;
      if (values.some(v => v.toLowerCase() === normalized.toLowerCase())) return true;
      const closest = findClosest(normalized, values, "literal");
      return levenshtein(normalized.toLowerCase(), closest.toLowerCase()) <= Math.max(1, Math.floor(normalized.length * 0.4));
    }
    case "choice": {
      const options = Array.isArray(syntax?.options) ? syntax.options : [];
      if (!options.length) return false;
      const optionNames = options.map(o => String(o?.name ?? o?.value ?? "")).filter(Boolean);
      if (optionNames.some(v => v.toLowerCase() === value.toLowerCase())) return true;
      return options.some(option => {
        const optionSyntaxes = Array.isArray(option.syntaxes) ? option.syntaxes : (Array.isArray(option.next) ? option.next : []);
        const firstSyntax = optionSyntaxes?.[0];
        return firstSyntax && isLikelySyntaxMatch(input, firstSyntax.type, firstSyntax);
      });
    }
    case "enum": {
      const values = (Array.isArray(syntax?.value) ? syntax.value : []).map(v => String(v?.name ?? v?.value ?? v)).filter(Boolean);
      if (!values.length) return false;
      if (values.some(v => v.toLowerCase() === value.toLowerCase())) return true;
      const closest = findClosest(value, values, "enum");
      return levenshtein(value.toLowerCase(), closest.toLowerCase()) <= Math.max(1, Math.floor(value.length * 0.4));
    }
    case "command_tail": return true;
    case "repeat": return true;
    case "playerselector":
    case "entityselector":
      if (/^@/.test(value)) return true;
      if (typeName === "playerselector") {
        return world.getAllPlayers().some(p => p.name.toLowerCase() === value.toLowerCase());
      }
      return false;
    case "location":
      return isValidLocation(value) || /^~/.test(value);
    case "json":
      return isValidJson(value) || /^[\[{]/.test(value);
    case "int":
      return /^[-+]?\d+$/.test(value) || /^[-+]?\d+/.test(value);
    case "float":
      return /^[-+]?\d*\.?\d+$/.test(value) || /^[-+]?\d*\.?\d+/.test(value);
    case "bool":
      if (/^(true|false)$/i.test(value)) return true;
      return levenshtein(value.toLowerCase(), "true") <= 2 || levenshtein(value.toLowerCase(), "false") <= 2;
    default:
      return true;
  }
}

function fixSelector(input) {
  const validSelectors = ["@a", "@r", "@e", "@p", "@s"];
  if (validSelectors.includes(input)) {
    print(`[DEBUG] Selector "${input}" is in ${JSON.stringify(validSelectors)}.`);
    return input;
  }
  if (typeof input === "string" && input.startsWith("@") && input.includes("[")) {
    const selectorFixedType = input.replace(/type\s*=\s*([^\],\s]+)/i, (_m, typeId) => {
      const normalizedType = String(typeId || "").replace(/^minecraft:/i, "");
      const allTypes = getKeysFromGetAll(EntityTypes.getAll()).map(e => String(e).replace(/^minecraft:/i, ""));
      const closest = findClosest(normalizedType, allTypes, "entitytype");
      if (!closest) return `type=${typeId}`;
      return `type=${closest}`;
    });
    return selectorFixedType;
  }
  const playerNames = Array.from(world.getAllPlayers()).map(p => p.name);
  print(`[DEBUG] Available players: ${playerNames.join(", ")}`);
  const closestPlayer = findClosest(input, playerNames, "playerselector/entityselector");
  return closestPlayer || input;
}

function fixPlayerSelector(input) {
  const validSelectors = ["@a", "@r", "@e", "@p", "@s"];
  if (validSelectors.includes(input)) return input;
  const raw = String(input || "").trim();
  if (!raw) return input;
  const playerNames = Array.from(world.getAllPlayers()).map(p => p.name);
  if (!playerNames.length) return input;
  const closestPlayer = findClosest(raw, playerNames, "playerselector");
  return closestPlayer || input;
}

function fixEntitySelector(input) {
  const validSelectors = ["@a", "@r", "@e", "@p", "@s"];
  if (validSelectors.includes(input)) return input;
  const raw = String(input || "").trim();
  if (!raw.startsWith("@")) return input;
  return fixSelector(raw);
}

function isValidLocation(input) {
  const parts = input.split(" ");
  if (parts.length !== 3) return false;
  return parts.every(p => /^~?$/.test(p) || !isNaN(parseFloat(p)));
}

function isValidJson(input) {
  try {
    JSON.parse(String(input));
    return true;
  } catch (_e) {
    return false;
  }
}

function getKeysFromGetAll(getAllResult) {
  if (Array.isArray(getAllResult)) {
    return getAllResult.map(e => (e && e.id) ? e.id : e);
  }
  return Object.keys(getAllResult || {});
}

function fixArgument(typeDef, input) {
  const typeName = (typeof typeDef === "string")
    ? typeDef.toLowerCase()
    : ((typeDef && (typeDef.type || typeDef.name)) || "").toLowerCase();

  print(`[DEBUG] fixArgument: Typ="${typeName}" Input="${input}"`);

  const extractStrings = list => {
    if (!list) return [];
    if (Array.isArray(list)) {
      return list.map(e => {
        if (typeof e === "string") return e;
        if (e?.getName) try { return e.getName(); } catch(_) { return null; }
        return e?.id || e?.name || e?.value?.value || e?.value || null;
      }).filter(Boolean);
    }
    return Object.keys(list || {});
  };

  const safeNumber = (v, fallback, preferInt = false) => {
    if (Number.isFinite(+v)) return String(v);
    const raw = String(v ?? "");
    const intMatch = raw.match(/[-+]?\d+/);
    if (preferInt && intMatch) return intMatch[0];
    const floatMatch = raw.match(/[-+]?\d*\.?\d+/);
    if (floatMatch) return floatMatch[0];
    return fallback;
  };
  const stripMinecraft = s => (typeof s === "string") ? s.replace(/^minecraft:/i, "") : s;

  switch (typeName) {
    case "literal": {
      const exp = typeDef?.value || typeDef?.values || typeDef?.expected;
      let raw = String(input), hadSlash = raw.startsWith("/");
      if (hadSlash) raw = raw.slice(1);
      if (Array.isArray(exp) && exp.length) {
        const corrected = findClosest(raw, exp.map(v => (v?.value ?? v)), "literal");
        return hadSlash ? `/${corrected}` : corrected;
      }
      return input;
    }
    case "string":   return /\s/.test(input) ? `"${input}"` : input;
    case "int":      return safeNumber(input, "0", true);
    case "float":    return safeNumber(input, "0.0", false);
    case "bool": {
      const raw = String(input || "").toLowerCase().trim();
      if (raw === "true" || raw === "false") return raw;
      const dTrue = levenshtein(raw, "true");
      const dFalse = levenshtein(raw, "false");
      return dTrue <= dFalse ? "true" : "false";
    }
    case "location": return isValidLocation(input) ? input : "~ ~ ~";

    case "blocktype": {
      const inputValue = stripMinecraft(input);
      return findClosest(inputValue, extractStrings(BlockTypes.getAll()).map(stripMinecraft), "blocktype") || input;
    }
    case "itemtype": {
      const all = [...extractStrings(ItemTypes.getAll()), ...extractStrings(BlockTypes.getAll())].map(stripMinecraft);
      return findClosest(stripMinecraft(input), [...new Set(all)], "itemtype") || input;
    }
    case "entitytype": {
      return findClosest(stripMinecraft(input), extractStrings(EntityTypes.getAll()).map(stripMinecraft), "entitytype") || input;
    }

    case "effecttype": {
      // Kandidaten und Input ohne "minecraft:" vergleichen => Ergebnis ohne Prefix zurückgeben
      const keys = extractStrings(EffectTypes.getAll()).map(k => stripMinecraft(k));
      const inp = stripMinecraft(String(input));
      return findClosest(inp, keys, "effecttype");
    }

    case "enchanttype": return findClosest(input, extractStrings(EnchantmentTypes.getAll()), "enchanttype");
    case "weathertype": {
      const weatherValues = [];
      try {
        if (typeof WeatherType?.getAll === "function") {
          weatherValues.push(...extractStrings(WeatherType.getAll()));
        }
      } catch (_e) {}
      weatherValues.push(...Object.values(WeatherType || {}).map(String));
      const normalized = [...new Set(weatherValues.filter(Boolean).map(v => v.replace(/^minecraft:/i, "")))];
      if (!normalized.length) return input;
      return findClosest(String(input).replace(/^minecraft:/i, ""), normalized, "weathertype") || input;
    }
    case "gameruletype": {
      const ruleNames = Object.keys(world.gameRules || {});
      return ruleNames.length ? (findClosest(input, ruleNames, "gameruletype") || input) : input;
    }

    case "playerselector": return fixPlayerSelector(input);
    case "entityselector": return fixEntitySelector(input);

    case "choice": {
      const vals = (typeDef?.options || typeDef?.value || []).map(v => v?.name ?? v?.value ?? v).filter(Boolean);
      return vals.length ? findClosest(input, vals, "choice") : input;
    }
    case "enum": {
      const vals = (Array.isArray(typeDef?.value) ? typeDef.value : []).map(v => String(v?.name ?? v?.value ?? v)).filter(Boolean);
      return vals.length ? findClosest(input, vals, "enum") : input;
    }
    case "json": {
      if (isValidJson(input)) return input;
      const compact = String(input || "").trim();
      const keyQuoted = compact
        .replace(/([{,]\s*)([A-Za-z_][A-Za-z0-9_]*)(\s*:)/g, '$1"$2"$3');
      if (isValidJson(keyQuoted)) return keyQuoted;
      const normalizedQuotes = keyQuoted.replace(/'/g, "\"");
      if (isValidJson(normalizedQuotes)) return normalizedQuotes;
      return "{}";
    }
    case "command_tail": return input;
    case "repeat": return input;
    default:     return input;
  }
}

function tryFixChoice(parts, index, choiceSyntax) {
  if (!choiceSyntax || !Array.isArray(choiceSyntax.options)) return null;

  const options = choiceSyntax.options;
  for (const option of options) {
    const optionName = String(option?.name ?? option?.value ?? "");
    const isImplicitOption = option?.emit === false || !optionName;
    const optionSyntaxes = Array.isArray(option.syntaxes) ? option.syntaxes : (Array.isArray(option.next) ? option.next : []);
    let currentIndex = index;
    const fixedParts = [];

    if (optionName && !isImplicitOption) {
      if (currentIndex >= parts.length) continue;
      const got = String(parts[currentIndex]).replace(/^\/+/, "");
      if (got.toLowerCase() !== optionName.toLowerCase()) continue;
      fixedParts.push(parts[currentIndex]);
      currentIndex++;
    }
    const nested = fixSyntax(parts, optionSyntaxes, currentIndex);
    if (nested.index <= currentIndex && optionSyntaxes.length > 0) continue;
    fixedParts.push(...nested.fixedParts);
    return { fixedParts, fixAvailable: nested.fixAvailable, index: nested.index };
  }

  return null;
}

function fixSyntax(parts, syntaxList, index = 0) {
  const fixedParts = [];
  let fixAvailable = false;

  const isCoordinateToken = (token) => {
    const t = String(token || "").trim();
    return /^[~^]?$/.test(t) || /^[~^]?[-+]?\d*\.?\d+$/.test(t);
  };

  const consumeLocation = (tokens, startIndex) => {
    const picked = [];
    let i = startIndex;
    while (i < tokens.length && picked.length < 3 && isCoordinateToken(tokens[i])) {
      picked.push(tokens[i]);
      i++;
    }
    while (picked.length < 3) picked.push("~");
    return { text: picked.join(" "), nextIndex: i };
  };

  for (let i = 0; i < syntaxList.length && index < parts.length; i++) {
    const syntax = syntaxList[i];
    const part = parts[index];

    if (!syntax) {
      fixedParts.push(part);
      index++;
      continue;
    }

    if (syntax.type === "command_tail") {
      fixedParts.push(parts.slice(index).join(" "));
      index = parts.length;
      break;
    }

    if (syntax.type === "exit_loop") {
      // UI-only marker for repeat loops: no token consumption in text parsing.
      continue;
    }
    if (syntax.type === "can_exit_loop") {
      // UI-only marker for repeat loops: no token consumption in text parsing.
      continue;
    }

    if (syntax.type === "repeat") {
      const repeatSyntaxes = Array.isArray(syntax.syntaxes) ? syntax.syntaxes : [];
      const min = Number.isFinite(+syntax.min) ? +syntax.min : 0;
      const max = Number.isFinite(+syntax.max) ? +syntax.max : Number.MAX_SAFE_INTEGER;
      let runs = 0;
      while (index < parts.length && runs < max) {
        const nested = fixSyntax(parts, repeatSyntaxes, index);
        if (!nested || nested.index <= index) break;
        fixedParts.push(...nested.fixedParts);
        if (nested.fixAvailable) fixAvailable = true;
        index = nested.index;
        runs++;
      }
      if (runs < min) print(`[DEBUG] Repeat ${syntax.name || "repeat"} erwartet min ${min}, erhalten ${runs}`);
      continue;
    }

    if (syntax.type === "choice") {
      const choiceResult = tryFixChoice(parts, index, syntax);
      if (choiceResult) {
        fixedParts.push(...choiceResult.fixedParts);
        if (choiceResult.fixAvailable) fixAvailable = true;
        index = choiceResult.index;
        continue;
      }
      if (syntax.optional) {
        continue;
      }
      fixedParts.push(part);
      index++;
      continue;
    }

    if (syntax.type === "location") {
      const loc = consumeLocation(parts, index);
      const fixed = fixArgument(syntax, loc.text);
      if (fixed !== loc.text) fixAvailable = true;
      fixedParts.push(fixed);
      index = loc.nextIndex;
      continue;
    }

    if (syntax.type === "json") {
      const rawJson = parts.slice(index).join(" ");
      const fixed = fixArgument(syntax, rawJson);
      if (fixed !== rawJson) fixAvailable = true;
      fixedParts.push(fixed);
      index = parts.length;
      break;
    }

    if (!syntax.optional && !isLikelySyntaxMatch(part, syntax.type, syntax)) {
      const tentativelyFixed = fixArgument(syntax, part);
      if (!isLikelySyntaxMatch(tentativelyFixed, syntax.type, syntax)) {
        break;
      }
    }

    if (syntax.optional && !isLikelySyntaxMatch(part, syntax.type, syntax)) {
      print(`[DEBUG] Optionaler Syntax-Teil übersprungen: ${JSON.stringify(syntax)} Teil="${part}"`);
      continue;
    }

    let fixed = fixArgument(syntax, part);
    if (fixed !== part) fixAvailable = true;
    fixedParts.push(fixed);
    index++;

    // Prüfe verschachtelte next-Optionen
    if (syntax.next && syntax.next.length > 0 && index < parts.length) {
      const { fixedParts: nestedParts, fixAvailable: nestedFix } = fixSyntax(parts.slice(index), syntax.next, 0);
      fixedParts.push(...nestedParts);
      if (nestedFix) fixAvailable = true;
      index += nestedParts.length;
    }
  }

  return { fixedParts, fixAvailable, index };
}

function correctCommand(inputCommand) {
  print(`[DEBUG] Eingabe-Command: "${inputCommand}"`);

  const trimmed = String(inputCommand || "").trim();
  const hadLeadingSlash = trimmed.startsWith("/");
  const withoutSlash = trimmed.replace(/^\//, "");
  const rawParts = splitCommandParts(withoutSlash);

  const baseResult = {
    fix_available: false,
    command: inputCommand,
    feedback: {
      confidence: "none",
      summary: "No suggestion available.",
      reasons: [],
      changes: []
    }
  };

  if (rawParts.length === 0) {
    baseResult.feedback.summary = "No command detected.";
    return baseResult;
  }

  const cmdLiteralRaw = rawParts[0] || "";
  const cmdLiteral = cmdLiteralRaw.replace(/^minecraft:/i, "");
  const commandNames = command_list.map(c => c.name).concat(command_list.flatMap(c => c.aliases || []));
  const closestCommandName = findClosestCommandName(cmdLiteral, commandNames);
  const command = closestCommandName
    ? command_list.find(c => c.name === closestCommandName || (c.aliases || []).includes(closestCommandName))
    : null;

  if (!command) {
    baseResult.feedback.summary = `Unknown command "${cmdLiteralRaw}".`;
    baseResult.feedback.reasons.push("No reliable command match found.");
    return baseResult;
  }

  const inputParts = rawParts.slice();
  const commandTokenBefore = inputParts[0];
  const normalizedCommandToken = command.name;
  const commandFixAvailable = normalizedCommandToken.toLowerCase() !== cmdLiteral.toLowerCase();

  const syntaxInputParts = rawParts.slice();
  let preNormalizedFixAvailable = false;
  let reinjectEffectGive = false;

  syntaxInputParts[0] = normalizedCommandToken;

  function normalizeRawtextPayload(rawInput) {
    const raw = String(rawInput || "").trim();
    if (!raw) return "{\"rawtext\":[{\"text\":\"\"}]}";

    const wrapAsText = (text) => JSON.stringify({ rawtext: [{ text: String(text ?? "") }] });

    try {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object" && Array.isArray(parsed.rawtext)) {
        return JSON.stringify(parsed);
      }
      if (parsed && typeof parsed === "object" && (parsed.text != null || parsed.selector != null || parsed.score != null || parsed.translate != null)) {
        return JSON.stringify({ rawtext: [parsed] });
      }
      return JSON.stringify({ rawtext: [parsed] });
    } catch (_e) {}

    const keyQuoted = raw.replace(/([{,]\s*)([A-Za-z_][A-Za-z0-9_]*)(\s*:)/g, '$1"$2"$3');
    try {
      const parsed = JSON.parse(keyQuoted);
      if (parsed && typeof parsed === "object" && Array.isArray(parsed.rawtext)) return JSON.stringify(parsed);
      if (parsed && typeof parsed === "object") return JSON.stringify({ rawtext: [parsed] });
    } catch (_e) {}

    const textMatch = raw.match(/["']?text["']?\s*:\s*["']([^"']*)["']/i);
    if (textMatch && textMatch[1] != null) return wrapAsText(textMatch[1]);

    const trimmedString = raw.replace(/^["']|["']$/g, "");
    return wrapAsText(trimmedString);
  }

  if (command.name === "tellraw" && syntaxInputParts.length >= 3) {
    const tellrawRaw = syntaxInputParts.slice(2).join(" ").trim();
    const normalized = normalizeRawtextPayload(tellrawRaw);
    if (normalized !== tellrawRaw) preNormalizedFixAvailable = true;
    syntaxInputParts.splice(2, syntaxInputParts.length - 2, normalized);
  }
  if (command.name === "titleraw" && syntaxInputParts.length >= 4) {
    const titleRaw = syntaxInputParts.slice(3).join(" ").trim();
    const normalized = normalizeRawtextPayload(titleRaw);
    if (normalized !== titleRaw) preNormalizedFixAvailable = true;
    syntaxInputParts.splice(3, syntaxInputParts.length - 3, normalized);
  }
  const { fixedParts, fixAvailable: syntaxFixAvailable } = fixSyntax(syntaxInputParts, command.syntaxes);
  if (command.name === "gamerule" && fixedParts.length >= 3) {
    const rule = fixedParts[1];
    const currentValue = world.gameRules?.[rule];
    if (typeof currentValue === "boolean") {
      const oldVal = fixedParts[2];
      fixedParts[2] = fixArgument("bool", fixedParts[2]);
      if (oldVal !== fixedParts[2]) {
        fixedParts._gameruleBoolFixed = true;
      }
    } else if (typeof currentValue === "number") {
      const oldVal = fixedParts[2];
      fixedParts[2] = fixArgument("int", fixedParts[2]);
      if (oldVal !== fixedParts[2]) {
        fixedParts._gameruleBoolFixed = true;
      }
    } else {
      const rawVal = String(fixedParts[2] || "");
      const boolCandidate = fixArgument("bool", rawVal);
      const boolLike = /^(true|false)$/i.test(rawVal) ||
        levenshtein(rawVal.toLowerCase(), "true") <= 2 ||
        levenshtein(rawVal.toLowerCase(), "false") <= 2;
      if (boolLike && rawVal !== boolCandidate) {
        fixedParts[2] = boolCandidate;
        fixedParts._gameruleBoolFixed = true;
      }
    }
  }
  const fixAvailable = preNormalizedFixAvailable || syntaxFixAvailable || commandFixAvailable || !!fixedParts._gameruleBoolFixed;
  let fixedCommandParts = fixedParts.slice();
  if (reinjectEffectGive) {
    fixedCommandParts = [fixedCommandParts[0], "give", ...fixedCommandParts.slice(1)];
  }
  const fixedCommand = (hadLeadingSlash ? "/" : "") + fixedCommandParts.join(" ");

  const changes = [];
  if (commandFixAvailable) {
    changes.push({
      type: "command",
      before: commandTokenBefore,
      after: command.name,
      reason: "Closest valid command name"
    });
  }

  const comparableLength = Math.min(syntaxInputParts.length, fixedParts.length);
  for (let i = 1; i < comparableLength; i++) {
    if (syntaxInputParts[i] !== fixedParts[i]) {
      changes.push({
        type: "argument",
        index: i,
        before: syntaxInputParts[i],
        after: fixedParts[i],
        reason: "Adjusted to expected argument type"
      });
    }
  }

  const reasons = [];
  if (!hadLeadingSlash) reasons.push("Input has no leading slash.");
  if (commandFixAvailable) reasons.push(`Command token matched to "${command.name}".`);
  if (preNormalizedFixAvailable) reasons.push("Raw JSON was normalized to Bedrock rawtext format.");
  if (syntaxFixAvailable) reasons.push("One or more arguments were corrected.");

  const confidence = !fixAvailable
    ? "exact"
    : (commandFixAvailable && syntaxFixAvailable ? "medium" : "high");

  print(`[DEBUG] Korrigierter Command: "${fixedCommand}" fix_available=${fixAvailable}`);

  const result = {
    fix_available: fixAvailable,
    command: fixedCommand,
    feedback: {
      confidence,
      summary: fixAvailable
        ? `Suggestion available (${changes.length} change${changes.length === 1 ? "" : "s"}).`
        : "Command looks already valid.",
      reasons,
      changes
    }
  };

  result.vc_hiperlink = (player) => {
    const vc = isVisualCommandAvailable(player, command);
    if (typeof vc === "function") {
      return vc(player);
    }
    return visual_command_generic(player, command);
  };
  result.visible = (player) => isCommandAvailable(player, `/${command.name}`);
  if (typeof command.visible === "function") {
    result.visible = (player) => command.visible(player);
  } else if (typeof command.visible === "boolean") {
    result.visible = command.visible;
  }

  return result;
}

function formatSuggestionFeedbackLines(suggestion) {
  const lines = [];
  const feedback = suggestion?.feedback;
  if (!feedback) return lines;

  if (feedback.summary) lines.push(`Summary: ${feedback.summary}`);
  if (feedback.confidence) lines.push(`Confidence: ${feedback.confidence}`);

  if (Array.isArray(feedback.reasons) && feedback.reasons.length) {
    for (const reason of feedback.reasons.slice(0, 3)) {
      lines.push(`- ${reason}`);
    }
  }

  if (Array.isArray(feedback.changes) && feedback.changes.length) {
    for (const change of feedback.changes.slice(0, 4)) {
      const before = String(change.before ?? "");
      const after = String(change.after ?? "");
      lines.push(`- ${before} -> ${after}`);
    }
  }

  return lines;
}

/*------------------------
 Time
-------------------------*/

function getRelativeTime(diffMs) {
  let seconds = Math.floor(diffMs / 1000);
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);
  let days = Math.floor(hours / 24);
  let months = Math.floor(days / 30);
  let years = Math.floor(days / 365);

  if (years > 0) {
    return `${years} year${years > 1 ? 's' : ''}`;
  }
  if (months > 0) {
    return `${months} month${months > 1 ? 's' : ''}`;
  }
  if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''}`;
  }
  if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''}`;
  }
  if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? 's' : ''}`;
  }
  return `a few seconds`;
}

function convertUnixToDate(timestamp, utcOffset) {
  // Auto-detect seconds vs ms
  if (timestamp < 1e12) {
    timestamp *= 1000;
  }

  const date = new Date(timestamp);
  const localDate = new Date(date.getTime() + utcOffset * 60 * 60 * 1000);

  const year = localDate.getUTCFullYear();
  const month = String(localDate.getUTCMonth() + 1).padStart(2, '0');
  const day = String(localDate.getUTCDate()).padStart(2, '0');
  const hours = String(localDate.getUTCHours()).padStart(2, '0');
  const minutes = String(localDate.getUTCMinutes()).padStart(2, '0');
  const seconds = String(localDate.getUTCSeconds()).padStart(2, '0');

  return {
    day,
    month,
    year,
    hours,
    minutes,
    seconds,
    utcOffset
  };
}

function normalizeTimestamp(ts) {
    if (!ts) return ts;

    // Wenn kleiner als ~2001 in ms → dann Sekunden
    if (ts < 1e12) {
        return ts * 1000;
    }

    return ts;
}

/*------------------------
 Internet API
-------------------------*/

async function fetchViaInternetAPI(url, timeoutMs = 20) {
  await system.waitTicks(1); // If mm_host gets initialisiert later

  // Wait until the line (the scoreboard) is free
  let objective = world.scoreboard.getObjective("mm_data");

  if (objective !== undefined) {
    await waitForNoObjective("mm_data");
  }

  world.scoreboard.addObjective("mm_data");
  objective = world.scoreboard.getObjective("mm_data");

  return new Promise((resolve, reject) => {
    try {
      // Payload bauen
      const payload = {
        event: "internet_api",
        data: {
          source: version_info.uuid,
          url: url
        }
      };

      // In Scoreboard schreiben und Event auslösen
      objective.setScore(JSON.stringify(payload), 1);
      world.getDimension("overworld").runCommand("scriptevent multiple_menu:data");

      // State für Cleanup
      let finished = false;
      let timerHandle = null;

      // Helper: safe cleanup (einmalig)
      const cleanup = () => {
        if (finished) return;
        finished = true;
        try { world.scoreboard.removeObjective("mm_data"); } catch (_) {}
        try { system.afterEvents.scriptEventReceive.unsubscribe(subscription); } catch (_) {}
        // Timer stoppen (versuche verschiedene API-Namen)
        try {
          if (timerHandle !== null) {
            if (typeof system.runTimeout === "function") system.runTimeout(timerHandle);
            else if (typeof system.runInterval === "function") system.runInterval(timerHandle);
            else if (typeof clearTimeout === "function") clearTimeout(timerHandle);
            else if (typeof clearInterval === "function") clearInterval(timerHandle);
          }
        } catch (_) {}
      };

      // Subscription für scriptevent
      const subscription = system.afterEvents.scriptEventReceive.subscribe(event => {
        if (event.id !== "multiple_menu:data") return;

        try {
          const board = world.scoreboard.getObjective("mm_data");
          if (!board) {
            // wurde möglicherweise bereits entfernt
            cleanup();
            return reject(new Error("Scoreboard mm_data nicht vorhanden nach Event."));
          }

          const participants = board.getParticipants();
          if (!participants || participants.length === 0) {
            // noch keine Daten — weiterwarten
            return;
          }

          const raw = participants[0].displayName;
          let data;
          try {
            data = JSON.parse(raw);
          } catch (e) {
            cleanup();
            return reject(new Error("Falsches Format im Scoreboard: " + e));
          }

          if (data.event === "internet_api" && data.data && data.data.target === version_info.uuid) {
            try {
              const answer = JSON.parse(data.data.answer);
              cleanup();
              return resolve(answer);
            } catch (e) {
              cleanup();
              return reject(new Error("Antwort konnte nicht als JSON geparst werden: " + e));
            }
          }
          // sonst: nicht für uns bestimmt -> ignorieren
        } catch (e) {
          cleanup();
          return reject(e);
        }
      });

      // Timeout einrichten: system.runTimeout bevorzugen, sonst runInterval-Fallback
      if (typeof system.runTimeout === "function") {
        timerHandle = system.runTimeout(() => {
          if (finished) return;
          cleanup();
          return reject(new Error("Timeout: keine Antwort von der Internet-API innerhalb " + timeoutMs + " ms"));
        }, timeoutMs);
      } else if (typeof system.runInterval === "function") {
        const start = Date.now();
        // poll alle 100ms auf Timeout
        timerHandle = system.runInterval(() => {
          if (finished) return;
          if (Date.now() - start >= timeoutMs) {
            cleanup();
            return reject(new Error("Timeout: keine Antwort von der Internet-API innerhalb " + timeoutMs + " ms"));
          }
        }, 100);
      } else {
        // Kein Timer verfügbar -> sofort aufräumen & Fehler
        cleanup();
        return reject(new Error("Keine Timer-Funktionen verfügbar (kein runTimeout/runInterval)."));
      }

    } catch (err) {
      try { world.scoreboard.removeObjective("mm_data"); } catch (_) {}
      return reject(err);
    }
  });
}

async function waitForNoObjective(name) {
  let obj = world.scoreboard.getObjective(name);
  while (obj) {
    // kleine Pause (z. B. 100ms), um den Server nicht zu blockieren
    await new Promise(resolve => system.runTimeout(resolve, 5)); // 5 Ticks warten
    obj = world.scoreboard.getObjective(name);
  }
}

/*------------------------
 Update data (github)
-------------------------*/

let github_data

system.run(() => {
  update_github_data()
});

async function update_github_data() {
  fetchViaInternetAPI("https://api.github.com/repos/TheFelixLive/Command2Hardcore/releases")
  .then(result => {
    print("API-Antwort erhalten");

    github_data = result.map(release => {
      const totalDownloads = release.assets?.reduce((sum, asset) => sum + (asset.download_count || 0), 0) || 0;
      return {
        tag: release.tag_name,
        name: release.name,
        prerelease: release.prerelease,
        published_at: release.published_at,
        body: release.body,
        download_count: totalDownloads
      };
    });

    let latest_online_version = version_info.release_type === 2 ? github_data.find(r => !r.prerelease)?.tag : github_data[0]?.tag

    if (compareVersions(latest_online_version, version_info.version) == 1) {
      world.getAllPlayers().forEach(p => {
        if (playerIsAdmin(p)) p.sendMessage("§l§1[§9Update§1§l]§r "+ latest_online_version + " is now out! You can finde the Changelog under §lSettings -> About -> Changelogs§r. Feel free to update to enjoy the latest features!\nCheck out: §7"+links[0].link)
      });
    }

  })
  .catch(err => {
    print("Fehler beim Abruf: " + err + " using update_message_period_unix‎");
    if (Date.now() > (version_info.unix + version_info.update_message_period_unix)) {
      world.getAllPlayers().forEach(p => {
        if (playerIsAdmin(p)) p.sendMessage("§l§1[§9Update§1§l]§r Your current version (" + version_info.version + ") is older than " + getRelativeTime(version_info.update_message_period_unix) +".\nThere MIGHT be a newer version out. Feel free to update to enjoy the latest features!\nCheck out: §7"+links[0].link)
      });
    }
  });
}

function compareVersions(version1, version2) {
  if (!version1 || !version2) return 0;

  // Entfernt 'v.' oder 'V.' am Anfang
  version1 = version1.replace(/^v\./i, '').trim();
  version2 = version2.replace(/^v\./i, '').trim();

  // Extrahiere Beta-Nummer oder Suffix (z. B. "(Beta 1)" oder "(RR3)")
  function extractParts(version) {
    // Suche nach Beta in Klammern: "(Beta 1)"
    const betaInParentheses = version.match(/^(.*?)\s*\(Beta\s*(\d+)\)$/i);
    if (betaInParentheses) {
      return {
        base: betaInParentheses[1].trim(),
        beta: parseInt(betaInParentheses[2], 10),
        suffix: null,
        suffixNumber: null
      };
    }
    // Suche nach Suffix in Klammern: "(RR3)"
    const suffixInParentheses = version.match(/^(.*?)\s*\(([A-Za-z]+)(\d+)\)$/);
    if (suffixInParentheses) {
      return {
        base: suffixInParentheses[1].trim(),
        beta: null,
        suffix: suffixInParentheses[2].toUpperCase(),
        suffixNumber: parseInt(suffixInParentheses[3], 10)
      };
    }
    // Suche nach Beta ohne Klammern: "Beta 1" oder "_1"
    const betaMatch = version.match(/^(.*?)\s*(?:_|\sBeta\s*)(\d+)$/i);
    if (betaMatch) {
      return {
        base: betaMatch[1].trim(),
        beta: parseInt(betaMatch[2], 10),
        suffix: null,
        suffixNumber: null
      };
    }
    // Suche nach Suffix ohne Klammern: "RR3"
    const suffixMatch = version.match(/^(.*?)\s*([A-Za-z]+)(\d+)$/);
    if (suffixMatch) {
      return {
        base: suffixMatch[1].trim(),
        beta: null,
        suffix: suffixMatch[2].toUpperCase(),
        suffixNumber: parseInt(suffixMatch[3], 10)
      };
    }
    // Kein Beta oder Suffix
    return {
      base: version,
      beta: null,
      suffix: null,
      suffixNumber: null
    };
  }

  const v1 = extractParts(version1);
  const v2 = extractParts(version2);

  // Vergleiche Hauptversion (Major.Minor.Patch)
  const v1Parts = v1.base.split('.').map(Number);
  const v2Parts = v2.base.split('.').map(Number);

  for (let i = 0; i < Math.max(v1Parts.length, v2Parts.length); i++) {
    const num1 = v1Parts[i] || 0;
    const num2 = v2Parts[i] || 0;
    if (num1 > num2) return 1;
    if (num1 < num2) return -1;
  }

  // Wenn Hauptversion gleich: Vergleiche Beta
  if (v1.beta !== null && v2.beta === null) return -1; // Beta < Vollversion
  if (v1.beta === null && v2.beta !== null) return 1;  // Vollversion > Beta
  if (v1.beta !== null && v2.beta !== null) {
    if (v1.beta > v2.beta) return 1;
    if (v1.beta < v2.beta) return -1;
  }

  // Wenn Beta gleich oder nicht vorhanden: Vergleiche Suffix
  if (v1.suffix !== null && v2.suffix === null) return -1; // Suffix < keine Suffix
  if (v1.suffix === null && v2.suffix !== null) return 1;  // keine Suffix > Suffix
  if (v1.suffix !== null && v2.suffix !== null) {
    if (v1.suffix > v2.suffix) return 1;
    if (v1.suffix < v2.suffix) return -1;
    if (v1.suffixNumber > v2.suffixNumber) return 1;
    if (v1.suffixNumber < v2.suffixNumber) return -1;
  }

  return 0; // Versionen sind gleich
}

/*------------------------
 Auto Timezone
-------------------------*/

let server_ip, server_utc

system.run(() => {
  update_server_utc()
});

async function update_server_utc() {
  if (new Date().getTimezoneOffset() !== 0) {
    server_utc = -new Date().getTimezoneOffset() / 60
  } else {
    try {
      let response = await fetchViaInternetAPI("https://ipwho.is/?fields=ip,timezone");
      server_ip = response.ip
      server_utc = offsetToDecimal(response.timezone.utc)
    } catch (e) {}
  }

  let save_data = load_save_data()

  if (save_data[0].utc_auto && server_utc) {
    save_data[0].utc = server_utc
    update_save_data(save_data)
  } else {
    save_data[0].utc_auto = false
    update_save_data(save_data)
  }
}

function offsetToDecimal(offsetStr) {
    // Prüfe auf das richtige Format (z. B. +02:00 oder -03:30)
    const match = offsetStr.match(/^([+-])(\d{2}):(\d{2})$/);
    if (!match) {
        throw new Error("Ungültiges Format. Erwartet wird z.B. '+02:00' oder '-03:30'");
    }

    const sign = match[1] === '+' ? 1 : -1;
    const hours = parseInt(match[2], 10);
    const minutes = parseInt(match[3], 10);

    // Umwandlung in Kommazahl (Dezimalstunden)
    const decimal = sign * (hours + minutes / 60);
    return decimal;
}

/*------------------------
 Visual Command Helpers
-------------------------*/

function anyplayerHasEffect() {
  for (const player of world.getAllPlayers()) {
    if (player.getEffects().length > 0) {
      return true;
    }
  }
  return false;
}

function extractErrorSnippet(message) {
  if (!message || typeof message !== "string") return "";

  // Bedrock often marks the exact token as >>token<<
  const markerMatch = message.match(/>>\s*([^<>]+?)\s*<</);
  if (markerMatch && markerMatch[1]) return markerMatch[1].trim();

  // Another common style: unexpected 'token'
  const unexpectedQuoted = message.match(/unexpected\s+['"]([^'"]+)['"]/i);
  if (unexpectedQuoted && unexpectedQuoted[1]) return unexpectedQuoted[1].trim();

  // Unknown command: gameode
  const unknownCommand = message.match(/unknown command:\s*([^\s.]+)/i);
  if (unknownCommand && unknownCommand[1]) return unknownCommand[1].trim();

  // Prefer quoted snippets; ignore long context fragments with spaces
  const quotedMatches = [...message.matchAll(/["']([^"']+)["']/g)]
    .map(m => m[1].trim())
    .filter(Boolean)
    .sort((a, b) => a.length - b.length);
  const shortQuoted = quotedMatches.find(s => !/\s/.test(s));
  if (shortQuoted) return shortQuoted;
  if (quotedMatches.length > 0) return quotedMatches[0];

  // Fallback patterns for common parser wording when quotes are missing
  const patterns = [
    /unexpected token\s+([^\s,.:;]+)/i,
    /near\s+([^\s,.:;]+)/i,
    /at\s+([^\s,.:;]+)/i,
  ];

  for (const pattern of patterns) {
    const match = message.match(pattern);
    if (match && match[1]) return match[1].trim();
  }

  return "";
}

function highlightErrorInCommand(command, errorSnippet) {
  if (!command || typeof command !== "string") return command;
  if (!errorSnippet || typeof errorSnippet !== "string") return command;

  const snippet = errorSnippet.trim();
  if (!snippet) return command;

  // Fast path: exact match
  if (command.includes(snippet)) {
    return command.replace(snippet, "§c" + snippet + "§7");
  }

  // Robust fallback: case-insensitive literal search
  const escaped = snippet.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = command.match(new RegExp(escaped, "i"));
  if (!match || !match[0]) return command;

  return command.replace(match[0], "§c" + match[0] + "§7");
}

function isBedrockCommandError(message) {
  if (!message || typeof message !== "string") return false;
  const lower = message.toLowerCase();
  return lower.includes("error occurred with parsing command params")
    || lower.includes("unknown command:");
}

function formatDisplayErrorMessage(message) {
  if (!message || typeof message !== "string") return "Unknown error";
  if (!isBedrockCommandError(message)) return message;

  // Keep only the command-related portion for cleaner UX
  const match = message.match(/error occurred with parsing command params:\s*(.+)$/i);
  if (match && match[1]) return match[1].trim();
  return message.trim();
}

function getCompatibleEnchantmentTypes(item) {
  if (!item) return [];

  // Enchantable-Component (gibt undefined wenn nicht vorhanden)
  let enchantable;
  try {
    enchantable = item.getComponent("minecraft:enchantable");
  } catch (err) {
    // Falls getComponent selbst Fehler wirft (selten): keine kompatiblen Enchants
    return [];
  }

  if (!enchantable) return [];

  // Alle EnchantmentTypes holen und sortieren (optional)
  const all = EnchantmentTypes.getAll().sort((a, b) => a.id.localeCompare(b.id));
  const compatible = [];

  for (const e of all) {
    try {
      // Test-Objekt: als 'type' das EnchantmentType-Objekt, level 1 verwenden
      const testEnchantment = { type: e, level: 1 };

      // canAddEnchantment kann Exceptions werfen (unknown id, level oob) — deshalb try/catch
      if (enchantable.canAddEnchantment(testEnchantment)) {
        compatible.push(e);
      }
    } catch (err) {
      // still ignore: wenn canAddEnchantment scheitert, ist das Enchant unbrauchbar für dieses Item
      // optional: world.say / print für Debugging
    }
  }

  return compatible;
}

function areEnchantmentsIncompatible(item, e1, e2) {
  if (!item) return false;
  try {
    // Clone the item so we don't change the real one
    const copy = item.clone();
    const enchComp = copy.getComponent("minecraft:enchantable");
    if (!enchComp) return false;

    // erst e1 hinzufügen (Level 1 zum Test)
    try {
      enchComp.addEnchantment({ type: e1, level: 1 });
    } catch (errAdd) {
      // wenn addEnchantment für e1 schon fehlschlägt: dann behandeln wir es als inkompatibel
      // (sollte aber nicht passieren, weil e1 aus kompatiblen Enchants stammt)
      return true;
    }

    // jetzt prüfen ob e2 noch geht
    try {
      const ok = enchComp.canAddEnchantment({ type: e2, level: 1 });
      return !ok;
    } catch (err) {
      // Wenn canAddEnchantment eine Exception wirft, behandeln wir das als inkompatibel
      return true;
    }
  } catch (err) {
    // Bei unerwarteten Fehlern: konservativ annehmen, dass inkompatibel
    return true;
  }
}

function buildEnchantmentCategories(item, compatibleEnchants) {
  const n = compatibleEnchants.length;
  const adj = Array.from({ length: n }, () => []);
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (areEnchantmentsIncompatible(item, compatibleEnchants[i], compatibleEnchants[j])) {
        adj[i].push(j);
        adj[j].push(i);
      }
    }
  }

  // connected components
  const seen = new Array(n).fill(false);
  const comps = [];
  for (let i = 0; i < n; i++) {
    if (seen[i]) continue;
    const stack = [i];
    const comp = [];
    seen[i] = true;
    while (stack.length) {
      const u = stack.pop();
      comp.push(compatibleEnchants[u]);
      for (const v of adj[u]) {
        if (!seen[v]) {
          seen[v] = true;
          stack.push(v);
        }
      }
    }
    comps.push(comp);
  }
  return comps;
}

/*------------------------
  Menu & search functions
-------------------------*/

class Category {
  /**
   * @param {MenuDefinition} MenuDefinition - Der MenuDefinition, zu dem diese Kategorie gehört.
   * @param {string} name - Name der Kategorie (wird als Label angezeigt).
   * @param {Object} [options] - Optionale Konfiguration.
   * @param {boolean} [options.is_hidden_when_unavailable=false] - Ob die Kategorie ausgeblendet wird, wenn keine Buttons vorhanden sind.
   * @param {string} [options.message] - Fehlermeldung, die angezeigt wird, wenn keine Buttons vorhanden sind.
   */
  constructor(MenuDefinition, name, options = {}) {
    this.MenuDefinition = MenuDefinition;
    this.name = name;
    this.buttons = [];
    this.options = {
      is_hidden_when_unavailable: false,
      message: "",
      ...options,
    };
  }

  /**
   * Fügt einen Button zu dieser Kategorie hinzu.
   * @param {string} text - Text des Buttons.
   * @param {string} icon - Icon des Buttons.
   * @param {Function} callback - Callback-Funktion des Buttons.
   * @returns {Category} - Gibt die Kategorie zurück, um Method Chaining zu ermöglichen.
   */
  button(text, icon, callback) {
    this.buttons.push({ text, icon, callback });
    return this;
  }
}

class MenuDefinition {
  constructor() {
    this.elements = []; // { type: "label" | "button" | "divider" | "header" | "category" | "footer", data: any }
    this.categories = new Map(); // Speichert Category-Objekte für spätere Referenz
    this.footerCategory = null; // Speichert die Footer-Kategorie
  }

  title(text) {
    this.elements.push({ type: "title", data: text });
    return this;
  }

  label(text) {
    this.elements.push({ type: "label", data: text });
    return this;
  }

  button(text, icon, callback) {
    this.elements.push({ type: "button", data: { text, icon, callback } });
    return this;
  }

  divider() {
    this.elements.push({ type: "divider" });
    return this;
  }

  /**
   * Erstellt eine neue Kategorie und fügt sie der MenuDefinition hinzu.
   * @param {string} name - Name der Kategorie.
   * @param {Object} [options] - Optionale Konfiguration.
   * @returns {Category} - Gibt die neue Kategorie zurück.
   */
  category(name, options = {}) {
    const category = new Category(this, name, options);
    this.categories.set(name, category);
    this.elements.push({
      type: "category",
      data: category,
    });
    return category;
  }

  /**
   * Erstellt einen Footer als spezielle Kategorie.
   * @param {string} [label] - Optional: Label für den Footer.
   * @returns {Category} - Gibt die Footer-Kategorie zurück.
   */
  footer(label = "") {
    this.footerCategory = new Category(this, label);
    this.footerCategory.backbutton = (callback) => {
      this.footerCategory.backbuttonCallback = callback;
      return this.footerCategory;
    };
    return this.footerCategory;
  }
}

function TranslateMenuDefinition(player, MenuDefinition) {
  const elements = [...MenuDefinition.elements];

  const PAGE_SIZE = 20;
  const OVERLAP = 5;

  // Seiten erzeugen
  const pages = [];
  let currentPage = [];

  for (const element of elements) {
    currentPage.push(element);

    if (currentPage.length >= PAGE_SIZE) {
      const moved = currentPage.splice(
        currentPage.length - OVERLAP,
        OVERLAP
      );

      pages.push([...currentPage]);
      currentPage = [...moved];
    }
  }

  if (currentPage.length > 0) {
    pages.push([...currentPage]);
  }

  const pageing_enabled = pages.length > 1;

  function showPage(pageIndex) {
    const form = new ActionFormData();
    const actions = [];

    const pageElements = pages[pageIndex];

    // Erstes Label bestimmen
    const allLabels = [];

    for (const element of pageElements) {
      if (element.type === "label") {
        allLabels.push(element);
      } else if (element.type === "category") {
        allLabels.push({
          type: "label",
          data: element.data.name
        });
      }
    }

    const firstLabelData =
      allLabels.length > 0
        ? allLabels[0].data
        : null;

    let firstLabelUsed = false;

    // Menü aufbauen
    for (let i = 0; i < pageElements.length; i++) {
      const element = pageElements[i];
      const isLastElement = i === pageElements.length - 1;

      switch (element.type) {
        case "title":
          form.title(
            element.data +
            (
              pageing_enabled
                ? ` (${pageIndex + 1}/${pages.length})`
                : ""
            )
          );
          break;

        case "label":
          if (
            !firstLabelUsed &&
            element.data === firstLabelData
          ) {
            form.body(element.data);
            firstLabelUsed = true;
          } else {
            form.label(element.data);
          }
          break;

        case "header":
          form.header(element.data);
          break;

        case "button":
          if (element.data.icon) {
            form.button(
              element.data.text,
              element.data.icon
            );
          } else {
            form.button(element.data.text);
          }

          actions.push(element.data.callback);
          break;

        case "divider":
          if (!isLastElement) {
            form.divider();
          }
          break;

        case "category": {
          const {
            name,
            buttons,
            options
          } = element.data;

          const {
            is_hidden_when_unavailable = false,
            message = ""
          } = options;

          if (buttons.length === 0) {
            if (is_hidden_when_unavailable) {
              break;
            }

            if (
              !firstLabelUsed &&
              name === firstLabelData
            ) {
              form.body(name);
              firstLabelUsed = true;
            } else {
              form.label(name);
            }

            if (message) {
              form.label(`§7${message}`);
            }

            if (!isLastElement) {
              form.divider();
            }
          } else {
            if (
              !firstLabelUsed &&
              name === firstLabelData
            ) {
              form.body(name);
              firstLabelUsed = true;
            } else {
              form.label(name);
            }

            for (const button of buttons) {
              form.button(
                button.text,
                button.icon
              );

              actions.push(button.callback);
            }

            if (!isLastElement) {
              form.divider();
            }
          }

          break;
        }
      }
    }

    // Footer
    const footer = MenuDefinition.footerCategory;

    if (footer) {
      const lastElement =
        pageElements[pageElements.length - 1];

      if (lastElement?.type !== "divider") {
        form.divider();
      }

      const footerLabel =
        footer.name
          ? footer.name
          : (
              pageing_enabled &&
              footer.buttons.length > 0
            )
              ? "Other"
              : null;

      if (footerLabel) {
        form.label(footerLabel);
      }

      for (const button of footer.buttons) {
        form.button(
          button.text,
          button.icon
        );

        actions.push(button.callback);
      }
    }

    // Navigation
    if (pageing_enabled) {
      form.divider();

      if (pageIndex > 0) {
        form.button("Prev");
        actions.push(() => showPage(pageIndex - 1));
      }

      if (pageIndex < pages.length - 1) {
        form.button("Next");
        actions.push(() => showPage(pageIndex + 1));
      }
    }

    // Back Button
    if (pageing_enabled) {
      form.divider();
    }

    form.button("");
    actions.push(
      footer?.backbuttonCallback ||
      (() => print("Back button pressed"))
    );

    form.show(player).then((response) => {
      if (response.selection === undefined) {
        return -1;
      }
      const action =actions[response.selection];
      if (action) {
        action(player);
      }
    });
  }

  showPage(0);
}


/*------------------------
 Main Menu
-------------------------*/

function main_menu(player) {
  let form = new MenuDefinition();
  let save_data = load_save_data();
  let player_sd_index = save_data.findIndex(entry => entry.id === player.id);

  form.title("Main menu");

  const { recommendedEntries } = generate_command_lists(player);
  const recommendVisible = (recommendedEntries.length > 0 && save_data[player_sd_index].recommendations);
  const pinedChains = save_data[player_sd_index].chain_commands.filter(chain => chain.pined).length > 0;
  const historyPreview = generate_history_entries(player);

  /*------------------------
    Main panel
  -------------------------*/
  let canUseCommands = !(player.commandPermissionLevel == 0 && save_data[player_sd_index].allowed_commands.length == 0);

  // Hauptkategorie für Befehle
  const mainCategory = form.category("Main", { is_hidden_when_unavailable: false, message: "No commands available. Ask your Admin." });

  if (canUseCommands) {
    mainCategory.button(
      "Run a command",
      "textures/ui/color_plus",
      () => {
        visual_command(player, (output) => {
          if (!output || !output.command) return;
          if (save_data[player_sd_index].quick_run) {
            execute_command(player, output.command).then((success) => {
              if (success && output.menu) output.menu();
            });
          } else {
            command_menu(player, output.command, null, output.menu);
          }
        }, { from_main_menu: true, recommendVisible: !recommendVisible });
      }
    );

    if (canPlayerUseChains(player)) {
      mainCategory.button(
        "Chain Commands",
        "textures/items/chain",
        () => chain_overview(player)
      );
    }

    /*------------------------
      Preview panel
    -------------------------*/
    if (!recommendVisible && pinedChains && canPlayerUseChains(player)) {
      const pinedChainsCategory = form.category("Pined Chains");

      let sorted_chains = save_data[player_sd_index].chain_commands
        .filter(chain => chain.pined)
        .slice()
        .sort((a, b) => (a.name || "").localeCompare(b.name || ""));

      sorted_chains.forEach((chain) => {
        const cmdName = chain.name || "Unnamed Chain";
        const statusText = chain.state.successful ? "§2Successful§r" : "§cFailed§r";
        const lastUnix = Array.isArray(chain.state.unix) ? chain.state.unix[chain.state.unix.length - 1] : chain.state.unix;
        const relativeTime = lastUnix != null ? getRelativeTime(Date.now() - lastUnix) : "Never";

        pinedChainsCategory.button(
          `${cmdName}\n${chain.state.successful === null ? "" : `${statusText} | ${relativeTime} ago`}`,
          chain.icon || "",
          () => {
            const originalIndex = save_data[player_sd_index].chain_commands.findIndex(c => c === chain);
            if (chain.commands.length !== 0 && save_data[player_sd_index].quick_run) {
              execute_chain(player, originalIndex);
            } else {
              chain_main(player, originalIndex);
            }
          }
        );
      });
    }

    if (!recommendVisible && historyPreview.length > 0 && !pinedChains) {
      const historyCategory = form.category("History");

      historyPreview.slice(0, historyPreview.length > 3 ? 2 : 3).forEach((buttonEntry) => {
        historyCategory.button(buttonEntry.label, buttonEntry.icon, buttonEntry.actionFn);
      });

      if (historyPreview.length > 3) {
        historyCategory.button(
          "Show more!",
          null,
          () => multipage_time_menu(player, generate_history_entries(player), canPlayerUseMenu(player) && (operatorMode ? player.commandPermissionLevel >= 1 : true) ? (p) => main_menu(p) : null)
        );
      }
    }

    if (recommendVisible) {
      const recommendedCategory = form.category("Recommended");

      const displayCount = recommendedEntries.length >= 4 ? 2 : 3;
      recommendedEntries.slice(0, displayCount).forEach(e => {
        recommendedCategory.button(e.label, e.icon, e.actionFn);
      });

      if (recommendedEntries.length > displayCount) {
        recommendedCategory.button("Show more!", null, () => visual_command_overview(player, recommendedEntries));
      }
    }
  }


  /*------------------------
    Settings panel
  -------------------------*/
  const otherCategory = form.footer("Other");

  if (historyPreview.length > 0 && (recommendVisible || pinedChains)) {
    otherCategory.button(
      "History",
      "textures/ui/icon_book_writable",
      () => multipage_time_menu(player, generate_history_entries(player), canPlayerUseMenu(player) && (operatorMode ? player.commandPermissionLevel >= 1 : true) ? (p) => main_menu(p) : null)
    );
  }

  otherCategory.button("Settings", "textures/ui/debug_glyph_color", () => settings_main(player));

  if (system_privileges !== 2) {
    otherCategory.backbutton(
      () => {
        world.scoreboard.addObjective("mm_data");
        world.scoreboard.getObjective("mm_data").setScore(JSON.stringify({event: "mm_open", data:{target: "main"}}), 1);
        player.runCommand("scriptevent multiple_menu:data");
      }
    );
  }

  return form;
}

/*------------------------
 Enter Command
-------------------------*/

function command_menu(player, command, history_index, on_success_menu) {
  let save_data = load_save_data();

  let form = new ModalFormData();
  let player_sd_index = save_data.findIndex(entry => entry.id === player.id);

  const playerNames = ["Server", ...world.getAllPlayers().map(p => p.name)];
  if (!playerNames.includes(player.name)) playerNames.unshift(player.name);

  form.title("Command");
  form.textField("Command", "e.g. /say hallo world!", { defaultValue: command });
  form.dropdown(
    "Execute by",
    playerNames,
    { defaultValueIndex: playerNames.indexOf(player.name), tooltip: "If you select other players it will run also at that location.\n§7§oNote: The Server doesn't have some properties!" }
  );

  if (typeof(history_index) === "number") {
    let history_data = save_data[player_sd_index].command_history[history_index];
    let build_date = convertUnixToDate(history_data.unix, save_data[0].utc || 0);

    form.label("Previous Result:");
    form.label(history_data.successful ? "§2Command executed successfully§r" : "§cCommand failed to execute§r");
    form.label(save_data[0].utc === undefined ? "§7§oTime: " + getRelativeTime(Date.now() - history_data.unix, player) + " ago" : "§7§oDate: " + `${build_date.day}.${build_date.month}.${build_date.year}`);
    form.toggle((version_info.release_type == 0? "Hide from history" : "Delete from history"), {tooltip: "If enabled, this command will be removed from your history after submitting the form."});
  } else if (canPlayerUseChains(player)) {
    form.toggle("Pin to Main Menu", {tooltip: "If enabled, this command will be added to your main menu for quick access."});
  }

  form.show(player).then(response => {
    if (response.canceled) return -1;

    const cmdVal = response.formValues[0];
    const execByIdx = response.formValues[1];
    const deleteToggle = response.formValues[5]
    const pinToggle = response.formValues[2];


    if (typeof(history_index) === "number" && deleteToggle) {
      save_data[player_sd_index].command_history[history_index].hidden = true;
      update_save_data(save_data);
    }

    if (!cmdVal || deleteToggle) {
      return typeof(history_index) === "number"
        ? multipage_time_menu(
            player,
            generate_history_entries(player),
            canPlayerUseMenu(player) && (operatorMode ? player.commandPermissionLevel >= 1 : true) ? (p) => main_menu(p) : null
          )
        : visual_command(player);
    }

    if (typeof(history_index) !== "number" && pinToggle) {
      // Füge den Command der chain_commands Liste hinzu

      menu_text_input(player, {
        title: "New Pined Command",
        prompt: "Enter a name for your pined command:",
        placeholder: "My Pined Command",
        defaultValue: cmdVal.length > 20 ? cmdVal.slice(0, 17) + "..." : cmdVal
      }).then((result) => {
        if (result.canceled) {
          return command_menu(player, command, history_index);
        }

        save_data[player_sd_index].chain_commands.push({
          name: result.response,
          commands: [cmdVal],
          pined: true,
          state: {
            successful: null,
            unix: null
          }
        });
        update_save_data(save_data);
        main_menu(player);
        return;

      });
      return;
    }

    let cmd = cmdVal.startsWith("/")
      ? cmdVal
      : "/" + cmdVal;

    let targetIdentity;
    if (execByIdx === 0) {
      targetIdentity = "server";
    } else {
      const targetName = playerNames[execByIdx];
      targetIdentity = world.getAllPlayers().find(p => p.name === targetName);
    }

    execute_command(player, cmd, targetIdentity).then((success) => {
      if (success && typeof on_success_menu === "function") {
        on_success_menu();
      }
    });
  });
}

/*------------------------
 execute a Command
-------------------------*/

async function execute_command(source, cmd, target = "server") {
  let save_data = load_save_data();
  let player_sd_index = save_data.findIndex(entry => entry.id === source.id);


  if (isCommandAvailable(source, cmd) === false) {
    save_data[player_sd_index].command_history.push({
      command: cmd,
      successful: false,
      unix: Date.now(),
      hidden: false
    });
    update_save_data(save_data);

    const errMsg = `This Command is restriced by your Admin.`;
    source.sendMessage("§c" + errMsg);
    command_menu_result_e(source, errMsg, cmd, false);
    return false;
  }

  let can_run = true;

  let matchedBlock = null;
  for (const block of block_command_list) {
    if (cmd.toLowerCase().includes(block.command_prefix.toLowerCase())) {
      if (!matchedBlock || block.command_prefix.length > matchedBlock.command_prefix.length) {
        matchedBlock = block;
      }
    }
  }

  if (matchedBlock && matchedBlock.rating > 0 && matchedBlock.relevent(world)) {
    can_run = await new Promise(resolve => {
      let form = new MessageFormData();
      let actions = [];

      form.title("Warning");
      form.body(
        matchedBlock.rating === 1
          ? `The §l/${matchedBlock.command_prefix}§r command may result in some §lunexpected§r behavior.\n\nDo you want to run it anyways?`
          : matchedBlock.rating === 2
            ? `The /${matchedBlock.command_prefix}§r command will most likely §4§lmodify your world in an unrecoverable way!§r\n§lMAKE SURE YOU HAVE A COPY OF THE WORLD!§r\n\nDo you really want that?`
            : ""
      );

      if (matchedBlock.rating > 0) {
        form.button1(matchedBlock.rating === 2 ? "No risk no fun!" : "Try it!");
        actions.push(() => resolve(true));
      }

      form.button2("");
      actions.push(() => resolve(false));

      form.show(source).then((response_2) => {
        if (response_2.selection === undefined) return -1;
        else if (actions[response_2.selection]) actions[response_2.selection]();
      });
    });

    if (!can_run) return command_menu(source, cmd);
  }

  // agent remove command
  let real_cmd = cmd.replace(/agent remove/i, "agent tp ~ -100 ~");

  if (cmd.includes("/seed")) {
    const seed = world.seed;
    source.sendMessage("World Seed: " + seed);

    save_data[player_sd_index].command_history.push({
      command: cmd,
      successful: true,
      unix: Date.now(),
      hidden: false
    });
    update_save_data(save_data);

    return true;
  }

  try {
    let result = target === "server"
      ? world.getDimension("overworld").runCommand(real_cmd)
      : target.runCommand(real_cmd);

    const success = result.successCount > 0;

    save_data[player_sd_index].command_history.push({
      command: cmd,
      successful: success,
      unix: Date.now(),
      hidden: false
    });

    update_save_data(save_data);
    source.sendMessage(success ? "Command executed" : "§cCommand didn't execute");
    return success;

  } catch (e) {
    save_data[player_sd_index].command_history.push({
      command: cmd,
      successful: false,
      unix: Date.now(),
      hidden: false
    });

    update_save_data(save_data);
    const rawErrorMessage = (e && typeof e.message === "string") ? e.message : String(e);
    const displayErrorMessage = formatDisplayErrorMessage(rawErrorMessage);
    command_menu_result_e(source, rawErrorMessage, cmd);
    source.sendMessage("§c" + displayErrorMessage);
    return false;
  }
}

function command_menu_result_e(player, message, command, show_suggestion = true) {
  let form = new ActionFormData();
  let actions = [];
  let suggestion = show_suggestion? correctCommand(command) : null;
  suggestion = suggestion?.visible(player) ? suggestion : null;

  form.title("Command Result");

  const rawMessage = (message && typeof message === "string") ? message : String(message);
  const displayMessage = formatDisplayErrorMessage(rawMessage);
  const errorSnippet = extractErrorSnippet(rawMessage);

  const highlightedCommand = highlightErrorInCommand(command, errorSnippet);
  form.body("Command:\n§o§7" + highlightedCommand);
  form.label("§rFailed with:\n§c" + displayMessage)

  if (suggestion && suggestion.fix_available) {
    form.label("Did you mean:\n§a§o§7" + suggestion.command);
  }

  form.divider();

  if (suggestion && suggestion.fix_available) {
    form.button("Use suggestion");
    actions.push(() => {
      execute_command(player, suggestion.command, player);
    });
  }

  if (suggestion && suggestion.fix_available && suggestion.vc_hiperlink) {
    form.button("Visual command");
    actions.push(() => {
      return suggestion.vc_hiperlink(player);
    });
  }

  if (suggestion) {
    form.divider();
  }

  form.button("Try again");
  actions.push(() => {
    command_menu(player, command);
  });

  if (canPlayerUseMenu(player)) {
    form.divider();
    form.button("");
    actions.push(() => {
      main_menu(player);
    });
  }

  form.show(player).then((response) => {
    if (response.selection == undefined) {
      return -1;
    }

    if (actions[response.selection]) {
      actions[response.selection]();
    }
  });
}

/*------------------------
 chain commands
-------------------------*/

async function chain_new(player) {
  const save_data = load_save_data();
  const player_sd_index = save_data.findIndex(entry => entry.id === player.id);

  const result = await menu_text_input(player, {
    title: "New Chain",
    prompt: "Enter the name of the chain command:",
    placeholder: "My Chain Command",
    defaultValue: ""
  });

  if (result.canceled) {
    return chain_overview(player);
  }

  save_data[player_sd_index].chain_commands.push({
    name: result.response,
    state: {successful: null, message: null, unix: []},
    icon: undefined,
    commands: [],
    pined: false
  });
  update_save_data(save_data);
  return chain_edit(player, save_data[player_sd_index].chain_commands.length - 1, true);
}

function chain_overview(player) {
  let form = new ActionFormData();
  let actions = [];
  let save_data = load_save_data();
  let player_sd_index = save_data.findIndex(entry => entry.id === player.id);

  form.title("Chain Commands");
  form.body("Select a chain");

  let chain_commands = save_data[player_sd_index].chain_commands;

  form.button("New chain", "textures/ui/color_plus");
  actions.push(() => { chain_new(player); });
  form.divider();

  // Zwei Listen: pined und unpined
  let pinedChains = chain_commands.filter(c => c.pined).sort((a, b) => (a.name || "").localeCompare(b.name || ""));
  let unpinedChains = chain_commands.filter(c => !c.pined).sort((a, b) => (a.name || "").localeCompare(b.name || ""));

  if (pinedChains.length > 0) {
    form.label("Pinned Chains")
    pinedChains.forEach(chain => {
      const cmdName = chain.name || "Unnamed Chain";
      const statusText = (chain.state.successful ? "§2Successful§r" : "§cFailed§r");
      const lastUnix = Array.isArray(chain.state.unix) ? chain.state.unix[chain.state.unix.length - 1] : chain.state.unix;
      const relativeTime = lastUnix != null ? getRelativeTime(Date.now() - lastUnix) : "Never";

      form.button(`${cmdName}\n${chain.state.successful === null ? "" : `${statusText} | ${relativeTime} ago`}`, chain.icon || "");
      actions.push(() => {
        let originalIndex = chain_commands.findIndex(c => c === chain);
        if (chain.commands.length !== 0 && save_data[player_sd_index].quick_run) {
          execute_chain(player, originalIndex);
        } else {
          chain_main(player, originalIndex);
        }
      });
    });

    if (canPlayerUseMenu(player) || unpinedChains.length > 0) form.divider();
  }


  if (unpinedChains.length > 0) {
    form.label("All Chains");

    unpinedChains.forEach(chain => {
      const cmdName = chain.name || "Unnamed Chain";
      const statusText = (chain.state.successful ? "§2Successful§r" : "§cFailed§r");
      const lastUnix = Array.isArray(chain.state.unix) ? chain.state.unix[chain.state.unix.length - 1] : chain.state.unix;
      const relativeTime = lastUnix != null ? getRelativeTime(Date.now() - lastUnix) : "Never";

      form.button(`${cmdName}\n${chain.state.successful === null ? "" : `${statusText} | ${relativeTime} ago`}`, chain.icon || "");

      actions.push(() => {
        let originalIndex = chain_commands.findIndex(c => c === chain);

        if (chain.commands.length !== 0 && save_data[player_sd_index].quick_run) {
          execute_chain(player, originalIndex);
        } else {
          chain_main(player, originalIndex);
        }
      });
    });

    if (canPlayerUseMenu(player)) form.divider();
  }


  if (canPlayerUseMenu(player)) {
    form.button("");
    actions.push(() => {
      main_menu(player);
    });
  }

  form.show(player).then((response) => {
    if (response.selection == undefined) return -1;
    if (actions[response.selection]) actions[response.selection]();
  });
};

function chain_main(player, chainIndex) {
  let form = new ActionFormData();
  let actions = [];
  let save_data = load_save_data();
  let player_sd_index = save_data.findIndex(entry => entry.id === player.id);
  let chain = save_data[player_sd_index].chain_commands[chainIndex];

  form.title(`${chain.name}`);
  form.body("Chain Command Overview");
  form.divider();
  form.label(`Commands in this chain: ${chain.commands.length}`);
  form.label(`Chain ID: ${chainIndex}`);
  const lastUnix = Array.isArray(chain.state.unix) ? chain.state.unix[chain.state.unix.length - 1] : chain.state.unix;
  form.label(`Last run: §7${lastUnix != null ? getRelativeTime(Date.now() - lastUnix) + " ago" : "Never"}§r`);
  if (chain.state.successful !== null) {
    form.label(`Last result: ${chain.state.successful ? "§2Successful§r" : "§cFailed§r"}`);
    form.label(`Last message: §7${chain.state.message || "No message"}§r`);
  }

  if (chain.commands.length !== 0) {
    form.divider();
    form.button("Run Chain", "textures/ui/icons/icon_trailer");
    actions.push(() => {
      execute_chain(player, chainIndex);
    });
  }

  form.divider();

  form.button("Edit Commands", "textures/ui/settings_pause_menu_icon");
  actions.push(() => {
    chain_edit(player, chainIndex);
  });

  form.button((save_data[player_sd_index].chain_commands[chainIndex].pined? "Unpin": "Pin") + " Chain", "textures/ui/icons/icon_trending");
  actions.push(() => {
    save_data[player_sd_index].chain_commands[chainIndex].pined = !save_data[player_sd_index].chain_commands[chainIndex].pined;
    update_save_data(save_data);
    chain_main(player, chainIndex);
  });

  form.button("Rename Chain", "textures/ui/editIcon");
  actions.push(() => {
    menu_text_input(player, {
      title: "Rename Chain",
      prompt: "Modify the name of the chain command:",
      placeholder: "My Chain Command",
      defaultValue: chain.name
    }).then((result) => {
      if (result.canceled) {
        return chain_main(player, chainIndex);
      }

      save_data[player_sd_index].chain_commands[chainIndex].name = result.response;
      update_save_data(save_data);
      chain_main(player, chainIndex);
    });
  });

  form.button(chain.icon ? "Change Icon" : "Add Icon", chain.icon || "textures/ui/mashup_PaintBrush");
  actions.push(() => {
    menu_text_input(player, {
      title: chain.icon ? "Change Icon" : "Add Icon",
      prompt: "Enter the texture path for the chain icon:",
      placeholder: "textures/ui/chain_icon",
      defaultValue: chain.icon || "textures/ui/",
      tooltip: "You can use any valid Minecraft texture path. For example:\n\n- textures/ui/icon_trailer\n- textures/items/ender_eye\n\nYou can find a list at github.com/Mojang/bedrock-samples/tree/main/resource_pack"
    }).then((result) => {
      if (result.canceled && chain.icon) {
        form = new MessageFormData();
        form.title("Delete Icon");
        form.body("Are you sure you want to delete the custom icon for this chain command?");
        form.button1("Yes, delete it");
        form.button2("");

        form.show(player).then((response) => {
          if (response.selection === 0) {
            save_data[player_sd_index].chain_commands[chainIndex].icon = undefined;
            update_save_data(save_data);
          }

          chain_main(player, chainIndex);
        });
        return;
      }

      save_data[player_sd_index].chain_commands[chainIndex].icon = result.response;
      update_save_data(save_data);
      chain_main(player, chainIndex);
    });
  });

  form.button("Delete Chain", "textures/ui/icon_trash");
  actions.push(() => {
    let confirmForm = new MessageFormData();
    confirmForm.title("Delete Chain");
    confirmForm.body("Are you sure you want to delete this chain command?");
    confirmForm.button1("Yes, delete it");
    confirmForm.button2("");

    confirmForm.show(player).then((confirmResponse) => {
      if (confirmResponse.selection === 0) {
        save_data[player_sd_index].chain_commands.splice(chainIndex, 1);
        update_save_data(save_data);
        chain_overview(player);
      } else {
        chain_main(player, chainIndex);
      }
    });
  });

  form.divider();

  form.button("");
  actions.push(() => {
    chain_overview(player);
  });

  form.show(player).then((response) => {
    if (response.selection == undefined) {
      return -1;
    }
    if (actions[response.selection]) {
      actions[response.selection]();
    }
  });

};

function chain_edit(player, chainIndex, setup = false) {
  let form = new ActionFormData();
  let actions = [];
  let save_data = load_save_data();
  let player_sd_index = save_data.findIndex(entry => entry.id === player.id);
  let chain = save_data[player_sd_index].chain_commands[chainIndex];

  form.title(`Commands in ${chain.name}`);
  form.body("Manage the commands in this chain.");

  if (chain.commands.length == 0) {
    form.label("§7No commands added yet.§r");
  }



  chain.commands.forEach((cmd, idx) => {
    // Extract base command (without '/' and arguments)
    const baseCmd = cmd.startsWith("/") ? cmd.slice(1) : cmd;
    const firstWord = baseCmd.split(" ")[0];

    // Find the matching command in the command list
    const matchingCommand = command_list.find(c =>
      Array.isArray(c.aliases) &&
      c.aliases.some(a => a.toLowerCase() === firstWord.toLowerCase())
    );

    // Determine the texture to use
    const texture = matchingCommand?.textures ?? "textures/ui/chat_send";

    // Add a button with the original command (keep arguments)
    form.button(`${cmd.startsWith("/") ? "" : "/"}${cmd}`, texture);

    // Store the action for this command
    actions.push(() => chain_edit_command(player, chainIndex, idx));
  });




  form.divider();

  form.button("Add Command", "textures/ui/color_plus");
  actions.push(() => {
    visual_command(player, (output) => {
      if (!output || !output.command) {
        return chain_edit(player, chainIndex, setup);
      }

      save_data[player_sd_index].chain_commands[chainIndex].commands.push(output.command);
      update_save_data(save_data);
      chain_edit(player, chainIndex, setup);
    });
  });

  form.divider();

  if (setup) {
    if (chain.commands.length !== 0) {
      form.button("Save", "textures/ui/check");
      actions.push(() => {
        chain_overview(player);
      });
    }


    form.button("");
    actions.push(() => {
      if (chain.commands.length == 0) {
        save_data[player_sd_index].chain_commands.splice(chainIndex, 1);
        update_save_data(save_data);
        chain_overview(player);
      } else {
        let confirmForm = new MessageFormData();
        confirmForm.title("Delete Chain");
        confirmForm.body("Are you sure you want to delete this chain command?");
        confirmForm.button1("Yes, delete it");
        confirmForm.button2("");

        confirmForm.show(player).then((confirmResponse) => {
          if (confirmResponse.selection === 0) {
            save_data[player_sd_index].chain_commands.splice(chainIndex, 1);
            update_save_data(save_data);
            chain_overview(player);
          } else {
            chain_edit(player, chainIndex, setup);
          }
        });
      }
    });
  } else {
    form.button("");
    actions.push(() => {
      chain_main(player, chainIndex);
    });
  }

  form.show(player).then((response) => {
    if (response.selection == undefined) {
      return -1;
    }
    if (actions[response.selection]) {
      actions[response.selection]();
    }
  });
};

function chain_edit_command(player, chainIndex, commandIndex, setup) {
  let form = new ActionFormData();
  let actions = [];
  let save_data = load_save_data();
  let player_sd_index = save_data.findIndex(entry => entry.id === player.id);
  let chain = save_data[player_sd_index].chain_commands[chainIndex];
  let command = chain.commands[commandIndex];

  form.title("Edit "+(command.startsWith("/")? "" : "/") + command);
  form.body("Select an action for this command.");

  const swap = (i, j) => {
    [chain.commands[i], chain.commands[j]] = [chain.commands[j], chain.commands[i]];
    update_save_data(save_data);
    chain_edit_command(player, chainIndex, commandIndex, setup);
  };

  if (commandIndex > 0) {
    form.button("Move Up", "textures/ui/chevron_white_up");
    actions.push(() => swap(commandIndex, commandIndex - 1));
  }

  if (commandIndex < chain.commands.length - 1) {
    form.button("Move Down", "textures/ui/chevron_white_down");
    actions.push(() => swap(commandIndex, commandIndex + 1));
  }

  if (chain.commands.length > 1) form.divider();




  form.button("Edit Command", "textures/ui/editIcon");
  actions.push(() => {
    menu_text_input(player, {
      title: "Edit Command",
      prompt: "Modify the command:",
      placeholder: "e.g. /say Hello World",
      defaultValue: command
    }).then((result) => {
      if (result.canceled) {
        return chain_edit_command(player, chainIndex, commandIndex, setup);
      }

      save_data[player_sd_index].chain_commands[chainIndex].commands[commandIndex] = result.response;
      update_save_data(save_data);
      chain_edit(player, chainIndex, setup);
    });
  });

  form.button("Delete Command", "textures/ui/icon_trash");
  actions.push(() => {
    save_data[player_sd_index].chain_commands[chainIndex].commands.splice(commandIndex, 1);
    update_save_data(save_data);
    chain_edit(player, chainIndex, setup);
  });

  form.divider();
  form.button("");
  actions.push(() => {
    chain_edit(player, chainIndex, setup);
  });

  form.show(player).then((response) => {
    if (response.selection == undefined) {
      return -1;
    }
    if (actions[response.selection]) {
      actions[response.selection]();
    }
  });
};

function execute_chain(player, chainIndex) {
  let save_data = load_save_data();
  let player_sd_index = save_data.findIndex(entry => entry.id === player.id);
  let chain = save_data[player_sd_index].chain_commands[chainIndex];
  let chainState = chain.state;

  (async () => {
    for (const cmd of chain.commands) {
      try {
        let result;

        if (canPlayerUseChains(player) === false) {
          throw new Error(`You are restriced from using chain commands by your Admin`);
        }

        if (isCommandAvailable(player, cmd) === false) {
          throw new Error(`${cmd} is restriced by your Admin`);
        } else {
          result = player.runCommand(cmd);
        }

        if (!result) {
          chainState.successful = false;
          chainState.message = `Command failed: ${cmd}`;
          pushChainUnix(chainState, Date.now());
          update_save_data(save_data);
          player.sendMessage(`§cChain execution stopped due to failure.§r`);
          return;
        }
      } catch (e) {
        chainState.successful = false;
        chainState.message = `Error executing command: ${e.message || e}`;
        pushChainUnix(chainState, Date.now());
        update_save_data(save_data);
        player.sendMessage(`§cChain execution stopped due to error on ${cmd}. Open the chain editor to view the error!§r`);
        return;
      }
    }

    chainState.successful = true;
    chainState.message = null;
    pushChainUnix(chainState, Date.now());
    update_save_data(save_data);
    player.sendMessage(`${save_data[player_sd_index].chain_commands[chainIndex].name} Chain executed successfully.§r`);
  })();
}

/*------------------------
 new command
-------------------------*/

function visual_command(player, on_output, options = {}) {
  let form = new ActionFormData();
  let actions = [];
  let save_data = load_save_data();
  let player_sd_index = save_data.findIndex(entry => entry.id === player.id);
  const recommendVisible = options.recommendVisible ?? true;
  const fromMainMenu = options?.from_main_menu === true;

  form.title("New Command");
  form.body("General");

  // --- General ---
  form.button("Typing", "textures/ui/chat_send");
  actions.push(() => {
    if (fromMainMenu) {
      return command_menu(player);
    }

    menu_text_input(player, {
      title: "Command",
      prompt: "Enter a command",
      placeholder: "e.g. /say Hello World",
      defaultValue: ""
    }).then((result) => {
      if (!result || result.canceled) return;
      const raw = String(result.response || "").trim();
      if (!raw) return;

      const output = { command: raw.startsWith("/") ? raw : "/" + raw };
      if (typeof on_output === "function") return on_output(output);

      const latestSaveData = load_save_data();
      const latestPlayerIndex = latestSaveData.findIndex(entry => entry.id === player.id);
      latestSaveData[latestPlayerIndex].quick_run
        ? execute_command(player, output.command)
        : command_menu(player, output.command);
    });
  });

  form.divider();

  // --- Listen durch Helper erzeugen ---
  const {recommendedEntries, allEntries, categoryLists} = generate_command_lists(player, on_output);

  // --- Recommended ---
  if (recommendedEntries.length && recommendVisible) {
    form.label("Recommended");

    const displayCount = recommendedEntries.length >= 4 ? 2 : 3;

    recommendedEntries
      .slice(0, displayCount)
      .forEach(e => {
        form.button(e.label, e.icon);
        actions.push(e.actionFn);
      });

    if (recommendedEntries.length > displayCount) {
      form.button("Show more!");
      actions.push(() => visual_command_overview(player, recommendedEntries, on_output, options));
    }

    form.divider();
  }

  // --- Categories ---
  if (categoryLists.length > 0) {
    form.label("Categories");
    for (const cat of categoryLists) {
      if (cat.entries.length === 0) continue;
      const label = `${cat.category.name}\n§o${cat.category.description}§r`;
      form.button(label, cat.category.icon);
      actions.push(() => visual_command_overview(player, cat.entries, on_output, options));
    }
    form.divider();
  }


  // --- Show all commands ---
  if (allEntries.length > 0) {
    form.button("Show all commands", "textures/ui/more-dots");
    actions.push(() => visual_command_overview(player, allEntries, on_output, options));
  }

  // --- Back button ---
  if (canPlayerUseMenu(player)) {
    form.button("");
    actions.push(() => main_menu(player));
  }

  // --- Show Form ---
  form.show(player).then(response => {
    if (response.selection === undefined) return;
    const idx = response.selection;
    if (actions[idx]) actions[idx]();
  });
}

function visual_command_overview(player, entries, on_output, options = {}) {
  let form = new ActionFormData();
  let actions = [];
  let save_data = load_save_data();
  let player_sd_index = save_data.findIndex(entry => entry.id === player.id);

  form.title("More Commands");
  form.body("Select a command!");

  // Hilfsfunktion: erstes sichtbares Zeichen normalisieren und Gruppe bestimmen
  function getGroupLetter(text) {
    if (!text) return '#';
    // Trim left to ignore führende Leerzeichen
    const trimmed = text.trimLeft();
    if (trimmed.length === 0) return '#';
    let ch = trimmed[0];

    // Kleinschreibung für Vergleich
    ch = ch.toLowerCase();

    // A-Z ?
    if (ch >= 'a' && ch <= 'z') {
      return ch.toUpperCase(); // A..Z
    }

    // Alles andere -> '#'
    return '#';
  }

  // Gruppen zusammenstellen (Erhalt der Reihenfolge innerhalb jeder Gruppe)
  const groups = {};
  for (const e of entries) {
    const labelText = typeof e.label === 'string' ? e.label : '';
    const g = getGroupLetter(labelText);
    if (!groups[g]) groups[g] = [];
    groups[g].push(e);
  }

  // Reihenfolge: A..Z, danach '#' (falls vorhanden)
  for (let i = 0; i < 26; i++) {
    const letter = String.fromCharCode(65 + i); // 'A'..'Z'
    if (groups[letter] && groups[letter].length > 0) {
      form.label(letter);
      for (const e of groups[letter]) {
        if (e.icon) form.button(e.label, e.icon);
        else form.button(e.label, "textures/ui/chat_send");
        actions.push(e.actionFn);
      }
      form.divider(); // optional: Trennung zwischen Buchstabenblöcken
    }
  }

  // '#' Gruppe (nicht A-Z oder nicht erkannte Zeichen)
  if (groups['#'] && groups['#'].length > 0) {
    form.label('#');
    for (const e of groups['#']) {
      if (e.icon) form.button(e.label, e.icon);
      else form.button(e.label, "textures/ui/chat_send");
      actions.push(e.actionFn);
    }
    form.divider();
  }

  // Zurück-Button (ohne spezielles Label)
  form.button("");
  actions.push(() => visual_command(player, on_output, options));

  // Anzeige und Auswertung
  form.show(player).then((response) => {
    if (response.selection === undefined) {
      return -1;
    }
    const idx = response.selection;
    if (actions[idx]) {
      actions[idx]();
    }
  });
}


/*------------------------
 visual_command: generic commands
-------------------------*/

async function visual_command_generic(player, cmd, on_output) {
  let fullCommand = "";
  const save_data = load_save_data();
  const player_sd_index = save_data.findIndex(entry => entry.id === player.id);

  function appendToken(token) {
    if (!token && token !== 0) return;
    fullCommand += (fullCommand ? " " : "") + token;
  }

  async function visual_rawtext_builder(player, cmdName, optional = false) {
    const components = [];
    while (true) {
      const requireTypeSelection = components.length === 0;
      const pick = await menu_actions_input(player, {
        title: "Visual commands - " + cmdName,
        prompt: requireTypeSelection
          ? "Choose at least one rawtext component type"
          : "Add another rawtext component (optional)",
        actions: [
          { id: "text", name: "Text" },
          { id: "selector", name: "Selector" },
          { id: "score", name: "Score" },
          { id: "translate", name: "Translate" }
        ],
        optional: requireTypeSelection ? false : true
      });
      if (pick.canceled) return { canceled: true };
      if (pick.skipped) break;

      if (pick.response === "text") {
        const textIn = await menu_text_input(player, {
          title: "Visual commands - " + cmdName,
          prompt: "Text value",
          optional: false
        });
        if (textIn.canceled) return { canceled: true };
        components.push({ text: String(textIn.response || "") });
        continue;
      }

      if (pick.response === "selector") {
        const selIn = await menu_text_input(player, {
          title: "Visual commands - " + cmdName,
          prompt: "Selector (e.g. @s, @a[name=...] )",
          defaultValue: "@s",
          optional: false
        });
        if (selIn.canceled) return { canceled: true };
        components.push({ selector: String(selIn.response || "@s") });
        continue;
      }

      if (pick.response === "score") {
        const scoreName = await menu_text_input(player, {
          title: "Visual commands - " + cmdName,
          prompt: "Score holder name",
          defaultValue: "*",
          optional: false
        });
        if (scoreName.canceled) return { canceled: true };
        const scoreObj = await menu_text_input(player, {
          title: "Visual commands - " + cmdName,
          prompt: "Score objective",
          optional: false
        });
        if (scoreObj.canceled) return { canceled: true };
        components.push({ score: { name: String(scoreName.response || "*"), objective: String(scoreObj.response || "") } });
        continue;
      }

      if (pick.response === "translate") {
        const trKey = await menu_text_input(player, {
          title: "Visual commands - " + cmdName,
          prompt: "Translation key/text",
          optional: false
        });
        if (trKey.canceled) return { canceled: true };
        const withInput = await menu_text_input(player, {
          title: "Visual commands - " + cmdName,
          prompt: "Optional 'with' values (comma separated)",
          optional: true
        });
        if (withInput.canceled) return { canceled: true };
        const trComp = { translate: String(trKey.response || "") };
        if (!withInput.skipped && String(withInput.response || "").trim()) {
          trComp.with = String(withInput.response).split(",").map(s => s.trim()).filter(Boolean);
        }
        components.push(trComp);
      }
    }

    if (components.length === 0) {
      if (optional) return { skipped: true };
      components.push({ text: "" });
    }
    return { response: JSON.stringify({ rawtext: components }) };
  }

  async function processParts(parts) {
    let requestRepeatExit = false;
    let canExitLoop = false;

    for (const part of parts) {
      if (part.type === "literal") {
        appendToken(String(part.value || "").replace(/^\/+/, ""));
        continue;
      }
      if (part.type === "exit_loop") {
        requestRepeatExit = true;
        continue;
      }
      if (part.type === "can_exit_loop") {
        canExitLoop = true;
        continue;
      }
      if (part.type === "command_tail") {
        let result = await new Promise((resolve) => {
          visual_command(player, (output) => {
            if (!output || !output.command) {
              return resolve({ canceled: true });
            }
            resolve({ response: output.command.replace(/^\/+/, "") });
          });
        });

        if (result.canceled) return { canceled: true };
        appendToken(result.response);
        continue;
      }
      if (part.type === "repeat") {
        const repeatParts = Array.isArray(part.syntaxes) ? part.syntaxes : [];
        const min = Number.isFinite(+part.min) ? +part.min : 0;
        const max = Number.isFinite(+part.max) ? +part.max : 999;
        let count = 0;
        let repeatCanExit = false;
        const singleChoice = repeatParts.length === 1 && repeatParts[0]?.type === "choice" ? repeatParts[0] : null;

        while (count < max) {
          if (singleChoice) {
            const options = Array.isArray(singleChoice.options) ? singleChoice.options : [];
            const actions = options.map((option, idx) => ({
              id: option.name || option.value || `choice_option_${idx}`,
              name: option.name || option.value || `Option ${idx + 1}`
            }));

            const pick = await menu_actions_input(player, {
              title: "Visual commands - " + cmd.name,
              prompt: `Choose option for ${singleChoice.name || part.name || "loop"}`,
              actions,
              optional: count >= min && repeatCanExit
            });
            if (pick.canceled) return { canceled: true };
            if (pick.skipped) break;
            if (pick.response === "__exit_repeat__") break;

            const selectedOption = options.find((option, idx) => (option.name || option.value || `choice_option_${idx}`) === pick.response);
            if (!selectedOption || selectedOption.emit !== false) appendToken(pick.response);

            const nestedSyntaxes = Array.isArray(selectedOption?.syntaxes) ? selectedOption.syntaxes : (Array.isArray(selectedOption?.next) ? selectedOption.next : []);
            if (nestedSyntaxes.length) {
              const nestedRes = await processParts(nestedSyntaxes);
              if (nestedRes?.canceled) return { canceled: true };
              if (nestedRes?.canExitLoop) repeatCanExit = true;
              if (nestedRes?.requestRepeatExit && count + 1 >= min) {
                count++;
                break;
              }
            }
            count++;
            continue;
          }

          const nestedRes = await processParts(repeatParts);
          if (nestedRes?.canceled) return { canceled: true };
          if (nestedRes?.canExitLoop) repeatCanExit = true;
          count++;
          if (nestedRes?.requestRepeatExit && count >= min) break;
          if (count >= min && repeatCanExit) {
            const cont = await menu_actions_input(player, {
              title: "Visual commands - " + cmd.name,
              prompt: `Add ${part.name || "another clause"}?`,
              actions: [{ id: "yes", name: "Add" }, { id: "no", name: "Finish / Exit" }],
              optional: false
            });
            if (cont.canceled) return { canceled: true };
            if (cont.response !== "yes") break;
          }
        }
        if (repeatCanExit) canExitLoop = true;
        continue;
      }

      if (part.type === "location") {
        let result = await menu_location_input(player, {
          title: "Visual commands - " + cmd.name,
          prompt: `Enter Location: ` + part.name,
          optional: part.optional || false
        });
        if (result.skipped) break;
        if (result.canceled) return { canceled: true };
        const { x, y, z } = result.response;
        appendToken(`${x} ${y} ${z}`);
        continue;
      }
      if (part.type === "blocktype") {
        let result = await menu_text_input(player, {
          title: "Visual commands - " + cmd.name,
          prompt: `Enter blocktype: ` + part.name,
          optional: part.optional || false
        });
        if (result.skipped) break;
        if (result.canceled) return { canceled: true };
        appendToken(result.response);
        continue;
      }
      if (part.type === "bool") {
        let result = await menu_actions_input(player, {
          title: "Visual commands - " + cmd.name,
          prompt: part.name + "?",
          actions: [{ id: "true", name: "Yes" }, { id: "false", name: "No" }],
          optional: part.optional || false
        });
        if (result.skipped) break;
        if (result.canceled) return { canceled: true };
        appendToken(result.response);
        continue;
      }
      if (part.type === "weathertype") {
        const actions = [
          { id: "clear", name: "Sunny (clear)", icon: "textures/ui/weather_clear" },
          { id: "rain", name: "Rain", icon: "textures/ui/weather_rain" },
          { id: "thunder", name: "Thunderstorms", icon: "textures/ui/weather_thunderstorm" }
        ];
        let result = await menu_actions_input(player, {
          title: "Visual commands - " + cmd.name,
          prompt: "Which weather do you want?",
          actions,
          optional: part.optional || false
        });
        if (result.skipped) break;
        if (result.canceled) return { canceled: true };
        appendToken(result.response);
        continue;
      }
      if (part.type === "playerselector") {
        let result = await menu_actions_input(player, {
          title: "Visual commands - " + cmd.name,
          prompt: `Select a player: ` + part.name,
          actions: world.getAllPlayers().map(p => ({ value: p.name, icon: "textures/ui/lan_icon" })),
          optional: part.optional || false
        });
        if (result.skipped) break;
        if (result.canceled) return { canceled: true };
        appendToken(result.response);
        continue;
      }
      if (part.type === "choice") {
        const options = Array.isArray(part.options) ? part.options : [];
        if (!options.length) continue;
        const actions = options.map((option, idx) => ({
          id: option.name || option.value || `choice_option_${idx}`,
          name: option.name || option.value || `Option ${idx + 1}`
        }));
        let result = await menu_actions_input(player, {
          title: "Visual commands - " + cmd.name,
          prompt: `Choose option for ${part.name || "choice"}`,
          actions,
          optional: part.optional || false
        });
        if (result.skipped) break;
        if (result.canceled) return { canceled: true };

        const selectedOption = options.find((option, idx) => (option.name || option.value || `choice_option_${idx}`) === result.response);
        if (!selectedOption || selectedOption.emit !== false) appendToken(result.response);
        const nestedSyntaxes = Array.isArray(selectedOption?.syntaxes) ? selectedOption.syntaxes : (Array.isArray(selectedOption?.next) ? selectedOption.next : []);
        if (nestedSyntaxes.length) {
          const nestedRes = await processParts(nestedSyntaxes);
          if (nestedRes?.canceled) return { canceled: true };
          if (nestedRes?.requestRepeatExit) requestRepeatExit = true;
          if (nestedRes?.canExitLoop) canExitLoop = true;
        }
        continue;
      }
      if (part.type === "enum") {
        const values = (Array.isArray(part.value) ? part.value : []).map((val, idx) => ({
          id: String(val?.name ?? val?.value ?? val ?? `enum_value_${idx}`),
          name: String(val?.name ?? val?.value ?? val ?? `Value ${idx + 1}`)
        }));
        if (!values.length) continue;
        let result = await menu_actions_input(player, {
          title: "Visual commands - " + cmd.name,
          prompt: `Choose value for ${part.name || "enum"}`,
          actions: values,
          optional: part.optional || false
        });
        if (result.skipped) break;
        if (result.canceled) return { canceled: true };
        appendToken(result.response);
        continue;
      }
      if (part.type === "entityType") {
        const actions = EntityTypes.getAll()
          .sort((a, b) => a.id.localeCompare(b.id))
          .map(e => {
            const id = e.id.replace(/^minecraft:/, "");
            if (entity_blocklist.find(entity => entity.id == id)) return null;
            let icon = "textures/items/spawn_eggs/spawn_egg_" + id;
            if (entity_exceptionlist[id]) icon = entity_exceptionlist[id].icon;
            const name = { rawtext: [{ translate: "entity." + id + ".name" }] };
            return { id, name, icon };
          })
          .filter(Boolean);
        let result = await menu_actions_input(player, {
          title: "Visual commands - " + cmd.name,
          prompt: `What entity do you mean for ` + part.name,
          actions,
          optional: part.optional || false
        });
        if (result.skipped) break;
        if (result.canceled) return { canceled: true };
        appendToken(result.response);
        continue;
      }
      if (part.type === "json") {
        if (cmd.name === "tellraw" || cmd.name === "titleraw") {
          const result = await visual_rawtext_builder(player, cmd.name, part.optional || false);
          if (result.skipped) break;
          if (result.canceled) return { canceled: true };
          appendToken(result.response);
          continue;
        }
        let result = await menu_text_input(player, {
          title: "Visual commands - " + cmd.name,
          prompt: `Enter JSON: ` + part.name,
          optional: part.optional || false
        });
        if (result.skipped) break;
        if (result.canceled) return { canceled: true };
        appendToken(result.response);
        continue;
      }

      let result = await menu_text_input(player, {
        title: "Visual commands - " + cmd.name,
        prompt: `Enter ${part.type}: ` + part.name,
        optional: part.optional || false
      });
      if (result.skipped) break;
      if (result.canceled) return { canceled: true };
      appendToken(result.response);
    }
    return { ok: true, requestRepeatExit, canExitLoop };
  }

  const result = await processParts(cmd.syntaxes);
  if (result && result.canceled) return visual_command(player, on_output);

  const output = { command: "/" + fullCommand.replace(/^\/+/, "") };
  if (typeof on_output === "function") return on_output(output);

  save_data[player_sd_index].quick_run
    ? execute_command(player, output.command)
    : command_menu(player, output.command);

}


/*------------------------
 visual_command: Gamerule
-------------------------*/

function visual_command_gamerule_new(player, on_output) {
  let form = new ActionFormData();
  let actions = [];

  form.title("Visual commands - gamerule");
  form.body("Select a gamerule to add!");

  const active_gamerules = gamerules.filter(g => {
    const current = world.gameRules[g.id];
    return (g.type === "boolean" && current === true);
  });

  const disabled_gamerules = gamerules.filter(g => {
    const current = world.gameRules[g.id];
    return (g.type === "boolean" && current === false);
  });


  const numerical_gamerules = gamerules
    .filter(g => g.type === "slider" || g.type === "numberText")
    .map(g => {
      const current = world.gameRules[g.id];
      return {
        ...g,
        value: current
      };
    });




  if (active_gamerules.length > 0) form.label("Active gamerules:");
  active_gamerules.forEach((g) => {
    let name = g.name || g.id;
    form.button(name + "\n§aon§r", g?.texture);
    actions.push(() => {
      const command = `/gamerule ${g.id} false`;
      const nextMenu = () => visual_command_gamerule_new(player, on_output);
      const output = { command, menu: nextMenu };
      if (typeof on_output === "function") return on_output(output);

      const save_data = load_save_data();
      const player_sd_index = save_data.findIndex(e => e.id === player.id);
      if (save_data[player_sd_index].quick_run) {
        execute_command(player, command, player).then((success) => {
          if (success) nextMenu();
        });
      } else {
        command_menu(player, command, null, nextMenu);
      }
    });
  });

  if (active_gamerules.length > 0) form.divider()

  if (numerical_gamerules.length > 0) form.label("Numerical gamerules:");
  numerical_gamerules.forEach((g) => {
    let name = g.name || g.id;
    form.button(name + "\n§9"+ g.value +"§r", g?.texture);
    actions.push(async () => {
      await menu_text_input(player, {
        title: "Set value for " + name,
        prompt: "Enter a new value:",
        placeholder: "Current value: " + g.value,
        defaultValue: String(g.value)
      }).then((result) => {
        if (result.canceled) {
          return visual_command_gamerule_new(player, on_output);
        }
        const newValue = result.response;
        const command = `/gamerule ${g.id} ${newValue}`;
        const nextMenu = () => visual_command_gamerule_new(player, on_output);
        const output = { command, menu: nextMenu };
        if (typeof on_output === "function") return on_output(output);
        const save_data = load_save_data();
        const player_sd_index = save_data.findIndex(e => e.id === player.id);
        if (save_data[player_sd_index].quick_run) {
          execute_command(player, command, player).then((success) => {
            if (success) nextMenu();
          });
        } else {
          command_menu(player, command, null, nextMenu);
        }
      });
    });
  });

  if (numerical_gamerules.length > 0) form.divider()

  if (disabled_gamerules.length > 0) form.label("Disabled gamerules:");
  disabled_gamerules.forEach((g) => {
    let name = g.name || g.id;
    form.button(name + "\n§coff§r", g?.texture);
    actions.push(() => {
      const command = `/gamerule ${g.id} true`;
      const nextMenu = () => visual_command_gamerule_new(player, on_output);
      const output = { command, menu: nextMenu };
      if (typeof on_output === "function") return on_output(output);

      const save_data = load_save_data();
      const player_sd_index = save_data.findIndex(e => e.id === player.id);
      if (save_data[player_sd_index].quick_run) {
        execute_command(player, command, player).then((success) => {
          if (success) nextMenu();
        });
      } else {
        command_menu(player, command, null, nextMenu);
      }
    });
  });
  if (disabled_gamerules.length > 0) form.divider()

  form.button("");
  actions.push(() => {
      return visual_command(player, on_output);
  });
  // Formular anzeigen
  form.show(player).then((response) => {
      if (response.selection == undefined) {
          return -1;
      }
      if (response.selection !== undefined && actions[response.selection]) {
          actions[response.selection]();
      }
  });
}

/*------------------------
 visual_command: Enchant
-------------------------*/

function visual_command_enchant(player, on_output) {
  let form = new ActionFormData();
  let actions = [];

  form.title("Visual commands - enchant");
  form.body("Select a vailed Item!");



  world.getAllPlayers().forEach(p => {
      const item = p.getComponent("minecraft:inventory")?.container?.getItem(p.selectedSlotIndex);
      if (!item) return;

      const compatibleEnchants = getCompatibleEnchantmentTypes(item);
      if (!(compatibleEnchants.length > 0)) return;

      form.button({ rawtext: [{ translate: "item." + item.typeId.replace(/^[^:]+:/, "") + ".name" }, {text: `\n(${p.name})`}]});
      actions.push(() => {
        visual_command_enchant_type(player, p, item, on_output)
      });
  });


  form.divider()
  form.button("");
  actions.push(() => {
      return visual_command(player, on_output);
  });

  // Formular anzeigen
  form.show(player).then((response) => {
      if (response.selection == undefined) {
          return -1;
      }
      if (response.selection !== undefined && actions[response.selection]) {
          actions[response.selection]();
      }
  });
}

function visual_command_enchant_type(viewing_player, selected_player, item, on_output) {
  let form = new ActionFormData();
  let actions = [];

  // Kompatible Enchants holen
  const compatibleEnchants = getCompatibleEnchantmentTypes(item);

  form.title("Visual commands - enchant");
  form.body({ rawtext: [{text: "Select an enchantment for: "}, { translate: "item." + item.typeId.replace(/^[^:]+:/, "") + ".name" }, {text: " (possible: " + compatibleEnchants.length + ")"}]});

  let save_data = load_save_data();
  const player_sd_index = save_data.findIndex(e => e.id === viewing_player.id);

  // Kategorien bilden (connected components basierend auf Inkompatibilitäten)
  const categories = buildEnchantmentCategories(item, compatibleEnchants);

  // Für jede Kategorie: Buttons hinzufügen; zwischen Kategorien divider einfügen
  categories.forEach((cat, ci) => {
    if (ci > 0) form.divider(); // trennt Kategorien

    // Optional: wenn Kategorie mehr als 1 Element hat, können wir einen kleinen Gruppentext
    // (ActionForm hat keine echte section label, daher könnten wir z.B. den ersten Button präfixen).
    for (const e of cat) {
      const label = humanizeId(e.id) + (e.maxLevel > 1 ? " " + toRoman(e.maxLevel) : "");
      form.button(label);
      actions.push(() => {
        const command = (`/enchant "${selected_player.name}" ${e.id} ` + (e.maxLevel > 1 ? e.maxLevel : "")).trim();
        const nextMenu = () => {
          if (compatibleEnchants.length > 1) {
            visual_command_enchant_type(viewing_player, selected_player, selected_player.getComponent("minecraft:inventory")?.container?.getItem(selected_player.selectedSlotIndex), on_output);
          } else {
            visual_command_enchant(viewing_player, on_output);
          }
        };

        const output = { command, menu: nextMenu };
        if (typeof on_output === "function") return on_output(output);

        if (save_data[player_sd_index].quick_run) {
          execute_command(viewing_player, command, viewing_player).then((success) => {
            if (success) nextMenu();
          });
        } else {
          command_menu(viewing_player, command, null, nextMenu);
        }
      });
    }
  });

  form.divider();
  form.button("");
  actions.push(() => { visual_command_enchant(viewing_player, on_output); });

  form.show(viewing_player).then((response) => {
    if (response.selection == undefined) return -1;
    if (actions[response.selection]) actions[response.selection]();
  });
}

/*------------------------
 visual_command: Effect
-------------------------*/

function visual_command_effect_select(player, on_output) {
  let form = new ActionFormData()
  let actions = []

  form.title("Visual commands - effect");
  form.body("Select a type!");


  form.button("Add an effect", "textures/ui/color_plus");
  actions.push(() => {
    return visual_command_effect_add(player, on_output)
  });

  form.button("Clear an effect", "textures/blocks/barrier");
  actions.push(() => {
    return visual_command_effect_clear_player(player, on_output)
  });

  form.divider()
  form.button("");
  actions.push(() => {
    return visual_command(player, on_output)
  });


  form.show(player).then((response) => {
    if (response.selection == undefined ) {
      return -1
    }
    if (response.selection !== undefined && actions[response.selection]) {
      actions[response.selection]();
    }
  });
}

function visual_command_effect_clear_player(player, on_output) {
  let form = new ActionFormData()
  let actions = []

  form.title("Visual commands - effect");
  form.body("Select your target!");


  if (world.getAllPlayers().length === 1) {
    return visual_command_effect_clear_config(player, world.getAllPlayers()[0], on_output);
  }

  for (const selected_player of world.getAllPlayers()) {
    for (const effectType of EffectTypes.getAll()) {
      if (player.getEffect(effectType)) {
        form.button(selected_player.name, "textures/ui/lan_icon");
        actions.push(() => {
          return visual_command_effect_clear_config(player, selected_player, on_output)
        });
        break;
      }
    }
  }

  form.divider()
  form.button("");
  actions.push(() => {
    return visual_command_effect_select(player, on_output)
  });


  form.show(player).then((response) => {
    if (response.selection == undefined ) {
      return -1
    }
    if (response.selection !== undefined && actions[response.selection]) {
      actions[response.selection]();
    }
  });
}

function visual_command_effect_clear_config(player, target, on_output) {
  let form = new ActionFormData();
  const save_data = load_save_data();
  const player_sd_index = save_data.findIndex(e => e.id === player.id);
  let actions = [];

  form.title("Visual commands - effect");
  form.body("Select the effect you want to clear from " + target.name + "!");

  if (EffectTypes.getAll().filter(e => target.getEffect(e)).length == 1) {
    const command = `/effect "${target.name}" clear`;
    const output = { command };
    if (typeof on_output === "function") return on_output(output);

    return save_data[player_sd_index].quick_run
      ? execute_command(player, command, player)
      : command_menu(player, command);
  }

  if (EffectTypes.getAll().filter(e => target.getEffect(e)).length > 1) {
    form.button("All effects", "textures/ui/store_sort_icon");
    actions.push(() => {
      const command = `/effect "${target.name}" clear`;
      const output = { command };
      if (typeof on_output === "function") return on_output(output);

      save_data[player_sd_index].quick_run
        ? execute_command(player, command, player)
        : command_menu(player, command);
    });
    form.divider();
  }

  // Nur Effekte anzeigen, die der Target-Spieler auch wirklich hat
  EffectTypes.getAll()
    .filter(e => target.getEffect(e)) // <-- Nur aktive Effekte
    .sort((a, b) => a.getName().localeCompare(b.getName()))
    .forEach(e => {
      const id = e.getName().replace(/^minecraft:/, "");

      let icon;
      if (id !== "saturation" && id !== "instant_damage" && id !== "instant_health" && id !== "fatal_poison") {
        icon = "textures/ui/" + id + "_effect";
      }

      if (icon) {
        form.button(id, icon);
      } else {
        form.button(id);
      }

      actions.push(() => {
        const command = `/effect "${target.name}" clear ${id}`;
        const output = { command };
        if (typeof on_output === "function") return on_output(output);

        save_data[player_sd_index].quick_run
          ? execute_command(player, command, player)
          : command_menu(player, command);
      });
  });

  form.divider();
  form.button(""); // Zurück-Button
  actions.push(() => visual_command_effect_select(player, on_output));

  form.show(player).then((response) => {
    if (response.selection === undefined) return -1;
    if (actions[response.selection]) actions[response.selection]();
  });
}

function visual_command_effect_add(player, on_output) {
  let form = new ActionFormData()
  let actions = []

  form.title("Visual commands - effect");
  form.body("Select an effect!");

  EffectTypes.getAll()
  .sort((a, b) => a.getName().localeCompare(b.getName()))
  .forEach(e => {

    const id = e.getName().replace(/^minecraft:/, "");

    let icon;
    if (id !== "empty" && id !== "saturation" && id !== "instant_damage" && id !== "instant_health" && id !== "fatal_poison") icon = "textures/ui/" + id + "_effect";

    if (id !== "empty") {
      if (icon) {
        form.button(humanizeId(id), icon);
      } else {
        form.button(humanizeId(id));
      }
      actions.push(() => visual_command_effect_config(player, id, on_output));
    }
  });

  form.divider()
  form.button("");
  actions.push(() => {
    if (anyplayerHasEffect()) {
      return visual_command_effect_select(player, on_output)
    }
    return visual_command(player, on_output)
  });


  form.show(player).then((response) => {
    if (response.selection == undefined ) {
      return -1
    }
    if (response.selection !== undefined && actions[response.selection]) {
      actions[response.selection]();
    }
  });
}

function visual_command_effect_config(player, id, on_output) {
  const form = new ModalFormData();
  const save_data = load_save_data();
  const player_sd_index = save_data.findIndex(e => e.id === player.id);
  form.title(humanizeId(id) + " - config");

  const allplayers = world.getAllPlayers();
  const playerNames = allplayers.map(p => p.name);
  if (playerNames.length !== 1) {
    if (!playerNames.includes(player.name)) playerNames.unshift(player.name);
    form.dropdown('Target', playerNames, {
      defaultValueIndex: playerNames.indexOf(player.name)
    });
  }

  form.slider("Effect Level", 0, 255);
  form.slider("Duration (s)", 0, 999, { defaultValue: 20 });
  form.toggle("Disable Duration", { tooltip: "Sets the duration to infinity" });
  form.toggle("Hide Effect Particle", { defaultValue: true });

  form.show(player).then(resp => {
    if (!resp.formValues) return -1;

    let index = 0;
    const targetName = (playerNames.length !== 1)
      ? playerNames[resp.formValues[index++]]
      : player.name;

    const effectLevel = resp.formValues[index++];
    const duration = resp.formValues[index++];
    const disableDuration = resp.formValues[index++];
    const hideParticles = resp.formValues[index++];

    const durationValue = disableDuration ? "infinite" : duration;
    const hideFlag = hideParticles ? "true" : "false";

    const command = `/effect "${targetName}" ${id} ${durationValue} ${effectLevel} ${hideFlag}`;
    const output = { command };
    if (typeof on_output === "function") return on_output(output);

    save_data[player_sd_index].quick_run
      ? execute_command(player, command, player)
      : command_menu(player, command);
    });

}

/*------------------------
 visual_command: Time
-------------------------*/

function visual_command_time(player, on_output) {
  const form = new ActionFormData();
  const actions = [];
  const saveData = load_save_data();
  const idx = saveData.findIndex(e => e.id === player.id);
  form.title("Visual commands - time");
  form.body("What's the time again?");

  // Define all weather options in one place
  [
    { label: "Midnight\n§90:00 o'clock",    icon: "textures/ui/time_6midnight", cmd: "/time set 18000" },
    { label: "Sunrise\n§e6:00 o'clock",    icon: "textures/ui/time_1sunrise",        cmd: "/time set 0"   },
    { label: "Day\n§b8:00 o'clock",             icon: "textures/ui/time_2day",         cmd: "/time set 1000"    },
    { label: "Noon\n§b12:00 o'clock",    icon: "textures/ui/time_3noon", cmd: "/time set 6000" },
    { label: "Sunset\n§e18:00 o'clock",    icon: "textures/ui/time_4sunset", cmd: "/time set 12000" },
    { label: "Night\n§919:00 o'clock",    icon: "textures/ui/time_5night", cmd: "/time set 13000" }
  ].forEach(opt => {
    form.button(opt.label, opt.icon);
    actions.push(() => {
      const output = { command: opt.cmd };
      if (typeof on_output === "function") return on_output(output);
      return saveData[idx].quick_run
        ? execute_command(player, opt.cmd, player)
        : command_menu(player, opt.cmd);
    });
  });

  // Back button
  form.divider()
  form.button("");
  actions.push(() => visual_command(player, on_output));

  form.show(player).then(resp => {
    if (resp.selection != null && actions[resp.selection]) {
      actions[resp.selection]();
    }
  });
}

/*------------------------
 visual_command: gamemode
-------------------------*/

function visual_command_gamemode(player, on_output) {
  const form = new ActionFormData();
  const actions = [];
  const saveData = load_save_data();
  const idx = saveData.findIndex(e => e.id === player.id);

  form.title("Visual commands - gamemode");
  form.body("Select a game mode:");

  // Optionen (jetzt mit `pin`-Feld)
  const options = [
    { label: "Survival",  icon: "textures/items/iron_sword",   cmd: "/gamemode survival",  pin: false },
    { label: "Creative",  icon: "textures/items/minecart_command_block",   cmd: "/gamemode creative",  pin: false },
    { label: "Adventure", icon: "textures/items/map_empty", cmd: "/gamemode adventure", pin: false },
    { label: "Spectator", icon: "textures/items/ender_eye", cmd: "/gamemode spectator", pin: false }
  ];

  // Pins nach aktuellem Gamemode setzen
  const current = (typeof player.getGameMode === 'function') ? player.getGameMode() : (player.gameMode || null);
  switch (current) {
    case "Creative":
      // Creative -> Survival & Spectator anpinnen
      options.forEach(o => { if (o.label === "Survival" || o.label === "Spectator") o.pin = true; });
      break;
    case "Spectator":
      // Spectator -> Creative anpinnen
      options.forEach(o => { if (o.label === "Creative") o.pin = true; });
      break;
    case "Survival":
      // Survival -> Creative anpinnen
      options.forEach(o => { if (o.label === "Creative") o.pin = true; });
      break;
    case "Adventure":
      // Adventure -> Survival anpinnen
      options.forEach(o => { if (o.label === "Survival") o.pin = true; });
      break;
    default:
      // kein bekannter Gamemode -> keine Pins
      break;
  }

  // Alphabetisch nach label sortieren
  options.sort((a, b) => a.label.localeCompare(b.label));

  const pinned = options.filter(o => o.pin);
  const others = options.filter(o => !o.pin);

  // Angepinnte Items zuerst
  if (pinned.length > 0) {
    pinned.forEach(opt => {
      form.button(opt.label, opt.icon);
      actions.push(() => {
        const output = { command: opt.cmd };
        if (typeof on_output === "function") return on_output(output);
        return saveData[idx].quick_run
          ? execute_command(player, opt.cmd, player)
          : command_menu(player, opt.cmd);
      });
    });

    // Divider zwischen Pins und Rest falls Rest existiert
    if (others.length > 0) form.divider();
  }

  // Restliche Items
  others.forEach(opt => {
    form.button(opt.label, opt.icon);
    actions.push(() => {
      const output = { command: opt.cmd };
      if (typeof on_output === "function") return on_output(output);
      return saveData[idx].quick_run
        ? execute_command(player, opt.cmd, player)
        : command_menu(player, opt.cmd);
    });
  });

  // Zurück-Button
  form.divider();
  form.button("");
  actions.push(() => visual_command(player, on_output));

  // Formular anzeigen und ausgewählte Aktion ausführen
  form.show(player).then(resp => {
    if (resp.selection != null && actions[resp.selection]) {
      actions[resp.selection]();
    }
  });
}

/*------------------------
 Settings
-------------------------*/

function settings_main(viewing_player, input_sd_index) {
  let form = new ActionFormData();
  let actions = [];

  let save_data = load_save_data();
  let player_sd_index = input_sd_index !== undefined ? input_sd_index : save_data.findIndex(entry => entry.id === viewing_player.id);
  let is_admin_mode = input_sd_index !== undefined;

  form.title("Settings" + (is_admin_mode ? " - " + save_data[player_sd_index].name : ""));
  form.body("Main Menu");

  // Status
  const playerToCheck = is_admin_mode ? world.getAllPlayers().find(p => p.id === save_data[input_sd_index].id) : null;
  if (is_admin_mode && (!playerToCheck || playerToCheck.commandPermissionLevel == 0) && !operatorMode) {
    form.button("Status\n" + (save_data[player_sd_index].allow_menu ? "§aon" : "§coff"), save_data[player_sd_index].allow_menu ? "textures/ui/toggle_on" : "textures/ui/toggle_off");
    actions.push(() => {
      if (!save_data[player_sd_index].allow_menu) {
        save_data[player_sd_index].allow_menu = true;
      } else {
        save_data[player_sd_index].allow_menu = false;
      }
      update_save_data(save_data);
      settings_main(viewing_player, input_sd_index);
    });
  }

  // Shortcuts
  if (canPlayerUseMenu(viewing_player, player_sd_index) && !(is_admin_mode && playerToCheck && playerToCheck.commandPermissionLevel >= 1) && (!is_admin_mode || !operatorMode)) {
    form.button("Shortcuts", "textures/ui/sidebar_icons/emotes");
    actions.push(() => {
      settings_shortcuts(viewing_player, input_sd_index);
    });

  // Recommendations
    form.button("Recommendations\n" + (save_data[player_sd_index].recommendations ? "§aon" : "§coff"), "textures/ui/realms_particles");
    actions.push(() => {
      if (!save_data[player_sd_index].recommendations) {
        save_data[player_sd_index].recommendations = true;
      } else {
        save_data[player_sd_index].recommendations = false;
      }
      update_save_data(save_data);
      settings_main(viewing_player, input_sd_index);
    });
  } else if (!is_admin_mode) {
    form.label("§7The Main menu is currently disabled.");
  } else if (operatorMode) {
    form.label("§7Restrictions cannot be applied in operator mode.");
  } else {
    form.label("§7Restrictions cannot be applied to a(n) "+CommandPermissionLevel[world.getAllPlayers().find(p => p.id === save_data[input_sd_index].id).commandPermissionLevel] + " player.");
  }

  form.divider()

  // Multiplayer
  if (playerIsAdmin(viewing_player) && !is_admin_mode) {
    form.label("Multiplayer");

    // Button 3: Permission
    const players = world.getAllPlayers();
    const playerMap = new Map(players.map(p => [p.id, p]));
    const onlineIds = new Set(players.map(p => String(p.id)));

    const names = save_data.slice(1).sort((a, b) => {
      const aOnline = onlineIds.has(String(a.id));
      const bOnline = onlineIds.has(String(b.id));

      const aOp = aOnline && playerMap.get(a.id)?.commandPermissionLevel >= 1;
      const bOp = bOnline && playerMap.get(b.id)?.commandPermissionLevel >= 1;

      // 1️⃣ Online OP
      if (aOnline && bOnline) {
        if (aOp !== bOp) return aOp ? -1 : 1;
        return a.name.localeCompare(b.name, undefined, { sensitivity: "base" });
      }

      // 2️⃣ Online vor Offline
      if (aOnline !== bOnline) return aOnline ? -1 : 1;

      // 3️⃣ Beide offline → zuletzt online zuerst
      const lastLoginB = getLastLogin(b);
      const lastLoginA = getLastLogin(a);

      return lastLoginB - lastLoginA;
    });



    if (names.length > 1) {
      const label = names.length > 1
        ? names.slice(0, -1).map(n => n.name).join(", ") + " & " + names[names.length - 1].name
        : names[0]?.name || "";


      form.button("Permission\n§9" + label, "textures/ui/lock_color");
      actions.push(() => settings_rights_main(viewing_player));
    }

    // Button 4: Logs
    let logs = generate_logs(viewing_player);

    form.button("Logs\n§9" + (logs.length) + " entries", "textures/ui/copy");
    actions.push(() => {
      multipage_time_menu(viewing_player, logs, (viewing_player) => settings_main(viewing_player));
    });

    // Button 4: UTC
    let zone = timezone_list.find(zone => zone.utc === save_data[0].utc), zone_text;

    if (!zone) {
      if (zone !== undefined) {
        zone = timezone_list.reduce((closest, current) => {
          const currentDiff = Math.abs(current.utc - save_data[0].utc);
          const closestDiff = Math.abs(closest.utc - save_data[0].utc);
          return currentDiff < closestDiff ? current : closest;
        });
        zone_text = "Prob. " + ("Prob. "+ zone.name.length > 30 ? zone.short : zone.name)
      }
    } else {
      zone_text = zone.name.length > 30 ? zone.short : zone.name
    }


    form.button(("Time zone") + (zone !== undefined? "\n§9"+zone_text : ""), "textures/ui/world_glyph_color_2x")
    actions.push(() => {
      if (save_data[0].utc_auto) return settings_time_zone_preview(viewing_player, zone)
      settings_time_zone(viewing_player, 0);
    });
    form.divider()
  }

  // Commands
  if (is_admin_mode && (!playerToCheck || playerToCheck.commandPermissionLevel == 0) && !operatorMode) {
    form.label("Commands");
    let label = save_data[player_sd_index].allowed_commands.length > 0 ? "§9" + save_data[player_sd_index].allowed_commands.length + " allowed commands" : "";
    form.button("Allowed commands\n" + label, "textures/ui/chat_send");
    actions.push(() => {
      manage_command(viewing_player, input_sd_index);
    });

    form.button("Allow Chains\n" + (save_data[player_sd_index].allow_chains ? "§aon" : "§coff"), save_data[player_sd_index].allow_chains ? "textures/ui/toggle_on" : "textures/ui/toggle_off");
    actions.push(() => {
      if (!save_data[player_sd_index].allow_chains) {
        save_data[player_sd_index].allow_chains = true;
      } else {
        save_data[player_sd_index].allow_chains = false;
      }
      update_save_data(save_data);
      settings_main(viewing_player, input_sd_index);
    });

    form.divider()
  }



  form.label("Other");

  // Storage
  if (playerIsAdmin(viewing_player)) {
    if (is_admin_mode) {
      form.button("Storage\n§9" + formatBytes(getBytesfromInput(save_data[input_sd_index]).bytes), "textures/ui/storageIconColor");
      actions.push(() => {
        settings_rights_manage_sd(viewing_player, save_data[input_sd_index]);
      });
    } else {
      form.button("Storage\n§9" + formatBytes(world.getDynamicPropertyTotalByteCount()), "textures/ui/storageIconColor");
      actions.push(() => {
        settings_storage(viewing_player, input_sd_index);
      });
    }
  }

  if (server_mode && is_admin_mode && playerIsAdmin(viewing_player) && !playerIsAdmin(input_sd_index)) {
    form.button("§cTransfer ownership", "textures/ui/op");
    actions.push(() => {
      transfer_ownership(viewing_player, input_sd_index);
    });
  }

  if (!is_admin_mode && playerIsAdmin(viewing_player)) {
    // Debug
    if (version_info.release_type == 0 ) {
      form.button("Debug\n", "textures/ui/ui_debug_glyph_color");
      actions.push(() => {
        debug_main(viewing_player);
      });
    }

    // Dictionary
    let latest_online_version = github_data? version_info.release_type === 2 ? github_data.find(r => !r.prerelease)?.tag : github_data[0]?.tag : null
    let update_text = github_data? (compareVersions(latest_online_version, version_info.version) !== 1? "" : "§9" + version_info.version +" -> "+ latest_online_version): Date.now() > (version_info.unix + version_info.update_message_period_unix)? "§9Update available!" : ""

    form.button("About\n"+update_text, "textures/ui/infobulb");
    actions.push(() => {
      is_admin_mode ? settings_rights_data(viewing_player, input_sd_index) : dictionary_about(viewing_player);
    });
  }




  // Back to main menu
  if (canPlayerUseMenu(viewing_player) || is_admin_mode) {
    form.divider()
    form.button("");
    actions.push(() => {
      is_admin_mode
        ? settings_rights_main(viewing_player)
        : main_menu(viewing_player);
    });
  }

  form.show(viewing_player).then((response) => {
    if (response.selection == undefined ) {
      return -1
    }

    if (response.selection !== undefined && actions[response.selection]) {
      actions[response.selection]();
    }
  });
}

/*------------------------
 commands settings menu
-------------------------*/

function manage_command(viewing_player, input_sd_index) {
  let form = new ActionFormData()
  let actions = [];

  let save_data = load_save_data();
  let selected_save_data = save_data[input_sd_index];

  const cmdList = Array.isArray(command_list) ? command_list : [];
  const allowedIdxs = Array.isArray(selected_save_data.allowed_commands) ? selected_save_data.allowed_commands : [];

  let allowedCommands = cmdList
    .map((c, i) => ({ ...c, _index: i }))
    .filter(item => allowedIdxs.includes(item._index));

  let restrictedCommands = cmdList
    .map((c, i) => ({ ...c, _index: i }))
    .filter(item => !allowedIdxs.includes(item._index));

  // Alphabetisch nach name sortieren
  allowedCommands.sort((a, b) => a.name.localeCompare(b.name));
  restrictedCommands.sort((a, b) => a.name.localeCompare(b.name));

  form.title("Manage commands for " + selected_save_data.name);

  // =========================
  // Allowed commands
  // =========================

  let hasAllowed = false;
  if (allowedCommands.length > 0) {
    hasAllowed = true;

    form.body(`§aAllowed commands (${allowedCommands.length}):`)
        .divider();

    allowedCommands.forEach((cmdObj) => {
      form.button(`/${cmdObj.name}`);

      actions.push(() => {
        const sd = load_save_data();
        const saveIndex = sd.findIndex(entry => entry.id === selected_save_data.id);
        if (saveIndex === -1) return;

        sd[saveIndex].allowed_commands = Array.isArray(sd[saveIndex].allowed_commands)
          ? sd[saveIndex].allowed_commands.slice()
          : [];

        const cmdIdx = cmdObj._index;
        const pos = sd[saveIndex].allowed_commands.indexOf(cmdIdx);
        if (pos !== -1) {
          sd[saveIndex].allowed_commands.splice(pos, 1);
        }

        update_save_data(sd);
        selected_save_data.allowed_commands = sd[saveIndex].allowed_commands.slice();
        return manage_command(viewing_player, saveIndex);
      });
    });

    form.divider();
  }

  // =========================
  // Restricted commands
  // =========================

  if (restrictedCommands.length > 0) {
    if (hasAllowed) {
      // Already used body, so use label here
      form.label(`§cRestricted commands (${restrictedCommands.length}):`)
          .divider();
    } else {
      // No allowed commands shown, so restricted gets the body
      form.body(`§cRestricted commands (${restrictedCommands.length}):`)
          .divider();
    }

    restrictedCommands.forEach((cmdObj) => {
      form.button(`/${cmdObj.name}`);

      actions.push(() => {
        const sd = load_save_data();
        const saveIndex = sd.findIndex(entry => entry.id === selected_save_data.id);
        if (saveIndex === -1) return;

        sd[saveIndex].allowed_commands = Array.isArray(sd[saveIndex].allowed_commands)
          ? sd[saveIndex].allowed_commands.slice()
          : [];

        const cmdIdx = cmdObj._index;
        if (!sd[saveIndex].allowed_commands.includes(cmdIdx)) {
          sd[saveIndex].allowed_commands.push(cmdIdx);
        }

        update_save_data(sd);
        selected_save_data.allowed_commands = sd[saveIndex].allowed_commands.slice();
        return manage_command(viewing_player, saveIndex);
      });
    });

    form.divider();
  }

  // =========================
  // Back button
  // =========================

  form.button("");
  actions.push(() => {
    settings_main(viewing_player, input_sd_index);
  });

  // Formular anzeigen und Auswahl ausführen
  form.show(viewing_player).then(response => {
    if (response.selection == undefined ) {
      return -1
    }
    const action = actions[response.selection];
    if (action) action();
  });
}

/*------------------------
 transfer ownership
-------------------------*/

function transfer_ownership(viewing_player, input_sd_index) {
  let form = new MessageFormData();
  let actions = [];

  let save_data = load_save_data();
  let selected_save_data = save_data[input_sd_index];
  let viewing_player_sd_index = save_data.findIndex(e => e.id === viewing_player.id);

  form.title("Transfer ownership");
  form.body("Are you sure you want to transfer ownership of " + viewing_player.name + " to " + selected_save_data.name + "? You will lose access to the SD of this player and all related settings. This action cannot be undone!");

  form.button1("§cYes, transfer ownership");
  actions.push(() => {
      save_data[input_sd_index].has_ownership = true;
      save_data[viewing_player_sd_index].has_ownership = false;
      update_save_data(save_data);
      settings_main(viewing_player);
  });

  form.button2("");
  actions.push(() => {
    settings_main(viewing_player, input_sd_index);
  });

  form.show(viewing_player).then(response => {
    if (response.selection == undefined ) {
      return -1
    }
    const action = actions[response.selection];
    if (action) action();
  });
}


/*------------------------
 storage
-------------------------*/

function settings_storage(player) {
  let form = new ActionFormData();
  let actions = [];

  let save_data = load_save_data();
  form.title("Storage");

  const MAX = 32767; // Maximalgröße eines DynamicProperties-Strings

  // ---------- Save-System ----------
  const saveSize = world.getDynamicPropertyTotalByteCount();

  let chunkCount = 0;
  let maxChunkSize = 0;

  while (true) {
    const part = world.getDynamicProperty(`${BASE_KEY}_${chunkCount}`);
    if (part === undefined || part === null) break;
    const size = part.length;
    if (size > maxChunkSize) maxChunkSize = size;
    chunkCount++;
  }

  // ---------- Storage ----------
  let lastChunk = world.getDynamicProperty(`${BASE_KEY}_${chunkCount - 1}`) || "";

  const used = lastChunk.length;
  const free = Math.max(0, MAX - used);
  const percent = Math.floor((used / MAX) * 100);

  let status = "§aLOW";
  if (percent >= 90) status = "§cALLMOST FULL";
  else if (percent >= 75) status = "§6HIGH";
  else if (percent >= 50) status = "§eMEDIUM";

  form.body("§lSave-System");
  form.label("Used Chunks: " + chunkCount + "\n" +
    "DynamicProperty Size: " + formatBytes(saveSize)
  );

  form.label("§lCurrent Chunk (" + chunkCount + ")");
  form.label("Used: " + formatBytes(used) + " / " + formatBytes(MAX) + " (" + percent + " Percent)\n" +
    "Free: " + formatBytes(free) + "\n" +
    "Status: " + status
  );

  form.label("§7Explanation:\n" +
    "The "+ version_info.name +" uses DynamicProperties to store data. Each property can hold up to "+ formatBytes(MAX) + " of data, corresponding to one chunk."
  );

  form.button("Player allocation", "textures/ui/storageIconColor");
  actions.push(() => {
    settings_storage_allocation(player);
  });

  form.button("Dump storage", "textures/ui/share_microsoft");
  actions.push(() => {
    dump_storage(player);
  });

  form.divider();

  if (version_info.release_type === 0) {
    form.label("Debug");
    form.button("Editor", "textures/ui/editIcon");
    actions.push(() => {
      debug_sd_editor(player, () => debug_main(player), [])
    });

    form.button("§cRemove storage", "textures/ui/icon_trash");
    actions.push(() => {
      delete_save_data();
      return close_world()
    });
    form.divider();
  }

  form.button("");
  actions.push(() => {
    settings_main(player);
  });
  form.show(player).then(response => {
    if (response.selection == undefined ) {
      return -1
    }
    const action = actions[response.selection];
    if (action) action();
  });
}

function dump_storage(player) {
  let form = new ActionFormData();
  let actions = [];

  form.title("Dump storage");
  let save_data = load_save_data();

  // Yes, that's right, you're not dumping the full "save_data". The player names are removed here for data protection reasons
  save_data = save_data.map(entry => {
    const newEntry = { ...entry };
    if ("name" in newEntry) {
      newEntry.name = "";
    }
    if ("version" in newEntry) {
      delete newEntry.version;
    }
    return newEntry;
  });
  // and this adds information about the dump date and version to ensure whether a dump matches a bug
  save_data.push({ dump_unix:Date.now(), server_mode: server_mode, operator_mode: operatorMode, name:version_info.name, version:version_info.version, build:version_info.build });

  if (!server_mode || server_ip !== "") {
    form.body("Recommended way to dump");
    form.button("Dump SD\nvia. server console");
    actions.push(() => {
      console.log(JSON.stringify(save_data))
    });
    form.label("§7If you are the host of the world, make sure that §lSettings -> Creator -> Enable Content Log File / GUI§r§7 is enabled to see the dump in your console.");
  } else {
    form.body("Console dumping is not available in server mode. Please use the alternative way to dump or enable the server-net module.");
  }

  form.label("Alternative ways to dump");
  form.button("Dump SD\nvia. privat chat");
  actions.push(() => {
    player.sendMessage("§l§7[§fSystem§7]§r SD Dump:\n"+JSON.stringify(save_data))
  });

  form.divider();

  form.button("");
  actions.push(() => {
    settings_storage(player);
  });

  form.show(player).then(response => {
    if (response.selection == undefined ) {
      return -1
    }
    const action = actions[response.selection];
    if (action) action();
  });
}

function settings_storage_allocation(player) {
  let form = new ActionFormData();
  let actions = [];
  let save_data = load_save_data();

  let storage_distribution = save_data
  .map((value, index) => {
    return {
      bytes: getBytesfromInput(value).bytes,
      chunks: getBytesfromInput(value).chunks,
      index: index
    };
  })
  .sort((a, b) => b.bytes - a.bytes);

  form.title("Storage - Player allocation");
  form.body("This is the distribution of storage usage among the players & the system.");

  storage_distribution.forEach(entry => {
    const name = entry.index === 0 ? "System" : (save_data[entry.index]?.name || "Unknown");
    form.button(`${name}\n§9${formatBytes(entry.bytes)}`, entry.index === 0 ? "textures/ui/storageIconColor" : "textures/ui/lan_icon");

    actions.push(() => {
      if (entry.index === 0) {
        const info_form = new ActionFormData()
          .title("System storage information")
          .body("The system storage is used to store global data that is not specific to any player.\nThis includes data such as global configurations, and other information that is essential for the functioning of "+ version_info.name +".\nModifying or deleting system storage can lead to unexpected behavior or loss of important data.");

        info_form.button("");
        info_form.show(player).then(response => {
          if (response.selection == undefined ) {
            return -1
          }
          return settings_storage_allocation(player);
        });
      }
      else {
        settings_rights_manage_sd(player, save_data[entry.index], true);
      }
    });
  });

  form.divider();

  form.button("");
  actions.push(() => {
    settings_storage(player);
  });

  form.show(player).then(response => {
    if (response.selection == undefined ) {
      return -1
    }
    const action = actions[response.selection];
    if (action) action();
  });
}

function settings_rights_manage_sd(viewing_player, selected_save_data, came_from_storage = false) {
  let save_data = load_save_data()
  const actions = [];
  const form = new ActionFormData()
    .title(`${selected_save_data.name}'s save data`)
    .body("Select an option!")


  form.button("§dReset save data")
  actions.push(() => {
    handle_data_action(true, false, viewing_player, selected_save_data);
  });

  form.button("§cDelete save data");
  actions.push(() => {
    handle_data_action(false, true, viewing_player, selected_save_data);
  });


  if (version_info.release_type == 0) {
    form.divider()
    form.button("§eOpen in SD Editor");
    actions.push(() => {
      debug_sd_editor(
        viewing_player,
        () => debug_sd_editor(viewing_player, () => debug_main(viewing_player), []),
        [save_data.findIndex(entry => entry.id === selected_save_data.id)]
      );
    });
  }

  form.divider()
  form.button("");
  actions.push(() => {
    came_from_storage? settings_storage_allocation(viewing_player) : settings_main(viewing_player, save_data.findIndex(entry => entry.id === selected_save_data.id));
  });

  form.show(viewing_player).then(response => {
    if (response.selection == undefined ) {
      return -1
    }
    const action = actions[response.selection];
    if (action) action();
  });
}

function handle_data_action(is_reset, is_delete, viewing_player, selected_save_data) {
  const selected_player = world.getAllPlayers().find(p => p.id === selected_save_data.id);
  if (is_reset) {
    delete_player_save_data(selected_save_data);
    create_player_save_data(selected_save_data.id, selected_save_data.name);
    return settings_rights_main(viewing_player, false);
  }

  if (is_delete) {
    if (selected_player) {
      const confirm_form = new MessageFormData()
        .title("Online player information")
        .body(`Are you sure you want to remove ${selected_player.name}'s save data?\nThey must disconnect from the world!`)
        .button2("")
        .button1("§cKick & Delete");

      confirm_form.show(viewing_player).then(confirm => {
        if (confirm.selection == undefined ) {
          return -1
        }
        if (confirm.selection === 0) {
          if (!world.getDimension("overworld").runCommand(`kick ${selected_player.name}`).successCount) {
            const host_form = new MessageFormData()
              .title("Host player information")
              .body(`${selected_player.name} is the host. To delete their data, the server must shut down. This usually takes 5 seconds`)
              .button2("")
              .button1("§cShutdown & Delete");

            host_form.show(viewing_player).then(host => {
              if (host.selection == undefined ) {
                return -1
              }
              if (host.selection === 0) {
                delete_player_save_data(selected_save_data);
                return close_world();
              } else {
                settings_rights_manage_sd(viewing_player, selected_save_data);
              }
            });
          } else {
            delete_player_save_data(selected_save_data);
            settings_rights_main(viewing_player, false);
          }
        } else {
          settings_rights_manage_sd(viewing_player, selected_save_data);
        }
      });

    } else {
      delete_player_save_data(selected_save_data);
      settings_rights_main(viewing_player, false);
    }
  }
}



/*------------------------
 time_zone
-------------------------*/

// Used by history or time-based logs, shows entries grouped by time and paginated if necessary
function multipage_time_menu(player, input, go_back_fn) {
  const save_data = load_save_data();

  input = input
    .map(entry => ({ ...entry, unix: normalizeTimestamp(entry.unix) }))
    .sort((a, b) => b.unix - a.unix);

  const now = Date.now();
  const utcSet = Boolean(save_data[0]?.utc);
  const utcOffsetMinutes = utcSet ? Math.round((save_data[0].utc || 0) * 60) : 0; // default 0 when not set

  // Lokalzeit / Mitternacht-Grenzen
  const nowLocal = new Date(now + utcOffsetMinutes * 60 * 1000);
  const midLocal = new Date(nowLocal.getFullYear(), nowLocal.getMonth(), nowLocal.getDate());
  const todayMid = midLocal.getTime();
  const yestMid = todayMid - 24 * 3600 * 1000;
  const week7Mid = todayMid - 7 * 24 * 3600 * 1000;

  // English month names
  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  // determineGroupLabel akzeptiert jetzt, ob utc gesetzt ist (utcSet).
  // Falls utc nicht gesetzt ist, liefern wir eine neutrale Gruppe ohne Label.
  function determineGroupLabel(entryUnix) {
    if (!utcSet) {
      // Wenn keine UTC-Einstellung vorhanden: keine zeit-basierten Kategorien anzeigen.
      // Wir geben eine neutrale Gruppe zurück, damit Zählungen/Logik weiterhin funktionieren,
      // aber das Label bleibt leer und wird nicht angezeigt.
      return { group: "ungrouped", label: "" };
    }

    entryUnix = normalizeTimestamp(entryUnix);
    const diffSec = Math.floor((now - entryUnix) / 1000);
    const localUnixMs = entryUnix + utcOffsetMinutes * 60 * 1000;
    const date = new Date(localUnixMs);

    const year = date.getFullYear();
    const month = date.getMonth();
    const hour = date.getHours();
    const minute = date.getMinutes();

    let group, label;
    if (diffSec < 3600) {
      label = `${hour}:${String(minute).padStart(2,'0')} o'clock`;
      group = `minute-${hour}-${minute}`;
    } else if (diffSec < 4 * 3600 && localUnixMs >= todayMid) {
      label = `${hour} o'clock`;
      group = `hour-${hour}`;
    } else if (localUnixMs >= todayMid && hour < 4) {
      label = "Today Night";       group = "today-night";
    } else if (localUnixMs >= todayMid && hour < 12) {
      label = "Today Morning";     group = "today-morning";
    } else if (localUnixMs >= todayMid && hour < 16) {
      label = "Today Noon";        group = "today-noon";
    } else if (localUnixMs >= todayMid && hour < 20) {
      label = "Today Afternoon";   group = "today-afternoon";
    } else if (localUnixMs >= todayMid) {
      label = "Today Evening";     group = "today-evening";
    } else if (localUnixMs >= yestMid) {
      label = "Yesterday";         group = "yesterday";
    } else if (localUnixMs >= week7Mid) {
      label = "Last days";         group = "last-days";
    } else if (diffSec < 14 * 24 * 3600) {
      label = "Last week";         group = "last-week";
    } else if (year === nowLocal.getFullYear()) {
      label = monthNames[month];   group = `month-${month}`;
    } else {
      label = String(year);        group = `year-${year}`;
    }

    return { group, label };
  }

  // 1. Durchlauf: Zähle Einträge pro Gruppe (wird später pro Seite genutzt)
  const groupCounts = {};
  input.forEach(buttonEntry => {
    const { group } = determineGroupLabel(buttonEntry.unix);
    groupCounts[group] = (groupCounts[group] || 0) + 1;
  });

  const pages = [];
  let currentPage = [];

  for (let i = 0; i < input.length; i++) {
    currentPage.push(input[i]);

    if (currentPage.length >= 20) {
      // move last 5 entries into a new page
      const moved = currentPage.splice(currentPage.length - 5, 5);
      // push a copy of the current (trimmed) page
      pages.push([...currentPage]);
      // start new currentPage with moved entries
      currentPage = [...moved];
    }
  }
  // push remaining
  if (currentPage.length > 0) pages.push([...currentPage]);

  // Funktion, die eine bestimmte Seite anzeigt
  function showPage(pageIndex) {
    const page = pages[pageIndex];

    // frisches Form für jede Seite
    let f = new ActionFormData();
    f.title("History" + (pages.length >= 2 ? " Page " + (pageIndex + 1) + "/" + pages.length : ""));
    f.body("Select a command!");
    const pageActions = [];

    if (!utcSet && input.length > 9 && playerIsAdmin(player) && pageIndex === 0) {
      f.label("§7Confusing? Enter your time zone!");
      f.button("Time zone", "textures/ui/world_glyph_color_2x");
      pageActions.push(() => settings_time_zone(player, 0));
      f.divider();
    }


    // gleiche Gruppierungslogik wie vorher, aber nur für diese Seite
    let lastGroup = null;
    page.forEach(buttonEntry => {

      const diffSec = Math.floor((now - normalizeTimestamp(buttonEntry.unix)) / 1000);
      const { group, label: baseLabel } = determineGroupLabel(buttonEntry.unix);

      // Labels nur anzeigen, wenn utc gesetzt ist UND es ein nicht-leeres Label gibt
      if (group !== lastGroup && utcSet && baseLabel) {
        let labelToShow = baseLabel;
        const count = groupCounts[group] || 0;
        if (count >= 3) {
          labelToShow = `${baseLabel} (${count})`;
        }
        f.label(labelToShow);
        lastGroup = group;
      }

      f.button(buttonEntry.label, buttonEntry.icon);
      pageActions.push(buttonEntry.actionFn);
    });

    f.divider();

    // Navigation buttons
    if (pageIndex > 0) {
      f.button("Prev");
      pageActions.push(() => showPage(pageIndex - 1));
    }

    if (pageIndex < pages.length - 1) {
      f.button("Next");
      pageActions.push(() => showPage(pageIndex + 1));
    }

    // Always add main menu button at the end
    if (go_back_fn) {
      if (pageIndex > 0 || pageIndex < pages.length - 1) {
        f.divider();
      }

      f.button("");
      pageActions.push(() => go_back_fn(player));
    }

    // Show the form for this page
    f.show(player).then(response => {
      if (response.selection === undefined) return -1;
      const action = pageActions[response.selection];
      if (action) action();
    });
  }

  // Start on the first page
  showPage(0);
}

function settings_time_zone(player, viewing_mode) {
  const form = new ActionFormData();
  const actions = [];
  const save_data = load_save_data();
  const now = new Date();

  let current_utc = save_data[0].utc;

  if (current_utc === undefined) {
    viewing_mode = 3;
  }

  form.body("Select your current time zone!").title("Time zone");

  const current_zone_index = timezone_list.findIndex(z => z.utc === current_utc)
    ?? timezone_list.reduce((closest, zone, i) =>
         Math.abs(zone.utc - current_utc) < Math.abs(timezone_list[closest].utc - current_utc) ? i : closest, 0);


  const renderZoneButton = (zone, index, switch_to_auto) => {
    const offsetMinutes = zone.utc * 60;

    // UTC-Zeit in Minuten seit Mitternacht
    const utcTotalMinutes = now.getUTCHours() * 60 + now.getUTCMinutes();

    // Lokale Zeit berechnen (immer positiv mit Modulo 1440)
    const totalMinutes = (utcTotalMinutes + offsetMinutes + 1440) % 1440;

    // Stunden und Minuten extrahieren
    const localHours = Math.floor(totalMinutes / 60);
    const localMinutes = totalMinutes % 60;

    // Funktion zur zweistelligen Formatierung
    const pad = (n) => n.toString().padStart(2, '0');

    // Zeitformatierung mit Farben je nach Tageszeit
    const getTimeFormat = (minutes) => {
      const timeString = `${pad(localHours)}:${pad(localMinutes)} o'clock`;

      if (minutes < 270) return "§9" + timeString;      // 00:00–04:30
      if (minutes < 360) return "§e" + timeString;      // 04:30–06:00
      if (minutes < 1020) return "§b" + timeString;     // 06:00–17:00
      if (minutes < 1140) return "§e" + timeString;     // 17:00–19:00
      return "§9" + timeString;                         // 19:00–00:00
    };

    // Name oder Kurzform je nach Länge
    const label = (switch_to_auto? "Automatically ("+zone.short+")" : (zone.name.length > 28 ? zone.short : zone.name)) + "\n" + getTimeFormat(totalMinutes);
    const getTimeIcon = (minutes) => {
      if (minutes < 270) return "textures/ui/time_6midnight";        // 00:00–04:30
      if (minutes < 360) return "textures/ui/time_1sunrise";         // 04:30–06:00
      if (minutes < 720) return "textures/ui/time_2day";             // 06:00–12:00
      if (minutes < 1020) return "textures/ui/time_3noon";           // 12:00–17:00
      if (minutes < 1140) return "textures/ui/time_4sunset";         // 17:00–19:00
      return "textures/ui/time_5night";                              // 19:00–00:00
    };

    const icon = index === current_zone_index
      ? "textures/ui/realms_slot_check"
      : getTimeIcon(totalMinutes);

    form.button(label, icon);

    actions.push(() => {
      if (switch_to_auto) {
        settings_time_zone_preview(player, zone, true, viewing_mode);
      } else if (icon === "textures/ui/realms_slot_check") {
        save_data.forEach(entry => {
          if (entry.time_source === 1) {
            entry.time_source = 0;
          }
        });
        save_data[0].utc = undefined;
        update_save_data(save_data);
        settings_time_zone(player);
      } else {
        settings_time_zone_preview(player, zone, false, viewing_mode);
      }
    });
  };




  const navButton = (label, icon, mode) => {
    form.button(label, icon);
    actions.push(() => settings_time_zone(player, mode));
  };

  const autoButton = () => {
    renderZoneButton(timezone_list.find(zone => zone.utc === server_utc), undefined, true)
  };

  const renderZones = (filterFn) => {
    timezone_list.forEach((zone, i) => {
      if (filterFn(i)) renderZoneButton(zone, i);
    });
  };

  if (viewing_mode === 0) {
    let start = Math.max(0, current_zone_index - 2);
    let end = Math.min(timezone_list.length - 1, current_zone_index + 2);

    if (start > 0) navButton("Show previous time zones", "textures/ui/up_arrow", 1);
    form.divider();
    for (let i = start; i <= end; i++) renderZoneButton(timezone_list[i], i);
    form.divider();
    if (end < timezone_list.length - 1) navButton("Show later time zones", "textures/ui/down_arrow", 2);
  } else {
    if (server_utc) {autoButton(); form.divider();}
    if (viewing_mode === 1) navButton("Show less", "textures/ui/down_arrow", 0);
    if (viewing_mode === 2 && current_zone_index !== 0) {navButton("Show previous time zones", "textures/ui/up_arrow", 3); form.divider();}
    if (viewing_mode === 3 && current_utc !== undefined) {navButton("Show less", "textures/ui/down_arrow", 2);}

    renderZones(i =>
      viewing_mode === 3 ||
      (viewing_mode === 1 && i <= current_zone_index) ||
      (viewing_mode === 2 && i >= current_zone_index)
    );

    if (viewing_mode === 1 && current_zone_index !== timezone_list.length) {form.divider(); navButton("Show later time zones", "textures/ui/down_arrow", 3);}
    if (viewing_mode === 2) {navButton("Show less", "textures/ui/up_arrow", 0)}
    if (viewing_mode === 3 && current_utc !== undefined) {navButton("Show less", "textures/ui/up_arrow", 1)}
    if (viewing_mode === 3 && current_utc == undefined) form.divider();
  }

  form.button("");
  actions.push(() => {
    settings_main(player);
  });

  form.show(player).then(res => {
    if (res.selection === undefined) {
      return -1
    } else {
      actions[res.selection]?.();
    }
  });
}

function settings_time_zone_preview (player, zone, switch_to_auto, viewing_mode) {
  const save_data = load_save_data();
  let form = new MessageFormData();
  const now = new Date();

  const offsetMinutes = zone.utc * 60;

  // UTC-Zeit in Minuten seit Mitternacht
  const utcTotalMinutes = now.getUTCHours() * 60 + now.getUTCMinutes();

  // Lokale Zeit berechnen (immer positiv mit Modulo 1440)
  const totalMinutes = (utcTotalMinutes + offsetMinutes + 1440) % 1440;

  // Stunden und Minuten extrahieren
  const localHours = Math.floor(totalMinutes / 60);
  const localMinutes = totalMinutes % 60;

  // Funktion zur zweistelligen Formatierung
  const pad = (n) => n.toString().padStart(2, '0');

  // Zeitformatierung mit Farben je nach Tageszeit
  const getTimeFormat = (minutes) => {
    const timeString = `${pad(localHours)}:${pad(localMinutes)} o'clock`;

    if (minutes < 270) return "§9" + timeString;      // 00:00–04:30
    if (minutes < 360) return "§e" + timeString;      // 04:30–06:00
    if (minutes < 1020) return "§b" + timeString;     // 06:00–17:00
    if (minutes < 1140) return "§e" + timeString;     // 17:00–19:00
    return "§9" + timeString;                         // 19:00–00:00
  };


  form.title("Time zone");
  let subtitle = save_data[0].utc_auto? "Do you want to manually overwrite this time zone?" : "Do you want to use this time zone?"
  form.body(
    "Time zone: " + zone.name +
    "\nUTC: "+ (zone.utc >= 0 ? "+" : "") + zone.utc +
    "\nTime: " + getTimeFormat(totalMinutes) +
    "§r\nLocation: " + zone.location.join(", ") +
    "\n\n"+ subtitle +"\n "
  )

  form.button1(save_data[0].utc_auto? "Choose manually" : "Switch to " +zone.short);
  form.button2("");

  form.show(player).then((response) => {
    if (response.selection == undefined ) {
      return -1
    }
    if (response.selection == 0) {
      // Disable UTC auto
      if (save_data[0].utc_auto) {
        save_data[0].utc_auto = false
        save_data[0].utc = undefined
        update_save_data(save_data);
        return settings_time_zone(player, 0);

      // Enable UTC auto
      } else if (switch_to_auto) {
        save_data[0].utc_auto = true
        save_data[0].utc = server_utc
        update_save_data(save_data);
        return settings_main(player);

      } else {
        // Save manuall UTC
        save_data[0].utc = zone.utc;
        update_save_data(save_data);
        return settings_main(player);
      }
    }
    return save_data[0].utc_auto? settings_main(player) : settings_time_zone(player, viewing_mode)
  });

}

/*------------------------
 Gestures
-------------------------*/

function settings_shortcuts(viewing_player, input_sd_index) {
  const form = new ActionFormData();

  const save_data = load_save_data();
  const player_sd_index = input_sd_index !== undefined ? input_sd_index : save_data.findIndex(e => e.id === viewing_player.id);
  let is_admin_mode = input_sd_index !== undefined;

  const shortcuts = save_data[player_sd_index].gesture;
  let actions = [];


  form.title("Shortcuts" + (is_admin_mode? " - "+ save_data[player_sd_index].name : ""));
  form.body("Commands")

  // Quick run
  form.button("Quick run\n" + (save_data[player_sd_index].quick_run ? "§aon" : "§coff"), (save_data[player_sd_index].quick_run ? "textures/ui/sprint_pressed" : "textures/ui/sprint"));
  actions.push(() => {
    if (!save_data[player_sd_index].quick_run) {
      save_data[player_sd_index].quick_run = true;
    } else {
      save_data[player_sd_index].quick_run = false;
    }
    update_save_data(save_data);
    settings_shortcuts(viewing_player, input_sd_index);
  });
  form.divider()

  // Menu Shortcuts
  form.label("Menu opening shortcuts")

  if (system_privileges == 0) {
    form.label("§7Menu shortcuts are courently unavailable.");
  } else {
    Object.keys(shortcuts).forEach(command => {
      const isOn = shortcuts[command];
      form.button(command + "\n" + (isOn ? "§aon" : "§coff"), isOn ? "textures/ui/toggle_on" : "textures/ui/toggle_off");
      actions.push(() => {
        shortcuts[command] = !shortcuts[command];
        update_save_data(save_data);
        settings_shortcuts(viewing_player, input_sd_index);
      });
    });
  }

  form.divider()
  form.button("");
  actions.push(() => {
    settings_main(viewing_player, input_sd_index);
  });

  form.show(viewing_player).then(response => {
    if (response.selection === undefined) {
      return -1
    }
    const sel = response.selection;
    if (typeof actions[sel] === "function") actions[sel]();
  });
}


/*------------------------
 Dictionary
-------------------------*/

function dictionary_about(player, show_ip = false) {
  let form = new ActionFormData()
  let actions = []

  let save_data = load_save_data()
  let player_sd_index = save_data.findIndex(entry => entry.id === player.id);

  let latest_online_version = github_data? version_info.release_type === 2 ? github_data.find(r => !r.prerelease)?.tag : github_data[0]?.tag : null

  let build_date = convertUnixToDate(version_info.unix, save_data[0].utc || 0);
  form.title("About")

  form.body("§lGeneral")
  form.label(
    "Name: " + version_info.name+ "\n"+
    "UUID: "+ version_info.uuid+ "\n"+
    "Operator Mode: " + (operatorMode? "§aYes" : "§cNo")
  )

  form.label("§lEnvironment")
  form.label(
    (show_ip? "Server IP: "+server_ip+"\n" : "")+
    (show_ip? "" : "Platform: " + (server_mode? "Dedicated" : world.getPlayers().find(p => p.commandPermissionLevel >= 3)?.clientSystemInfo.platformType || "Client")) + "\n"+
    "Memory: " + getMemoryText(system.serverSystemInfo.memoryTier)
  )

  form.label("§lVersion")
  form.label(
    "Version: " + version_info.version + "\n" +
    "Build: " + version_info.build + "\n" +
    "Release type: " + ["dev", "preview", "stable"][version_info.release_type] + "\n" +
    "Build date: " + (
      save_data[0].utc === undefined
        ? getRelativeTime(Date.now() - version_info.unix, player) + " ago\n\n§7Note: Set the time zone to see detailed information"
        : `${build_date.day}.${build_date.month}.${build_date.year} ${build_date.hours}:${build_date.minutes}:${build_date.seconds} (UTC${build_date.utcOffset >= 0 ? '+' : ''}${build_date.utcOffset})`
    ) + "\n" +
    "Status: " + (github_data? (compareVersions(latest_online_version, version_info.version) !== 1? "§aLatest version" : "§6Update available ("+latest_online_version+")!"): Date.now() > (version_info.unix + version_info.update_message_period_unix)? "§6MAYBE an Update available!" : "§cFailed to fetch!")
  );

  form.label("§7© "+ (build_date.year > 2025 ? "2025 - " + build_date.year : build_date.year ) + " TheFelixLive. Licensed under the MIT License.")

  if (!show_ip && server_ip && player.commandPermissionLevel >= 3) {
    form.button("Show Public IP");
    actions.push(() => {
      dictionary_about(player, true)
    });
    form.divider()
  }

  if (version_info.changelog.new_features.length > 0 || version_info.changelog.general_changes.length > 0 || version_info.changelog.bug_fixes.length > 0) {
    form.button("§9Changelog"+(github_data?"s":""));
    actions.push(() => {
      github_data? dictionary_about_changelog(player) : dictionary_about_changelog_legacy(player, build_date)
    });
  }

  form.button("§3Contact");
  actions.push(() => {
    dictionary_contact(player, build_date)
  });

  form.button("Storage usage");
  actions.push(() => {
    settings_storage_allocation(player)
  });

  form.divider()
  form.button("");
  actions.push(() => {
    return settings_main(player);
  });

  form.show(player).then((response) => {
    if (response.selection == undefined ) {
      return -1
    }
    if (response.selection !== undefined && actions[response.selection]) {
      actions[response.selection]();
    }
  });
}

function dictionary_about_changelog(player) {
  const form = new ActionFormData();
  let save_data = load_save_data()
  const actions = [];

  // ---- 1) Hilfsdaten ----------------------------------------------------
  const installed   = version_info.version;        // z.B. "v1.5.0"
  const buildName   = version_info.build;          // z.B. "B123"
  const installDate = version_info.unix;           // z.B. "1700000000"

  // ---- 3) Neue Instanzen finden -----------------------------------------
  const latest_stable = github_data.find(r => !r.prerelease);
  let   latest_beta   = github_data.find(r => r.prerelease);

  // ---- 4) Beta-Versions-Filter (nach release_type) --------------------
  if (version_info.release_type === 2) { // „nur Beta zulassen“
    if (latest_beta && latest_stable) {
      const isBetaNewer = compareVersions(latest_beta.name, latest_stable.name) > 0;
      if (isBetaNewer) {
        // Nur die neueste Beta behalten
        github_data = github_data.filter(r => r === latest_beta || !r.prerelease);
      } else {
        // Stable neuer oder gleich → Betas entfernen
        github_data = github_data.filter(r => !r.prerelease);
        latest_beta = undefined;
      }
    } else {
      // Sicherheit: Alle Betas entfernen
      github_data = github_data.filter(r => !r.prerelease);
      latest_beta = undefined;
    }
  } else {
    // Wenn Stable neuer als Beta ist → Beta Label unterdrücken
    if (latest_beta && latest_stable) {
      const isStableNewer = compareVersions(latest_stable.name, latest_beta.name) > 0;
      if (isStableNewer) {
        latest_beta = undefined; // Kein Beta-Label später anzeigen
      }
    }
  }


  // ---- 5) Alle Einträge, inkl. eventuell fehlenden Installations‑Eintrag --
  const allData = [...github_data];

  // Prüfen, ob die installierte Version überhaupt in der Liste vorkommt
  const isInstalledListed = github_data.some(r => r.name === installed);
  if (!isInstalledListed) {
    // Dummy‑Objekt – so sieht es aus wie ein reguläres GitHub‑Release
    allData.push({
      name:        installed,
      published_at: installDate,
      prerelease:  false,          // wichtig, damit das Label nicht „(latest beta)“ bekommt
    });
  }

  // Sortieren (nach Version)
  allData.sort((a, b) => compareVersions(b.name, a.name));

  // ---- 6) UI bauen ----------------------------------------------------
  form.title("About");
  form.body("Select a version");

  allData.forEach(r => {
    const publishedMs = (typeof r.published_at === 'number' && r.published_at < 1e12)
      ? r.published_at * 1000
      : new Date(r.published_at).getTime();

    let label;
    let build_date = convertUnixToDate(publishedMs, save_data[0].utc || 0);

    let build_text = (
      save_data[0].utc === undefined
        ? getRelativeTime(Date.now() - publishedMs) + " ago"
        : `${build_date.day}.${build_date.month}.${build_date.year}`
    );

    if (r === latest_beta && r.name === installed) {
      label = `${r.name} (${buildName})\n${build_text} §9(latest beta)`;
    } else {
      label = `${r.name}\n${build_text}`;

      if (r === latest_stable) {
        label += ' §a(latest version)';
      } else if (r === latest_beta) {
        label += ' §9(latest beta)';
      } else if (r.name === installed) {
        label += ' §6(installed version)';
      }
    }

    form.button(label);

    actions.push(() => {
      dictionary_about_changelog_view(player, r);
    });
  });


  // ---- 7) Footer‑Button -------------------------------------------------
  form.divider();
  form.button("");
  actions.push(() => {
    dictionary_about(player);
  });

  // ---- 8) Anzeigen -----------------------------------------------------
  form.show(player).then(response => {
    if (response.selection === undefined) return;
    if (actions[response.selection]) actions[response.selection]();
  });
}

function dictionary_about_changelog_view(player, version) {
  let save_data = load_save_data()
  const publishedMs = typeof version.published_at === 'number' && version.published_at < 1e12
    ? version.published_at * 1000
    : new Date(version.published_at).getTime();

  let build_date = convertUnixToDate(publishedMs, save_data[0].utc || 0);

  if (version.name == version_info.version) return dictionary_about_changelog_legacy(player, build_date)
  const form = new ActionFormData().title("Changelog - " + version.name);

  // TODO: Markdown support
  form.body(markdownToMinecraft(version.body))


  const dateStr = `${build_date.day}.${build_date.month}.${build_date.year}`;
  const relative = getRelativeTime(Date.now() - publishedMs);
  form.label(`§7As of ${dateStr} (${relative} ago)`);
  form.button("");

  form.show(player).then(res => {
    if (res.selection === 0) dictionary_about_changelog(player);
  });
}

function dictionary_about_changelog_legacy(player, build_date) {
  const { new_features, general_changes, bug_fixes } = version_info.changelog;
  const { unix } = version_info
  const sections = [
    { title: "§l§bNew Features§r", items: new_features },
    { title: "§l§aGeneral Changes§r", items: general_changes },
    { title: "§l§cBug Fixes§r", items: bug_fixes }
  ];

  const form = new ActionFormData().title("Changelog - " + version_info.version);

  let bodySet = false;
  for (let i = 0; i < sections.length; i++) {
    const { title, items } = sections[i];
    if (items.length === 0) continue;

    const content = title + "\n\n" + items.map(i => `- ${i}`).join("\n\n");

    if (!bodySet) {
      form.body(content);
      bodySet = true;
    } else {
      form.label(content);
    }

    // Add divider if there's at least one more section with items
    if (sections.slice(i + 1).some(s => s.items.length > 0)) {
      form.divider();
    }
  }

  const dateStr = `${build_date.day}.${build_date.month}.${build_date.year}`;
  const relative = getRelativeTime(Date.now() - unix);
  form.label(`§7As of ${dateStr} (${relative} ago)`);
  form.button("");

  form.show(player).then(res => {
    if (res.selection === 0) github_data? dictionary_about_changelog(player) : dictionary_about(player);
  });
}

function dictionary_contact(player) {
  let form = new ActionFormData()

  let actions = []
  form.title("Contact")
  form.body("If you need want to report a bug, need help, or have suggestions to improvements to the project, you can reach me via these platforms:\n");

  for (const entry of links) {
    if (entry !== links[0]) form.divider()
    form.label(`${entry.name}\n${entry.link}`);
  }

  form.divider()
  form.button("");
  actions.push(() => {
    dictionary_about(player)
  });

  form.show(player).then((response) => {
    if (response.selection == undefined ) {
      return -1
    }
    if (response.selection !== undefined && actions[response.selection]) {
      actions[response.selection]();
    }
  });
}


/*------------------------
 Debug
-------------------------*/

function debug_main(player) {
  let form = new ActionFormData()
  let actions = []
  let save_data = load_save_data()
  let player_sd_index = save_data.findIndex(entry => entry.id === player.id);

  form.title("Debug menu");
  form.body("This is for testing purposes only!");


  form.button("§e\"save_data\" Editor");
  actions.push(() => {
    debug_sd_editor(player, () => debug_main(player), [])
  });

  form.button("§cRemove \"save_data\"");
  actions.push(() => {
    delete_save_data();
    return close_world()
  });


  form.button("§cClose Server");
  actions.push(() => {
    return close_world()
  });

  form.button("§9Test command fixer");
  actions.push(() => {
    return test_fix(player)
  })

  form.button("§cClear history");
  actions.push(() => {
    save_data[player_sd_index].command_history = [];

    update_save_data(save_data);
    return debug_main(player);
  })

  form.button("Test history");
  actions.push(() => {
    command_list.forEach(cmd => {
      save_data[player_sd_index].command_history.push({
        unix: Date.now(),
        command: "/" + cmd.name,
        successful: true,
        hidden: false
      });
    });


    update_save_data(save_data);
    return debug_main(player);
  });


  form.button("CustomForm demo");
  actions.push(() => {
    return custom_form_demo(player)
  });


  form.divider()
  form.button("");
  actions.push(() => {
    return settings_main(player)
  });


  form.show(player).then((response) => {
    if (response.selection == undefined ) {
    }
    if (response.selection !== undefined && actions[response.selection]) {
      actions[response.selection]();
    }
  });
}

function custom_form_demo(player) {
  const dropdownValue = new ObservableNumber(
      1,
      { clientWritable: true }
  );

  const sliderValue = new ObservableNumber(
      50,
      { clientWritable: true }
  );

  const textValue = new ObservableString(
      "Hello World",
      { clientWritable: true }
  );

  const toggleValue = new ObservableBoolean(
      true,
      { clientWritable: true }
  );

  const form = new CustomForm(player, "DDUI Demo");

  form.button(
      "Test",
      async () => {
        form.close();
        system.run(() => {
          MessageBox_test(player);
        });
      },
      {
          disabled: false,
          tooltip: "Test",
          visible: true
      }
  );

  form.spacer();

  form.toggle(
      "Test",
      toggleValue,
      {
          description: "Hello World",
          disabled: true
      }
  );

  form.spacer();

  form.label("Test");

  form.spacer();

  form.textField(
      "Textfeld",
      textValue,
      {
          description: "Schreibe etwas"
      }
  );

  form.slider(
      "Slider",
      sliderValue,
      0,
      100,
      {
          description: "Wähle einen Wert"
      }
  );



  form.dropdown(
      "Test",
      dropdownValue,
      [
          {
              label: "Test",
              description: "Test",
              value: 0
          },
          {
              label: "Hello",
              description: "World",
              value: 1
          }
      ],
      {
          disabled: false,
          description: "Test",
          visible: true
      }
  );

  form.divider();

  form.button(
      "Reload",
      () => {
        form.close();
        system.run(() => {
          custom_form_demo(player);
        });
      }
  );

  form.show();
}

function MessageBox_test(player) {
    const form = new MessageBox(player, "title");

    form.body("body");

    form.button1("button1");

    form.show().then((res) => {
        if (res.selection === undefined) {
            console.log("Closed");
            return;
        }

        if (res.selection === 1) {
            console.log("Yes");
        } else if (res.selection === 2) {
            console.log("No");
        }
    });
}

function test_fix(player) {
  let form = new ModalFormData()
    .title("Command fixer test")
    .textField("Enter a command to fix", "e.g. /give @s diamond_sword 1")
  form.show(player).then(res => {
    if (res.formValues == undefined) {
      return -1
    }
    const input = res.formValues[0];
    print("Input: "+ input);
    print("Output: "+ JSON.stringify(correctCommand(input)));
  });
}

function debug_sd_editor(player, onBack, path = []) {
  let actions = [];
  const save_data = load_save_data();
  let player_sd_index = save_data.findIndex(entry => entry.id === player.id);

  let current = save_data;
  for (const key of path) {
    current = current[key];
  }

  const returnToCurrentMenu = () => debug_sd_editor(player, onBack, path);

  // === A) Array-Branch ===
  if (path.length === 0 && Array.isArray(current)) {
    const form = new ActionFormData()
      .title("SD notepad v.2.0")
      .body(`Path: §7save_data/`);

    current.forEach((entry, idx) => {
      const label = idx === 0
        ? `Server [${idx}]`
        : `${entry.name ?? `player ${idx}`} [${entry.id ?? idx}]`;
      form.button(label, "textures/ui/storageIconColor");

      // Push action for this entry
      actions.push(() => {
        debug_sd_editor(
          player,
          returnToCurrentMenu,
          [...path, idx]
        );
      });
    });

    form.button("§aAdd player", "textures/ui/color_plus");
    actions.push(() => {
      return debug_add_fake_player(player);
    });

    form.divider()
    form.button(""); // Back (no action needed here)

    form.show(player).then(res => {
      if (res.selection == undefined) {
        return -1
      }
      if (res.selection === current.length + 1) { // Back button index
        return onBack();
      }

      // Execute selected action
      actions[res.selection]?.();
    });


  // === B) Object-Branch ===
  } else if (current && typeof current === "object") {
    const keys = Object.keys(current);

    const displaySegments = path.map((seg, idx) => {
      if (idx === 0) {
        return seg === 0 ? "server" : save_data[Number(seg)]?.id ?? seg;
      }
      return seg;
    });
    const displayPath = `save_data/${displaySegments.join("/")}`;
    const form = new ActionFormData()
      .title("SD notepad v.2.0")
      .body(`Path: §7${displayPath}`);

    // Dateneinträge als Buttons
    keys.forEach(key => {
      const val = current[key];
      if (typeof val === "boolean") {
        form.button(
          `${key}\n${val ? "§aON" : "§cOFF"}`,
          val ? "textures/ui/toggle_on" : "textures/ui/toggle_off"
        );
      } else if (typeof val === "number") {
        form.button(`${key}: ${val}§r\n§9type: number`, "textures/ui/editIcon");
      } else if (typeof val === "string") {
        form.button(`${key}: ${val}§r\n§9type: string`, "textures/ui/editIcon");
      } else {
        form.button(`${key}`, "textures/ui/storageIconColor");
      }

      // Aktionen pushen
      actions.push(() => {
        const nextPath = [...path, key];
        const fresh = load_save_data();
        let target = fresh;
        for (const k of nextPath.slice(0, -1)) {
          target = target[k];
        }
        const val = target[key];

        if (typeof val === "boolean") {
          target[key] = !val;
          update_save_data(fresh);
          returnToCurrentMenu();
        } else if (typeof val === "number" || typeof val === "string") {
          openTextEditor(
            player,
            String(val),
            nextPath,
            newText => {
              target[key] = newText;
              update_save_data(fresh);
              returnToCurrentMenu();
            },
            () => {
              return -1
            }
          );
        } else {
          debug_sd_editor(player, returnToCurrentMenu, nextPath);
        }
      });
    });
    // Optional: Remove player
    if (path.length === 1 && path[0] !== 0) {
      form.button("§cRemove player", "textures/blocks/barrier");
      actions.push(() => {
        return handle_data_action(false, true, player, save_data[Number(path[0])], save_data[player_sd_index].lang);
      });
    }

    // Zurück-Button
    form.divider()
    form.button("");
    actions.push(() => onBack());

    form.show(player).then(res => {
      if (res.selection == undefined) {
        return -1
      }

      // Aktion ausführen
      const action = actions[res.selection];
      if (action) {
        action();
      }
    });

  }
}

function openTextEditor(player, current, path, onSave, onCancel) {
  let save_data = load_save_data()
  const displaySegments = path.map((seg, idx) => {
    if (idx === 0) {
      return seg === 0 ? "server" : save_data[Number(seg)]?.id ?? seg;
    }
    return seg;
  });

  const fullPath = `save_data/${displaySegments.join("/")}`;
  const form = new ModalFormData();
  form.title("Edit Text");
  form.textField(`Path: ${fullPath} > Value:`, "Enter text...", {defaultValue: current});
  form.submitButton("Save");

  form.show(player).then(res => {
    if (res.canceled) {
      return onCancel();
    }

    let input = res.formValues[0];
    // Wenn der String nur aus Ziffern besteht, in Zahl umwandeln
    if (/^\d+$/.test(input)) {
      input = Number(input);
    }

    onSave(input);
  });
}

function debug_add_fake_player(player) {
  let form = new ModalFormData();
  let UniqueId = ""+generateEntityUniqueId()

  form.textField("player name", player.name);
  form.textField("player id", UniqueId);
  form.submitButton("Add player")

  form.show(player).then((response) => {
    if (response.canceled) {
      return -1
    }

    let name = response.formValues[0]
    let id = response.formValues[1]

    if (id == "") {
      id = UniqueId
    }

    if (name == "") {
      name = player.name
    }

    create_player_save_data(id, name)
    return debug_sd_editor(player, () => debug_main(player), [])
  });
}

function generateEntityUniqueId() {
  // Erzeuge eine zufällige 64-Bit Zahl als BigInt
  // Wir erzeugen 2 * 32-Bit Teile und setzen sie zusammen
  const high = BigInt(Math.floor(Math.random() * 0x100000000)); // obere 32 Bit
  const low = BigInt(Math.floor(Math.random() * 0x100000000));  // untere 32 Bit

  let id = (high << 32n) | low;

  // Umwandlung in signed 64-Bit Bereich (zweier Komplement)
  // Wenn das höchste Bit (63.) gesetzt ist, wird die Zahl negativ
  if (id & (1n << 63n)) {
    id = id - (1n << 64n);
  }

  return id;
}



/*------------------------
 rights
-------------------------*/

function settings_rights_main(player) {
  let form = new ActionFormData();
  let save_data = load_save_data();

  const players = world.getAllPlayers();
  const playerMap = new Map(players.map(p => [p.id, p]));

  // sd_index hinzufügen (Original-Index behalten)
  let newList = save_data.slice(1).map((entry, index) => ({
    ...entry,
    sd_index: index + 1 // wegen slice(1)
  }));

  const now = Date.now();

  function getIconforPermissionLevel(level) {
    if (level === 0) return "textures/ui/permissions_member_star"
    if (level === 2) return "textures/ui/op"
  }

  // Kategorisiere Online-Spieler nach commandPermissionLevel
  const permissionLevels = Object.keys(CommandPermissionLevel)
    .map(key => {
      const index = Number(key); // 0,1,2,...
      const name = CommandPermissionLevel[index]; // Name vom Index
      return {
        name,
        icon: getIconforPermissionLevel(index),
        players: []
      };
    });

  let offlinePlayers = [];

  newList.forEach(entry => {
    const isOnline = playerMap.has(entry.id);

    if (isOnline) {
      const onlineplayer = playerMap.get(entry.id);
      const permLevel = onlineplayer?.commandPermissionLevel || 0;

      if (permissionLevels[permLevel]) {
        permissionLevels[permLevel].players.push(entry);
      }
    } else {
      offlinePlayers.push(entry);
    }
  });

  // Sortiere innerhalb jeder Kategorie A-Z
  Object.values(permissionLevels).forEach(categorie => {
    categorie.players.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
  });

  // Sortiere offline Spieler nach zuletzt online
  offlinePlayers.sort((a, b) => getLastLogin(b) - getLastLogin(a));

  form.title("Permissions");

  let buttonMap = [];

  let firstBodyUsed = false;

  [...permissionLevels].reverse().forEach(levelInfo => {
    if (levelInfo.players.length > 0) {
      if (!firstBodyUsed) {
        form.body(levelInfo.name + " (" + levelInfo.players.length + ")");
        firstBodyUsed = true;
      } else {
        form.label(levelInfo.name + " (" + levelInfo.players.length + ")");
      }

      levelInfo.players.forEach(entry => {
        const lastLogin = getLastLogin(entry);
        let displayName = entry.name;
        displayName += "\n§2(for " + (lastLogin ? getRelativeTime(now - lastLogin) : "unknown") + ")§r";

        form.button(displayName, levelInfo.icon);
        buttonMap.push(entry.sd_index);
      });

      form.divider();
    }
  });

  // Zeige Offline-Spieler
  if (offlinePlayers.length > 0) {
    form.label("Offline players (" + offlinePlayers.length + ")");

    offlinePlayers.forEach(entry => {
      const lastLogout = getLastLogout(entry);
      let displayName = entry.name;
      displayName += "\n§o(since " + (lastLogout ? getRelativeTime(now - lastLogout) : "unknown") + ")§r";

      form.button(displayName, "textures/ui/lan_icon");
      buttonMap.push(entry.sd_index);
    });

    form.divider();
  }

  // Zurück Button
  form.button("");
  buttonMap.push("back");

  form.show(player).then((response) => {
    if (response.selection === undefined) return -1;

    const selected = buttonMap[response.selection];

    if (selected === "back") {
      return settings_main(player);
    } else {
      return settings_main(player, selected);
    }
  });
}

function settings_rights_data(viewing_player, input_sd_index) {
  let save_data = load_save_data();
  let selected_save_data = save_data[input_sd_index];
  let selected_player = world.getAllPlayers().find(player => player.id == selected_save_data.id);

  let form = new ActionFormData();
  form.title(selected_save_data.name + "'s profile");

  // === GENERAL ===
  form.body("§lGeneral");
  form.label(
    "Name: " + selected_save_data.name + "\n" +
    "ID: " + selected_save_data.id
  );

  if (selected_player) {
    const lastLogin = getLastLogin(selected_save_data);
    form.label(
      "Online: §ayes §7(for " +
        (lastLogin ? getRelativeTime(Date.now() - lastLogin) : "unknown") +
        ")§r\n" +
        "Command Permission: " + CommandPermissionLevel[selected_player.commandPermissionLevel]
      );
    } else {
      const lastLogout = getLastLogout(selected_save_data);
      form.label(
        "Online: §cno §7(last seen " +
        (lastLogout ? getRelativeTime(Date.now() - lastLogout) : "unknown") +
        " ago)§r"
      );
    }

  // === CLIENT ===
  if (selected_player) {

    let memory_text = getMemoryText(selected_player.clientSystemInfo.memoryTier);

    let input_text = "";
    switch (selected_player.inputInfo.lastInputModeUsed) {
      case "Gamepad": input_text = "Gamepad"; break;
      case "KeyboardAndMouse": input_text = "Mouse & Keyboard"; break;
      case "MotionController": input_text = "Motion controller"; break;
      case "Touch": input_text = "Touch"; break;
    }

    form.label("§lClient");
    form.label(
      "Platform: " + selected_player.clientSystemInfo.platformType + "\n" +
      "Graphics: " + selected_player.graphicsMode + "\n" +
      "Memory: " + memory_text + "\n" +
      "Maximum render distance: " + selected_player.clientSystemInfo.maxRenderDistance + "\n" +
      "Input: " + input_text
    );
  }

  // === BUTTONS ===
  let actions = [];

  form.divider();
  form.button("");
  actions.push(() => {
    settings_main(viewing_player, input_sd_index);
  });

  form.show(viewing_player).then((response) => {
    if (response.selection == undefined) return -1;
    if (actions[response.selection]) {
      actions[response.selection]();
    }
  });
}


/*------------------------
 Update loop
-------------------------*/

function close_world() {
  world.sendMessage("§l§7[§fSystem§7]§r Closing World! Auto Save is disabled! Please wait...");
  while (true) {} // Infinite loop to effectively "close" the world via. the watchdog timer, which will trigger after a few seconds and stop the server. This is necessary because there is no method to programmatically stop the server.
}

function update_loop() {
  gesture_nod();
  gesture_jump();
  gesture_emote();
}

system.runInterval(() => update_loop(), 1);