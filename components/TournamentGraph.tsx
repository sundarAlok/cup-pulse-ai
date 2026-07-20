"use client";

import React, { useCallback, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  ConnectionLineType,
  MarkerType,
  Node,
  Edge,
} from "reactflow";
import "reactflow/dist/style.css";

type TournamentNodeData = {
  title: string;
  subtitle?: string;
  info?: string;
  typeLabel?: string;
  metric?: string;
  confidence?: string;
};

const initialNodes: Node<TournamentNodeData>[] = [
  {
    id: "team-1",
    type: "teamNode",
    position: { x: 0, y: 20 },
    data: {
      title: "Brazil",
      subtitle: "Rank #1",
      info: "Form 91",
      typeLabel: "Team",
      metric: "Win Prob 76%",
    },
  },
  {
    id: "team-2",
    type: "teamNode",
    position: { x: 0, y: 200 },
    data: {
      title: "France",
      subtitle: "Rank #2",
      info: "Form 88",
      typeLabel: "Team",
      metric: "Win Prob 68%",
    },
  },
  {
    id: "match-1",
    type: "matchNode",
    position: { x: 260, y: 100 },
    data: {
      title: "Brazil vs France",
      subtitle: "QF 1",
      info: "Pred: Brazil 62%",
      confidence: "Confidence 82%",
      typeLabel: "Match",
    },
  },
  {
    id: "team-3",
    type: "teamNode",
    position: { x: 0, y: 380 },
    data: {
      title: "Argentina",
      subtitle: "Rank #3",
      info: "Form 90",
      typeLabel: "Team",
      metric: "Win Prob 72%",
    },
  },
  {
    id: "team-4",
    type: "teamNode",
    position: { x: 0, y: 560 },
    data: {
      title: "England",
      subtitle: "Rank #4",
      info: "Form 84",
      typeLabel: "Team",
      metric: "Win Prob 60%",
    },
  },
  {
    id: "match-2",
    type: "matchNode",
    position: { x: 260, y: 460 },
    data: {
      title: "Argentina vs England",
      subtitle: "QF 2",
      info: "Pred: Argentina 69%",
      confidence: "Confidence 79%",
      typeLabel: "Match",
    },
  },
  {
    id: "semifinal",
    type: "roundNode",
    position: { x: 540, y: 260 },
    data: {
      title: "Semi Final",
      subtitle: "Moving to next stage",
      info: "Projected: Brazil vs Argentina",
      typeLabel: "Round",
    },
  },
  {
    id: "final",
    type: "roundNode",
    position: { x: 820, y: 260 },
    data: {
      title: "Final",
      subtitle: "Champion path",
      info: "Top candidates: Brazil",
      typeLabel: "Round",
    },
  },
];

