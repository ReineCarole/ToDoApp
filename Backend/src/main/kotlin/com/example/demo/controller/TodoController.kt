package com.example.todo.controller

import com.example.todo.model.Todo
import com.example.todo.repository.TodoRepository
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/todos")
@CrossOrigin(
    origins = ["*"], // ← Allows all origins (for development & Vercel deployment)
    allowedHeaders = ["*"],
    methods = [RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS],
    allowCredentials = "true",
    maxAge = 3600L
)
class TodoController(private val repository: TodoRepository) {

    @GetMapping
    fun getAll(): List<Todo> = repository.findAll()

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun create(@RequestBody todo: Todo): Todo = repository.save(todo)

    @GetMapping("/{id}")
    fun getOne(@PathVariable id: Long): Todo =
        repository.findById(id).orElseThrow { RuntimeException("Todo $id not found") }

    @PutMapping("/{id}")
    fun update(@PathVariable id: Long, @RequestBody updated: Todo): Todo {
        val todo = repository.findById(id).orElseThrow { RuntimeException("Todo $id not found") }
        todo.title = updated.title
        todo.completed = updated.completed
        return repository.save(todo)
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun delete(@PathVariable id: Long) {
        if (!repository.existsById(id)) {
            throw RuntimeException("Todo $id not found")
        }
        repository.deleteById(id)
    }
}