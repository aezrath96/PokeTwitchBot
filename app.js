require('dotenv').config();
const tmi = require("tmi.js");
var mysql = require("mysql");
const fs = require("fs");
var connection = mysql.createConnection({
  host: "localhost",
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

connection.connect();

const client = new tmi.Client({
  options: { debug: true },
  identity: {
    username: process.env.TWITCH_BOT_CHANNEL,
    password: process.env.TWITCH_OAUTH_TOKEN,
  },
  channels: [process.env.TWITCH_CHANNEL_NAME],
});

client.connect();

client.on("message", (channel, tags, message, self) => {
  // block bot self responding
  if (self || !message.startsWith("!")) return;

  // define arguments
  const args = message.slice(1).split(" ");
  const command = args.shift().toLowerCase();

  // check if mod or streamer
  const badges = tags.badges || {};
  const isBroadcaster = badges.broadcaster;
  const isMod = badges.moderator;
  const isModUp = isBroadcaster || isMod;

  // functions

  // Spawn pokemon from database using !spawn
  function SpawnPokemon() {
    connection.query(
      'SELECT Pokemon AS spawn FROM pokemon WHERE Id="1"',
      function (error, results, fields) {
        if (error) throw error;
        var spawn = results[0].spawn;
        client.say(
          channel,
          `A wild ` + spawn + ` has appeared. Type: !catch to catch it!`
        );
      }
    );
  }

  // Show Pokemon list from database

  function PokemonList() {
    connection.query(
      'SELECT GROUP_CONCAT(Pokemon SEPARATOR ", ") AS spawn FROM pokemonlist WHERE User="' +
        tags.username +
        '" GROUP BY User',
      function (error, result, fields) {
        if (error) throw error;
        if (result.length <= "0") {
          client.say(channel, `You don't have any pokemon.`);
        } else {
          res = result[0].spawn;
          client.say(channel, `Your pokemon: ` + res);
        }
      }
    );
  }

  // change pokemon to Not Set in database so people can't catch pokemon when none is spawned

  function ChangePokemonSet() {
    var sql = "UPDATE pokemon SET Pokemon = 'Not Set' WHERE Id = '1'";
    connection.query(sql, function (err, result) {
      if (err) throw err;
    });
  }

  // Choose random pokemon from array to spawn and add it to the database

  function ChangePokemon() {
    var things = [
      "Pikachu",
      "Charmander",
      "Squirtle",
      "Jigglypuff",
      "Pikachu",
      "Meowth",
      "Mewtwo",
      "Psyduck",
      "Pichu",
      "Raichu",
      "Charmeleon",
      "Charmander",
      "Onix",
      "Snorlax",
      "Machamp",
      "Wigglytuff",
      "Eevee",
      "Jolteon",
      "Bulbasaur",
      "Ivysaur",
      "Venusaur",
      "Wartortle",
      "Blastoise",
      "Caterpie",
      "Metapod",
      "Butterfree",
      "Weedle",
      "Kakuna",
      "Beedrill",
      "Pidgey",
      "Pidgeotto",
      "Pidgeot",
      "Rattata",
      "Raticate",
      "Spearow",
      "Fearow",
      "Ekans",
      "Arbok",
      "Sandshrew",
      "Sandslash",
      "Nidoran",
      "Nidorina",
      "Nidoqueen",
      "Nidorino",
      "Nidoking",
      "Clefairy",
      "Clefable",
      "Vulpix",
      "Ninetales",
      "Zubat",
      "Golbat",
      "Oddish",
      "Gloom",
      "Vileplume",
      "Paras",
      "Parasect",
      "Venonat",
      "Venomoth",
      "Diglett",
      "Dugtrio",
      "Persian",
      "Golduck",
      "Mankey",
      "Primeape",
      "Growlithe",
      "Arcanine",
      "Poliwag",
      "Poliwhirl",
      "Poliwrath",
      "Abra",
      "Kadabra",
      "Alakazam",
      "Machop",
      "Machoke",
      "Bellsprout",
      "Weepinbell",
      "Victreebel",
      "Tentacool",
      "Geodude",
      "Graveler",
      "Golem",
      "Ponyta",
      "Rapidash",
      "Slowpoke",
      "Slowbro",
      "Magnemite",
      "Magneton",
      "Farfetch`d",
      "Doduo",
      "Dodrio",
      "Seel",
      "Dewgong",
      "Grimer",
      "Muk",
      "Shellder",
      "Cloyster",
      "Gastly",
      "Haunter",
      "Gengar",
      "Drowzee",
      "Hypno",
      "Krabby",
      "Kingler",
      "Voltorb",
      "Electrode",
      "Exeggcute",
      "Exeggutor",
      "Cubone",
      "Marowak",
      "Hitmonlee",
      "Hitmonchan",
      "Lickitung",
      "Koffing",
      "Weezing",
      "Rhyhorn",
      "Rhydon",
      "Chansey",
      "Tangela",
      "Kangaskhan",
      "Horsea",
      "Seadra",
      "Goldeen",
      "Seaking",
      "Staryu",
      "Starmie",
      "Mr. Mime",
      "Scyther",
      "Jynx",
      "Electabuzz",
      "Magmar",
      "Pinsir",
      "Tauros",
      "Magikarp",
      "Gyarados",
      "Lapras",
      "Ditto",
      "Vaporeon",
      "Flareon",
      "Porygon",
      "Omanyte",
      "Omastar",
      "Kabuto",
      "Kabutops",
      "Aerodactyl",
      "Articuno",
      "Zapdos",
      "Moltres",
      "Dratini",
      "Dragonair",
      "Dragonite",
      "Mew",
      "Chikorita",
      "Bayleef",
      "Meganium",
      "Cyndaquil",
      "Quilava",
      "Typhlosion",
      "Totodile",
      "Croconaw",
      "Feraligatr",
      "Sentret",
      "Furret",
      "Hoothoot",
      "Noctowl",
      "Ladyba",
      "Ledian",
      "Spinarak",
      "Ariados",
      "Crobat",
      "Chinchou",
      "Lanturn",
      "Cleffa",
      "Igglybuff",
      "Togepi",
      "Togetic",
      "Natu",
      "Xatu",
      "Mareep",
      "Flaaffy",
      "Ampharos",
      "Bellossom",
      "Marill",
      "Azumarill",
      "Sudowoodo",
      "Politoed",
      "Hoppip",
      "Skiploom",
      "Jumpluff",
      "Aipom",
      "Sunkern",
      "Sunflora",
      "Yanma",
      "Wooper",
      "Quagsire",
      "Espeon",
      "Umbreon",
      "Murkrow",
      "Slowking",
      "Misdreavus",
      "Unown",
      "Wobbuffet",
      "Girafarig",
      "Pineco",
      "Forretress",
      "Dunsparce",
      "Gligar",
      "Steelix",
      "Snubbull",
      "Granbull",
      "Qwilfish",
      "Scizor",
      "Shuckle",
      "Heracross",
      "Sneasel",
      "Teddiursa",
      "Ursaring",
      "Slugma",
      "Magcargo",
      "Swinub",
      "Piloswine",
      "Corsola",
      "Remoraid",
      "Octillery",
      "Delibird",
      "Mantine",
      "Skarmory",
      "Houndour",
      "Houndoom",
      "Kingdra",
      "Phanpy",
      "Donphan",
      "Porygon2",
      "Stantler",
      "Smeargle",
      "Tyrogue",
      "Hitmontop",
      "Smoochum",
      "Elekid",
      "Magby",
      "Miltank",
      "Blissey",
      "Raikou",
      "Entei",
      "Suicune",
      "Larvitar",
      "Pupitar",
      "Tyranitar",
      "Lugia",
      "Ho-Oh",
      "Celebi",
      "Treecko",
      "Grovyle",
      "Sceptile",
      "Torchic",
      "Combusken",
      "Blaziken",
      "Mudkip",
      "Marshtomp",
      "Swampert",
      "Poochyena",
      "Mightyena",
      "Zigzagoon",
      "Linoone",
      "Wurmple",
      "Silcoon",
      "Beautifly",
      "Cascoon",
      "Dustox",
      "Lotad",
      "Lombre",
      "Ludicolo",
      "Seedot",
      "Nuzleaf",
      "Shiftry",
      "Taillow",
      "Swellow",
      "Wingull",
      "Pelipper",
      "Ralts",
      "Kirlia",
      "Gardevoir",
      "Surskit",
      "Masquerain",
      "Shroomish",
      "Breloom",
      "Slakoth",
      "Vigoroth",
      "Slaking",
      "Nincada",
      "Ninjask",
      "Shedinja",
      "Whismur",
      "Loudred",
      "Exploud",
      "Makuhita",
      "Hariyama",
      "Azurill",
      "Nosepass",
      "Skitty",
      "Delcatty",
      "Sableye",
      "Mawile",
      "Aron",
      "Lairon",
      "Aggron",
      "Meditite",
      "Medicham",
      "Electrice",
      "Manectric",
      "Plusle",
      "Minun",
      "Volbeat",
      "Illumise",
      "Roselia",
      "Gulpin",
      "Swalot",
      "Carvanha",
      "Sharpedo",
      "Wailmer",
      "Wailord",
      "Numel",
      "Camerupt",
      "Torkoal",
      "Spoink",
      "Grumpig",
      "Spinda",
      "Trapinch",
      "Vibrava",
      "Flygon",
      "Cacnea",
      "Cacturne",
      "Swablu",
      "Altaria",
      "Zangoose",
      "Seviper",
      "Lunatone",
      "Solrock",
      "Barboach",
      "Whiscash",
      "Corphish",
      "Crawdaunt",
      "Baltoy",
      "Claydol",
      "Lileep",
      "Cradily",
      "Anorith",
      "Armaldo",
      "Feebas",
      "Milotic",
      "Castform",
      "Kecleon",
      "Shuppet",
      "Banette",
      "Duskull",
      "Dusclops",
      "Tropius",
      "Chimecho",
      "Absol",
      "Wynaut",
      "Snorunt",
      "Gailie",
      "Spheal",
      "Sealeo",
      "Walrein",
      "Clamperl",
      "Huntail",
      "Gorebyss",
      "Relicanth",
      "Luvdisc",
      "Bagon",
      "Shelgon",
      "Salamence",
      "Beldum",
      "Metang",
      "Metagross",
      "Regirock",
      "Regice",
      "Registeel",
      "Latias",
      "Lations",
      "Kyogre",
      "Groudon",
      "Rayquaza",
      "Jirachi",
      "Deoxys",
      "Turtwig",
      "Grotle",
      "Torterra",
      "Chimchar",
      "Monferno",
      "Infernape",
      "Piplup",
      "Prinlup",
      "Empoleon",
      "Starly",
      "Staravia",
      "Staraptor",
      "Bidoof",
      "Bibarel",
      "Kricketot",
      "Kricketune",
      "Shinx",
      "Luxio",
      "Luxray",
      "Budew",
      "Roserade",
      "Cranidos",
      "Rampardos",
      "Shieldon",
      "Bastiodon",
      "Burmy",
      "Wormadam",
      "Mothim",
      "Combee",
      "Vespiquen",
      "Pachirisu",
      "Buizel",
      "Floatzel",
      "Cherubi",
      "Cherrim",
      "Shellos",
      "Gastrodon",
      "Ambipom",
      "Drifloon",
      "Drifblim",
      "Buneary",
      "Lopunny",
      "Mismagius",
      "Honchkrow",
      "Glameow",
      "Purugly",
      "Chingling",
      "Stunky",
      "Skuntank",
      "Bronzor",
      "Bronzong",
      "Bonsly",
      "Mime Jr.",
      "Happiny",
      "Chatot",
      "Spiritomb",
      "Gible",
      "Gabite",
      "Garchomp",
      "Munchlax",
      "Riolu",
      "Lucario",
      "Hippopotas",
      "Hippowdon",
      "Skorupi",
      "Drapion",
      "Croagunk",
      "Toxicroak",
      "Carnivine",
      "Finneon",
      "Lumineon",
      "Mantyke",
      "Snover",
      "Abomasnow",
      "Weavile",
      "Magnezone",
      "Lickilicky",
      "Rhyperior",
      "Tangrowth",
      "Electivite",
      "Magmortar",
      "Togekiss",
      "Yanmega",
      "Leafeon",
      "Glaceon",
      "Gliscor",
      "Mamoswine",
      "Porygon-Z",
      "Gallade",
      "Probopass",
      "Dusknoir",
      "Froslass",
      "Rotom",
      "Uxie",
      "Mesprit",
      "Azelf",
      "Dialga",
      "Palkia",
      "Heatran",
      "Regigigas",
      "Giratina",
      "Cresselia",
      "Phione",
      "Manaphy",
      "Darkrai",
      "Shaymin",
      "Arceus",
      "Victini",
      "Snivy",
      "Servine",
      "Serperior",
      "Tepig",
      "Pignite",
      "Emboar",
      "Oshawott",
      "Dewott",
      "Samurott",
      "Patrat",
      "Watchog",
      "Lillipup",
      "Herdier",
      "Stoutland",
      "Purrloin",
      "Liepard",
      "Pansage",
      "Simisage",
      "Pansear",
      "Simisear",
      "Panpour",
      "Simipour",
      "Munna",
      "Musharna",
      "Pidove",
      "Tranquill",
      "Unfezant",
      "Blitzle",
      "Zebstrika",
      "Roggenrola",
      "Boldore",
      "Gigalith",
      "Woobat",
      "Swoobat",
      "Drilbur",
      "Excadrill",
      "Audino",
      "Timburr",
      "Gurdurr",
      "Conkeldurr",
      "Tympole",
      "Palpitoad",
      "Seismitoad",
      "Throh",
      "Sawk",
      "Sewaddle",
      "Swadloon",
      "Leavanny",
      "Venipede",
      "Whirlipede",
      "Scolipede",
      "Cottonee",
      "Whimsicott",
      "Petilil",
      "Liligant",
      "Basculin",
      "Sandile",
      "Krokorok",
      "Krookodile",
      "Darumaka",
      "Darmanitan",
      "Maractus",
      "Dwebble",
      "Crustle",
      "Scraggy",
      "Scrafty",
      "Sigilyph",
      "Yamask",
      "Cofagrigus",
      "Tirtouga",
      "Carracosta",
      "Archen",
      "Archeops",
      "Trubbish",
      "Garbodor",
      "Zorua",
      "Zoroark",
      "Minccino",
      "Cinccino",
      "Gothita",
      "Gothorita",
      "Gothitelle",
      "Solosis",
      "Duosion",
      "Reuniclus",
      "Ducklett",
      "Swanna",
      "Vanillite",
      "Vanillish",
      "Vanilluxe",
      "Deerling",
      "Sawsbuck",
      "Emolga",
      "Karrablast",
      "Escavalier",
      "Foongus",
      "Amoonguss",
      "Frillish",
      "Jellicent",
      "Alomomola",
      "Joltik",
      "Galvantula",
      "Ferroseed",
      "Ferrothorn",
      "Klink",
      "Klang",
      "Klinklang",
      "Tynamo",
      "Eelektrik",
      "Eelektross",
      "Elgyem",
      "Beheeyem",
      "Litwick",
      "Lampent",
      "Chandelure",
      "Axew",
      "Fraxure",
      "Haxorus",
      "Cubchoo",
      "Beartic",
      "Cryogonal",
      "Shelmet",
      "Accelgor",
      "Stunfisk",
      "Mienfoo",
      "Mienshao",
      "Druddigon",
      "Golett",
      "Golurk",
      "Pawniard",
      "Bisharp",
      "Bouffalant",
      "Rufflet",
      "Braviary",
      "Vullaby",
      "Mandibuzz",
      "Heatmor",
      "Durant",
      "Deino",
      "Zweilous",
      "Hydreigon",
      "Larvesta",
      "Volcarona",
      "Cobalion",
      "Terrakion",
      "Virizion",
      "Tornadus",
      "Thundurus",
      "Reshiram",
      "Zekrom",
      "Landorus",
      "Kyurem",
      "Keldeo",
      "Meloetta",
      "Genesect",
      "Chespin",
      "Quilladin",
      "Chesnaught",
      "Fennekin",
      "Braixen",
      "Delphox",
      "Froakie",
      "Frogadier",
      "Greninja",
      "Bunnelby",
      "Diggersby",
      "Fletchling",
      "Fletchinder",
      "Talonflame",
      "Scatterbug",
      "Spewpa",
      "Vivillon",
      "Litleo",
      "Pyroar",
      "Flabébé",
      "Floette",
      "Florges",
      "Skiddo",
      "Gogoat",
      "Pancham",
      "Pangoro",
      "Furfrou",
      "Espurr",
      "Meowstic",
      "Honedge",
      "Doublade",
      "Aegislash",
      "Spritzee",
      "Aromatisse",
      "Swirlix",
      "Slurpuff",
      "Inkay",
      "Malamar",
      "Binacle",
      "Barbaracle",
      "Skrelp",
      "Dragalge",
      "Clauncher",
      "Clawitzer",
      "Helioptile",
      "Heliolisk",
      "Tyrunt",
      "Tyrantrum",
      "Amaura",
      "Aurorus",
      "Sylveon",
      "Hawlucha",
      "Dedenne",
      "Carbink",
      "Goomy",
      "Sliggoo",
      "Goodra",
      "Klefki",
      "Phantump",
      "Trevenant",
      "Pumpkaboo",
      "Gourgeist",
      "Bergmite",
      "Avalugg",
      "Noibat",
      "Noivern",
      "Xerneas",
      "Yveltal",
      "Zygarde",
      "Diancie",
      "Hoopa",
      "Volcanion",
      "Rowlet",
      "Dartrix",
      "Decidueye",
      "Litten",
      "Torracat",
      "Incineroar",
      "Popplio",
      "Brionne",
      "Primarina",
      "Pikipek",
      "Trumbeak",
      "Toucannon",
      "Yungoos",
      "Gumshoos",
      "Grubbin",
      "Charjabug",
      "Vikavolt",
      "Crabrawler",
      "Crabominable",
      "Oricorio",
      "Cutiefly",
      "Ribombee",
      "Rockruff",
      "Lycanroc",
      "Wishiwashi",
      "Mareanie",
      "Toxapex",
      "Mudbray",
      "Mudsdale",
      "Dewpider",
      "Araquanid",
      "Fomantis",
      "Lurantis",
      "Morelull",
      "Shiinotic",
      "Salandit",
      "Salazzle",
      "Stufful",
      "Bewear",
      "Bounsweet",
      "Steenee",
      "Tsareena",
      "Comfey",
      "Oranguru",
      "Passimian",
      "Wimpod",
      "Golisopod",
      "Sandygast",
      "Palossand",
      "Pyukumuku",
      "Type: Null",
      "Silvally",
      "Minior",
      "Komala",
      "Turtonator",
      "Togedemaru",
      "Mimikyu",
      "Bruxish",
      "Drampa",
      "Dhelmise",
      "Jangmo-o",
      "Hakamo-o",
      "Kommo-o",
      "Tapu Koko",
      "Tapu Lele",
      "Tapu Bulu",
      "Tapu Fini",
      "Cosmog",
      "Cosmoem",
      "Solgaleo",
      "Lunala",
      "Nihilego",
      "Buzzwole",
      "Pheromosa",
      "Xurkitree",
      "Celesteela",
      "Kartana",
      "Guzzlord",
      "Necrozma",
      "Magearna",
      "Marshadow",
      "Poipole",
      "Naganadel",
      "Stakataka",
      "Blacephalon",
      "Zeraora",
      "Meltan",
      "Melmetal",
      "Grookey",
      "Thwackey",
      "Rillaboom",
      "Scorbunny",
      "Raboot",
      "Cinderace",
      "Sobble",
      "Drizzile",
      "Inteleon",
      "Skwovet",
      "Greedent",
      "Rookidee",
      "Corvisquire",
      "Corviknight",
      "Blipbug",
      "Dottler",
      "Orbeetle",
      "Nickit",
      "Thievul",
      "Gossifleur",
      "Eldegoss",
      "Wooloo",
      "Dubwool",
      "Chewtle",
      "Drednaw",
      "Yamper",
      "Boltund",
      "Rolycoly",
      "Carkol",
      "Coalossal",
      "Applin",
      "Flapple",
      "Appletun",
      "Silicobra",
      "Sandaconda",
      "Cramorant",
      "Arrokuda",
      "Barraskewda",
      "Toxel",
      "Toxtricity",
      "Sizzlipede",
      "Centiskorch",
      "Clobbopus",
      "Grapploct",
      "Sinistea",
      "Polteageist",
      "Hatenna",
      "Hattrem",
      "Hatterene",
      "Impidimp",
      "Morgrem",
      "Grimmsnarl",
      "Obstagoon",
      "Perrserker",
      "Cursola",
      "Sirfetch`d",
      "Mr. Rime",
      "Runerigus",
      "Milcery",
      "Alcremie",
      "Falinks",
      "Pincurchin",
      "Snom",
      "Frosmoth",
      "Stonjourner",
      "Eiscue",
      "Indeedee",
      "Morpeko",
      "Cufant",
      "Copperajah",
      "Dracozolt",
      "Arctozolt",
      "Dracovish",
      "Arctovish",
      "Duraludon",
      "Dreepy",
      "Drakloak",
      "Dragapult",
      "Zacian",
      "Zamazenta",
      "Eternatus",
      "Kubfu",
      "Urshifu",
      "Zarude",
      "Regieleki",
      "Regidrago",
      "Glastrier",
      "Spectrier",
      "Calyrex"
    ];
    var thing = things[Math.floor(Math.random() * things.length)];
    var sql = "UPDATE pokemon SET Pokemon = '" + thing + "' WHERE Id = '1'";
    connection.query(sql, function (err, result) {
      if (err) throw err;
      var show = things.length;
      console.log("New Pokemon: " + thing + "! Total: " + show);
    });
  }

  // catch pokemon and add it with user it belongs to in the database

  function CatchPokemon() {
    connection.query(
      'SELECT Pokemon AS spawn FROM pokemon WHERE Id="1"',
      function (error, results, fields) {
        if (error) throw error;
        var spawn = results[0].spawn;
        if (spawn == "Not Set") {
          client.say(
            channel,
            `@${tags.username}, there is no pokemon to catch. Wait until it spawns.`
          );
        } else {
          client.say(channel, `@${tags.username} just caught a ` + spawn + `!`);
          var sqls =
            "INSERT INTO pokemonlist (User, Pokemon) VALUES ('" +
            tags.username +
            "', '" +
            spawn +
            "')";
          connection.query(sqls, function (err, result) {
            if (err) throw err;
          });
        }
      }
    );
  }

  // Spawn command, only mods and streamer

  if (isModUp) {
    if (command === "spawn") {
      ChangePokemon();
      SpawnPokemon();
    }
  }

  // Catch command

  if (command === "catch") {
    CatchPokemon();
    ChangePokemonSet();
  }

  // Pokemon list command

  if (command === "pokedex") {
    PokemonList();
  }
});
