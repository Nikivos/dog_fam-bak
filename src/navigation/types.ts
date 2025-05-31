export type RootStackParamList = {
  Main: undefined;
  Walk: undefined;
  WalkStats: undefined;
  Medical: undefined;
  AddVaccination: undefined;
  AddVetVisit: undefined;
  EditVaccination: { id: string };
  EditVetVisit: { id: string };
  VaccinationDetails: { id: string };
  VetVisitDetails: { id: string };
}; 