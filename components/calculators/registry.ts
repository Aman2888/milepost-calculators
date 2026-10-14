import type { ComponentType } from "react";
import FuelCost from "./FuelCost";
import Mpg from "./Mpg";
import EvCharging from "./EvCharging";
import RoadTrip from "./RoadTrip";
import TireSize from "./TireSize";
import Depreciation from "./Depreciation";
import WheelOffset from "./WheelOffset";
import Horsepower from "./Horsepower";
import CostPerMile from "./CostPerMile";
import AutoLoan from "./AutoLoan";

/**
 * Kept in a plain (server) module on purpose: each calculator is its own
 * client component, and the page picks one by slug.
 */
export const calculators: Record<string, ComponentType> = {
  "fuel-cost-calculator": FuelCost,
  "mpg-calculator": Mpg,
  "ev-charging-cost-calculator": EvCharging,
  "road-trip-cost-calculator": RoadTrip,
  "tire-size-calculator": TireSize,
  "car-depreciation-calculator": Depreciation,
  "wheel-offset-calculator": WheelOffset,
  "horsepower-converter": Horsepower,
  "cost-per-mile-calculator": CostPerMile,
  "auto-loan-calculator": AutoLoan,
};
