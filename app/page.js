"use client";
import { useState, useEffect } from "react";
import { supabase } from "./supabase";
import { Plus, Trash2, LogOut } from "lucide-react";

const DAYS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
const COLORS = {
  blue: "bg-blue-100 border-blue-500 text-blue-800",
  green: "bg-green-100 border-green-500 text-green-800",
  orange: "bg-orange-100 border-orange-500 text-orange-800",
  purple: "bg-purple-100 border-purple-500 text-purple-800"
};

export default function Home() {
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: "", day_of_week: "Lundi", color: "blue" });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchTasks(session.user.id);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchTasks(session.user.id);
    });
  }, []);

  const handleAuth = async (type) => {
    if (type === "login") {
      await supabase.auth.signInWithPassword({ email, password });
    } else {
      await supabase.auth.signUp({ email, password });
    }
  };

  const fetchTasks = async (userId) => {
    const { data } = await supabase.from("tasks").select("*").eq("user_id", userId);
    if (data) setTasks(data);
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!newTask.title) return;
    const { data } = await supabase.from("tasks").insert([
      { ...newTask, user_id: session.user.id }
    ]).select();
    if (data) setTasks([...tasks, data[0]]);
    setNewTask({ ...newTask, title: "" });
  };

  const deleteTask = async (id) => {
    await supabase.from("tasks").delete().eq("id", id);
    setTasks(tasks.filter(t => t.id !== id));
  };

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 text-black">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
          <h1 className="text-2xl font-bold mb-6 text-center">Calendar 17📅</h1>
          <input type="email" placeholder="Email" className="w-full mb-4 p-3 border rounded-lg bg-white" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Mot de passe" className="w-full mb-6 p-3 border rounded-lg bg-white" value={password} onChange={(e) => setPassword(e.target.value)} />
          <div className="flex gap-4">
            <button onClick={() => handleAuth("login")} className="flex-1 bg-black text-white p-3 rounded-lg font-medium hover:bg-gray-800 transition">Connexion</button>
            <button onClick={() => handleAuth("signup")} className="flex-1 bg-gray-100 text-black p-3 rounded-lg font-medium hover:bg-gray-200 transition">Inscription</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-4 md:p-8">
      <header className="flex justify-between items-center mb-8 max-w-6xl mx-auto bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <h1 className="text-xl font-bold">Ma Semaine - Calendar 17</h1>
        <button onClick={() => supabase.auth.signOut()} className="p-2 text-red-500 hover:bg-red-50 rounded-full transition"><LogOut size={20} /></button>
      </header>

      <main className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/4 bg-white p-6 rounded-2xl shadow-sm h-fit border border-gray-100">
          <h2 className="font-semibold mb-4">Ajouter un bloc</h2>
          <form onSubmit={addTask} className="space-y-4">
            <input type="text" placeholder="Titre (ex: Sport)" required className="w-full p-2 border rounded-lg bg-white" value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} />
            <select className="w-full p-2 border rounded-lg bg-white" value={newTask.day_of_week} onChange={e => setNewTask({...newTask, day_of_week: e.target.value})}>
              {DAYS.map(day => <option key={day}>{day}</option>)}
            </select>
            <select className="w-full p-2 border rounded-lg bg-white" value={newTask.color} onChange={e => setNewTask({...newTask, color: e.target.value})}>
              <option value="blue">Bleu (Cours)</option>
              <option value="green">Vert (Sport)</option>
              <option value="orange">Orange (Travail)</option>
              <option value="purple">Violet (Perso)</option>
            </select>
            <button type="submit" className="w-full bg-black text-white p-2 rounded-lg flex justify-center items-center gap-2 hover:bg-gray-800 transition"><Plus size={18}/> Ajouter</button>
          </form>
        </div>

        <div className="w-full md:w-3/4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {DAYS.map(day => (
            <div key={day} className="bg-white p-4 rounded-2xl shadow-sm min-h-[200px] border border-gray-100">
              <h3 className="font-bold border-b pb-2 mb-3">{day}</h3>
              <div className="space-y-2">
                {tasks.filter(t => t.day_of_week === day).map(task => (
                  <div key={task.id} className={`p-3 rounded-lg border-l-4 flex justify-between items-start ${COLORS[task.color]}`}>
                    <span className="font-medium text-sm">{task.title}</span>
                    <button onClick={() => deleteTask(task.id)} className="text-gray-500 hover:text-red-500 transition"><Trash2 size={16}/></button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}