const initialEdges: Edge[] = [
  {
    id: "edge-1",
    source: "team-1",
    target: "match-1",
    type: "smoothstep",
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  {
    id: "edge-2",
    source: "team-2",
    target: "match-1",
    type: "smoothstep",
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  {
    id: "edge-3",
    source: "team-3",
    target: "match-2",
    type: "smoothstep",
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  {
    id: "edge-4",
    source: "team-4",
    target: "match-2",
    type: "smoothstep",
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  {
    id: "edge-5",
    source: "match-1",
    target: "semifinal",
    type: "smoothstep",
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  {
    id: "edge-6",
    source: "match-2",
    target: "semifinal",
    type: "smoothstep",
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  {
    id: "edge-7",
    source: "semifinal",
    target: "final",
    type: "smoothstep",
    markerEnd: { type: MarkerType.ArrowClosed },
  },
];

const TeamNode = ({ data }: { data: TournamentNodeData }) => {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white/95 p-4 shadow-sm">
      <div className="text-[11px] uppercase tracking-[0.24em] text-slate-500">{data.typeLabel}</div>
      <div className="mt-2 text-lg font-semibold text-slate-900">{data.title}</div>
      <div className="mt-1 text-sm text-slate-500">{data.subtitle}</div>
      <div className="mt-3 text-sm text-slate-600">{data.info}</div>
      <div className="mt-3 rounded-2xl bg-slate-50 px-3 py-2 text-sm text-slate-700">{data.metric}</div>
    </div>
  );
};

const MatchNode = ({ data }: { data: TournamentNodeData }) => {
  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
      <div className="text-[11px] uppercase tracking-[0.24em] text-slate-500">{data.typeLabel}</div>
      <div className="mt-2 text-lg font-semibold text-slate-900">{data.title}</div>
      <div className="mt-1 text-sm text-slate-500">{data.subtitle}</div>
      <div className="mt-3 text-sm text-slate-600">{data.info}</div>
      <div className="mt-3 rounded-2xl bg-white p-2 text-sm font-semibold text-slate-800">{data.confidence}</div>
    </div>
  );
};

const RoundNode = ({ data }: { data: TournamentNodeData }) => {
  return (
    <div className="rounded-[2rem] border border-slate-200 bg-cyan-50/80 p-4 shadow-sm">
      <div className="text-[11px] uppercase tracking-[0.24em] text-cyan-700">{data.typeLabel}</div>
      <div className="mt-2 text-lg font-semibold text-slate-900">{data.title}</div>
      <div className="mt-1 text-sm text-slate-500">{data.subtitle}</div>
      <div className="mt-3 text-sm text-slate-600">{data.info}</div>
    </div>
  );
};

const nodeTypes = {
  teamNode: TeamNode,
  matchNode: MatchNode,
  roundNode: RoundNode,
};

export default function TournamentGraph() {
  const [selected, setSelected] = useState<TournamentNodeData | null>(null);
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node<TournamentNodeData>) => {
    setSelected(node.data);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelected(null);
  }, []);

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white/90 p-5 shadow-xl shadow-slate-200/30">
      <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Tournament Intelligence Graph</p>
          <h3 className="mt-2 text-2xl font-semibold text-slate-900">Team & Match Progression</h3>
        </div>
        <div className="rounded-full bg-slate-50 px-4 py-2 text-sm text-slate-600 shadow-sm">
          Click any node to reveal analytics.
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.8fr_1fr]">
        <div className="min-h-[560px] rounded-3xl border border-slate-200 bg-white">
          <ReactFlowProvider>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onNodeClick={onNodeClick}
              onPaneClick={onPaneClick}
              fitView
              nodesDraggable
              nodesConnectable={false}
              connectionLineType={ConnectionLineType.SmoothStep}
              attributionPosition="bottom-left"
              nodeTypes={nodeTypes}
              style={{ background: "#f8fafc" }}
            >
              <MiniMap nodeColor={(n) => {
                if (n.type === "teamNode") return "#0ea5ff";
                if (n.type === "matchNode") return "#a855f7";
                return "#22c55e";
              }} />
              <Controls showInteractive={false} />
              <Background gap={16} size={1} color="#e2e8f0" />
            </ReactFlow>
          </ReactFlowProvider>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
          <div className="text-sm font-semibold text-slate-900">Node Details</div>
          <div className="mt-3 text-sm text-slate-600">
            {selected ? (
              <div className="space-y-3">
                <div className="rounded-2xl bg-white p-4 shadow-sm">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500">{selected.typeLabel}</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">{selected.title}</p>
                  <p className="mt-1 text-sm text-slate-500">{selected.subtitle}</p>
                  {selected.info ? <p className="mt-2 text-sm text-slate-600">{selected.info}</p> : null}
                  {selected.metric ? <p className="mt-3 rounded-2xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-900">{selected.metric}</p> : null}
                  {selected.confidence ? <p className="mt-3 rounded-2xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-900">{selected.confidence}</p> : null}
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-slate-500">
                Select a team, match or round node to inspect details.
              </div>
            )}
          </div>

          <div className="mt-6 space-y-3 rounded-3xl bg-white p-4 shadow-sm">
            <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Key indicators</div>
            <div className="grid gap-3">
              <div className="rounded-2xl bg-slate-100 p-3">
                <p className="text-sm font-medium text-slate-900">Zoom & Pan</p>
                <p className="text-xs text-slate-500">Use mouse wheel or touchpad to inspect the bracket.</p>
              </div>
              <div className="rounded-2xl bg-slate-100 p-3">
                <p className="text-sm font-medium text-slate-900">Click nodes</p>
                <p className="text-xs text-slate-500">Click any node for team, match or round analytics.</p>
              </div>
              <div className="rounded-2xl bg-slate-100 p-3">
                <p className="text-sm font-medium text-slate-900">Confidence metrics</p>
                <p className="text-xs text-slate-500">AI prediction confidence is surfaced for each match.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
