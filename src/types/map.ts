import { DisplayResponse } from "../services/displays.service";

export interface DisplayMapProps {
    displays: DisplayResponse[];
    center: {
      lat: number;
      lng: number;
    };
  }