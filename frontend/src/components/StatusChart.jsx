import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

const COLORS = {
  Applied: "#9ca3af",
  OA: "#60a5fa",
  Interview: "#fbbf24",
  Offer: "#34d399",
  Rejected: "#f87171",
};

const StatusChart = ({ applications }) => {
  const counts = applications.reduce((acc, app) => {
    acc[app.status] = (acc[app.status] || 0) + 1;
    return acc;
  }, {});

  const data = Object.entries(counts).map(([status, value]) => ({
    name: status,
    value,
  }));

  if (data.length === 0) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 mb-6">
      <h3 className="font-bold mb-4 text-gray-900 dark:text-gray-100">Application Status Breakdown</h3>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={80}
            paddingAngle={2}
          >
            {data.map((entry) => (
              <Cell key={entry.name} fill={COLORS[entry.name] || "#a5b4fc"} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--tooltip-bg, #fff)",
              border: "none",
              borderRadius: "8px",
            }}
            wrapperClassName="dark:[&_.recharts-default-tooltip]:!bg-gray-800 dark:[&_.recharts-default-tooltip]:!border-gray-700 dark:[&_.recharts-default-tooltip]:!text-gray-100"
          />
          <Legend wrapperStyle={{ fontSize: "13px" }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StatusChart;