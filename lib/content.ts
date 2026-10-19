import { SITE_NAME } from "@/lib/site";

/**
 * The written content that sits around each tool: a short direct answer, a
 * worked example and a few frequently asked questions. It is shown on the
 * tool page and in /llms-full.txt, so people and AI assistants read the same
 * facts. Tool pages do not emit FAQPage JSON-LD. Google retired FAQ rich
 * results on 7 May 2026.
 *
 * Every number in a worked example was produced by the same formulas the
 * calculators use.
 */

export type Faq = { q: string; a: string };

export type ToolContent = {
  /** The answer in one or two sentences, written to be quoted on its own. */
  quick: string;
  /** A worked example, for calculators. */
  worked?: string;
  faq: Faq[];
  /** Slugs of the three most related tools, used for the "More tools" links. */
  related: [string, string, string];
  /** schema.org applicationCategory */
  category: "UtilitiesApplication" | "FinanceApplication" | "ReferenceApplication";
};

export const content: Record<string, ToolContent> = {
  "fuel-cost-calculator": {
    category: "UtilitiesApplication",
    quick:
      "To work out what a trip costs in fuel, divide the distance by your car’s MPG to get the gallons needed, then multiply by the price per gallon. For example, 300 miles at 28 MPG and $3.45 a gallon costs about $36.96.",
    worked:
      "300 miles ÷ 28 MPG = 10.71 gallons. 10.71 gallons × $3.45 = $36.96, which is about 12.3 cents per mile.",
    faq: [
      {
        q: "How do I calculate the fuel cost of a trip?",
        a: "Divide the trip distance by your car’s miles per gallon to get the gallons you will use, then multiply by the price per gallon. Leave a little margin for traffic, hills and highway speeds, which all lower MPG.",
      },
      {
        q: "How do I find my car’s real MPG?",
        a: "Fill the tank, reset the trip meter, drive normally, then fill up again. Divide the miles driven by the gallons you added. The MPG Calculator on this site does the sum, and averaging a few fill-ups gives the most reliable figure.",
      },
      {
        q: "Does this include tolls, food or parking?",
        a: "No, it covers fuel only. The Road Trip Cost Calculator adds tolls and other costs and splits the total between everyone in the car.",
      },
      {
        q: "Why is my real fuel cost higher than the estimate?",
        a: "Speed, towing, roof boxes, cold weather, low tire pressure and hard acceleration all reduce MPG. Use the MPG you actually get rather than the window-sticker number.",
      },
    ],
    related: ["mpg-calculator", "road-trip-cost-calculator", "cost-per-mile-calculator"],
  },

  "mpg-calculator": {
    category: "UtilitiesApplication",
    quick:
      "MPG is the miles you drove divided by the gallons of fuel you used. If you drove 420 miles and filled 13.5 gallons, your fuel economy is 31.1 MPG, or about 7.6 L/100 km.",
    worked:
      "420 miles ÷ 13.5 gallons = 31.1 MPG. In metric units that is 7.56 L/100 km (235.215 ÷ 31.1) or 13.2 km/L.",
    faq: [
      {
        q: "How do I calculate MPG?",
        a: "Divide the miles driven by the gallons of fuel used. Fill the tank, reset the trip meter, drive, then fill up again and divide the trip miles by the gallons that went in.",
      },
      {
        q: "How do I convert MPG to L/100 km?",
        a: "Divide 235.215 by the MPG figure (US gallons). 30 MPG is about 7.8 L/100 km. A lower L/100 km number means a more efficient car, the opposite of MPG.",
      },
      {
        q: "Why does my MPG change from tank to tank?",
        a: "Weather, speed, short trips, tire pressure, load and how consistently you stop at the pump’s first shut-off click all change the result. Average three or four fill-ups for a figure you can trust.",
      },
      {
        q: "What is a good MPG?",
        a: "It depends on the vehicle type. Compare your result with cars of the same size and fuel type, and with the figure on the window sticker, rather than with a single target number.",
      },
    ],
    related: ["fuel-cost-calculator", "cost-per-mile-calculator", "ev-charging-cost-calculator"],
  },

  "ev-charging-cost-calculator": {
    category: "UtilitiesApplication",
    quick:
      "Charging an EV costs the energy added to the battery, divided by charging efficiency, multiplied by your price per kWh. A 60 kWh battery charged from 0% to 100% at $0.16 per kWh and 90% efficiency costs about $10.67.",
    worked:
      "60 kWh ÷ 0.90 efficiency = 66.7 kWh drawn from the wall. 66.7 kWh × $0.16 = $10.67. At 3.5 miles per kWh that charge adds about 210 miles, roughly 5.1 cents per mile.",
    faq: [
      {
        q: "How much does it cost to charge an electric car?",
        a: "Multiply the kWh you add by the electricity price, then allow for charging losses. Home electricity is usually the cheapest option, while public DC fast chargers often cost noticeably more per kWh.",
      },
      {
        q: "What is charging efficiency?",
        a: "Some electricity is lost as heat while charging, so the wall supplies more energy than the battery receives. A figure between 85% and 95% is common.",
      },
      {
        q: "Where do I find my electricity rate per kWh?",
        a: "Look at your utility bill, which shows the price per kilowatt-hour. If you are on a time-of-use plan, use the overnight rate for home charging.",
      },
      {
        q: "How many miles does an EV get per kWh?",
        a: "It varies by vehicle, speed and weather, from roughly 2.5 to 4.5 miles per kWh. Your car’s trip computer shows your own average.",
      },
    ],
    related: ["fuel-cost-calculator", "cost-per-mile-calculator", "road-trip-cost-calculator"],
  },

  "road-trip-cost-calculator": {
    category: "UtilitiesApplication",
    quick:
      "The total cost of a road trip is fuel plus tolls plus other costs such as food and lodging, divided by the number of travelers for each person’s share. A 500-mile trip at 28 MPG and $3.45 gas with $12 tolls and $150 of other costs comes to about $223.61.",
    worked:
      "500 miles ÷ 28 MPG = 17.86 gallons × $3.45 = $61.61 of fuel. Add $12 in tolls and $150 in other costs for $223.61 in total, or $111.80 each for two travelers.",
    faq: [
      {
        q: "How do I calculate the cost of a road trip?",
        a: "Work out fuel as distance ÷ MPG × gas price, add tolls, parking, food and lodging, then divide the total by the number of travelers to get each person’s share.",
      },
      {
        q: "What does the round-trip switch do?",
        a: "It doubles the distance and the tolls you entered for one direction. Other costs, such as lodging and food, are kept exactly as typed.",
      },
      {
        q: "Which gas price should I use?",
        a: "Use the average price along your route rather than your local price. Prices vary between states and are usually higher near highway exits.",
      },
      {
        q: "How can I make a long drive cheaper?",
        a: "Drive at steady speeds, keep tires properly inflated, remove roof boxes and extra weight, and split costs between travelers.",
      },
    ],
    related: ["fuel-cost-calculator", "mpg-calculator", "cost-per-mile-calculator"],
  },

  "tire-size-calculator": {
    category: "UtilitiesApplication",
    quick:
      "A tire’s overall diameter is the rim size × 25.4 plus twice the sidewall height (width × aspect ratio ÷ 100), in millimetres. Moving from 225/45R17 to 235/40R18 makes the tire about 1.7% taller, so a speedometer reading 60 mph means you are really doing about 61 mph.",
    worked:
      "225/45R17: 17 × 25.4 + 2 × (225 × 0.45) = 634.3 mm (24.97 in). 235/40R18: 18 × 25.4 + 2 × (235 × 0.40) = 645.2 mm (25.40 in). The new tire is 1.7% taller, so 60 mph on the speedometer is about 61.0 mph.",
    faq: [
      {
        q: "How do I read a tire size like 225/45R17?",
        a: "225 is the tire width in millimetres, 45 is the aspect ratio (the sidewall height as a percentage of the width), R means radial construction, and 17 is the rim diameter in inches.",
      },
      {
        q: "How much can I change tire size safely?",
        a: "Most guides suggest staying within about 3% of the original overall diameter, so the speedometer, gearing and ABS keep working as designed. Check your owner’s manual or a tire shop for your car.",
      },
      {
        q: "Will bigger tires change my speedometer?",
        a: "A taller tire makes the speedometer read lower than your true speed, and a shorter tire makes it read higher. The odometer is affected in the same way.",
      },
      {
        q: "Do different tires change fuel economy?",
        a: "They can. Taller, wider or heavier tires change the effective gearing and rolling resistance, which can slightly alter fuel economy and acceleration.",
      },
    ],
    related: ["wheel-offset-calculator", "mpg-calculator", "cost-per-mile-calculator"],
  },

  "car-depreciation-calculator": {
    category: "FinanceApplication",
    quick:
      "A car’s value after a number of years is its purchase price × (1 − yearly depreciation rate) ^ years. A $28,000 car losing 15% a year is worth about $17,196 after 3 years and about $12,424 after 5.",
    worked:
      "$28,000 × 0.85³ = $17,195.50 after 3 years. Two years later: $17,195.50 × 0.85² = $12,423.75, which means the car has lost about 56% of its price.",
    faq: [
      {
        q: "How do I calculate car depreciation?",
        a: "Multiply the purchase price by (1 − the yearly rate) raised to the number of years. Each year the car loses the same percentage of the value it has left.",
      },
      {
        q: "How fast do cars depreciate?",
        a: "Most cars lose the largest share of their value in the first few years and then lose value more slowly. Try rates between 10% and 20% to see a realistic range for your car.",
      },
      {
        q: "What affects a car’s resale value?",
        a: "Mileage, condition, service history, accident history, the model’s reputation and market demand all move the real number.",
      },
      {
        q: "Is this the same as a trade-in or valuation quote?",
        a: "No. It is an estimate based on a single flat rate. For a real figure, compare listings for similar cars or use a valuation guide.",
      },
    ],
    related: ["auto-loan-calculator", "cost-per-mile-calculator", "vin-decoder"],
  },

  "wheel-offset-calculator": {
    category: "UtilitiesApplication",
    quick:
      "Wheel offset (ET) is the distance from the wheel’s mounting face to its centerline. The inner edge sits at half the width plus the offset, and the outer edge at half the width minus the offset. Going from an 8-inch ET35 wheel to a 9-inch ET30 moves the inner edge 7.7 mm toward the suspension and the outer edge 17.7 mm outward.",
    worked:
      "8 in wide, ET35: half the width is 101.6 mm, so the inner edge is 136.6 mm and the outer edge is 66.6 mm from the mounting face. 9 in wide, ET30: half the width is 114.3 mm, giving 144.3 mm inner and 84.3 mm outer.",
    faq: [
      {
        q: "What is wheel offset?",
        a: "Offset, written ET on the wheel, is the distance in millimetres between the hub mounting surface and the center of the wheel’s width. A lower offset pushes the wheel outward, and a higher offset pulls it inward.",
      },
      {
        q: "What is the difference between offset and backspacing?",
        a: "Backspacing is the distance from the mounting surface to the wheel’s inner lip. Offset is the distance to the wheel’s centerline. The inner edge figure in this calculator is the backspacing, measured in millimetres.",
      },
      {
        q: "Will my new wheels fit?",
        a: "Offset and width are only part of it. Also check the bolt pattern, center bore, and clearance to the strut, brakes and fender with the real tire fitted.",
      },
      {
        q: "Does a lower offset make the car wider?",
        a: "Yes. A lower offset moves the wheel and tire outward, so the track width increases and the tire sits closer to the fender.",
      },
    ],
    related: ["tire-size-calculator", "horsepower-converter", "vin-decoder"],
  },

  "horsepower-converter": {
    category: "UtilitiesApplication",
    quick:
      "One mechanical horsepower (hp) equals 0.7457 kilowatts (kW) and about 1.0139 metric horsepower (PS). That makes 300 hp equal to 223.7 kW or 304.2 PS.",
    worked: "300 hp × 0.7457 = 223.7 kW. 223.7 kW ÷ 0.7355 = 304.2 PS.",
    faq: [
      {
        q: "How do I convert horsepower to kilowatts?",
        a: "Multiply the horsepower by 0.7457. For example, 200 hp is 149.1 kW.",
      },
      {
        q: "How do I convert kilowatts to horsepower?",
        a: "Divide the kilowatts by 0.7457, or multiply by about 1.341. For example, 150 kW is about 201 hp.",
      },
      {
        q: "What is PS?",
        a: "PS (Pferdestärke, also written CV or pk) is metric horsepower, equal to 0.7355 kW. European manufacturers often quote power in PS, and 1 hp is about 1.0139 PS.",
      },
      {
        q: "What is the difference between hp, BHP and wheel horsepower?",
        a: "Brake horsepower (BHP) is measured at the engine and is treated as the same unit as hp here. Wheel horsepower is measured at the wheels and is lower because of power lost in the drivetrain.",
      },
    ],
    related: ["vin-decoder", "ev-charging-cost-calculator", "tire-size-calculator"],
  },

  "cost-per-mile-calculator": {
    category: "FinanceApplication",
    quick:
      "Cost per mile is your total running costs, such as fuel, insurance, maintenance and other expenses, divided by the miles you drove in the same period. $4,300 a year over 12,000 miles works out to about $0.358 per mile.",
    worked:
      "$1,800 fuel + $1,500 insurance + $700 maintenance + $300 other = $4,300. $4,300 ÷ 12,000 miles = $0.358 per mile, or about $358 for every 1,000 miles.",
    faq: [
      {
        q: "How do I calculate cost per mile?",
        a: "Add up what the car cost you over a period, then divide by the miles you drove in that same period. If you use yearly costs, use yearly miles.",
      },
      {
        q: "Which costs should I include?",
        a: "Fuel, insurance, maintenance and tires are the basics. For a full picture, add registration, parking, tolls, and car payments or depreciation.",
      },
      {
        q: "Why does cost per mile fall when I drive more?",
        a: "Fixed costs such as insurance, registration and depreciation are spread over more miles, while fuel and wear costs rise with every mile.",
      },
      {
        q: "How does this compare with a work mileage rate?",
        a: "Compare your result with the mileage rate your employer or tax authority uses, such as the IRS standard mileage rate in the US, which is set each year.",
      },
    ],
    related: ["fuel-cost-calculator", "car-depreciation-calculator", "auto-loan-calculator"],
  },

  "auto-loan-calculator": {
    category: "FinanceApplication",
    quick:
      "A car loan payment is P × r ÷ (1 − (1 + r)^−n), where P is the amount financed, r is the monthly rate (APR ÷ 12) and n is the number of months. Financing $28,000 at 6.5% APR for 60 months costs about $547.85 a month and $4,871 in interest.",
    worked:
      "Price $32,000 − $4,000 down = $28,000 financed. Monthly rate 6.5% ÷ 12 = 0.5417%. Over 60 months the payment is $547.85, so you repay $32,871 and pay $4,871 in interest. Stretch it to 72 months and the payment drops to $470.68 but the interest rises to $5,889.",
    faq: [
      {
        q: "How is a car loan payment calculated?",
        a: "The payment is the amount financed × the monthly interest rate ÷ (1 − (1 + monthly rate) to the power of minus the number of months). Enter the price, down payment, APR and term, and the calculator does it for you.",
      },
      {
        q: "How does the loan term affect what I pay?",
        a: "A longer term lowers the monthly payment but raises the total interest, sometimes by a lot. In the example above, going from 60 to 72 months adds about $1,018 of interest.",
      },
      {
        q: "Should I include sales tax and fees?",
        a: "Yes. Sales tax and fees differ by state, so add them in the tax field or fold fees into the price to see the real amount financed.",
      },
      {
        q: "How much does a down payment help?",
        a: "A bigger down payment or a trade-in reduces the amount financed, which lowers the monthly payment and cuts interest every month.",
      },
    ],
    related: ["car-depreciation-calculator", "cost-per-mile-calculator", "fuel-cost-calculator"],
  },

  "vin-decoder": {
    category: "ReferenceApplication",
    quick:
      `A VIN (vehicle identification number) is a unique 17-character code that identifies a vehicle’s maker, model, year, engine and where it was built. Enter yours and ${SITE_NAME} decodes it using NHTSA’s official vPIC database.`,
    faq: [
      {
        q: "What is a VIN?",
        a: "A VIN is a 17-character code of letters and numbers, unique to one vehicle. The letters I, O and Q are never used, so they cannot be mistaken for 1 and 0.",
      },
      {
        q: "Where do I find my VIN?",
        a: "Look at the dashboard on the driver’s side, visible through the windshield, or on the sticker in the driver’s door jamb. It is also printed on your registration, title and insurance card.",
      },
      {
        q: "What can a VIN tell me?",
        a: "The make, model, model year, engine, body type, assembly plant and many of the safety features the car was built with. It does not show ownership, accident history, service records or mileage. A vehicle history report covers those.",
      },
      {
        q: "Why did my VIN return an error or only partial details?",
        a: "The most common cause is a typing mistake, which NHTSA catches with the VIN’s check digit. Some very old, imported or low-volume vehicles also have incomplete records in the database.",
      },
    ],
    related: ["recall-checker", "vehicle-safety-ratings", "common-problems-lookup"],
  },

  "recall-checker": {
    category: "ReferenceApplication",
    quick:
      "A safety recall is issued when a vehicle or part has a safety defect or fails a federal safety standard, and the manufacturer must repair it for free. Pick a year, make and model to see NHTSA’s recalls for that model year. To check one specific car, use the VIN search at nhtsa.gov/recalls.",
    faq: [
      {
        q: "How do I check whether my car has a recall?",
        a: "Pick your year, make and model here to see the recalls NHTSA has on file. Then confirm for your exact car by entering its VIN at nhtsa.gov/recalls, or ask a franchised dealer.",
      },
      {
        q: "Do recall repairs cost anything?",
        a: "No. A safety recall repair for the problem covered is free at an authorized dealer for the manufacturer.",
      },
      {
        q: "Does a recall cover every car of that model year?",
        a: "Not always. Many recalls apply only to certain production dates, engines or trim levels, which is why the VIN check is the way to be sure about one car.",
      },
      {
        q: "What do “Do not drive” and “Park outside” mean?",
        a: "“Do not drive” marks a recall where NHTSA advises against driving the vehicle until it is repaired. “Park outside” is usually used when there is a fire risk, advising owners to keep the vehicle away from buildings until it is fixed.",
      },
    ],
    related: ["vin-decoder", "common-problems-lookup", "vehicle-safety-ratings"],
  },

  "vehicle-safety-ratings": {
    category: "ReferenceApplication",
    quick:
      "NHTSA’s 5-Star Safety Ratings score vehicles from one to five stars for frontal crash, side crash and rollover, with five the best. Pick a year, make and model to see the overall rating, each crash result and the safety technology offered.",
    faq: [
      {
        q: "What do the NHTSA star ratings mean?",
        a: "More stars mean better protection in that test. NHTSA scores frontal crash, side crash and rollover separately and combines them into an overall rating.",
      },
      {
        q: "Can I compare the ratings of any two vehicles?",
        a: "Compare vehicles of a similar size and weight. The crash ratings are not designed to compare very different vehicles, such as a small car and a large SUV.",
      },
      {
        q: "Why does my car have no rating?",
        a: "NHTSA does not test every vehicle. Many trucks, vans, older models and low-volume cars never receive star ratings.",
      },
      {
        q: "How are NHTSA ratings different from IIHS ratings?",
        a: "NHTSA is the US federal government’s New Car Assessment Program. The Insurance Institute for Highway Safety (IIHS) is an independent organization with its own tests and awards. It is worth checking both.",
      },
    ],
    related: ["recall-checker", "common-problems-lookup", "vin-decoder"],
  },

  "common-problems-lookup": {
    category: "ReferenceApplication",
    quick:
      "NHTSA collects safety complaints that owners file about their vehicles. Pick a year, make and model to see how many complaints are on file, which problem areas are reported most, such as engine, brakes or air bags, and the latest owner reports.",
    faq: [
      {
        q: "Where do these complaints come from?",
        a: `Owners file them with NHTSA, and NHTSA tags each one with the parts involved. ${SITE_NAME} reads the public complaint data and counts the problem areas.`,
      },
      {
        q: "Does a complaint mean the car is defective?",
        a: "No. Complaints are unverified owner reports. A pattern across many complaints can lead NHTSA to investigate and sometimes to a recall.",
      },
      {
        q: "How do I tell which problems are serious?",
        a: "Look at the crash, fire and injury tags, and at which problem areas are reported most. Then open Car Recall Check to see whether the issue was already recalled.",
      },
      {
        q: "How do I report a problem with my own car?",
        a: "You can file a complaint with NHTSA at nhtsa.gov/report-a-safety-problem. Reports from owners help NHTSA spot patterns.",
      },
    ],
    related: ["recall-checker", "vehicle-safety-ratings", "vin-decoder"],
  },
};

