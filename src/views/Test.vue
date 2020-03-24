<template>
  <div class="test">
      <dorothy-community

        id="1"
        :description="description"

    ></dorothy-community>
  </div>
</template>

<script>

export default {
  name: 'test',
  data() {
    return {
        description: JSON.stringify({
            title: "GT Teste - Dorothy", 
            tools: [
                {
                    title: "Workspace", 
                    element: "dorothy-workspace",
                }
            ], 
            includes: [],
        })
    }
  }
}
</script>
