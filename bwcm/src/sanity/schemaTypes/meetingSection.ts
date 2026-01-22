// @ts-nocheck
import { defineField, defineType } from "sanity";

const meetingSection = {
  name: "meeting",
  title: "Upcoming Meetings",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Meeting Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "date",
      title: "Date",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
    }),
    defineField({
      name: "image",
      title: "Meeting Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "link",
      title: "More Info / Registration Link",
      type: "url",
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "date",
      media: "image",
    },
  },
};

export default meetingSection;