export const getContent = (slug: string) => content[slug];

/** Questions about the site itself, shown on the home page. */
export const homeFaq: Faq[] = [
  {
    q: `Are ${SITE_NAME}’s calculators and lookups free?`,
    a: "Yes. Every tool is free to use, with no sign-up and no account.",
  },
  {
    q: "Where does the vehicle data come from?",
    a: "The VIN decoder, recall, safety rating and complaint lookups use free public APIs from the U.S. National Highway Traffic Safety Administration (NHTSA). The calculators use standard published formulas.",
  },
  {
    q: `Does ${SITE_NAME} store my VIN or the numbers I enter?`,
    a: `The calculators run in your browser and send nothing anywhere. A lookup sends only the VIN or the year, make and model you search for, and ${SITE_NAME} does not save it.`,
  },
  {
    q: "Can I check whether my exact car has an open recall?",
    a: "Car Recall Check lists the recalls issued for a year, make and model. To see whether one specific car still needs a repair, enter its VIN at nhtsa.gov/recalls.",
  },
  {
    q: "How accurate are the calculators?",
    a: "They apply standard formulas, so the maths is exact, but results are estimates. Real fuel prices, MPG, interest rates and resale values vary, so treat the answers as a guide, not a quote.",
  },
  {
    q: `Is ${SITE_NAME} affiliated with NHTSA?`,
    a: `No. ${SITE_NAME} is an independent site that uses NHTSA’s public data and is not affiliated with or endorsed by NHTSA.`,
  },
];
