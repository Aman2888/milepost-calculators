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
  | "key"
  | "scan"
  | "alert"
  | "star"
  | "chat";

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
  /**
   * For a calculator: the formula. For a lookup: where the data comes from.
   * The page labels it to match.
   */
  formula: string;
  tips: string[];
  example?: string;
  /** "lookup" tools fetch official NHTSA data. Everything else is a calculator. */
  kind?: "calculator" | "lookup";
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
    title: "Fuel Cost Calculator: Cost of a Trip in Gas",
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
    title: "MPG Calculator: Find Your Real Fuel Economy",
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
    title: "EV Charging Cost Calculator: Cost per Charge",
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
    title: "Road Trip Cost Calculator: Fuel, Tolls, Split",
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
    title: "Tire Size Calculator: Diameter and Speedometer",
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
    title: "Car Depreciation Calculator: Value Over Time",
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
    title: "Wheel Offset Calculator: Inner and Outer Shift",
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
    title: "Horsepower Converter: HP to kW and PS",
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
    title: "Cost Per Mile Calculator: True Cost of Driving",
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
    title: "Auto Loan Calculator: Payment and Interest",
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
  {
    slug: "vin-decoder",
    kind: "lookup",
    name: "VIN Decoder",
    short: "Type a 17-character VIN to see the make, model, year, engine and body type.",
    enter: "a 17-character VIN",
    get: "year, make, model, engine, body type",
    glyph: "scan",
    tone: "blue",
    title: "VIN Decoder: Make, Model, Year and Engine",
    description:
      "Enter a 17-character VIN to see the year, make, model, engine, body type and more, straight from the official NHTSA vehicle database.",
    formula:
      "Your VIN is checked against NHTSA’s vPIC (Vehicle Product Information Catalog), the same database behind the NHTSA VIN decoder. Makers register how each VIN is built, and vPIC reads the code back to you.",
    tips: [
      "The VIN is on the dashboard by the windshield, on the driver’s door jamb sticker, and on your registration and insurance card.",
      "A VIN never contains the letters I, O or Q. If you see one, it is probably a 1 or a 0.",
      "The decoder reads how the car was built at the factory. Options added later, paint changes and trim packages may not show up.",
      "Anyone can look up a VIN, so avoid posting yours next to personal details online.",
    ],
  },
  {
    slug: "recall-checker",
    kind: "lookup",
    name: "Recall Checker",
    short: "See the safety recalls issued for any year, make and model.",
    enter: "year, make, model",
    get: "recalls and what the fix is",
    glyph: "alert",
    tone: "red",
    title: "Recall Checker: Safety Recalls by Model",
    description:
      "Pick a year, make and model to see the safety recalls NHTSA has on file, what could go wrong and how the maker fixes it.",
    formula:
      "Recalls come from NHTSA’s recall database, which collects every safety recall campaign that car makers report in the United States. Results are listed newest first.",
    tips: [
      "This lists recalls issued for the model year. It cannot tell you whether your particular car has been fixed. Use NHTSA’s VIN recall search at nhtsa.gov/recalls for that.",
      "Recall repairs are free at a franchised dealer, whatever the age or mileage of the car.",
      "“Do not drive” and “park outside” notes are the most urgent. Contact a dealer straight away if your car is listed with one.",
      "Buying a used car? Check recalls before you pay, and again after the sale in case new ones appear.",
    ],
  },
  {
    slug: "vehicle-safety-ratings",
    kind: "lookup",
    name: "Vehicle Safety Ratings",
    short: "Look up NHTSA’s crash-test star ratings for a year, make and model.",
    enter: "year, make, model",
    get: "crash and rollover star ratings",
    glyph: "star",
    tone: "green",
    title: "Vehicle Safety Ratings: NHTSA Crash-Test Stars",
    description:
      "Pick a year, make and model to see its NHTSA 5-Star Safety Ratings for frontal crash, side crash and rollover, plus the safety technology it offers.",
    formula:
      "Ratings come from NHTSA’s New Car Assessment Program (NCAP). NHTSA crash-tests new vehicles and scores them from one to five stars, with five the best.",
    tips: [
      "Compare cars of a similar size and weight. A five-star small car and a five-star large SUV do not protect their passengers equally in a collision with each other.",
      "Many models have no rating at all. Trucks, vans and low-volume cars are often not tested.",
      "A model year can have several ratings, one for each body style or drive type. Check the one that matches your car.",
      "NHTSA ratings are separate from the Insurance Institute for Highway Safety (IIHS) tests. It is worth checking both.",
    ],
  },
  {
    slug: "common-problems-lookup",
    kind: "lookup",
    name: "Common Problems Lookup",
    short: "See what owners complain about most on a given year, make and model.",
    enter: "year, make, model",
    get: "complaints grouped by problem area",
    glyph: "chat",
    tone: "yellow",
    title: "Common Problems Lookup: Owner Complaints",
    description:
      "Pick a year, make and model to see which problem areas owners report most, with the latest complaints filed with NHTSA.",
    formula:
      "Complaints come from NHTSA’s consumer complaint database. Owners file a report and NHTSA tags it with the parts involved. Problem areas are counted across every complaint for that model year.",
    tips: [
      "Complaints are owner reports, not confirmed defects. NHTSA does not check each one.",
      "Popular cars collect more complaints simply because more of them are on the road. Look at which areas stand out, not only the total.",
      "Check the same problem across a few model years. A trouble spot that disappears in a later year is often a sign it was fixed.",
      "Pair this with the Recall Checker. A common complaint that has a recall is usually one you can get repaired for free.",
    ],
  },
];

export const getTool = (slug: string) => tools.find((t) => t.slug === slug);
