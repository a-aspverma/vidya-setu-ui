import { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import {
  FiBook,
  FiCheckCircle,
  FiClock,
  FiActivity,
} from "react-icons/fi";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const MyProgress = () => {
  const [progress, setProgress] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchData();
  }, [filter]);

  const fetchData = async () => {
    try {
      const params = filter !== "all" ? `?status=${filter}` : "";

      const [progressRes, analyticsRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/progress${params}`),
        axios.get(`${import.meta.env.VITE_API_URL}/progress/analytics?period=30`),
      ]);

      setProgress(progressRes.data.data || []);
      setAnalytics(analyticsRes.data.data || {});
    } catch (err) {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const totalLessons = progress.length;
  const completed = progress.filter(p => p.status === "completed").length;
  const inProgress = progress.filter(p => p.status === "in-progress").length;
  const totalTime = progress.reduce((sum, p) => sum + (p.timeSpent || 0), 0);

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700";
      case "in-progress":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6 space-y-6">
        
        {/* Header */}
        <h1 className="text-3xl font-bold">My Learning Progress 📊</h1>

        {/* Stats */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total Lessons" value={totalLessons} icon={<FiBook />} color="blue" />
          <StatCard title="Completed" value={completed} icon={<FiCheckCircle />} color="green" />
          <StatCard title="In Progress" value={inProgress} icon={<FiActivity />} color="yellow" />
          <StatCard title="Time Spent" value={`${totalTime}m`} icon={<FiClock />} color="purple" />
        </div>

        {/* Charts */}
        {analytics?.quizPerformance?.length > 0 && (
          <div className="grid lg:grid-cols-2 gap-6">
            
            {/* Line Chart */}
            <Card title="Quiz Performance">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analytics.quizPerformance.slice(-10)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="submittedAt" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="percentage" stroke="#6366f1" />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            {/* Bar Chart */}
            <Card title="Subject Performance">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.subjectPerformance || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="_id" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Bar dataKey="averageScore" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </Card>

          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-xl shadow p-5">
          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-semibold">Content Progress</h2>

            <div className="flex gap-2">
              {["all", "completed", "in-progress"].map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-1 rounded ${
                    filter === f
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {progress.length > 0 ? (
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left">Content</th>
                  <th className="p-3">Subject</th>
                  <th className="p-3">Progress</th>
                  <th className="p-3">Time</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>

              <tbody>
                {progress.map(item => (
                  <tr key={item._id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <Link to={`/content/${item.content?._id}`} className="text-blue-600 font-medium">
                        {item.content?.title}
                      </Link>
                    </td>

                    <td className="text-center">{item.content?.subject}</td>

                    <td className="p-3">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${item.progressPercentage}%` }}
                        />
                      </div>
                    </td>

                    <td className="text-center">{item.timeSpent || 0}m</td>

                    <td className="text-center">
                      <span className={`px-2 py-1 text-xs rounded ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <EmptyState />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default MyProgress;

const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-white p-4 rounded-xl shadow flex justify-between items-center">
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <h2 className="text-2xl font-bold">{value}</h2>
    </div>
    <div className={`p-3 rounded-lg bg-${color}-500 text-white`}>
      {icon}
    </div>
  </div>
);

const Card = ({ title, children }) => (
  <div className="bg-white p-4 rounded-xl shadow">
    <h2 className="font-semibold mb-4">{title}</h2>
    {children}
  </div>
);

const EmptyState = () => (
  <div className="text-center py-10 text-gray-500">
    <FiBook size={40} className="mx-auto mb-2" />
    <p>No progress yet</p>
  </div>
);