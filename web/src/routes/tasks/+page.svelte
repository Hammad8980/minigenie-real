<script lang="ts">
	import { onMount } from 'svelte';

	interface Task {
		id: number;
		text: string;
		completed: boolean;
	}

	let tasks = $state<Task[]>([]);
	let newTaskText = $state<string>('');

	// Derived variable to check if input is empty
	let isInputEmpty = $derived(newTaskText.trim().length === 0);

	// Load tasks from localStorage on component mount
	onMount(() => {
		const stored = localStorage.getItem('tasks');
		if (stored) {
			tasks = JSON.parse(stored);
		}
	});

	// Save tasks to localStorage
	function saveTasks(): void {
		localStorage.setItem('tasks', JSON.stringify(tasks));
	}

	// Add a new task
	function addTask(): void {
		if (newTaskText.trim()) {
			tasks = [...tasks, { id: Date.now(), text: newTaskText, completed: false }];
			newTaskText = '';
			saveTasks();
		}
	}

	// Delete a task
	function deleteTask(id: number): void {
		tasks = tasks.filter((task) => task.id !== id);
		saveTasks();
	}

	// Toggle task completion
	function toggleComplete(id: number): void {
		tasks = tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task));
		saveTasks();
	}
</script>

<h1>Add your tasks here</h1>

<div>
	<textarea bind:value={newTaskText} placeholder="Enter your task..."></textarea>
	<button on:click={addTask} disabled={isInputEmpty}>Add Task</button>
</div>

{#if tasks.length === 0}
	<p>No tasks yet. Add one above!</p>
{:else}
	<ul>
		{#each tasks as task (task.id)}
			<li>
				<input type="checkbox" checked={task.completed} on:change={() => toggleComplete(task.id)} />
				<span>{task.text}</span>
				<button on:click={() => deleteTask(task.id)}>Delete</button>
			</li>
		{/each}
	</ul>
{/if}
