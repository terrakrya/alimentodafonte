<template>
<div class="row">
  <div class="col-sm-6">
    <b-form-group label="Grupo de coletores">
      <form-entity-select type="collectors_groups" :form="form" field="collectors_group" />
    </b-form-group>
  </div>
  <div class="col-sm-6">
    <b-form-group label="Coletor">
      <form-entity-select v-if="collectors_filtered && collectors_filtered.length" :items="collectors_filtered" :form="form" field="collector" />
      <no-item :list="collectors_filtered" />
    </b-form-group>
  </div>
</div>
</template>

<script>
import axios from 'axios'
import NoItem from '@/components/NoItem'
import FormEntitySelect from '@/components/FormEntitySelect'

export default {
  name: 'form-group-collector',
  props: ['form'],
  data() {
    return {
      collectors: [],
      collectors_filtered: []
    }
  },
  async created() {
    axios.get('users', {
      params: {
        role: 'collector',
        populate: {
          path: 'collectors_group',
          select: '_id'
        }
      }
    }).then(resp => {
      this.collectors = resp.data

      this.collectors = this.collectors.map(collector => {
        return {
          id: collector._id,
          title: collector.name,
          description: collector.nickname,
          picture: collector.image ? collector.image.thumb : '',
          collectors_group: collector.collectors_group ? collector.collectors_group._id : null,
        }
      });
      this.filterCollectors(this.form.collectors_group)

    }).catch(this.showError);
  },
  methods: {
    filterCollectors(group) {
      if (group) {
        this.collectors_filtered = this.collectors.filter(collector => {
          return collector.collectors_group && collector.collectors_group == group
        })
      } else {
        this.collectors_filtered = this.collectors
      }
    }
  },
  watch: {
    'form.collectors_group': function(group) {
      this.filterCollectors(group)
      this.form.collector = null
    }
  },
  components: {
    NoItem,
    FormEntitySelect
  }
};
</script>
