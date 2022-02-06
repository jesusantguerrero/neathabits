import { addDays, addHours } from 'date-fns'
import Dashboard from '../../components/templates/DashboardTemplate.vue'

export default {
  title: 'Templates/Dashboard',
  component: Dashboard,
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { Dashboard },
  template: '<dashboard args="args" />',
})
const setISOTime = (hoursToAdd = 0, daysToAdd = 0) => {
  return addHours(addDays(new Date(), daysToAdd), hoursToAdd)
}

const scheduledEvents = [
  {
    id: '1',
    title: 'Item 1',
    description: 'Item 1 description',
    image: 'https://picsum.photos/200/300',
    startTime: setISOTime(8),
    endTime: setISOTime(9),
  },
  {
    id: '2',
    title: 'Item 2',
    description: 'Item 2 description',
    image: 'https://picsum.photos/200/300',
    startTime: setISOTime(10),
    endTime: setISOTime(11),
  },
]

const activeCycle = {
  title: 'January 2022',
  topGoals: [
    {
      title: 'Build MVP Neathabits',
    },
  ],
  due: new Date(),
  progress: 0,
}

export const Default = Template.bind({})

Default.args = {
  scheduledEvents,
  labels: [],
  activeCycle,
}
