import { mount } from '@cypress/vue'
import FormField from '../molecules/FormField.vue'

describe('FormField', () => {
  it('Renders the component', () => {
    // @ts-expect-error: Unreachable code error
    mount(FormField, {
      propsData: {
        label: 'Test Label',
      },
    })

    cy.get('label').should('contain', 'Test Label')
  })
})
