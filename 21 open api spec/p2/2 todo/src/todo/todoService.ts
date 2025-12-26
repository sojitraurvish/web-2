import { Todo } from "./todo";

export type TodoCreationParams = Pick<Todo, "title" | "description">;