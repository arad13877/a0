import Header from "../Header";

export default function HeaderExample() {
  return (
    <Header
      projectName="my-ecommerce-store"
      onNewProject={() => console.log("New project clicked")}
      onSettings={() => console.log("Settings clicked")}
      onDownload={() => console.log("Download clicked")}
    />
  );
}
