import { mount } from '@cypress/vue'
import FormField from '../src/components/molecules/FormField.vue'

describe('FormField', () => {
  it('Renders the component', () => {
    mount(FormField, {
      propsData: {
        label: 'Test Label',
      },
    })

    cy.get('label').should('contain', 'Test Label')
  })
})
