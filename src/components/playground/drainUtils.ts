import type { SinkSnapshot } from '@/types/engine'

/// A sink is a demo drain if it has been rewritten to our loopback drain
/// endpoint (identified by the ?sink= query parameter the rewriter adds).
/// Named console/file/http outputs all get this treatment; unnamed outputs
/// never appear here.
export function hasDemoHttpSink(sinks: SinkSnapshot[]): boolean {
    return sinks.some(
        (sink) =>
            sink.type === 'http' &&
            sink.target.includes('127.0.0.1') &&
            sink.target.includes('?sink='),
    )
}
