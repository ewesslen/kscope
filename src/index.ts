export { analyzeImage, AnalyzeOptions } from "./analyzer";
export { BrandColor } from "./color-utils";
export { app, startServer } from "./server";

// Start server when run directly
if (require.main === module) {
  const port = parseInt(process.env.PORT || "3000", 10);
  const { startServer } = require("./server");
  startServer(port);
}
