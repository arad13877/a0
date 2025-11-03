import FigmaUpload from "../FigmaUpload";

export default function FigmaUploadExample() {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <FigmaUpload onAnalyze={(images) => console.log("Analyzing", images.length, "images")} />
    </div>
  );
}
