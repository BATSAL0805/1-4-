import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import type { Todo, TodoInput } from "../types";
import { isExpired, todayString } from "../utils/date";

const COLLECTION = "todos";

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, COLLECTION), orderBy("createdAt", "asc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const docs = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...(docSnap.data() as Omit<Todo, "id">),
        }));

        const today = todayString();
        const expired = docs.filter((todo) => isExpired(todo.startDate, todo.endDate, today));
        for (const todo of expired) {
          deleteDoc(doc(db, COLLECTION, todo.id)).catch(() => {});
        }

        setTodos(docs.filter((todo) => !expired.includes(todo)));
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      },
    );
    return unsubscribe;
  }, []);

  async function addTodo(input: TodoInput) {
    const now = Date.now();
    await addDoc(collection(db, COLLECTION), {
      ...input,
      createdAt: now,
      updatedAt: now,
    });
  }

  async function updateTodo(id: string, input: TodoInput) {
    await updateDoc(doc(db, COLLECTION, id), {
      ...input,
      updatedAt: Date.now(),
    });
  }

  async function deleteTodo(id: string) {
    await deleteDoc(doc(db, COLLECTION, id));
  }

  return { todos, loading, error, addTodo, updateTodo, deleteTodo };
}
