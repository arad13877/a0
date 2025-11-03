interface StatusIndicatorProps {
  status: "connected" | "disconnected" | "error";
  label?: string;
}

export default function StatusIndicator({ status, label }: StatusIndicatorProps) {
  const colors = {
    connected: "bg-green-500",
    disconnected: "bg-gray-400",
    error: "bg-red-500",
  };

  return (
    <div className="flex items-center gap-2" data-testid="status-indicator">
      <div className={`w-2 h-2 rounded-full ${colors[status]}`} data-testid={`status-${status}`} />
      {label && <span className="text-xs text-muted-foreground">{label}</span>}
    </div>
  );
}
