<template>
  <div class="dashboard">
    <dashboard-manager v-if="isManager" />
  </div>
</template>

<script>
import DashboardManager from './DashboardManager'

export default {
  name: 'Dashboard',
  components: {
    DashboardManager,
  }
}
</script>
