export type GlyphName =
  | "pump"
  | "gauge"
  | "plug"
  | "route"
  | "tire"
  | "trend"
  | "offset"
  | "bolt"
  | "coin"
  | "key";

export type ShieldTone = "blue" | "red" | "yellow" | "green" | "ink";

export type Tool = {
  slug: string;
  name: string;
  /** one friendly sentence, used on cards */
  short: string;
  enter: string;
  get: string;
  glyph: GlyphName;
  tone: ShieldTone;
  title: string;
  description: string;
  formula: string;
  tips: string[];
  example?: string;
};

export const tools: Tool[] = [
  {
    slug: "fuel-cost-calculator",
    name: "Fuel Cost Calculator",
    short: "Find out what a trip will cost you in gas before you leave.",
    enter: "distance, MPG, fuel price",
    get: "trip fuel cost",
    glyph: "pump",
    tone: "red",
    title: "Fuel Cost Calculator: what will your trip cost in gas?",
    description:
      "Enter the distance, your car's MPG and the price of fuel to see what a trip will cost in gas, plus the cost per mile.",
    formula: "Fuel cost = distance ÷ MPG × price per gallon",
    tips: [
      "Use the MPG your car actually gets (the trip computer average is a good source), not the number on the window sticker.",
      "Steady highway speeds above 65 mph usually lower MPG, so leave a little margin on long drives.",
      "Towing, a roof box or a full load all push fuel use up noticeably.",
    ],
    example: "300 miles at 28 MPG and $3.45 a gallon costs about $36.96.",
  },
  {
    slug: "mpg-calculator",
    name: "MPG Calculator",
    short: "Turn the miles you drove and the gas you used into your real MPG.",
    enter: "miles driven, gallons used",
    get: "miles per gallon (and L/100 km)",
    glyph: "gauge",
    tone: "blue",
    title: "MPG Calculator: work out your real fuel economy",
    description:
      "Enter the miles you drove and the gallons you filled up to get your actual miles per gallon, with L/100 km and km/L too.",
    formula: "MPG = miles driven ÷ gallons used",
    tips: [
      "Fill the tank, reset the trip meter, drive normally, then fill up again. The gallons you add is the number to enter.",
      "Use the same pump (or at least the same shut-off click) each time so the readings are comparable.",
      "One tank can mislead you. Average three or four fill-ups for a figure you can trust.",
    ],
    example: "420 miles on 13.5 gallons works out to 31.1 MPG.",
  },
  {
    slug: "ev-charging-cost-calculator",
    name: "EV Charging Cost Calculator",
    short: "See what a charge costs at home or at a public charger.",
    enter: "battery kWh, electricity rate",
    get: "cost of a full charge",
    glyph: "plug",
    tone: "green",
    title: "EV Charging Cost Calculator: what does a full charge cost?",
    description:
      "Enter your battery size and electricity rate to see what a full (or partial) charge costs, how much range it adds and the cost per mile.",
    formula:
      "Cost = battery kWh × (end % − start %) ÷ charging efficiency × price per kWh",
    tips: [
      "Some energy is lost as heat while charging, which is why the wall draws more than the battery receives. 85 to 95% is a common range.",
      "Home rates are usually the cheapest. Public fast chargers often cost two to three times as much per kWh.",
      "If you are on a time-of-use plan, use the overnight rate for home charging.",
    ],
  },
  {
    slug: "road-trip-cost-calculator",
    name: "Road Trip Cost Calculator",
    short: "Add up fuel, tolls and extras, then split it between everyone in the car.",
    enter: "miles, MPG, gas price, tolls",
    get: "total trip cost",
    glyph: "route",
    tone: "yellow",
    title: "Road Trip Cost Calculator: fuel, tolls and cost per person",
    description:
      "Work out the total cost of a road trip from distance, MPG, gas price and tolls, and see how much each traveler pays.",
    formula: "Total = fuel + tolls + other costs, where fuel = total miles ÷ MPG × gas price",
    tips: [
      "Enter the one-way distance and tolls, then switch on round trip. Both are doubled for you.",
      "Put food, lodging and parking in the “other costs” box so the per-person figure covers the whole trip.",
      "Detours and city driving add miles. Round the distance up a little.",
    ],
  },
  {
    slug: "tire-size-calculator",
    name: "Tire Size Calculator",
    short: "Check how a new tire size changes your speedometer and ride height.",
    enter: "old and new tire sizes",
    get: "diameter and speed difference",
    glyph: "tire",
    tone: "ink",
    title: "Tire Size Calculator: compare diameters and speedometer error",
    description:
      "Compare two tire sizes to see the change in overall diameter, sidewall height and how far off your speedometer will read.",
    formula:
      "Diameter = rim × 25.4 + 2 × (width × aspect ÷ 100) mm. Actual speed = indicated speed × new diameter ÷ old diameter",
    tips: [
      "Most guides suggest staying within about 3% of the original diameter so the speedometer, gearing and ABS keep working as designed.",
      "A taller tire makes the speedometer read lower than your real speed. A shorter one makes it read higher.",
      "Read the size off the tire sidewall. It looks like 225/45R17: width, aspect ratio, then rim size.",
    ],
  },
  {
    slug: "car-depreciation-calculator",
    name: "Car Depreciation Calculator",
    short: "Estimate what a car is worth today and in a few years.",
    enter: "price, age, yearly depreciation",
    get: "current and future value",
    glyph: "trend",
    tone: "red",
    title: "Car Depreciation Calculator: current and future value",
    description:
      "Enter the purchase price, the car's age and a yearly depreciation rate to estimate its value today and in the years ahead.",
    formula: "Value = purchase price × (1 − yearly rate) ^ years",
    tips: [
      "Cars usually lose the most in the first few years, so a single flat rate is an approximation. Use a higher rate for newer cars.",
      "Mileage, condition and the model's reputation all move the real number. Check listings for similar cars to confirm.",
      "Try two or three rates to see a range instead of one figure.",
    ],
  },
  {
    slug: "wheel-offset-calculator",
    name: "Wheel Offset Calculator",
    short: "See how new wheels will sit in the arches before you buy them.",
    enter: "wheel width and offset",
    get: "inner and outer position change",
    glyph: "offset",
    tone: "blue",
    title: "Wheel Offset Calculator: inner and outer position change",
    description:
      "Compare the width and offset of your current and new wheels to see how far the inner and outer edges move.",
    formula:
      "Inner edge = width ÷ 2 + offset. Outer edge = width ÷ 2 − offset (distances from the hub mounting face, in mm)",
    tips: [
      "Offset (ET) is printed on the back of the wheel or inside the spokes, in millimetres.",
      "A lower offset pushes the wheel outward. A higher offset pulls it in toward the suspension.",
      "This ignores the tire. Check clearance to the strut, brakes and fender with the real tire mounted.",
    ],
  },
  {
    slug: "horsepower-converter",
    name: "Horsepower Converter",
    short: "Convert between horsepower, kilowatts and PS in one go.",
    enter: "HP, kW or PS",
    get: "the other two units",
    glyph: "bolt",
    tone: "yellow",
    title: "Horsepower Converter: HP, kW and PS",
    description:
      "Convert engine power between mechanical horsepower (hp), kilowatts (kW) and metric horsepower (PS).",
    formula: "1 hp = 0.7457 kW. 1 PS = 0.7355 kW. 1 hp = 1.0139 PS",
    tips: [
      "Horsepower (hp) here is mechanical horsepower. BHP is the same unit measured at the engine rather than the wheels.",
      "PS, CV and pk are all metric horsepower, the figure European makers often quote.",
      "Kilowatts are the standard unit for electric motors and appear on most EV spec sheets.",
    ],
  },
  {
    slug: "cost-per-mile-calculator",
    name: "Cost Per Mile Calculator",
    short: "Find out what each mile of driving really costs you.",
    enter: "fuel, insurance, maintenance, miles",
    get: "actual cost per mile",
    glyph: "coin",
    tone: "green",
    title: "Cost Per Mile Calculator: what does driving really cost?",
    description:
      "Add up fuel, insurance, maintenance and other running costs, divide by the miles you drive, and see your true cost per mile.",
    formula: "Cost per mile = (fuel + insurance + maintenance + other costs) ÷ miles driven",
    tips: [
      "Use the same period for everything. If you enter yearly costs, enter yearly miles too.",
      "Put registration, parking, tolls and car payments or depreciation in “other” for a full picture.",
      "Compare the result with the mileage rate you use for work trips to see if it is realistic.",
    ],
  },
  {
    slug: "auto-loan-calculator",
    name: "Auto Loan Calculator",
    short: "Work out the monthly payment and total interest on a car loan.",
    enter: "price, down payment, APR, term",
    get: "monthly payment",
    glyph: "key",
    tone: "ink",
    title: "Auto Loan Calculator: monthly payment and total interest",
    description:
      "Enter the price, down payment, APR and loan term to see your monthly car payment and how much interest you will pay.",
    formula:
      "Payment = P × r ÷ (1 − (1 + r) ^ −n), where P is the amount financed, r the monthly rate and n the number of months",
    tips: [
      "A longer term lowers the monthly payment but raises the total interest, sometimes by a lot.",
      "A bigger down payment or a trade-in reduces the amount financed, which cuts interest every month.",
      "Sales tax and fees differ by state. Add them in the tax field or fold fees into the price.",
    ],
  },
];

export const getTool = (slug: string) => tools.find((t) => t.slug === slug);
