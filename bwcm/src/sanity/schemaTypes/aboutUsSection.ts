// @ts-nocheck
import { defineType, defineField } from "sanity";

const aboutUsSection = {
  name: "aboutPage",
  title: "About Page",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Section Title",
      type: "string",
      initialValue: "About Us",
    }),
    defineField({
      name: "intro",
      title: "Introduction Paragraph",
      type: "text",
      description: "Short intro about the ministry or founders",
    }),
    defineField({
      name: "founders",
      title: "Founders / Pastors",
      type: "array",
      of: [
        defineField({
          name: "founder",
          title: "Founder",
          type: "object",
          fields: [
            {
              name: "name",
              title: "Full Name",
              type: "string",
            },
            {
              name: "role",
              title: "Role / Title",
              type: "string",
              initialValue: "Pastor",
            },
            {
              name: "bio",
              title: "Biography",
              type: "text",
            },
            {
              name: "photo",
              title: "Photo",
              type: "image",
              options: { hotspot: true },
            },
          ],
        }),
      ],
    }),
  ],
  preview: {
    select: { title: "title" },
  },
};

export default aboutUsSection;