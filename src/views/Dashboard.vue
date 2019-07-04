<template>
  <div class="dashboard">
    <dashboard-manager v-if="isManager" />
    <dashboard-collector v-if="isCollector && !isManager" />
  </div>
</template>

<script>
import DashboardManager from './DashboardManager'
import DashboardCollector from './DashboardCollector'

export default {
  name: 'Dashboard',
  components: {
    DashboardManager,
    DashboardCollector
  }
}
</script>
