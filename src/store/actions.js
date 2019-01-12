export default {
  login ({ commit }, token) {
    commit('login', token)
  },
  logout ({ commit }) {
    commit('logout')
  },

  addTodo ({ commit }, text) {
    commit('addTodo', {
      text,
      done: false
    })
  },

  removeTodo ({ commit }, todo) {
    commit('removeTodo', todo)
  },

  toggleTodo ({ commit }, todo) {
    commit('editTodo', { todo, done: !todo.done })
  },

  editTodo ({ commit }, { todo, value }) {
    commit('editTodo', { todo, text: value })
  },

  toggleAll ({ state, commit }, done) {
    state.todos.forEach((todo) => {
      commit('editTodo', { todo, done })
    })
  },

  clearCompleted ({ state, commit }) {
    state.todos.filter(todo => todo.done)
      .forEach(todo => {
        commit('removeTodo', todo)
      })
  }
}