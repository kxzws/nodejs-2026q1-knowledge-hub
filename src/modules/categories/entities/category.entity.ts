export interface Category {
  id: string; // uuid v4
  name: string;
  description: string;
}

export class SwaggerCategory implements Category {
  id: string;
  name: string;
  description: string;
}
