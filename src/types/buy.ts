import type { ProductDto } from './product';

export type BuyCreateDto = {
  productId: number;
  cantidad: number;
};

export interface BuyDto {
  id: number;
  cantidad: number;
  fechaCompra: string;
  total: number; 
  product: ProductDto; 
}