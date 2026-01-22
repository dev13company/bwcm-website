import { type SchemaTypeDefinition } from 'sanity'
import heroSection from './heroSection';
import galleryImage from './galleryImage';
import meetingSection from './meetingSection';
import aboutUsSection from "./aboutUsSection";
import testimonialSection from './testimonialSection';

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [heroSection, galleryImage, meetingSection, aboutUsSection, testimonialSection],
}
