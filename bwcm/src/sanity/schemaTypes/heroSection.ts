// @ts-nocheck
import { defineField, defineType } from "sanity";

const heroSection = {
  name: "heroSection",
  title: "Hero Section",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Main Title",
      type: "string",
    }),
    defineField({
      name: "subtitle",
      title: "Subtitle",
      type: "text",
    }),
    defineField({
      name: "buttonText",
      title: "Button Text",
      type: "string",
      initialValue: "Join Us",
    }),
    defineField({
      name: "buttonLink",
      title: "Button Link",
      type: "url",
    }),
    defineField({
      name: "backgroundImage",
      title: "Background Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "weekOf",
      title: "Week Of",
      type: "date",
      description: "Monday date for this week's hero",
    }),
  ],
};

export default heroSection;
