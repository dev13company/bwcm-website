import { type SchemaTypeDefinition } from 'sanity'
import heroSection from './heroSection';
import galleryImage from './galleryImage';

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [heroSection, galleryImage],
}
