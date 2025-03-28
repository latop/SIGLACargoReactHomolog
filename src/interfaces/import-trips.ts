import { Dayjs } from "dayjs";

export interface ImportGtmFilterParams {
  startDate: Dayjs | null;
  endDate: Dayjs | null;
  locationGroupCode?: string;
}

export interface ImportGtms {
  FileName?: string;
  LocationCode: string;
  Id: string;
  CreateAt: Dayjs;
  createAt?: string;
  UpdateAt?: string;
  UserIdCreate?: string | null;
  UserIdUpdate?: string | null;
}

export interface ImportGtm {
  tripGTMSId: string;
  cont: string;
  status: string;
  idGTMS: string;
  dt: string;
  sto: string;
  dlv: string;
  transportadora: string | null;
  codOrigem: string;
  cdOrigem: string;
  codDestino: string;
  clienteCDV: string;
  cidadeDestino: string;
  dataColeta: string;
  horaColeta: string;
  dataSaida: string;
  horaSaida: string;
  dataEntrega: string;
  horaEntrega: string;
  dataSolicitacao: string;
  tipoCarga: string;
  vcagvcap: string;
  observacoes: string;
  dataSaidaEst: string | null;
  horaSaidaEst: string | null;
  dataEntregaEst: string | null;
  horaEntregaEst: string | null;
  dataSolicitacaoNova: string | null;
  codGrupoFrota: string | null;
  erro: string | null;
  dtColeta: string;
  dtSaida: string;
  dtEntrega: string;
  dtSolicitacao: string;
  id: string;
}

export type ImportGtmsResponse = ImportGtms[];
