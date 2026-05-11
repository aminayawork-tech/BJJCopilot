export interface VideoLink {
  label: string;
  url: string;
}

export interface BJJTerm {
  term: string;
  category: string;
  definition: string;
  videos: VideoLink[];
}

function yt(query: string): string {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
}

export const bjjTerms: BJJTerm[] = [
  // ── Positions ──────────────────────────────────────────────────────────────
  {
    term: 'Closed Guard',
    category: 'Positions',
    definition:
      'Bottom player locks ankles behind the top player\'s back, controlling distance and preventing posture. From here you can attack with triangles, armbars, sweeps, and chokes.',
    videos: [
      { label: 'Closed Guard Attacks', url: yt('bjj closed guard attacks tutorial') },
      { label: 'Closed Guard Sweeps', url: yt('bjj closed guard sweeps fundamentals') },
    ],
  },
  {
    term: 'Half Guard',
    category: 'Positions',
    definition:
      'Bottom player captures one of top player\'s legs between their own. Bottom goal is to recover full guard or take the back; top goal is to flatten out and pass.',
    videos: [
      { label: 'Half Guard Fundamentals', url: yt('bjj half guard fundamentals tutorial') },
      { label: 'Half Guard Sweeps', url: yt('bjj half guard sweeps back take') },
    ],
  },
  {
    term: 'Side Control',
    category: 'Positions',
    definition:
      'Top player controls their opponent from the side, hips-to-hips, with chest pressure. A dominant position with direct paths to mount, knee-on-belly, and arm attacks.',
    videos: [
      { label: 'Side Control Submissions', url: yt('bjj side control submissions tutorial') },
      { label: 'Side Control Escapes', url: yt('bjj side control escape fundamentals') },
    ],
  },
  {
    term: 'Mount',
    category: 'Positions',
    definition:
      'Top player sits on the opponent\'s torso with knees on the mat. High-percentage submissions (armbar, cross choke, ezekiel) are available. The opponent\'s primary escape is the elbow-knee or bridge-and-roll.',
    videos: [
      { label: 'Mount Attacks', url: yt('bjj mount attacks submissions tutorial') },
      { label: 'Mount Escapes', url: yt('bjj mount escape fundamentals') },
    ],
  },
  {
    term: 'Back Control',
    category: 'Positions',
    definition:
      'Attacker is behind the opponent with both hooks (or body triangle) in, seatbelt grip secured. The highest-value position in BJJ — rear naked choke and bow-and-arrow are the primary finishes.',
    videos: [
      { label: 'Back Control Details', url: yt('bjj back control hooks seatbelt tutorial') },
      { label: 'Finishing from the Back', url: yt('bjj back take submissions finish') },
    ],
  },
  {
    term: 'Turtle',
    category: 'Positions',
    definition:
      'Defensive position where the bottom player is on all fours protecting their neck and arms. Common transition point — attacker looks to take the back; defender looks to sit out or recover guard.',
    videos: [
      { label: 'Attacking the Turtle', url: yt('bjj attacking turtle position back take') },
      { label: 'Turtle Escapes', url: yt('bjj turtle position escape sit out') },
    ],
  },
  {
    term: 'Knee-on-Belly',
    category: 'Positions',
    definition:
      'Top player places a knee on the opponent\'s belly while the other leg posts out for base. Creates pressure and sets up arm attacks or transitions to mount and back.',
    videos: [
      { label: 'Knee-on-Belly Tutorial', url: yt('bjj knee on belly attacks tutorial') },
      { label: 'KOB Submissions', url: yt('bjj knee on belly armbar submissions') },
    ],
  },
  {
    term: 'North-South',
    category: 'Positions',
    definition:
      'Top player is perpendicular across the opponent\'s chest, head-to-hips. Used to control, tire the opponent, and attack with north-south choke or kimura.',
    videos: [
      { label: 'North-South Tutorial', url: yt('bjj north south position tutorial') },
      { label: 'North-South Choke', url: yt('bjj north south choke technique') },
    ],
  },

  // ── Guards ─────────────────────────────────────────────────────────────────
  {
    term: 'Open Guard',
    category: 'Guards',
    definition:
      'Bottom player\'s legs are not locked but actively framing, pushing, and creating angles. Encompasses dozens of specific guard variants — the key is constant hip movement and grip fighting.',
    videos: [
      { label: 'Open Guard Fundamentals', url: yt('bjj open guard fundamentals tutorial') },
      { label: 'Open Guard Sweeps', url: yt('bjj open guard sweeps hip movement') },
    ],
  },
  {
    term: 'Butterfly Guard',
    category: 'Guards',
    definition:
      'Bottom player sits up with both feet hooked inside the opponent\'s thighs (butterfly hooks). Primary weapon is the butterfly sweep; also sets up back takes and single-leg attacks.',
    videos: [
      { label: 'Butterfly Guard System', url: yt('bjj butterfly guard tutorial marcelo garcia') },
      { label: 'Butterfly Sweep', url: yt('bjj butterfly sweep elevator tutorial') },
    ],
  },
  {
    term: 'De La Riva Guard',
    category: 'Guards',
    definition:
      'One foot hooks around the outside of the opponent\'s lead leg while the same-side hand grips the ankle. Strong platform for back takes, berimbolo entries, and DLR sweep.',
    videos: [
      { label: 'De La Riva Tutorial', url: yt('bjj de la riva guard tutorial') },
      { label: 'DLR Sweeps & Back Takes', url: yt('bjj de la riva sweep back take') },
    ],
  },
  {
    term: 'Spider Guard',
    category: 'Guards',
    definition:
      'Both feet press into the opponent\'s biceps while both hands control the sleeves. Excellent for lasso transitions, triangle setups, and omoplata attacks.',
    videos: [
      { label: 'Spider Guard Tutorial', url: yt('bjj spider guard tutorial gi') },
      { label: 'Spider Guard Attacks', url: yt('bjj spider guard sweeps triangle omoplata') },
    ],
  },
  {
    term: 'Lasso Guard',
    category: 'Guards',
    definition:
      'One leg wraps around the opponent\'s arm from the outside (lasso), controlling the sleeve. Creates strong off-balance setups for sweeps and triangle/omoplata attacks.',
    videos: [
      { label: 'Lasso Guard Tutorial', url: yt('bjj lasso guard tutorial') },
      { label: 'Lasso Sweeps', url: yt('bjj lasso guard sweeps attacks') },
    ],
  },
  {
    term: 'X-Guard',
    category: 'Guards',
    definition:
      'Bottom player sits under the opponent with two hooks inside both legs, creating a destabilizing frame. Primary attacks are standing sweeps — kick the legs out or lift for a takedown.',
    videos: [
      { label: 'X-Guard Tutorial', url: yt('bjj x guard tutorial marcelo garcia') },
      { label: 'X-Guard Sweeps', url: yt('bjj x guard sweeps standing') },
    ],
  },

  // ── Submissions ────────────────────────────────────────────────────────────
  {
    term: 'Armbar',
    category: 'Submissions',
    definition:
      'Hyperextend the opponent\'s elbow by isolating the arm across your hips. Available from mount, guard, back control, and side control — keep hips high and squeeze the knees.',
    videos: [
      { label: 'Armbar Fundamentals', url: yt('bjj armbar tutorial fundamentals') },
      { label: 'Armbar from Guard & Mount', url: yt('bjj armbar from guard mount details') },
    ],
  },
  {
    term: 'Triangle Choke',
    category: 'Submissions',
    definition:
      'Lock one arm and the opponent\'s neck between your legs in a figure-four. Cut the angle, pull the head down, and squeeze the knees to finish. High percentage from guard.',
    videos: [
      { label: 'Triangle Choke Tutorial', url: yt('bjj triangle choke tutorial step by step') },
      { label: 'Triangle Setup & Finish', url: yt('bjj triangle choke setup finish details') },
    ],
  },
  {
    term: 'Rear Naked Choke',
    category: 'Submissions',
    definition:
      'Blood choke applied from back control — one arm under the chin, the other arm behind the head creating a figure-four. The most common submission in grappling and MMA.',
    videos: [
      { label: 'RNC Tutorial', url: yt('rear naked choke tutorial bjj details') },
      { label: 'RNC Finish Details', url: yt('bjj rear naked choke finish technique') },
    ],
  },
  {
    term: 'Guillotine',
    category: 'Submissions',
    definition:
      'Arm wraps around the opponent\'s neck from the front, typically when they shoot or lower their head. Arm-in and arm-out variations — pull up on the neck and squeeze the elbow tight.',
    videos: [
      { label: 'Guillotine Tutorial', url: yt('bjj guillotine choke tutorial') },
      { label: 'Arm-In Guillotine', url: yt('bjj arm in guillotine technique') },
    ],
  },
  {
    term: 'Kimura',
    category: 'Submissions',
    definition:
      'Figure-four shoulder lock targeting the rotator cuff — grip your own wrist and rotate the arm up behind the back. Available from top half guard, north-south, and guard bottom.',
    videos: [
      { label: 'Kimura Tutorial', url: yt('bjj kimura tutorial fundamentals') },
      { label: 'Kimura Attack System', url: yt('bjj kimura trap system attack') },
    ],
  },
  {
    term: 'Americana',
    category: 'Submissions',
    definition:
      'Figure-four shoulder lock in the opposite direction from the kimura — bend the arm to 90° and lever the wrist toward the mat. Common from mount and side control.',
    videos: [
      { label: 'Americana Tutorial', url: yt('bjj americana shoulder lock tutorial') },
      { label: 'Americana from Mount', url: yt('bjj americana from mount side control') },
    ],
  },
  {
    term: 'Omoplata',
    category: 'Submissions',
    definition:
      'Shoulder lock where you use both legs to rotate the opponent\'s arm behind their back. Initiated from guard — great submission but also a strong sweep if they roll.',
    videos: [
      { label: 'Omoplata Tutorial', url: yt('bjj omoplata tutorial from guard') },
      { label: 'Omoplata Sweep & Finish', url: yt('bjj omoplata sweep finish technique') },
    ],
  },
  {
    term: 'Heel Hook',
    category: 'Submissions',
    definition:
      'Leg entanglement submission that torques the knee by wrapping the heel and rotating the foot. Inside heel hook (lower risk) and outside heel hook (high force, high damage). Legal at brown/black belt in many rulesets.',
    videos: [
      { label: 'Inside Heel Hook Tutorial', url: yt('bjj inside heel hook tutorial') },
      { label: 'Heel Hook Leg Lock System', url: yt('bjj heel hook leg lock entry system') },
    ],
  },
  {
    term: 'Bow and Arrow Choke',
    category: 'Submissions',
    definition:
      'Gi choke from back control — pull the collar with one hand, hook the opponent\'s far leg, and extend your body. One of the tightest finishes from the back.',
    videos: [
      { label: 'Bow and Arrow Tutorial', url: yt('bjj bow and arrow choke tutorial gi') },
      { label: 'Back Control to Bow & Arrow', url: yt('bjj back control bow arrow finish') },
    ],
  },
  {
    term: "D'Arce Choke",
    category: 'Submissions',
    definition:
      'Arm-in triangle choke where your arm threads under the opponent\'s arm and behind the neck, creating a figure-four with your own arm. Applied from turtle, side control scrambles, and front headlock.',
    videos: [
      { label: "D'Arce Choke Tutorial", url: yt('bjj darce choke tutorial') },
      { label: "D'Arce from Turtle", url: yt('bjj darce choke from turtle front headlock') },
    ],
  },

  // ── Sweeps ─────────────────────────────────────────────────────────────────
  {
    term: 'Scissor Sweep',
    category: 'Sweeps',
    definition:
      'From closed guard: push one knee forward with your shin while pulling the other down like scissors to topple the opponent. Requires breaking posture first.',
    videos: [
      { label: 'Scissor Sweep Tutorial', url: yt('bjj scissor sweep from closed guard tutorial') },
      { label: 'Scissor Sweep Details', url: yt('bjj scissor sweep mechanics timing') },
    ],
  },
  {
    term: 'Hip Bump Sweep',
    category: 'Sweeps',
    definition:
      'From closed guard: sit up, post on one arm, and drive your hip into the opponent\'s torso to throw them off balance. Sets up the kimura and guillotine if they post.',
    videos: [
      { label: 'Hip Bump Sweep Tutorial', url: yt('bjj hip bump sweep tutorial') },
      { label: 'Hip Bump Kimura Combo', url: yt('bjj hip bump sweep kimura combination') },
    ],
  },
  {
    term: 'Flower Sweep',
    category: 'Sweeps',
    definition:
      'From closed guard: reach back to grab the ankle, bridge, and roll them over the captured leg. Works well when the opponent puts weight forward.',
    videos: [
      { label: 'Flower Sweep Tutorial', url: yt('bjj flower sweep pendulum closed guard') },
      { label: 'Flower Sweep Details', url: yt('bjj flower sweep technique details') },
    ],
  },
  {
    term: 'Elevator Sweep',
    category: 'Sweeps',
    definition:
      'From butterfly guard: underhook one arm, hook the leg with your butterfly hook, and lift to come on top. The underhook side is the direction you sweep.',
    videos: [
      { label: 'Elevator Sweep Tutorial', url: yt('bjj elevator sweep butterfly guard tutorial') },
      { label: 'Butterfly Guard Sweeps', url: yt('bjj butterfly guard sweep system') },
    ],
  },
  {
    term: 'Sickle Sweep',
    category: 'Sweeps',
    definition:
      'From seated/open guard: hook behind the opponent\'s far heel with your leg and pull while pushing the near knee — breaks their base and puts them on their back.',
    videos: [
      { label: 'Sickle Sweep Tutorial', url: yt('bjj sickle sweep open guard tutorial') },
      { label: 'Hook Sweep Details', url: yt('bjj hook sweep standing opponent') },
    ],
  },

  // ── Escapes & Movements ────────────────────────────────────────────────────
  {
    term: 'Shrimping',
    category: 'Escapes & Movements',
    definition:
      'Hip escape movement — push off one foot, turn on your side, and drive your hips away to create space. The foundational movement for escaping bottom positions and recovering guard.',
    videos: [
      { label: 'Shrimping Tutorial', url: yt('bjj shrimping hip escape tutorial fundamentals') },
      { label: 'Shrimping Drills', url: yt('bjj shrimping drills guard recovery') },
    ],
  },
  {
    term: 'Bridge (Upa)',
    category: 'Escapes & Movements',
    definition:
      'Explosive hip thrust from flat on your back — plant your feet, grab the opponent, bridge and roll. Primary escape from mount and the first move white belts should master.',
    videos: [
      { label: 'Bridge & Roll Tutorial', url: yt('bjj bridge and roll upa mount escape tutorial') },
      { label: 'Upa Details', url: yt('bjj upa escape from mount technique') },
    ],
  },
  {
    term: 'Granby Roll',
    category: 'Escapes & Movements',
    definition:
      'Inversional roll used to escape leg rides, turtle attacks, and certain guard passing scenarios. Roll over the shoulder to invert and re-guard or create scrambles.',
    videos: [
      { label: 'Granby Roll Tutorial', url: yt('bjj granby roll tutorial escape') },
      { label: 'Granby in Sparring', url: yt('bjj granby roll turtle escape inversion') },
    ],
  },
  {
    term: 'Elbow-Knee Escape',
    category: 'Escapes & Movements',
    definition:
      'Escape from mount: shrimp to create space, bring the knee across the opponent\'s thigh, and recover half or full guard. Also called the "elbow escape" — the highest-percentage mount escape.',
    videos: [
      { label: 'Elbow-Knee Escape Tutorial', url: yt('bjj elbow knee escape from mount tutorial') },
      { label: 'Mount Escape Details', url: yt('bjj mount escape shrimp elbow knee') },
    ],
  },
  {
    term: 'Trap and Roll',
    category: 'Escapes & Movements',
    definition:
      'Mount escape combining the bridge and arm trap — control one arm and the same-side foot, then bridge and roll to end up in their guard. Often paired with the elbow-knee escape.',
    videos: [
      { label: 'Trap and Roll Tutorial', url: yt('bjj trap and roll mount escape tutorial') },
      { label: 'Bridge & Roll vs Elbow Escape', url: yt('bjj mount escape trap roll vs elbow knee') },
    ],
  },

  // ── Concepts ───────────────────────────────────────────────────────────────
  {
    term: 'Base',
    category: 'Concepts',
    definition:
      'The stability of your position relative to your center of gravity. Good base = hard to sweep or off-balance. Widen your stance and lower your hips to improve base when passing or in top positions.',
    videos: [
      { label: 'Base & Balance Tutorial', url: yt('bjj base balance fundamentals tutorial') },
      { label: 'Base in Guard Passing', url: yt('bjj base posture guard passing') },
    ],
  },
  {
    term: 'Posture',
    category: 'Concepts',
    definition:
      'Keeping your spine upright and head up, especially in guard. Good posture prevents chokes and setups from bottom. The guard player\'s first job is to break posture.',
    videos: [
      { label: 'Posture in Guard', url: yt('bjj posture in guard tutorial') },
      { label: 'Breaking Posture', url: yt('bjj breaking guard posture technique') },
    ],
  },
  {
    term: 'Frames',
    category: 'Concepts',
    definition:
      'Using your forearms, shins, or knees as rigid structures against the opponent\'s joints or body to create and maintain space. Essential for guard retention and escaping bad positions.',
    videos: [
      { label: 'Framing Tutorial', url: yt('bjj framing frames tutorial create space') },
      { label: 'Frames in Guard Retention', url: yt('bjj frames guard retention escapes') },
    ],
  },
  {
    term: 'Grips',
    category: 'Concepts',
    definition:
      'Controlling the opponent\'s collar, sleeves, wrists, or ankles to dictate movement. Grip fighting is often the match before the match — whoever establishes grips first usually controls the action.',
    videos: [
      { label: 'Grip Fighting Tutorial', url: yt('bjj grip fighting tutorial fundamentals') },
      { label: 'Grip Breaks & Controls', url: yt('bjj grip breaks and grip control') },
    ],
  },
  {
    term: 'Pressure',
    category: 'Concepts',
    definition:
      'Applying controlled body weight through chest, hips, or cross-face to flatten and tire the opponent. Heavy, directional pressure is a key tool in top positions — stay dense and eliminate space.',
    videos: [
      { label: 'Pressure Passing Tutorial', url: yt('bjj pressure passing tutorial') },
      { label: 'Top Pressure Details', url: yt('bjj top pressure side control mount') },
    ],
  },
  {
    term: 'Kuzushi (Off-Balancing)',
    category: 'Concepts',
    definition:
      'Breaking the opponent\'s balance and structure before executing a technique. A sweep without kuzushi requires strength; with kuzushi, it requires timing. Pull, push, or angle first.',
    videos: [
      { label: 'Off-Balancing Tutorial', url: yt('bjj off balancing kuzushi before sweep') },
      { label: 'Breaking Balance for Sweeps', url: yt('bjj breaking balance timing sweeps') },
    ],
  },
  {
    term: 'Transition',
    category: 'Concepts',
    definition:
      'The brief moment between positions where neither player has established control. Most submissions and counters happen in transitions — stay active and anticipate rather than react.',
    videos: [
      { label: 'Transitions Tutorial', url: yt('bjj transitions between positions tutorial') },
      { label: 'Scrambles & Transitions', url: yt('bjj scrambles transitions fundamentals') },
    ],
  },
];
