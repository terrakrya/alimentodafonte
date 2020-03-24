<template>
  <div class="test">
      <!-- O id vai definir o workspace com o alias padrão de 'room_ID' -->
      <dorothy-community

        id="2"
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
            title: "GT Teste 2 - Dorothy", 
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
