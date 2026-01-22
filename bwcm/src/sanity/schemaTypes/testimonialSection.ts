// @ts-nocheck
import { defineField, defineType } from "sanity";

const testimonialSection = {
  name: "testimonial",
  title: "Testimonials",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Person's Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "role",
      title: "Role / Location (optional)",
      type: "string",
    }),
    defineField({
      name: "message",
      title: "Testimonial Message",
      type: "text",
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "photo",
      title: "Photo (optional)",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "date",
      title: "Date Shared",
      type: "date",
      initialValue: new Date().toISOString().split("T")[0],
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "message",
      media: "photo",
    },
  },
};

export default testimonialSection;
