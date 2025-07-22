export interface Card {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  createdAt: string;
}

export interface CardListResponse {
  list: Card[];
  rpp: number;
  page: number;
  more: boolean;
}

export interface AddCardsRequest {
  cardIds: string[];
} 