import ActivityType from '../components/molecules/ActivityType.vue'

export default {
  title: 'Molecules/ActivityType',
  component: ActivityType,
}

export const Primary = () => ({
  components: { ActivityType },
  template: '<activity-type :type="type" />',
})
