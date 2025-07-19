import { Handle, type HandleProps, useNodeConnections } from "@xyflow/react";

const CustomHandle = (
	props: HandleProps & {
		connectionCount: number;
	},
) => {
	const connections = useNodeConnections({
		handleType: props.type,
	});

	return (
		<Handle
			{...props}
			isConnectable={connections.length < props.connectionCount}
		/>
	);
};

export default CustomHandle;
