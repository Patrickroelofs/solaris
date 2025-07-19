import { Handle, type HandleProps, useNodeConnections } from "@xyflow/react";

const CustomHandle = (
	props: HandleProps & {
		connectioncount: number;
	},
) => {
	const connections = useNodeConnections({
		handleType: props.type,
	});

	return (
		<Handle
			{...props}
			isConnectable={connections.length < props.connectioncount}
		/>
	);
};

export default CustomHandle;
