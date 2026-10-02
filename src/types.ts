export interface OpinionData {
  id: number;
  title: string;
  body: string;
  userName: string;
  votes: number;
}

export type NewOpinionData = Pick<OpinionData, 'title' | 'body' | 'userName'>;