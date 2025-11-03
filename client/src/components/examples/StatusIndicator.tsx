import StatusIndicator from "../StatusIndicator";

export default function StatusIndicatorExample() {
  return (
    <div className="p-8 space-y-4">
      <StatusIndicator status="connected" label="Gemini API Connected" />
      <StatusIndicator status="disconnected" label="Disconnected" />
      <StatusIndicator status="error" label="Connection Error" />
    </div>
  );
}
