export interface ReleaseDriverInterface {
  saida: string;
  entrega: string;
  destino: string;
  demanda: string;
  motoristaPlan: string;
  veiculoPlan: string;
  motoristaLiberado: boolean;
  veiculoLiberado?: boolean;
  dtCheckList?: Date;
  dtLiberacao?: Date;
  dailyTripSectionId: string;
  mdfe: string;
  cte: string;
  obs: string;
  presentationDate: string;
  issueDate: string;
  issueResponsible: string;
  palletInvoice: string;
  productInvoice: string;
  isReturnLoaded: boolean;
  licensePlateTrailer: string;
  justificationCode?: string;
}

export interface ReleaseDriverResponse {
  hasNext: boolean;
  currentPage: number;
  drivers: ReleaseDriverInterface[];
  pageSize: number;
  totalPages: number;
  totalCount: number;
  hasPrevious: boolean;
}
