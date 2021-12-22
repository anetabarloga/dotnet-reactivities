import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Header, Icon } from "semantic-ui-react";

interface Props {
	setFiles: (files: any) => void;
}

export default function PhotoWidgetDropzone({ setFiles }: Props) {
	const dropzoneStyle = {
		border: "dashed 3px #eee",
		borderColor: "#eee",
		borderRadius: "5px",
		paddingTop: "30px",
		textAlign: "center" as "center", // mitigating TS warning
		height: 200,
	};

	const activeDropzoneStyle = {
		borderColor: "green",
	};

	const onDrop = useCallback(
		(acceptedFiles) => {
			setFiles(
				// get preview of the dropped image
				acceptedFiles.map((file: any) =>
					Object.assign(file, {
						preview: URL.createObjectURL(file),
					})
				)
			);
		},
		[setFiles]
	);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

	return (
		<div {...getRootProps()} style={isDragActive ? { ...dropzoneStyle, ...activeDropzoneStyle } : dropzoneStyle}>
			<input {...getInputProps()} />
			<Icon name="upload" size="huge" />
			<Header content="Drop image here" />
		</div>
	);
}
