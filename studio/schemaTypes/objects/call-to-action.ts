import {LinkIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const callToAction = defineType({
  name: 'callToAction',
  title: 'Call to Action',
  type: 'object',
  icon: LinkIcon,
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'href',
      title: 'Href',
      type: 'string',
      description: 'Use a relative path like /demo or a full external URL.',
      validation: (rule) => rule.required(),
    }),
  ],
})
