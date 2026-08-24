import { useEffect, useState } from "react";

import Container from "../components/ui/Container";
import TaskForm from "../components/tasks/TaskForm";
import TaskList from "../components/tasks/TaskList";
import TaskFilters from "../components/tasks/TaskFilters";
import TaskSearch from "../components/tasks/TaskSearch";
import TaskStats from "../components/tasks/TaskStats";
import TaskProgress from "../components/tasks/TaskProgress";
import LoadingSpinner from "../components/ui/LoadingSpinner";

import api from "../services/api";
import {
  getTasks,
  updateTask,
  deleteTask,
} from "../services/taskService";

function Dashboard() {
  const [user, setUser] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [statusFilter, setStatusFilter] = useState("all");
    const [priorityFilter, setPriorityFilter] = useState("all");
    const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [userData, taskData] = await Promise.all([
          api("/users/me"),
          getTasks(),
        ]);

        setUser(userData.user);
        setTasks(taskData.tasks);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleTaskCreated = (task) => {
    setError("");

    setTasks((previousTasks) => [
      task,
      ...previousTasks,
    ]);
  };

  const handleTaskUpdated = async (taskId, taskData) => {
    try {
      setError("");

      const data = await updateTask(taskId, taskData);

      setTasks((previousTasks) =>
        previousTasks.map((task) =>
          task._id === taskId
            ? data.task
            : task
        )
      );
    } catch (error) {
      setError(error.message);
    }
  };

  const handleTaskDeleted = async (taskId) => {
    try {
      setError("");

      await deleteTask(taskId);

      setTasks((previousTasks) =>
        previousTasks.filter(
          (task) => task._id !== taskId
        )
      );
    } catch (error) {
      setError(error.message);
    }
  };

    
    const filteredTasks = tasks.filter((task) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      (task.title || "")
        .toLowerCase()
        .includes(searchText) ||
      (task.description || "")
        .toLowerCase()
        .includes(searchText);

    const matchesStatus =
        statusFilter === "all" ||
        task.status === statusFilter;

    const matchesPriority =
        priorityFilter === "all" ||
        task.priority === priorityFilter;

    return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority
    );
    });
    

  if (loading) {
    return (
      <main className="min-h-[calc(100vh-4rem)] bg-slate-950 flex items-center justify-center">
        <LoadingSpinner message="Loading dashboard..." />
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-slate-950 py-12">
      <Container>
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-between gap-4">
            <p>{error}</p>

            <button
              type="button"
              onClick={() => setError("")}
              className="text-sm text-red-300 hover:text-white"
            >
              Dismiss
            </button>
          </div>
        )}

        <div>
          <p className="text-blue-500 font-medium">
            Dashboard
          </p>

          <h1 className="text-4xl font-bold text-white mt-2">
            Welcome back, {user?.name} 👋
          </h1>

          <p className="text-slate-400 mt-3 max-w-2xl">
            Track your learning, DSA progress, projects, and
            developer journey.
          </p>
        </div>

        <TaskStats tasks={tasks} />
        <TaskProgress tasks={tasks} />

        <div className="grid lg:grid-cols-3 gap-8 mt-10">
          <div>
            <TaskForm
              onTaskCreated={handleTaskCreated}
            />
          </div>

                  <div className="lg:col-span-2">
                      <div className="mb-4">
  <TaskSearch
    search={search}
    onSearchChange={setSearch}
  />
</div>
        <TaskFilters
            status={statusFilter}
            priority={priorityFilter}
            onStatusChange={setStatusFilter}
            onPriorityChange={setPriorityFilter}
        />

        <div className="mt-5">
          <TaskList
            tasks={filteredTasks}
            hasFilters={
              search.trim() !== "" ||
              statusFilter !== "all" ||
              priorityFilter !== "all"
            }
            onTaskUpdated={handleTaskUpdated}
            onTaskDeleted={handleTaskDeleted}
          />
        </div>
        </div>
        </div>
      </Container>
    </main>
  );
}

export default Dashboard;