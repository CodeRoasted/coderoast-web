import type { SinkSnapshot } from '@/types/engine'

/// Heuristic: any HTTP sink whose target host ends in logcraft.demo (or
/// has been rewritten to our loopback) is one we will (have)
/// intercepted. Exported so the parent can decide whether to render the
/// tab at all without instantiating the component.
export function hasDemoHttpSink(sinks: SinkSnapshot[]): boolean {
    return sinks.some(
        (sink) =>
            sink.type === 'http' &&
            (sink.target.includes('logcraft.demo') || sink.target.includes('127.0.0.1')),
    )
}
