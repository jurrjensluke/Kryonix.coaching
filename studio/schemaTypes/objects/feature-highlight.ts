import {BoltIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const featureHighlight = defineType({
  name: 'featureHighlight',
  title: 'Feature Highlight',
  type: 'object',
  icon: BoltIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      initialValue: 'planned',
      options: {
        list: [
          {title: 'Available', value: 'available'},
          {title: 'Pilot', value: 'pilot'},
          {title: 'Planned', value: 'planned'},
        ],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
    }),
  ],
})
