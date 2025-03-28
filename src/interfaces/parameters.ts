export interface Activity {
  code: string;
  description: string;
  activityTypeId: string;
  start: string;
  end: string;
  flgActive: boolean;
  flgMeal: boolean;
  flgLunch: boolean;
  flgRest: boolean;
  flgRequest: boolean;
  id: string;
  createAt: string;
  updateAt: string;
  userIdCreate: null | string;
  userIdUpdate: null | string;
}

export interface Company {
  code: string;
  name: string;
  id: string;
  address: string;
  cityId: string;
  stateId: string;
  regionId: null | string;
  countryId: string;
  isSupplier: boolean;
}

export interface Country {
  code: string;
  name: string;
  codeAlpha3: string;
  codeNum: number;
  id: string;
}

export interface State {
  code: string;
  name: string;
  regionId: string | null;
  countryId: string;
  country: Country;
  id: string;
}
export interface City {
  id: string;
  code: string;
  name: string;
  stateId: string;
  countryId: string;
  capital: boolean;
}

export type Attribution = {
  code: string;
  description: string;
  id: string;
};

export interface ResponsibleSectorType {
  code: string;
  description: string;
  id: string;
}

export interface JustificationType {
  code: string;
  description: string;
  responsibleSectorId: string;
  responsibleSector?: Partial<ResponsibleSectorType>;
  type: string;
  id: string;
}

export interface ResponsibleSectorResponse {
  currentPage?: number;
  hasNext?: boolean;
  hasPrevious?: boolean;
  pageSize?: number;
  totalPages?: number;
  data: ResponsibleSectorType[];
  totalCount?: number;
}

export interface ActivityType {
  code: string;
  description: string;
  function: string;
  flgJourney: boolean;
  flgPayroll: boolean;
  color: string;
  id: string;
}

export interface ActivityTypeResponse {
  currentPage?: number;
  hasNext?: boolean;
  hasPrevious?: boolean;
  pageSize?: number;
  totalPages?: number;
  data: ActivityType[];
  totalCount?: number;
}

export interface Activity {
  id: string;
  code: string;
  description: string;
  activityTypeId: string;
  activityType: ActivityType;
  start: string; // ISO datetime string
  end: string; // ISO datetime string
  flgActive: boolean;
  flgMeal: boolean;
  flgLunch: boolean;
  flgRest: boolean;
  flgRequest: boolean;
}

export interface ActivityeResponse {
  currentPage?: number;
  hasNext?: boolean;
  hasPrevious?: boolean;
  pageSize?: number;
  totalPages?: number;
  data: Activity[];
  totalCount?: number;
}

export interface PaginatedResponse<T> {
  currentPage?: number;
  hasNext?: boolean;
  hasPrevious?: boolean;
  pageSize?: number;
  totalPages?: number;
  data: T[];
  totalCount?: number;
}
