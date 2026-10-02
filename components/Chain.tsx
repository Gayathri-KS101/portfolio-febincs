import type { Project } from "@/content/site";

// Signal-chain diagram: blocks joined by wires; a wireless hop is drawn dashed.
// Each wire is grouped with the block it leads into, so a wrapped row never
// starts or ends with a dangling wire.
export default function Chain({ chain }: { chain: NonNullable<Project["chain"]> }) {
  return (
    <div className="chain" role="img" aria-label={`Signal chain: ${chain.map((n) => n.label).join(" to ")}`}>
      {chain.map((node, i) => (
        <span className="chain-hop" key={`${i}-${node.label}`}>
          {i > 0 && (
            <span className={chain[i - 1].wireless ? "chain-link chain-link-air" : "chain-link"} aria-hidden="true" />
          )}
          <span className="chain-node">{node.label}</span>
        </span>
      ))}
    </div>
  );
}
