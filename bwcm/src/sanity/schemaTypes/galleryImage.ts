// @ts-nocheck
import { defineField, defineType } from "sanity";

const galleryImage = {
  name: "galleryImage",
  title: "Gallery Images (Weekly Set)",
  type: "document",
  fields: [
    defineField({
      name: "weekOf",
      title: "Week Of",
      type: "date",
      description: "Monday date for this week's gallery images",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "images",
      title: "Upload up to 3 Images",
      type: "array",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            {
              name: "alt",
              title: "Alt Text",
              type: "string",
              description: "Describe the image for accessibility and SEO",
            },
          ],
        },
      ],
      validation: (Rule) => Rule.max(3).error("You can upload up to 3 images only."),
    }),
  ],
  preview: {
    select: {
      weekOf: "weekOf",
      media: "images.0", // show first image as preview thumbnail
    },
    prepare(selection: { weekOf?: string; media?: any }) {
      const { weekOf, media } = selection;
      return {
        title: weekOf ? `Gallery for week of ${weekOf}` : "Gallery (unspecified week)",
        media,
      };
    },
  },
};

export default galleryImage
