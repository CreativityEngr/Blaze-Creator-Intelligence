import { config } from "../config.js";
import { channelRepository, notificationRepository } from "../repositories/index.js";
import { benchmarkResearchService } from "../services/benchmarkResearch.js";

let timer: NodeJS.Timeout | undefined;

export function startBenchmarkCollector() {
  const run = () => {
    void benchmarkResearchService.collect()
      .then(async (result) => {
        console.log(`Benchmark capture complete (${result.creatorCount} creators, confidence ${result.confidence})`);
        const channels = await channelRepository.listAll();
        await Promise.all(channels.map((channel) => notificationRepository.createIfNew(channel.id, {
          kind: "SYSTEM",
          title: "Benchmark research updated",
          body: `${result.creatorCount} active creators observed. Benchmark signal strength is ${Math.round(result.confidence * 100)}%.`,
          metadata: { benchmarkRunId: result.id, confidence: result.confidence }
        }, new Date(Date.now() - 24 * 60 * 60_000))));
      })
      .catch((error) => console.error("Benchmark capture failed", error));
  };
  run();
  timer = setInterval(run, config.BENCHMARK_INTERVAL_MINUTES * 60_000);
  return () => timer && clearInterval(timer);
}
