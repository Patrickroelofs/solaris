import type { Edge, EdgeProps, Position } from "@xyflow/react";
import {
	BaseEdge,
	getBezierPath,
	getSmoothStepPath,
	getStraightPath,
} from "@xyflow/react";
import type { FC } from "react";

export type AnimatedSvgEdge = Edge<{
	/**
	 * The amount of time it takes, in seconds, to move the shape one from end of
	 * the edge path to the other.
	 */
	duration: number;
	/**
	 * The direction in which the shape moves along the edge path. Each value
	 * corresponds to the following behavior:
	 *
	 * - `forward`: The shape moves from the source node to the target node.
	 *
	 * - `reverse`: The shape moves from the target node to the source node.
	 *
	 * - `alternate`: The shape moves from the source node to the target node and
	 *   then back to the source node.
	 *
	 * - `alternate-reverse`: The shape moves from the target node to the source
	 *   node and then back to the target node.
	 *
	 * If not provided, this defaults to `"forward"`.
	 */
	direction?: "forward" | "reverse" | "alternate" | "alternate-reverse";
	/**
	 * Which of React Flow's path algorithms to use. Each value corresponds to one
	 * of React Flow's built-in edge types.
	 *
	 * If not provided, this defaults to `"bezier"`.
	 */
	path?: "bezier" | "smoothstep" | "step" | "straight";
	/**
	 * The number of times to repeat the animation before stopping. If set to
	 * `"indefinite"`, the animation will repeat indefinitely.
	 *
	 * If not provided, this defaults to `"indefinite"`.
	 */
	repeat?: number | "indefinite";
	shape: keyof typeof shapes;
}>;

/**
 * The `AnimatedSvgEdge` component renders a typical React Flow edge and animates
 * an SVG shape along the edge's path.
 */
export function AnimatedSvgEdge({
	id,
	sourceX,
	sourceY,
	targetX,
	targetY,
	sourcePosition,
	targetPosition,
	data = {
		duration: 2,
		direction: "forward",
		path: "bezier",
		repeat: "indefinite",
		shape: "wood",
	},
}: EdgeProps<AnimatedSvgEdge>) {
	const Shape = shapes[data.shape];

	const [path] = getPath({
		type: data.path ?? "bezier",
		sourceX,
		sourceY,
		sourcePosition,
		targetX,
		targetY,
		targetPosition,
	});

	const animateMotionProps = getAnimateMotionProps({
		duration: data.duration,
		direction: data.direction ?? "forward",
		repeat: data.repeat ?? "indefinite",
		path,
	});

	return (
		<>
			<BaseEdge id={id} path={path} />
			<Shape animateMotionProps={animateMotionProps} />
		</>
	);
}

type AnimateMotionProps = {
	dur: string;
	keyTimes: string;
	keyPoints: string;
	repeatCount: number | "indefinite";
	path: string;
};

type AnimatedSvg = FC<{ animateMotionProps: AnimateMotionProps }>;

const shapes = {
	wood: ({ animateMotionProps }) => (
		<svg
			className="fill-yellow-900"
			xmlns="http://www.w3.org/2000/svg"
			width="32"
			height="32"
			viewBox="0 0 256 256"
		>
			<title>Wood</title>
			<path d="M212,136a12,12,0,1,1-12-12A12,12,0,0,1,212,136Zm36,0c0,40.37-21.08,72-48,72H56c-26.92,0-48-31.63-48-72S29.08,64,56,64H92.69l37.65-37.66A8,8,0,0,1,136,24h32a8,8,0,0,1,0,16H139.31l-24,24H200C226.92,64,248,95.63,248,136ZM56,192H169.51a73.46,73.46,0,0,1-12.67-24H80a8,8,0,0,1,0-16h73.16A110.63,110.63,0,0,1,152,136c0-22.86,6.76-42.9,17.51-56H56c-12.47,0-23.55,13.26-28.8,32H104a8,8,0,0,1,0,16H24.35q-.34,3.93-.35,8C24,166.36,38.65,192,56,192Zm176-56c0-30.36-14.65-56-32-56s-32,25.64-32,56,14.65,56,32,56S232,166.36,232,136Z"></path>
			<animateMotion {...animateMotionProps} />
		</svg>
	),
} satisfies Record<string, AnimatedSvg>;

/**
 * Chooses which of React Flow's edge path algorithms to use based on the provided
 * `type`.
 */
function getPath({
	type,
	sourceX,
	sourceY,
	targetX,
	targetY,
	sourcePosition,
	targetPosition,
}: {
	type: "bezier" | "smoothstep" | "step" | "straight";
	sourceX: number;
	sourceY: number;
	targetX: number;
	targetY: number;
	sourcePosition: Position;
	targetPosition: Position;
}) {
	switch (type) {
		case "bezier":
			return getBezierPath({
				sourceX,
				sourceY,
				targetX,
				targetY,
				sourcePosition,
				targetPosition,
			});

		case "smoothstep":
			return getSmoothStepPath({
				sourceX,
				sourceY,
				targetX,
				targetY,
				sourcePosition,
				targetPosition,
			});

		case "step":
			return getSmoothStepPath({
				sourceX,
				sourceY,
				targetX,
				targetY,
				sourcePosition,
				targetPosition,
				borderRadius: 0,
			});

		case "straight":
			return getStraightPath({
				sourceX,
				sourceY,
				targetX,
				targetY,
			});
	}
}

/**
 * Construct the props for an `<animateMotion />` element based on an
 * `AnimatedSvgEdge`'s data.
 */
function getAnimateMotionProps({
	duration,
	direction,
	repeat,
	path,
}: {
	duration: number;
	direction: "forward" | "reverse" | "alternate" | "alternate-reverse";
	repeat: number | "indefinite";
	path: string;
}) {
	const base = {
		path,
		repeatCount: repeat,
		// The default calcMode for the `<animateMotion />` element is "paced", which
		// is not compatible with the `keyPoints` attribute. Setting this to "linear"
		// ensures that the shape correct follows the path.
		calcMode: "linear",
	};

	switch (direction) {
		case "forward":
			return {
				...base,
				dur: `${duration}s`,
				keyTimes: "0;1",
				keyPoints: "0;1",
			};

		case "reverse":
			return {
				...base,
				dur: `${duration}s`,
				keyTimes: "0;1",
				keyPoints: "1;0",
			};

		case "alternate":
			return {
				...base,
				// By doubling the animation duration, the time spent moving from one end
				// to the other remains consistent when switching between directions.
				dur: `${duration * 2}s`,
				keyTimes: "0;0.5;1",
				keyPoints: "0;1;0",
			};

		case "alternate-reverse":
			return {
				...base,
				dur: `${duration * 2}s`,
				keyTimes: "0;0.5;1",
				keyPoints: "1;0;1",
			};
	}
}
