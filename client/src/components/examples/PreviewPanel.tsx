import PreviewPanel from "../PreviewPanel";

export default function PreviewPanelExample() {
  return (
    <div className="h-[600px]">
      <PreviewPanel url="about:blank" onClose={() => console.log("Close preview")} />
    </div>
  );
}
