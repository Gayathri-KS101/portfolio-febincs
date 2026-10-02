// Background of a dark section: faint PCB traces, with current shooting along them.
// The traces are one 320px tile repeated. The current lives on a much larger tile, so
// each row keeps its own rhythm and a pulse crosses the whole screen in one run.

const TILE = 320;
const COLS = 8; // wider than any screen, so a run never restarts in view
const ROWS = 3;

// One tile's worth of the two horizontal traces; they join up edge to edge
const HIGH = "h90l40 40h70l40-40h80"; // enters and leaves at y = 60
const LOW = "h50l40 40h110l40-40h80"; // enters and leaves at y = 220
const RUN = 353.14; // length of either, per tile

// The link from one tile's lower via down to the upper via of the tile below
const LINK = "M160 176v54l40 40v90l40 40v54";
const LINK_LENGTH = 311.14;
const LINK_END = [240, 460];

// Rows across the big tile: which trace, seconds between runs, where in that wait it starts
const rows = [
  { y: 60, shape: HIGH, seconds: 9, offset: 0.1, reverse: false },
  { y: 220, shape: LOW, seconds: 14, offset: 0.55, reverse: true },
  { y: 380, shape: HIGH, seconds: 11, offset: 0.8, reverse: true },
  { y: 540, shape: LOW, seconds: 8, offset: 0.35, reverse: false },
  { y: 700, shape: HIGH, seconds: 15, offset: 0.65, reverse: false },
  { y: 860, shape: LOW, seconds: 10, offset: 0.2, reverse: true },
];

// Via-to-via links that fire now and then: tile column, tile row, seconds between, start
const links = [
  { col: 0, row: 0, seconds: 5, offset: 0.2 },
  { col: 2, row: 0, seconds: 7, offset: 0.7 },
  { col: 3, row: 1, seconds: 4.5, offset: 0.45 },
  { col: 1, row: 1, seconds: 8, offset: 0.05 },
  { col: 5, row: 0, seconds: 6, offset: 0.6 },
  { col: 6, row: 1, seconds: 5.5, offset: 0.9 },
  { col: 4, row: 1, seconds: 9, offset: 0.3 },
];

// A pulse is a comet: every layer ends at the same head. The long ones are faint and
// amber, the short ones bright and white, so the tail fades out behind a hot tip.
const comet = [
  { length: 1, width: 1.6, opacity: 0.1, color: "#ff9d55" },
  { length: 0.6, width: 1.6, opacity: 0.16, color: "#ffb57d" },
  { length: 0.33, width: 1.8, opacity: 0.3, color: "#ffd9b8" },
  { length: 0.16, width: 2, opacity: 0.55, color: "#fff" },
  { length: 0.06, width: 2.4, opacity: 1, color: "#fff" },
  // glow around the head
  { length: 0.07, width: 14, opacity: 0.09, color: "#fff" },
  { length: 0.045, width: 7, opacity: 0.26, color: "#fff" },
];

type PulseProps = {
  d: string;
  length: number; // of the path
  tail: number; // of the comet
  seconds: number; // from one run to the next
  run: number; // share of that time spent moving; the rest it waits out of sight
  offset: number;
  reverse?: boolean;
  transform?: string;
};

function Pulse({ d, length, tail, seconds, run, offset, reverse, transform }: PulseProps) {
  const travel = length + tail; // far enough for the whole tail to leave the path
  return comet.map((layer) => {
    const dash = layer.length * tail;
    // forwards the head leads the dash; in reverse the dash's start is the head
    const from = reverse ? -length : dash;
    const to = reverse ? tail : dash - travel;
    return (
      <path
        key={`${layer.length}-${layer.width}`}
        d={d}
        transform={transform}
        stroke={layer.color}
        strokeWidth={layer.width}
        strokeOpacity={layer.opacity}
        strokeDasharray={`${dash} ${travel + tail}`}
        strokeDashoffset={from}
      >
        <animate
          attributeName="stroke-dashoffset"
          values={`${from};${to};${to}`}
          keyTimes={`0;${run};1`}
          dur={`${seconds}s`}
          begin={`${-offset * seconds}s`}
          repeatCount="indefinite"
        />
      </path>
    );
  });
}

export default function Traces() {
  const lap = RUN * COLS;
  const linkTail = 170;
  const linkRun = 0.16;
  // when the head reaches the far via, as a share of the link's cycle
  const arrive = (linkRun * LINK_LENGTH) / (LINK_LENGTH + linkTail);

  return (
    <svg className="traces" aria-hidden="true">
      <defs>
        <pattern id="traces-copper" width={TILE} height={TILE} patternUnits="userSpaceOnUse">
          <g className="traces-copper">
            <path d={`M0 60${HIGH}M0 220${LOW}M200 0v40l40 40v54M200 320v-50l-40-40v-54`} />
            <circle cx="240" cy="140" r="6" />
            <circle cx="160" cy="170" r="6" />
          </g>
        </pattern>

        <pattern id="traces-current" width={TILE * COLS} height={TILE * ROWS} patternUnits="userSpaceOnUse">
          <g className="traces-current">
            {rows.map((row) => (
              <Pulse
                key={row.y}
                d={`M0 ${row.y}${row.shape.repeat(COLS)}`}
                length={lap}
                tail={420}
                seconds={row.seconds}
                run={0.42}
                offset={row.offset}
                reverse={row.reverse}
              />
            ))}
            {links.map((link) => {
              const at = `translate(${link.col * TILE} ${link.row * TILE})`;
              const begin = `${-link.offset * link.seconds}s`;
              return (
                <g key={`${link.col}-${link.row}`}>
                  <Pulse
                    d={LINK}
                    transform={at}
                    length={LINK_LENGTH}
                    tail={linkTail}
                    seconds={link.seconds}
                    run={linkRun}
                    offset={link.offset}
                  />
                  {/* the far via flares as the current arrives, then cools */}
                  <g transform={at} opacity="0">
                    <circle cx={LINK_END[0]} cy={LINK_END[1]} r="16" fill="#fff" fillOpacity="0.12" stroke="none" />
                    <circle cx={LINK_END[0]} cy={LINK_END[1]} r="9" fill="#fff" fillOpacity="0.2" stroke="none" />
                    <circle cx={LINK_END[0]} cy={LINK_END[1]} r="6" stroke="#fff" strokeWidth="2" />
                    <animate
                      attributeName="opacity"
                      values="0;0;1;0;0"
                      keyTimes={`0;${arrive * 0.9};${arrive};${arrive + 0.22};1`}
                      dur={`${link.seconds}s`}
                      begin={begin}
                      repeatCount="indefinite"
                    />
                  </g>
                </g>
              );
            })}
          </g>
        </pattern>
      </defs>

      <rect width="100%" height="100%" fill="url(#traces-copper)" />
      <rect className="traces-live" width="100%" height="100%" fill="url(#traces-current)" />
    </svg>
  );
}
