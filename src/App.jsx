import { useState, useEffect, useRef } from "react";
import Navbar from "./components/Navbar";
import { FaEdit } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import { v4 as uuidv4 } from "uuid";

function App() {
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [showFinished, setshowFinished] = useState(true);

  // Ref to skip saving to localStorage on the first render/mount
  const isInitialMount = useRef(true);

  // Load todos from localStorage when the app starts
  useEffect(() => {
    try {
      const todoString = localStorage.getItem("todos");
      if (todoString) {
        const savedTodos = JSON.parse(todoString);
        setTodos(savedTodos);
      }
    } catch (err) {
      console.error("Failed to parse todos from localStorage:", err);
    }
  }, []);

  // Save todos to localStorage whenever `todos` changes,
  // but skip the very first run to avoid overwriting existing storage on mount.
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    try {
      localStorage.setItem("todos", JSON.stringify(todos));
    } catch (err) {
      console.error("Failed to save todos to localStorage:", err);
    }
  }, [todos]);

  const toggleFinished = () => {
    setshowFinished(!showFinished);
  };

  // Edit behavior: populate input with todo text and remove the original item.
  // After editing, click Save to add it again (if you prefer inline edit, let me know).
  const handleEdit = (e, id) => {
    const t = todos.find((i) => i.id === id);
    if (!t) return;
    setTodo(t.todo);
    const newTodos = todos.filter((item) => item.id !== id);
    setTodos(newTodos);
  };

  const handleDelete = (e, id) => {
    const newTodos = todos.filter((item) => item.id !== id);
    setTodos(newTodos);
  };

  const handleAdd = () => {
    const trimmed = todo.trim();
    if (trimmed.length <= 3) return;
    setTodos((prev) => [...prev, { id: uuidv4(), todo: trimmed, isCompleted: false }]);
    setTodo("");
  };

  const handleChange = (e) => {
    setTodo(e.target.value);
  };

  const handleCheckbox = (e) => {
    const id = e.target.name;
    const newTodos = todos.map((item) =>
      item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
    );
    setTodos(newTodos);
  };

  return (
    <>
      <Navbar />
      <div className="mx-3 md:container md:mx-auto my-5 rounded-xl p-5 bg-violet-100 min-h-[80vh] md:w-[35%]">
        <h1 className="font-bold text-center text-3xl">
          iTask - Manage your todos at one place
        </h1>

        <div className="addTodo my-5 flex flex-col gap-4">
          <h2 className="text-2xl font-bold">Add a Todo</h2>
          <div className="flex">
            <input
              onChange={handleChange}
              value={todo}
              type="text"
              className="w-full rounded-xl px-5 py-1 bg-white"
              placeholder="Enter a task..."
            />
            <button
              onClick={handleAdd}
              disabled={todo.trim().length <= 3}
              className="bg-violet-800 mx-2 rounded-xl hover:bg-violet-950 disabled:bg-violet-500 p-4 py-2 text-sm font-bold text-white"
            >
              Save
            </button>
          </div>
        </div>

        <input
          className="my-4"
          id="show"
          onChange={toggleFinished}
          type="checkbox"
          checked={showFinished}
        />
        <label className="mx-2" htmlFor="show">
          Show Finished
        </label>

        <div className="h-[1px] bg-black opacity-15 w-[90%] mx-auto my-2"></div>

        <h2 className="text-2xl font-bold">Your Todos</h2>
        <div className="todos">
          {todos.length === 0 && <div className="m-5">No Todos to display</div>}

          {todos.map((item) => {
            return (
              (showFinished || !item.isCompleted) && (
                <div key={item.id} className="todo flex my-3 justify-between">
                  <div className="flex gap-5">
                    <input
                      name={item.id}
                      onChange={handleCheckbox}
                      type="checkbox"
                      checked={item.isCompleted}
                    />
                    <div className={item.isCompleted ? "line-through" : ""}>
                      {item.todo}
                    </div>
                  </div>
                  <div className="buttons flex h-full">
                    <button
                      onClick={(e) => handleEdit(e, item.id)}
                      className="bg-violet-800 hover:bg-violet-950 p-2 py-1 text-sm font-bold text-white rounded-md mx-1"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={(e) => handleDelete(e, item.id)}
                      className="bg-violet-800 hover:bg-violet-950 p-2 py-1 text-sm font-bold text-white rounded-md mx-1"
                    >
                      <AiFillDelete />
                    </button>
                  </div>
                </div>
              )
            );
          })}
        </div>
      </div>
    </>
  );
}

export default App;
