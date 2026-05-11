export interface BJJTerm {
  term: string;
  category: string;
  definition: string;
}

export const bjjTerms: BJJTerm[] = [
  // Positions
  {
    term: 'Closed Guard',
    category: 'Positions',
    definition:
      'Bottom player locks ankles behind the top player\'s back, controlling distance and preventing posture. From here you can attack with triangles, armbars, sweeps, and chokes.',
  },
  {
    term: 'Half Guard',
    category: 'Positions',
    definition:
      'Bottom player captures one of top player\'s legs between their own. Bottom goal is to recover full guard or take the back; top goal is to flatten out and pass.',
  },
  {
    term: 'Side Control',
    category: 'Positions',
    definition:
      'Top player controls their opponent from the side, hips-to-hips, with chest pressure. A dominant position with direct paths to mount, knee-on-belly, and arm attacks.',
  },
  {
    term: 'Mount',
    category: 'Positions',
    definition:
      'Top player sits on the opponent\'s torso with knees on the mat. High-percentage submissions (armbar, cross choke, ezekiel) are available. The opponent\'s primary escape is the elbow-knee or bridge-and-roll.',
  },
  {
    term: 'Back Control',
    category: 'Positions',
    definition:
      'Attacker is behind the opponent with both hooks (or body triangle) in, seatbelt grip secured. The highest-value position in BJJ — rear naked choke and bow-and-arrow are the primary finishes.',
  },
  {
    term: 'Turtle',
    category: 'Positions',
    definition:
      'Defensive position where the bottom player is on all fours protecting their neck and arms. Common transition point — attacker looks to take the back; defender looks to sit out or recover guard.',
  },
  {
    term: 'Knee-on-Belly',
    category: 'Positions',
    definition:
      'Top player places a knee on the opponent\'s belly while the other leg posts out for base. Creates pressure and sets up arm attacks or transitions to mount and back.',
  },
  {
    term: 'North-South',
    category: 'Positions',
    definition:
      'Top player is perpendicular across the opponent\'s chest, head-to-hips. Used to control, tire the opponent, and attack with north-south choke or kimura.',
  },

  // Guards
  {
    term: 'Open Guard',
    category: 'Guards',
    definition:
      'Bottom player\'s legs are not locked but actively framing, pushing, and creating angles. Encompasses dozens of specific guard variants — the key is constant hip movement and grip fighting.',
  },
  {
    term: 'Butterfly Guard',
    category: 'Guards',
    definition:
      'Bottom player sits up with both feet hooked inside the opponent\'s thighs (butterfly hooks). Primary weapon is the butterfly sweep; also sets up back takes and single-leg attacks.',
  },
  {
    term: 'De La Riva Guard',
    category: 'Guards',
    definition:
      'One foot hooks around the outside of the opponent\'s lead leg while the same-side hand grips the ankle. Strong platform for back takes, berimbolo entries, and DLR sweep.',
  },
  {
    term: 'Spider Guard',
    category: 'Guards',
    definition:
      'Both feet press into the opponent\'s biceps while both hands control the sleeves. Excellent for lasso transitions, triangle setups, and omoplata attacks.',
  },
  {
    term: 'Lasso Guard',
    category: 'Guards',
    definition:
      'One leg wraps around the opponent\'s arm from the outside (lasso), controlling the sleeve. Creates strong off-balance setups for sweeps and triangle/omoplata attacks.',
  },
  {
    term: 'X-Guard',
    category: 'Guards',
    definition:
      'Bottom player sits under the opponent with two hooks inside both legs, creating a destabilizing frame. Primary attacks are standing sweeps — kick the legs out or lift for a takedown.',
  },

  // Submissions
  {
    term: 'Armbar',
    category: 'Submissions',
    definition:
      'Hyperextend the opponent\'s elbow by isolating the arm across your hips. Available from mount, guard, back control, and side control — keep hips high and squeeze the knees.',
  },
  {
    term: 'Triangle Choke',
    category: 'Submissions',
    definition:
      'Lock one arm and the opponent\'s neck between your legs in a figure-four. Cut the angle, pull the head down, and squeeze the knees to finish. High percentage from guard.',
  },
  {
    term: 'Rear Naked Choke',
    category: 'Submissions',
    definition:
      'Blood choke applied from back control — one arm under the chin, the other arm behind the head creating a figure-four. The most common submission in grappling and MMA.',
  },
  {
    term: 'Guillotine',
    category: 'Submissions',
    definition:
      'Arm wraps around the opponent\'s neck from the front, typically when they shoot or lower their head. Arm-in and arm-out variations — pull up on the neck and squeeze the elbow tight.',
  },
  {
    term: 'Kimura',
    category: 'Submissions',
    definition:
      'Figure-four shoulder lock targeting the rotator cuff — grip your own wrist and rotate the arm up behind the back. Available from top half guard, north-south, and guard bottom.',
  },
  {
    term: 'Americana',
    category: 'Submissions',
    definition:
      'Figure-four shoulder lock in the opposite direction from the kimura — bend the arm to 90° and lever the wrist toward the mat. Common from mount and side control.',
  },
  {
    term: 'Omoplata',
    category: 'Submissions',
    definition:
      'Shoulder lock where you use both legs to rotate the opponent\'s arm behind their back. Initiated from guard — great submission but also a strong sweep if they roll.',
  },
  {
    term: 'Heel Hook',
    category: 'Submissions',
    definition:
      'Leg entanglement submission that torques the knee by wrapping the heel and rotating the foot. Inside heel hook (lower risk) and outside heel hook (high force, high damage). Legal at brown/black belt in many rulesets.',
  },
  {
    term: 'Bow and Arrow Choke',
    category: 'Submissions',
    definition:
      'Gi choke from back control — pull the collar with one hand, hook the opponent\'s far leg, and extend your body. One of the tightest finishes from the back.',
  },
  {
    term: "D'Arce Choke",
    category: 'Submissions',
    definition:
      'Arm-in triangle choke where your arm threads under the opponent\'s arm and behind the neck, creating a figure-four with your own arm. Applied from turtle, side control scrambles, and front headlock.',
  },

  // Sweeps
  {
    term: 'Scissor Sweep',
    category: 'Sweeps',
    definition:
      'From closed guard: push one knee forward with your shin while pulling the other down like scissors to topple the opponent. Requires breaking posture first.',
  },
  {
    term: 'Hip Bump Sweep',
    category: 'Sweeps',
    definition:
      'From closed guard: sit up, post on one arm, and drive your hip into the opponent\'s torso to throw them off balance. Sets up the kimura and guillotine if they post.',
  },
  {
    term: 'Flower Sweep',
    category: 'Sweeps',
    definition:
      'From closed guard: reach back to grab the ankle, bridge, and roll them over the captured leg. Works well when the opponent puts weight forward.',
  },
  {
    term: 'Elevator Sweep',
    category: 'Sweeps',
    definition:
      'From butterfly guard: underhook one arm, hook the leg with your butterfly hook, and lift to come on top. The underhook side is the direction you sweep.',
  },
  {
    term: 'Sickle Sweep',
    category: 'Sweeps',
    definition:
      'From seated/open guard: hook behind the opponent\'s far heel with your leg and pull while pushing the near knee — breaks their base and puts them on their back.',
  },

  // Escapes & Movements
  {
    term: 'Shrimping',
    category: 'Escapes & Movements',
    definition:
      'Hip escape movement — push off one foot, turn on your side, and drive your hips away to create space. The foundational movement for escaping bottom positions and recovering guard.',
  },
  {
    term: 'Bridge (Upa)',
    category: 'Escapes & Movements',
    definition:
      'Explosive hip thrust from flat on your back — plant your feet, grab the opponent, bridge and roll. Primary escape from mount and the first move white belts should master.',
  },
  {
    term: 'Granby Roll',
    category: 'Escapes & Movements',
    definition:
      'Inversional roll used to escape leg rides, turtle attacks, and certain guard passing scenarios. Roll over the shoulder to invert and re-guard or create scrambles.',
  },
  {
    term: 'Elbow-Knee Escape',
    category: 'Escapes & Movements',
    definition:
      'Escape from mount: shrimp to create space, bring the knee across the opponent\'s thigh, and recover half or full guard. Also called the "elbow escape" — the highest-percentage mount escape.',
  },
  {
    term: 'Trap and Roll',
    category: 'Escapes & Movements',
    definition:
      'Mount escape combining the bridge and arm trap — control one arm and the same-side foot, then bridge and roll to end up in their guard. Often paired with the elbow-knee escape.',
  },

  // Concepts
  {
    term: 'Base',
    category: 'Concepts',
    definition:
      'The stability of your position relative to your center of gravity. Good base = hard to sweep or off-balance. Widen your stance and lower your hips to improve base when passing or in top positions.',
  },
  {
    term: 'Posture',
    category: 'Concepts',
    definition:
      'Keeping your spine upright and head up, especially in guard. Good posture prevents chokes and setups from bottom. The guard player\'s first job is to break posture.',
  },
  {
    term: 'Frames',
    category: 'Concepts',
    definition:
      'Using your forearms, shins, or knees as rigid structures against the opponent\'s joints or body to create and maintain space. Essential for guard retention and escaping bad positions.',
  },
  {
    term: 'Grips',
    category: 'Concepts',
    definition:
      'Controlling the opponent\'s collar, sleeves, wrists, or ankles to dictate movement. Grip fighting is often the match before the match — whoever establishes grips first usually controls the action.',
  },
  {
    term: 'Pressure',
    category: 'Concepts',
    definition:
      'Applying controlled body weight through chest, hips, or cross-face to flatten and tire the opponent. Heavy, directional pressure is a key tool in top positions — stay dense and eliminate space.',
  },
  {
    term: 'Kuzushi (Off-Balancing)',
    category: 'Concepts',
    definition:
      'Breaking the opponent\'s balance and structure before executing a technique. A sweep without kuzushi requires strength; with kuzushi, it requires timing. Pull, push, or angle first.',
  },
  {
    term: 'Transition',
    category: 'Concepts',
    definition:
      'The brief moment between positions where neither player has established control. Most submissions and counters happen in transitions — stay active and anticipate rather than react.',
  },
];
