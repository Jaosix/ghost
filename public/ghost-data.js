const ghostData = {
  banshee: {
    name: "Banshee",
    evidence: ["D.O.T.S Projector", "Ghost Orb", "Fingerprints"],
    strengths: "Targets one player at a time",
    weaknesses: "Has a distinctive scream through a parabolic microphone",
    behavior: [
      "Will focus on and hunt one player until they die",
      "More likely to be aggressive when their target is nearby",
      "Less likely to switch targets mid-hunt"
    ],
    secretBehavior: [
      "Hunts based off the target's sanity: 50% sanity",
      "Targets only one player as long as they're alive and inside the house",
      "If the target leaves the house, the banshee will hunt normally",
      "When the target dies, the banshee will select a new target",
      "Will ignore all non-targets during a hunt",
      "Increased chance for singing ghost events",
      "Has a unique parabolic microphone sound: sounds like a scream",
      "Will follow target around"
    ]
  },
  demon: {
    name: "Demon",
    evidence: ["Fingerprints", "Ghost Writing", "Freezing Temperatures"],
    strengths: "Can initiate hunts more frequently",
    weaknesses: "Crucifix effectiveness is increased to 5m against Demons",
    behavior: [
      "Highly aggressive ghost that can hunt at any sanity",
      "More likely to initiate hunts when players use crucifixes",
      "Using a Ouija Board barely drains sanity"
    ],
    secretBehavior: [
      "Very aggressive ghost hunt wise",
      "Can hunt at 70% naturally with a rare chance to hunt at any sanity",
      "Minimum cooldown between hunts is 20 seconds (other ghosts is 25 seconds)",
      "Smudging a demon will prevent it from hunting for 60 seconds (compared to 90 seconds for most ghosts and 180 seconds for spirit)"
    ]
  },
  deogen: {
    name: "Deogen",
    evidence: ["Spirit Box", "Ghost Writing", "D.O.T.S Projector"],
    strengths: "Always knows where players are during a hunt",
    weaknesses: "Moves very slowly when close to its target",
    behavior: [
      "Can be detected by extremely high EMF readings",
      "Requires high amounts of energy to manifest",
      "Gives unique responses on the Spirit Box"
    ],
    secretBehavior: [
      "You're unable to hide from this ghost",
      "To tell if its a deo while hiding, listen to its speed: if its super fast and then slows down when it gets closer to your hiding spot, try and leave your hiding spot and move somewhere that you can loop the ghost",
      "Deos are VERY slow when they are near you so they are super easy to loop",
      "Has a unique spirit box response that sounds like a growl or heavy breathing",
      "Increased chanced of writing and dots",
      "Will always have spirit box on nightmare"
    ]
  },
  goryo: {
    name: "Goryo",
    evidence: ["EMF Level 5", "Fingerprints", "D.O.T.S Projector"],
    strengths: "Only shows itself on camera when no one is nearby",
    weaknesses: "Rarely seen far from its death place",
    behavior: [
      "D.O.T.S evidence can only be seen through a video camera",
      "Less likely to change favorite rooms",
      "More likely to show D.O.T.S when players are far away"
    ],
    secretBehavior: [
      "Goryo dots can only be seen through the video camera",
      "Will also not show dots if you're in the same room as it",
      "To check for a goryo, make sure no players are in its room and look for dots through the video camera",
      "Dots is forced evidence on Nightmare mode",
      "If you see dots without the use of a video camera, you can rule out goryo",
      "Will not leave its room as often as other ghosts and will not change its favorite room"
    ]
  },
  hantu: {
    name: "Hantu",
    evidence: ["Fingerprints", "Ghost Orb", "Freezing Temperatures"],
    strengths: "Moves faster in cold areas",
    weaknesses: "Moves slower in warm areas",
    behavior: [
      "More active in cold temperatures",
      "Freezing breath can be seen during hunts",
      "Will not turn on heating systems"
    ],
    secretBehavior: [
      "Lower the temps, the quicker a hantu will be",
      "15C+ = 1.4m/s, 12C = 1.75, 9C = 2.1, 6C = 2.3, 3C = 2.5, 0C (freezing) = 2.7",
      "Does not gradually speed up with line of sight",
      "Has an increased chance to turn off the breaker",
      "Will produce freezing breath during a hunt in any room if the breaker is off",
      "Will always have freezing temps on Nightmare mode"
    ]
  },
  jinn: {
    name: "Jinn",
    evidence: ["EMF Level 5", "Fingerprints", "Freezing Temperatures"],
    strengths: "Travels faster if victim is far away",
    weaknesses: "Cannot use its ability if the location's power is off",
    behavior: [
      "Can reduce players' sanity at a faster rate when powered",
      "Territorial ghost that stays near its location",
      "More active when powered by electricity"
    ],
    secretBehavior: [
      "When the breaker is on and the Jinn get's line of site with a player, it will get faster (not as fast as a revenant and not as slow as a Revenant without LOS)",
      "When it gets within 3m of a player, it will slow down to normal ghost speed",
      "Has the ability to zap 25% sanity when near a player and the breaker is on: will give an emf reading at the breaker when this ability is performed",
      "Unable to turn off the breaker (if the Jinn happens to turn on a light which causes the breaker to trip, it could still be a Jinn)"
    ]
  },
  mare: {
    name: "Mare",
    evidence: ["Spirit Box", "Ghost Orb", "Ghost Writing"],
    strengths: "Increased chance to attack in the dark",
    weaknesses: "Less likely to hunt if lights are on",
    behavior: [
      "Will turn off lights more frequently",
      "More likely to hunt at lower sanity",
      "Prefers to stay in darker areas"
    ],
    secretBehavior: [
      "Can hunt at 60% sanity when the lights are off, 40% sanity when the lights are on",
      "Unable to turn on a light",
      "Higher chance of performing a light breaking event",
      "Wanders more if lights are on in its room",
      "Has a chance of immediately switching a light off that has been turned on"
    ]
  },
  mimic: {
    name: "The Mimic",
    evidence: ["Spirit Box", "Fingerprints", "Freezing Temperatures"],
    strengths: "Can mimic the abilities and traits of other ghosts",
    weaknesses: "Shows Ghost Orb evidence in addition to its three evidence types",
    behavior: [
      "Regularly changes behavior to match other ghost types",
      "Can switch between different ghost behaviors",
      "Always shows Ghost Orb as a fourth evidence"
    ],
    secretBehavior: [
      "The only ghost to have 4 pieces of evidence on professional difficulty and below (Orbs being the piece of evidence you will get that is not listed in the journal for Mimic)",
      "Will always have Orbs on Nightmare Mode",
      "Will also always have orbs if you're playing with no evidence",
      "Will change the ghost it mimics every 30 seconds to 2 minutes",
      "Easiest way to see if its a mimic is to see if there are orbs in addition to its 3 pieces of evidence (2 evidence on nightmare)",
      "If I have orbs as evidence, I ALWAYS check for the mimics other evidence (fingerprints, spirit box, freezing) to ensure its not a mimic",
      "Cannot change its behavior mid hunt"
    ]
  },
  moroi: {
    name: "Moroi",
    evidence: ["Spirit Box", "Ghost Writing", "Freezing Temperatures"],
    strengths: "Grows stronger as players' sanity drops",
    weaknesses: "Smudge sticks blind it for longer during hunts",
    behavior: [
      "Can curse players through Spirit Box interactions",
      "Moves faster when hunting low sanity players",
      "More likely to respond through Spirit Box"
    ],
    secretBehavior: [
      "Speed demon",
      "Curses a player when they get a response on either the spirit box or the parabolic mic",
      "Curse causes the players sanity to drain twice as fast, with lights and candles unable to prevent this curse",
      "To remove the curse, take sanity pills",
      "Smudging during a hunt will blind the moroi for 12 seconds, instead of 6 seconds for other ghosts",
      "The lower your sanity, the faster the moroi",
      "To test for a moroi, get a spirit box response and either stay in the light or hold a candle, if your sanity continues to drain, it's likely a moroi",
      "If you're playing with no evidence, see if the ghost gets faster the more your sanity drains",
      "Moroi will also get line of site speed, so at 0% sanity and enough LOS speed, Moroi becomes the fastest ghost in the game",
      "Spirit box is forced evidence on nightmare"
    ]
  },
  myling: {
    name: "Myling",
    evidence: ["EMF Level 5", "Fingerprints", "Ghost Writing"],
    strengths: "Quieter when hunting",
    weaknesses: "Produces more frequent paranormal sounds",
    behavior: [
      "Footsteps are quieter during hunts",
      "Makes more frequent paranormal sounds",
      "Can be detected earlier with a parabolic microphone"
    ],
    secretBehavior: [
      "Can only be heard during a hunt at a range of 12 meters or less (which includes footsteps AND vocal hunt noises)",
      "All other ghosts can be heard up to 20 meters away",
      "Myling will also respond more on the parabolic microphone",
      "To test for a myling, hide with your flashlight or put dots on the floor, if you only hear footsteps during a hunt right when your equipment starts flickering, its likely a Myling"
    ]
  },
  obake: {
    name: "Obake",
    evidence: ["EMF Level 5", "Fingerprints", "Ghost Orb"],
    strengths: "Can change forms, leaving less evidence behind",
    weaknesses: "Sometimes leaves unique fingerprints",
    behavior: [
      "Can leave six-fingered handprints",
      "Has a small chance to shapeshift during hunts",
      "Can make fingerprints disappear more quickly"
    ],
    secretBehavior: [
      "The only ghost that can leave a 6 fingered fingerprint",
      "Fingerprints are forced evidence on Nightmare",
      "Has a 25% to not leave fingerprints",
      "Also able to cut the duration of fingerprints in half if it uses its ability",
      "During a hunt, the Obake has a chance to shapeshift",
      "It will briefly flash as another ghost model of the same gender",
      "It was a 6.66% chance every time it blinks during a hunt to shapeshift",
      "To test for an obake during a hunt, loop it for as long as possible and see if it changes ghost models",
      "I've also seen it change the stance of a ghost model during a hunt (i.e. when from being the standing child to the crawling child in one hunt)",
      "Can also have it run at you from a long corridor and see if the blink changes"
    ]
  },
  oni: {
    name: "Oni",
    evidence: ["EMF Level 5", "D.O.T.S Projector", "Freezing Temperatures"],
    strengths: "More active when people are nearby and moves objects faster",
    weaknesses: "Being more active makes it easier to find evidence",
    behavior: [
      "Very active and territorial",
      "Throws objects with great force",
      "More likely to manifest when multiple people are nearby"
    ],
    secretBehavior: [
      "Unable to do the 'ghost mist' or 'air ball' ghost event",
      "Much more visible during a hunt, meaning it blinks a lot less than other ghosts",
      "Has a higher chance of showing its full form during ghost events (instead of being a shadow or transparent)",
      "Will drain double the sanity when a ghost event hits you"
    ]
  },
  onryo: {
    name: "Onryo",
    evidence: ["Spirit Box", "Ghost Orb", "Freezing Temperatures"],
    strengths: "Extinguishing flames can trigger a hunt",
    weaknesses: "Presence of flames reduces hunt chance",
    behavior: [
      "More likely to hunt when flames are extinguished",
      "Candles can be used to detect its presence",
      "Less likely to hunt near lit candles"
    ],
    secretBehavior: [
      "Unable to hunt within 4m of a flame",
      "If it blows out 3 flames and there are no other flames nearby to prevent it from hunting, it will trigger a hunt at any sanity",
      "To test for an onryo, put candles and crucifixes in its room",
      "If the ghost uses a crucifix without blowing out the candle, rule out onryo",
      "If it only uses a crucifix after blowing out all the candles with a 4m range, it's likely an onryo",
      "May also wander away from the candles and initiate a hunt"
    ]
  },
  phantom: {
    name: "Phantom",
    evidence: ["Spirit Box", "Fingerprints", "D.O.T.S Projector"],
    strengths: "Looking at a Phantom will considerably drop your sanity",
    weaknesses: "Taking a photo will make it temporarily disappear",
    behavior: [
      "Can teleport to players during hunts",
      "Less visible during hunts",
      "Taking its photo makes it disappear"
    ],
    secretBehavior: [
      "Has a much longer blink during hunts, making it seem almost invisible",
      "Will immediately disappear when you take a picture during a ghost event and you will continue to hear the ghost event audio",
      "Will not appear in the picture when you take a ghost picture",
      "Also able to wander to a targeted player (not to be mistaken with the Wraith teleport)"
    ]
  },
  poltergeist: {
    name: "Poltergeist",
    evidence: ["Spirit Box", "Fingerprints", "Ghost Writing"],
    strengths: "Can throw multiple objects at once",
    weaknesses: "Less effective in empty rooms",
    behavior: [
      "Can throw multiple objects simultaneously",
      "More active in rooms with many items",
      "Drains sanity when throwing objects"
    ],
    secretBehavior: [
      "More likely to throw items, decreases player sanity by 2% for every item thrown",
      "During hunts, it has a 100% chance to thrown an object nearby every .5 seconds compared to 50% for other ghosts",
      "Can do an 'explosion' of items"
    ]
  },
  raiju: {
    name: "Raiju",
    evidence: ["EMF Level 5", "Ghost Orb", "D.O.T.S Projector"],
    strengths: "Moves faster near electrical devices",
    weaknesses: "More frequently disrupts electronic equipment",
    behavior: [
      "Disrupts electronic equipment from further away",
      "Moves faster near active electronics",
      "Can be detected by its electrical interference"
    ],
    secretBehavior: [
      "Faster around electronics that are turned on: 50% speed without electronics, 65% speed with electronics",
      "Must be within 6m of equipment on small maps, 8m on medium maps, and 10m on large maps",
      "Headcams are the only equipment that does not effect a Raiju",
      "When hunting, electronics will malfunction at 15m for a Raji as opposed to 10m for other ghosts",
      "May be easy to confuse a Raiju with a Myling because of the above fact, so make sure to pay attention to its speed near powered electronics"
    ]
  },
  revenant: {
    name: "Revenant",
    evidence: ["Ghost Orb", "Ghost Writing", "Freezing Temperatures"],
    strengths: "Travels significantly faster when hunting visible players",
    weaknesses: "Moves very slowly when not chasing a player",
    behavior: [
      "One of the fastest ghosts when chasing players",
      "Very slow when not targeting anyone",
      "Will switch targets during hunts if it sees another player"
    ],
    secretBehavior: [
      "Will be very slow when player location is unknown (1m/s)",
      "When it sees a player, it will immediately speed up to 3m/s",
      "After reaching the players last known location, it will gradually slow back down if it doesn't see the player",
      "Best tell for a revenant: slow steps when it does not see a player, and instantly fast speeds when it does see a player"
    ]
  },
  shade: {
    name: "Shade",
    evidence: ["EMF Level 5", "Ghost Writing", "Freezing Temperatures"],
    strengths: "Being shy makes it harder to find evidence",
    weaknesses: "Less likely to hunt if multiple people are nearby",
    behavior: [
      "Very shy and less active when multiple people are nearby",
      "Rarely starts hunts when players are grouped together",
      "More active when players are alone"
    ],
    secretBehavior: [
      "Very shy and boring ghost",
      "Will often show up in shadow form during ghost events or do more airball ghost events",
      "Ghost event chance increases the lower the average sanity",
      "Will not throw objects if you are in the same room as it",
      "Will not hunt if there is a player nearby",
      "To test for a shade, sit in the ghost room with a crucifix, if your sanity is low enough for the ghost to hunt and it's not hunting or using a crucifix, probably a shade"
    ]
  },
  spirit: {
    name: "Spirit",
    evidence: ["EMF Level 5", "Spirit Box", "Ghost Writing"],
    strengths: "None",
    weaknesses: "Smudge sticks are more effective, preventing ghost activity for longer",
    behavior: [
      "Most common ghost type",
      "Will attempt to defend itself when threatened",
      "Less active when smudged"
    ],
    secretBehavior: [
      "When you smudge a spirit, it prevents it from hunting for 180 seconds (3 minutes) instead of the usual 90 seconds for most ghosts, 60 seconds for Demon"
    ]
  },
  thaye: {
    name: "Thaye",
    evidence: ["Ghost Orb", "Ghost Writing", "D.O.T.S Projector"],
    strengths: "Very active when first discovered",
    weaknesses: "Becomes slower and less active over time",
    behavior: [
      "Ages over time, becoming less active",
      "More aggressive when young",
      "Activity decreases faster when near players"
    ],
    secretBehavior: [
      "The only ghost capable of aging",
      "Will start out young at the beginning of the game, making it more active and more aggressive and can hunt at 75% sanity and be super fast 2.5m/s",
      "Every 1-2 minutes that you're near a Thaye, it has a chance of aging",
      "At it's oldest, it lowers the hunting threshold to 15% and speed 1m/s",
      "Does not have line of site speed increase, so it will not speed up gradually while chasing you",
      "To test for a thaye, pay attention to its speed during hunts if you've been hanging out in its ghost room enough to age it",
      "If it seems to slow down each hunt, its likely a Thaye",
      "It will also tell you a different age on the ouija board if you ask it its age at the beginning of the game and then again later on once you've aged it"
    ]
  },
  twins: {
    name: "The Twins",
    evidence: ["EMF Level 5", "Spirit Box", "Freezing Temperatures"],
    strengths: "Either twin can initiate a hunt",
    weaknesses: "Often interact with the environment at the same time",
    behavior: [
      "Can interact with the environment simultaneously",
      "One twin moves faster than the other during hunts",
      "Can alternate between which twin does the hunting"
    ],
    secretBehavior: [
      "Able to interact with multiple objects at the same time in different rooms",
      "Over the course of multiple hunts, you may hear different speeds",
      "Twins has the chance during a hunt to send out either a slightly faster ghost (110%) or a slightly slower ghost (90%)",
      "Will only send out one ghost during a hunt",
      "May also hunt from a different location from the ghost room if it's sending out its 'decoy' twin"
    ]
  },
  wraith: {
    name: "Wraith",
    evidence: ["EMF Level 5", "Spirit Box", "D.O.T.S Projector"],
    strengths: "Almost never touches the ground, no footprints in salt",
    weaknesses: "Toxic reaction to salt",
    behavior: [
      "Can teleport to players",
      "Can see through doors and lockers",
      "More likely to hunt when players are talking"
    ],
    secretBehavior: [
      "Wraith will never step in a salt pile or leave UV footsteps",
      "They can teleport to a player outside of a hunt which will give a EMF 2 reading"
    ]
  },
  yokai: {
    name: "Yokai",
    evidence: ["Spirit Box", "Ghost Orb", "D.O.T.S Projector"],
    strengths: "Talking near a Yokai will anger it, increasing hunt chance",
    weaknesses: "Can only hear voices close to it during hunts",
    behavior: [
      "More active when players are talking",
      "Can only hear nearby players during hunts",
      "More likely to hunt when players are talking"
    ],
    secretBehavior: [
      "Has a chance to hunt at 80% when players nearby are talking (otherwise hunts at 50% sanity)",
      "During a hunt, unable to detect your voice or equipment further than 2.5m away",
      "You can get much loser to a yokai with a music box before the box will break",
      "Ghost activity is increased when talking near a Yokai",
      "To test for a yokai, hide in a room nearby with equipment on and yell at it during a hunt: if you're close enough and the ghost doesn't find you, probably a yokai"
    ]
  },
  yurei: {
    name: "Yurei",
    evidence: ["Ghost Orb", "Freezing Temperatures", "D.O.T.S Projector"],
    strengths: "Has a stronger effect on players' sanity",
    weaknesses: "Smudging the room will trap it temporarily",
    behavior: [
      "Has a stronger effect on sanity",
      "More likely to wander away from its room",
      "Can be contained in its room by smudging"
    ],
    secretBehavior: [
      "Has the ability to zap 15% sanity if a player is nearby",
      "When it uses it ability, it will also fully close a door in its room",
      "When smudged, the yurei will be trapped in its room for a period of time"
    ]
  }
};

module.exports = ghostData;
